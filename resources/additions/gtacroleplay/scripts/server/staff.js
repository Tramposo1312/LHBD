// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: staff.js
// DESC: Provides staff commands, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initStaffScript() {
	logToConsole(LOG_INFO, "[VRR.Staff]: Initializing staff script ...");
	logToConsole(LOG_INFO, "[VRR.Staff]: Staff script initialized successfully!");
}

// ===========================================================================

function kickClientCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent kicking admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot kick this person!");
			return false;
		}
	}

	messageAdminAction(`${getPlayerName(targetClient)} has been kicked from the server.`);
	targetClient.disconnect();
}

// ===========================================================================

function setClientStaffTitleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split("");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let staffTitle = splitParams.slice(1).join(" ");

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	// Prevent setting titles on staff with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot set this person's staff title!");
			return false;
		}
	}

	getPlayerData(targetClient).accountData.staffTitle = staffTitle;
	messageAdmins(`${client.name} {MAINCOLOUR}set ${getPlayerName(targetClient)}'s staff title to ${staffTitle}`);
	messagePlayerAlert(client, `${getPlayerName(client)} set your staff title to ${staffTitle}`);
	targetClient.disconnect();
}

// ===========================================================================

function muteClientCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent muting admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot mute this person!");
			return false;
		}
	}

	messageAdmins(`${targetClient.name} {MAINCOLOUR}has been muted by ${client.name}!`);
	getPlayerData(targetClient).muted = true;
}

// ===========================================================================

function unMuteClientCommand(command, params, client) {

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent unmuting admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot unmute this person!");
			return false;
		}
	}

	messageAdmins(`${targetClient.name} {MAINCOLOUR}has been un-muted by ${client.name}!`);
	getPlayerData(targetClient).muted = false;
}

// ===========================================================================

function freezeClientCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent freeze admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot freeze this person!");
			return false;
		}
	}

	messageAdmins(`${targetClient.name} {MAINCOLOUR}has been frozen by ${client.name}!`);
	//setPlayerFrozenState(client, state);
	setPlayerControlState(client, false);
}

// ===========================================================================

function unFreezeClientCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent unfreezing admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot freeze this person!");
			return false;
		}
	}

	messageAdmins(`${targetClient.name} {MAINCOLOUR}has been un-frozen by ${client.name}!`);
	//sendPlayerFrozenState(client, false);
	setPlayerControlState(client, true);
}

// ===========================================================================

function gotoPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(targetClient), getPlayerHeading(targetClient), 2));
	setPlayerHeading(client, getPlayerHeading(targetClient));
	setPlayerInterior(client, getPlayerInterior(targetClient));
	setPlayerDimension(client, getPlayerInterior(targetClient));
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(targetClient), getPlayerHeading(targetClient), 2));
	//	setPlayerHeading(client, getPlayerHeading(targetClient));
	//	setPlayerInterior(client, getPlayerInterior(targetClient));
	//	setPlayerDimension(client, getPlayerInterior(targetClient));
	//	updateInteriorLightsForPlayer(client, true);
	//}, 1000);

	messagePlayerSuccess(client, `You teleported to {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

function getGeoIPInformationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	let countryName = module.geoip.getCountryName(getGlobalConfig().geoIPCountryDatabaseFilePath, targetClient.ip);
	let subDivisionName = module.geoip.getSubdivisionName(getGlobalConfig().geoIPCityDatabaseFilePath, targetClient.ip);
	let cityName = module.geoip.getCityName(getGlobalConfig().geoIPCityDatabaseFilePath, targetClient.ip);

	messagePlayerInfo(client, `{ALTCOLOUR}${targetClient.name} {MAINCOLOUR}is from {ALTCOLOUR}${cityName}, ${subDivisionName}, ${countryName}`);
}

// ===========================================================================

function gotoVehicleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(typeof getServerData().vehicles[toInteger(params)] == "undefined") {
		messagePlayerError(client, "That vehicle ID doesn't exist!");
	}

	let vehicle = getServerData().vehicles[toInteger(params)].vehicle;

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getPosAbovePos(getVehiclePosition(vehicle), 3.0));
	setPlayerInterior(client, 0);
	setPlayerDimension(client, getElementDimension(vehicle));
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getPosAbovePos(getVehiclePosition(vehicle), 3.0));
	//	setPlayerInterior(client, 0);
	//	setPlayerDimension(client, getElementDimension(vehicle));
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to a {vehiclePurple}${getVehicleName(vehicle)} {ALTCOLOUR}(ID ${vehicle.id})`);
}

