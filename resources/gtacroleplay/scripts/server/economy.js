// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy/financial utils, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEconomyScript() {
	logToConsole(LOG_INFO, "[VRR.Economy]: Initializing economy script ...");
	logToConsole(LOG_INFO, "[VRR.Economy]: Economy script initialized successfully!");
}

// ===========================================================================

function getTimeDisplayUntilPlayerPayDay(client) {
	return getTimeDifferenceDisplay(sdl.ticks-getPlayerData(client).payDayTickStart);
}

// ===========================================================================

function applyServerInflationMultiplier(value) {
	return toInteger(Math.round(value*getServerConfig().inflationMultiplier))
}

// ===========================================================================

function playerPayDay(client) {
	let wealth = calculateWealth(client);
	let grossIncome = getPlayerData(client).payDayAmount;

	// Public Beta Bonus
	grossIncome = grossIncome + getGlobalConfig().economy.passiveIncomePerPayDay;
	grossIncome = grossIncome*getGlobalConfig().economy.grossIncomeMultiplier;

	let incomeTaxAmount = calculateIncomeTax(wealth);

	let netIncome = grossIncome-incomeTaxAmount;

	messagePlayerAlert(client, "== Payday! =============================");
	messagePlayerInfo(client, `Paycheck: {ALTCOLOUR}$${grossIncome}`);
	messagePlayerInfo(client, `Taxes: {ALTCOLOUR}$${incomeTaxAmount}`);
	messagePlayerInfo(client, `You receive: {ALTCOLOUR}$${netIncome}`);
	if(netIncome < incomeTaxAmount) {
		let totalCash = getPlayerCash(client);
		let canPayNow = totalCash+netIncome;
		if(incomeTaxAmount <= canPayNow) {
			takePlayerCash(client, canPayNow);
			messagePlayerInfo(client, `You covered the remaining taxes with {ALTCOLOUR}$${canPayNow} {MAINCOLOUR}in cash.`);
			messagePlayerAlert(client, `{orange}You lost money since your taxes are more than your paycheck!`);
			messagePlayerAlert(client, `{orange}If you don't have enough cash to cover taxes on next paycheck, you will lose stuff!`);
		} else {
			messagePlayerInfo(client, `{orange}You don't have enough cash to pay your taxes!`);
			takePlayerCash(client, canPayNow);

			let vehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let houseCount = getAllHousesOwnedByPlayer(client).length;
			let businessCount = getAllBusinessesOwnedByPlayer(client).length;

			attemptRepossession(client, incomeTaxAmount-canPayNow);

			let newVehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let newHouseCount = getAllHousesOwnedByPlayer(client).length;
			let newBusinessCount = getAllBusinessesOwnedByPlayer(client).length;
			messagePlayerInfo(client, `{orange}You lost ${newVehicleCount-vehicleCount} vehicles, ${newHouseCount-houseCount} houses, and ${newBusinessCount-businessCount} businesses to cover the remaining tax.`);
		}
	}

	givePlayerCash(client, netIncome);
}

// ===========================================================================

function calculateWealth(client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);
	let houses = getAllHousesOwnedByPlayer(client);
	let businesses = getAllBusinessesOwnedByPlayer(client);

	let vehicleUpKeep = applyServerInflationMultiplier(vehicles.length*getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle);
	let houseUpKeep = applyServerInflationMultiplier(houses.length*getGlobalConfig().economy.upKeepCosts.upKeepPerHouse);
	let businessUpKeep = applyServerInflationMultiplier(businesses.length*getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness);

	return vehicleUpKeep+houseUpKeep+businessUpKeep;
}

// ===========================================================================

function calculateIncomeTax(amount) {
	return amount*getGlobalConfig().economy.incomeTaxRate;
}

// ===========================================================================

function forcePlayerPayDayCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if(!targetClient) {
		messagePlayerError(client, "That player is not connected!");
		return false;
	}

	messageAdmins(`${client.name} gave ${targetClient.name} an instant payday`);
	playerPayDay(targetClient);
}

// ===========================================================================

function taxInfoCommand(command, params, client) {
	let wealth = calculateWealth(client);
	let tax = calculateIncomeTax(wealth);
	messagePlayerInfo(client, `Your tax on payday is: $${tax}. Use {ALTCOLOUR}/help tax {MAINCOLOUR}for more information.`);
}

// ===========================================================================

function wealthInfoCommand(command, params, client) {
	let wealth = calculateWealth(client);
	messagePlayerInfo(client, `Your wealth is: $${wealth}. Use {ALTCOLOUR}/help wealth {MAINCOLOUR}for more information.`);
}

// ===========================================================================

function attemptRepossession(client, totalToPay) {
	let leftToPay = totalToPay;

	while(leftToPay > 0) {
		let repossessionValue = repossessFirstAsset(client);
		leftToPay = leftToPay - repossessionValue;
	}
	return true;
}

function repossessFirstAsset(client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);
	if(vehicles.length > 0) {
		deleteVehicle(vehicles[0])
		return getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle;
	}

	let houses = getAllHousesOwnedByPlayer(client);
	if(houses.length > 0) {
		deleteHouse(houses[0].index);
		return getGlobalConfig().economy.upKeepCosts.upKeepPerHouse;
	}

	let businesses = getAllBusinessesOwnedByPlayer(client);
	if(businesses.length > 0) {
		deleteBusiness(businesses[0].index);
		return getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness;
	}
}

// ===========================================================================

function getAllVehiclesOwnedByPlayer(client) {
	return getServerData().vehicles.filter((v) => v.ownerType == VRR_VEHOWNER_PLAYER && v.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllBusinessesOwnedByPlayer(client) {
	return getServerData().businesses.filter((b) => b.ownerType == VRR_BIZOWNER_PLAYER && b.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllHousesOwnedByPlayer(client) {
	return getServerData().houses.filter((h) => h.ownerType == VRR_HOUSEOWNER_PLAYER && h.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}