// ===========================================================================

function getVehicleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(typeof getServerData().vehicles[toInteger(params)-1] == "undefined") {
		messagePlayerError(client, "That vehicle ID doesn't exist!");
	}

	let vehicle = getServerData().vehicles[toInteger(params)-1].vehicle;

	setElementPosition(vehicle, getPosInFrontOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), 5.0));
	setElementInterior(vehicle, getPlayerInterior(client));
	setElementDimension(vehicle, getPlayerDimension(client));

	messageAdmins(`${client.name} {MAINCOLOUR}teleported a {vehiclePurple}${getVehicleName(vehicle)} {ALTCOLOUR}(ID ${vehicle.id}) {MAINCOLOUR}to you`);
}

// ===========================================================================

function gotoBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let businessId = getBusinessFromParams(params)

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, "That business doesn't exist!");
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getBusinessData(businessId).entrancePosition);
	setPlayerInterior(client, getBusinessData(businessId).entranceInterior);
	setPlayerDimension(client, getBusinessData(businessId).entranceDimension);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getBusinessData(businessId).entrancePosition);
	//	setPlayerInterior(client, getBusinessData(businessId).entranceInterior);
	//	setPlayerDimension(client, getBusinessData(businessId).entranceDimension);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to business {businessBlue}${getBusinessData(businessId).name} {ALTCOLOUR}(ID ${businessId})`);
}

// ===========================================================================

function gotoGameLocationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let gameLocationId = getGameLocationFromParams(params);

	if(!gameLocationId) {
		messagePlayerError(client, "That game location doesn't exist!");
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getGameData().locations[getServerGame()][gameLocationId][1]);
	setPlayerInterior(client, 0);
	setPlayerDimension(client, 0);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getGameData().locations[getServerGame()][gameLocationId][1]);
	//	setPlayerInterior(client, 0);
	//	setPlayerDimension(client, 0);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to game location {ALTCOLOUR}${getGameData().locations[getServerGame()][gameLocationId][0]}`);
}

// ===========================================================================

function gotoHouseCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let houseId = getHouseFromParams(params)

	if(!getHouseData(houseId)) {
		messagePlayerError(client, "That house doesn't exist!");
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getHouseData(houseId).entrancePosition);
	setPlayerInterior(client, getHouseData(houseId).entranceInterior);
	setPlayerDimension(client, getHouseData(houseId).entranceDimension);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getHouseData(houseId).entrancePosition);
	//	setPlayerInterior(client, getHouseData(houseId).entranceInterior);
	//	setPlayerDimension(client, getHouseData(houseId).entranceDimension);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to house {houseGreen}${getHouseData(houseId).description} {ALTCOLOUR}(ID ${houseId})`);
}

// ===========================================================================

function gotoJobLocationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client)).job;

	if(!getJobData(jobId)) {
		messagePlayerError(client, `That job does not exist!`);
		return false;
	}

	let jobLocationId = getParam(params, " ", 2) || 0;

	if(typeof getJobData(jobId).locations[jobLocationId] == "undefined") {
		messagePlayerError(client, `That location ID does not exist!`);
		return false;
	}

	client.player.velocity = toVector3(0.0, 0.0, 0.0);
	setPlayerPosition(client, getJobData(jobId).locations[jobLocationId].position);
	setPlayerInterior(client, getJobData(jobId).locations[jobLocationId].interior);
	setPlayerDimension(client, getJobData(jobId).locations[jobLocationId].dimension);
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to location {ALTCOLOUR}${jobLocationId} {MAINCOLOUR}for the ${getInlineChatColourByName("jobYellow")}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function gotoNewPlayerSpawnCommand(command, params, client) {
	client.player.velocity = toVector3(0.0, 0.0, 0.0);
	setPlayerPosition(client, getServerConfig().newCharacter.spawnPosition);
	setPlayerInterior(client, 0);
	setPlayerDimension(client, 0);
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to the new character spawn location!`);
}

// ===========================================================================

function gotoPositionCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = params.replace(",", "");
	let x = getParam(params, " ", 1);
	let y = getParam(params, " ", 2);
	let z = getParam(params, " ", 3);
	let int = getParam(params, " ", 4);
	let vw = getParam(params, " ", 5);

	client.player.velocity = toVector3(0.0, 0.0, 0.0);
	setPlayerInterior(client, toInteger(int));
	setPlayerDimension(client, toInteger(vw));
	setPlayerPosition(client, toVector3(toFloat(x), toFloat(y), toFloat(z)));
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to coordinates {ALTCOLOUR}${x}, ${y}, ${z} with interior ${int} and dimension ${vw}`);
}

// ===========================================================================

function teleportForwardCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosInFrontOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported forward ${distance} meters`);
}

// ===========================================================================

function teleportBackwardCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported backward {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function teleportLeftCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosToLeftOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported left {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function teleportUpCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosAbovePos(getPlayerPosition(client), distance));

	messagePlayerSuccess(client, `You teleported up {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function teleportDownCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosBelowPos(getPlayerPosition(client), distance));

	messagePlayerSuccess(client, `You teleported down {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function teleportRightCommand(command, params, client) {
	let distance = 1.0;
	if(!areParamsEmpty(params)) {
		if(!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosToRightOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported right {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function playerInteriorCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(getParamsCount(params, " ") == 1) {
		messagePlayerInfo(client, `${getPlayerName(targetClient)}'s interior is {ALTCOLOUR}${getPlayerInterior(targetClient)}`);
		return false;
	}

	let interiorId = getParam(params, " ", 2);
	setPlayerInterior(targetClient, Number(interiorId));
	messageAdmins(`${client.name} {MAINCOLOUR}set ${getPlayerName(targetClient)}'s interior to {ALTCOLOUR}${interiorId}`);
}

// ===========================================================================

function playerVirtualWorldCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(getParamsCount(params, " ") == 1) {
		messagePlayerInfo(client, `{ALTCOLOUR}${getPlayerName(targetClient)}'s {MAINCOLOUR}virtual world is {ALTCOLOUR}${getPlayerDimension(targetClient)}`);
		return false;
	}

	let dimensionId = getParam(params, " ", 2);
	setPlayerDimension(targetClient, Number(dimensionId));
	messageAdmins(`${client.name} {MAINCOLOUR}set {ALTCOLOUR}${getPlayerName(targetClient)}'s {MAINCOLOUR}virtual world to {ALTCOLOUR}${dimensionId}`);
}

// ===========================================================================

function getPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	removePlayerFromVehicle(targetClient);

	getPlayerData(targetClient).returnToPosition = getPlayerPosition(targetClient);
	getPlayerData(targetClient).returnToHeading = getPlayerPosition(targetClient);
	getPlayerData(targetClient).returnToDimension = getPlayerDimension(targetClient);
	getPlayerData(targetClient).returnToInterior = getPlayerInterior(targetClient);
	getPlayerData(targetClient).returnToType = VRR_RETURNTO_TYPE_ADMINGET;

	if(isPlayerInAnyHouse(targetClient)) {
		getPlayerData(targetClient).returnToHouse = getPlayerHouse(targetClient);
	}

	if(isPlayerInAnyBusiness(targetClient)) {
		getPlayerData(targetClient).returnToBusiness = getPlayerBusiness(targetClient);
	}

	removePlayerFromVehicle(targetClient);
	setPlayerPosition(targetClient, getPosBehindPos(getPlayerPosition(client), getPlayerHeading(client), 2));
	setPlayerHeading(targetClient, getPlayerHeading(client));
	setPlayerInterior(targetClient, getPlayerInterior(client));
	setPlayerDimension(targetClient, getPlayerDimension(client));

	messageAdmins(`${client.name} {MAINCOLOUR}teleported {ALTCOLOUR}${getPlayerName(targetClient)} {MAINCOLOUR}to their position.`);
	messagePlayerAlert(targetClient, `An admin has teleported you to their location`);
}

// ===========================================================================

function returnPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let targetClient = getPlayerFromParams(params);
    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	removePlayerFromVehicle(targetClient);

	if(getPlayerData(targetClient).returnToPosition == null) {
        messagePlayerError(client, "There is nowhere to return that player to!");
        return false;
	}

	setPlayerPosition(targetClient, getPlayerData(targetClient).returnToPosition);
	setPlayerHeading(targetClient, getPlayerData(targetClient).returnToHeading);
	setPlayerInterior(targetClient, getPlayerData(targetClient).returnToInterior);
	setPlayerDimension(targetClient, getPlayerData(targetClient).returnToDimension);

	getPlayerData(targetClient).returnToPosition = null;
	getPlayerData(targetClient).returnToHeading = null;
	getPlayerData(targetClient).returnToDimension = null;
	getPlayerData(targetClient).returnToInterior = null;
	getPlayerData(targetClient).returnToHouse = null;
	getPlayerData(targetClient).returnToBusiness = null;
	getPlayerData(targetClient).returnToType = VRR_RETURNTO_TYPE_NONE;

	messageAdmins(`${client.name} {MAINCOLOUR}returned {ALTCOLOUR}${getPlayerName(targetClient)} {MAINCOLOUR}to their previous position.`);
	messagePlayerAlert(targetClient, `An admin has returned you to your previous location`);
}

// ===========================================================================

function addStaffFlagCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let flagName = getParam(params, " ", 2) || "None";

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	if(getStaffFlagValue(flagName) == false) {
		messagePlayerError(client, "That staff flag doesn't exist!");
        return false;
	}

	// Prevent setting flags on admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot give staff flags to this person!");
			return false;
		}
	}

	givePlayerStaffFlag(targetClient, flagName);
	messageAdmins(`${client.name} has {MAINCOLOUR}given {ALTCOLOUR}${getPlayerName(targetClient)} {MAINCOLOUR}the {ALTCOLOUR}${flagName} {MAINCOLOUR}staff flag`);
}

// ===========================================================================

function takeStaffFlagCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let flagName = getParam(params, " ", 2) || "None";

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	if(getStaffFlagValue(flagName) == false) {
		messagePlayerError(client, "That staff flag doesn't exist!");
        return false;
	}

	// Prevent setting flags on admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot take staff flags from this person!");
			return false;
		}
	}

	takePlayerStaffFlag(targetClient, flagName);
	messageAdmins(`${client.name} {MAINCOLOUR}has taken the {ALTCOLOUR}${flagName} {MAINCOLOUR}staff flag from {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

function clearStaffFlagsCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
    }

	// Prevent setting flags on admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot clear staff flags for this person!");
			return false;
		}
	}

	clearPlayerStaffFlags(targetClient);
	messageAdmins(`${client.name} {MAINCOLOUR}removed all staff flags from {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

function getStaffFlagsCommand(command, params, client) {
	if(getCommand(command).requireLogin) {
		if(!isPlayerLoggedIn(client)) {
			messagePlayerError(client, "You must be logged in to use this command!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(command))) {
		messagePlayerError(client, "You do not have permission to use this command!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	let tempStaffFlags = [];
	let serverBitFlagKeys = getServerBitFlagKeys();
	for(let i in serverBitFlagKeys) {
		let tempFlagValue = getStaffFlagValue(serverBitFlagKeys[i]);
		if(doesPlayerHaveStaffPermission(targetClient, tempFlagValue)) {
			tempStaffFlags.push(serverBitFlagKeys[i]);
		}
	}

	let flagList = [];
	for(let i in getServerBitFlagKeys().staffFlagKeys) {
		if(doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue(getServerBitFlagKeys().staffFlagKeys[i]))) {
			flagList.push(`{softGreen}${getServerBitFlagKeys().staffFlagKeys[i]}`);
		} else {
			flagList.push(`{softRed}${getServerBitFlagKeys().staffFlagKeys[i]}`);
		}
	}

	let chunkedList = splitArrayIntoChunks(flagList, 8);

	messagePlayeNormal(client, `{clanOrange}== {jobYellow}Staff Flags (${targetClient.name}) {clanOrange}=========================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join("{MAINCOLOUR}, "));
	}
}

// ===========================================================================

function allStaffFlagsCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let flagName = getParam(params, " ", 2) || "None";

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	messagePlayerInfo(client, `{MAINCOLOUR}Staff flags: {ALTCOLOUR}${getServerBitFlagKeys().staffFlagKeys.join(getInlineChatColourByName("white"))}, {ALTCOLOUR}")}`);
}

// ===========================================================================

function givePlayerMoneyCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let amount = toInteger(getParam(params, " ", 2));

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	givePlayerCash(targetClient, toInteger(amount));
	updatePlayerCash(targetClient);
	//messagePlayerSuccess(client, `You gave {ALTCOLOUR}$${amount} {MAINCOLOUR}to {ALTCOLOUR}${getCharacterFullName(targetClient)}`);
	messageAdmins(`${client.name} {MAINCOLOUR}gave {ALTCOLOUR}$${amount} {MAINCOLOUR}to {ALTCOLOUR}${getCharacterFullName(targetClient)}`)
	messagePlayerAlert(targetClient, `An admin gave you {ALTCOLOUR}$${amount}`);
}

// ===========================================================================

function forcePlayerAccentCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let newAccent = getParam(params, " ", 2) || "None";

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	if(toLowerCase(newAccent) == "None") {
		newAccent = "";
	}

	setPlayerAccentText(client, newAccent);

	if(newAccent == "") {
		//messagePlayerSuccess(client, `You removed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent.`);
		messageAdmins(client, `${client.name} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent.`);
		messagePlayerAlert(client, `An admin removed your accent.`);
	} else {
		//messagePlayerSuccess(client, `You set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent to {ALTCOLOUR}${newAccent}`);
		messageAdmins(`${client.name} set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent to {ALTCOLOUR}${newAccent}`)
		messagePlayerAlert(client, `An admin set your accent to {ALTCOLOUR}${newAccent}`);
	}
}

// ===========================================================================

function forceCharacterNameChangeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	getPlayerData(targetClient).changingCharacterName = true;

	messageAdmins(`${client.name} {MAINCOLOUR}forced {ALTCOLOUR}${getPlayerName(targetClient)} (${getCharacterFullName(targetClient)}) {MAINCOLOUR}to change their character's name.`);
	showPlayerNewCharacterFailedGUI(targetClient, "Non-RP name! Choose a new one:");
}

// ===========================================================================

function forceCharacterNameCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	//if(areThereEnoughParams(params, 3, " ")) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let firstName = getParam(params, " ", 2);
	let lastName = getParam(params, " ", 3);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	firstName = fixCharacterName(firstName);
	lastName = fixCharacterName(lastName);
	let newName = `${firstName} ${lastName}`;
	let oldName = getCharacterFullName(targetClient);

	getPlayerCurrentSubAccount(targetClient).firstName = firstName;
	getPlayerCurrentSubAccount(targetClient).lastName = lastName;

	messageAdmins(`${client.name} {MAINCOLOUR}forced {ALTCOLOUR}${getPlayerName(targetClient)}'s {MAINCOLOUR}current character name from {ALTCOLOUR}${oldName} {MAINCOLOUR}to {ALTCOLOUR}${newName}`);

	updateAllPlayerNameTags();
}

// ===========================================================================

function forcePlayerSkinCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	//if(areThereEnoughParams(params, 3, " ")) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	let splitParams = params.split("");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let skinIndex = getSkinModelIndexFromParams(splitParams.slice(1).join(" "));

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	if(!skinIndex) {
        messagePlayerError(client, "That skin is invalid!");
        return false;
	}

	getPlayerCurrentSubAccount(targetClient).skin = skinIndex;
	setPlayerSkin(targetClient, skinIndex);

	messageAdmins(`${client.name} {MAINCOLOUR}set ${getPlayerName(targetClient)}'s {MAINCOLOUR}skin to {ALTCOLOUR}${getGameData().skins[getGame()][skinIndex][1]}`);
}

// ===========================================================================

function forcePlayerWantedLevelCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let wantedLevel = getParam(params, " ", 2);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	forcePlayerWantedLevel(targetClient, wantedLevel);

	//messageAdmins(`${client.name} {MAINCOLOUR}set ${getPlayerName(targetClient)}'s {MAINCOLOUR}skin to {ALTCOLOUR}${getGameData().skins[getGame()][skinIndex][1]}`);
}

// ===========================================================================

function getAllVehiclesOwnedByPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	let vehicles = getAllVehiclesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Player Vehicles {clanOrange}==========================`);
	for(let i in vehicles) {
		messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${vehicles[i].index}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicles[i].databaseId}, {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicles[i].vehicle)}[${vehicles[i].model}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicles[i].buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicles[i].rentPrice}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(vehicles[i].locked)}, {MAINCOLOUR}Engine: {ALTCOLOUR}${getYesNoFromBool(vehicles[i].engine)}`);
	}
}

// ===========================================================================

function getAllBusinessesOwnedByPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	let businesses = getAllBusinessesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Player Businesses {clanOrange}========================`);
	for(let i in businesses) {
		messagePlayerNormal(client, `🏢 {businessBlue}[Business Info] {MAINCOLOUR}Name: {ALTCOLOUR}${businesses[i].name}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(businesses[i].locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${businesses[i].index}/${businesses[i].databaseId}`);
	}
}

// ===========================================================================

function getAllHousesOwnedByPlayerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	let houses = getAllHousesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Player Houses {clanOrange}============================`);
	for(let i in houses) {
		messagePlayerNormal(client, `🏠 {houseGreen}[House Info] {MAINCOLOUR}Description: {ALTCOLOUR}${houses[i].description}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(houses[i].locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${houses[i].index}/${houses[i].databaseId}`);
	}
}

// ===========================================================================

function forceAccountPasswordResetCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!");
        return false;
	}

	let houses = getAllHousesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Player Houses {clanOrange}============================`);
	for(let i in houses) {
		messagePlayerNormal(client, `🏠 {houseGreen}[House Info] {MAINCOLOUR}Description: {ALTCOLOUR}${houses[i].description}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(houses[i].locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${houses[i].index}/${houses[i].databaseId}`);
	}
}

// ===========================================================================

function isPlayerWeaponBanned(client) {
	if(hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("WeaponBanned"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function isPlayerJobBanned(client) {
	if(hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("JobBanned"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function isPlayerPoliceBanned(client) {
	let jobId = getJobFromParams("Police");
	if(doesJobHaveWhiteListEnabled(jobId)) {
		if(isPlayerOnJobWhiteList(client, jobId)) {
			return true;
		}
	}

	if(doesJobHaveBlackListEnabled(jobId)) {
		if(!isPlayerOnJobBlackList(client, jobId)) {
			return true;
		}
	}

	return false;
}

// ===========================================================================