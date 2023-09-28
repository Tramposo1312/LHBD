// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: house.js
// DESC: Provides house commands, functions, and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initHouseScript() {
	logToConsole(LOG_INFO, "[VRR.House]: Initializing house script ...");
	getServerData().houses = loadHousesFromDatabase();

	if(getServerConfig().createHousePickups) {
		createAllHousePickups();
	}

	if(getServerConfig().createHouseBlips) {
		createAllHouseBlips();
	}

	setAllHouseIndexes();
	logToConsole(LOG_INFO, "[VRR.House]: House script initialized successfully!");
	return true;
}

// ===========================================================================

function loadHousesFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.House]: Loading houses from database ...");
	let tempHouses = [];
	let dbConnection = connectToDatabase();
	let dbAssoc;

	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM house_main WHERE house_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempHouseData = new HouseData(dbAssoc);
					tempHouses.push(tempHouseData);
					logToConsole(LOG_VERBOSE, `[VRR.House]: House '${tempHouseData.description}' (ID ${tempHouseData.databaseId}) loaded!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}
	logToConsole(LOG_INFO, `[VRR.House]: ${tempHouses.length} houses loaded from database successfully!`);
	return tempHouses;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function createHouseCommand(command, params, client) {
	let entranceLocation = new HouseLocationData(false);
	entranceLocation.entrancePosition = getPlayerPosition(client);
	entranceLocation.entranceRotation = 0.0;
	entranceLocation.entrancePickupModel = getGameConfig().pickupModels[getServerGame()].house;
	entranceLocation.entranceBlipModel = getGameConfig().blipSprites[getServerGame()].house;
	entranceLocation.entranceInterior = 0;
	entranceLocation.entranceDimension = 0;

	entranceLocation.exitPosition = toVector3(0.0, 0.0, 0.0);
	entranceLocation.exitRotation = 0.0;
	entranceLocation.exitPickupModel = getGameConfig().pickupModels[getServerGame()].exit;
	entranceLocation.exitBlipModel = -1;
	entranceLocation.exitInterior = 0;
	entranceLocation.exitDimension = 0;

	let tempHouseData = createHouse(params, entranceLocation);
	let houseId = getServerData().houses.push(tempHouseData);

	saveHouseToDatabase(houseId-1);
	setAllHouseIndexes();

	createHouseEntrancePickup(houseId-1);
	createHouseExitPickup(houseId-1);
	createHouseEntranceBlip(houseId-1);
	createHouseExitBlip(houseId-1);

	//getHouseData(houseId).needsSaved = true;

	let messageText = `{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}created house {houseGreen}${tempHouseData.description}`;
	logToConsole(LOG_INFO, messageText);
	messageAdmins(messageText);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function lockUnlockHouseCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	getHouseData(houseId).locked = !getHouseData(houseId).locked;

	//for(let i in getHouseData(houseId).locations) {
	//	if(getHouseData(houseId).locations[i].type == VRR_HOUSE_LOC_DOOR) {
	//		setEntityData(getHouseData(houseId).locations[i].entrancePickup, "vrr.label.locked", getHouseData(houseId).locked, true);
	//	}
	//}

	setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.locked", getHouseData(houseId).locked, true);
	getHouseData(houseId).needsSaved = true;

	messagePlayerSuccess(client, `House {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}${getLockedUnlockedFromBool((getHouseData(houseId).locked))}!`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function toggleHouseInteriorLightsCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	getHouseData(houseId).interiorLights = !getHouseData(houseId).interiorLights;

	getHouseData(houseId).needsSaved = true;

	updateHouseInteriorLightsForOccupants(houseId);
	meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(getHouseData(houseId).interiorLights))} the house lights`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHouseDescriptionCommand(command, params, client) {
	let newHouseDescription = toString(params);

	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let oldDescription = getHouseData(houseId).description;
	getHouseData(houseId).description = newHouseDescription;

	//for(let i in getHouseData(houseId).locations) {
	//	if(getHouseData(houseId).locations[i].type == VRR_HOUSE_LOC_DOOR) {
	//		setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.name", getHouseData(houseId).description, true);
	//	}
	//}

	setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.name", getHouseData(houseId).description, true);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}renamed house {houseGreen}${oldDescription} {MAINCOLOUR}to {houseGreen}${getHouseData(houseId).description}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHouseOwnerCommand(command, params, client) {
	let newHouseOwner = getPlayerFromParams(params);
	let houseId = getPlayerHouse(client);

	if(!newHouseOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, "You don't own this house!");
			return false;
		}
	}

	getHouseData(houseId).needsSaved = true;

	getHouseData(houseId).ownerType = VRR_HOUSEOWNER_PLAYER;
	getHouseData(houseId).ownerId = getServerData().clients[newHouseOwner.index].accountData.databaseId;
	messagePlayerSuccess(`{MAINCOLOUR}You gave house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}to {ALTCOLOUR}${newHouseOwner.name}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHouseClanCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(params);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, "You don't own this house!");
			return false;
		}
	}

	getHouseData(houseId).needsSaved = true;

	getHouseData(houseId).ownerType = VRR_HOUSEOWNER_CLAN;
	getHouseData(houseId).ownerId = getClanData(clanId).databaseId;
	messagePlayerSuccess(`{MAINCOLOUR}You gave house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR} to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function setHouseRankCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(params);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanRankId = getClanRankFromParams(clanId, params);

	if(!getClanRankData(clanId, clanRankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
		messagePlayerError(client, "You can't set clan house ranks!");
		return false;
	}

	if(getClanRankData(clanId, clanRankId).level > getPlayerCurrentSubAccount(client).clanRank) {
		messagePlayerError(client, "That rank is above your level!");
		return false;
	}

	getHouseData(houseId).clanRank = getClanRankData(clanId, clanRankId).level;
	getHouseData(houseId).needsSaved = true;
	messagePlayerSuccess(`{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR}'s clan rank to {clanOrange}${getClanRankData(clanId, clanRankId).name} {MAINCOLOUR}(level ${getClanRankData(clanId, clanRankId).level}) and above!`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHousePickupCommand(command, params, client) {
	let typeParam = params || "house";
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entrancePickupModel = -1;
		} else {
			if(isNull(getGameConfig().pickupModels[getServerGame()][typeParam])) {
				messagePlayerError(client, "Invalid house type! Use a house type name or a pickup model ID or 'none'");
				messagePlayerInfo(client, `Pickup Types: {ALTCOLOUR}${Object.keys(getGameConfig().pickupModels[getServerGame()]).join(", ")}`)
				return false;
			}

			getHouseData(houseId).entrancePickupModel = getGameConfig().pickupModels[getServerGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entrancePickupModel = toInteger(typeParam);
	}

	deleteHouseEntrancePickup(houseId);
	createHouseEntrancePickup(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${client.name} {MAINCOLOUR}set house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}pickup display to {ALTCOLOUR}${toLowerCase(typeParam)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHouseInteriorTypeCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "None";
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(isNaN(typeParam)) {
		let tempHouseLocation = new HouseLocationData(false);

		if(toLowerCase(typeParam) == "None") {
			tempHouseLocation.exitPosition = toVector3(0.0, 0.0, 0.0);
			tempHouseLocation.exitInterior = -1;
			getHouseData(houseId).hasInterior = false;
			messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}removed house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}interior`);
			return false;
		}

		if(isNull(getGameConfig().interiorTemplates[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(getGameConfig().interiorTemplates[getServerGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader("InteriorTypes"));
			for(let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getHouseData(houseId).exitPosition = getGameConfig().interiorTemplates[getServerGame()][typeParam][0];
		getHouseData(houseId).exitInterior = getGameConfig().interiorTemplates[getServerGame()][typeParam][1];
		getHouseData(houseId).exitDimension = getHouseData(houseId).databaseId+getGlobalConfig().houseDimensionStart;
		getHouseData(houseId).hasInterior = true;
	}

	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);
	createHouseEntrancePickup(houseId);
	createHouseExitPickup(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${client.name} {MAINCOLOUR}set house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}interior type to {ALTCOLOUR}${toLowerCase(typeParam)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setHouseBlipCommand(command, params, client) {
	let typeParam = params || "house";
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entranceBlipModel = -1;
		} else {
			if(isNull(getGameConfig().blipSprites[getServerGame()][typeParam])) {
				messagePlayerError(client, "Invalid house type! Use a house type name or a blip image ID");
				messagePlayerInfo(client, `Pickup Types: {ALTCOLOUR}${Object.keys(getGameConfig().blipSprites[getServerGame()]).join(", ")}`)
				return false;
			}

			getHouseData(houseId).entranceBlipModel = getGameConfig().blipSprites[getServerGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entranceBlipModel = toInteger(typeParam);
	}

	if(getHouseData(houseId).entranceBlip != null) {
		deleteGameElement(getHouseData(houseId).entranceBlip);
	}

	resetHouseBlips(houseId);
	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${client.name} {MAINCOLOUR}set house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}blip display to {ALTCOLOUR}${toLowerCase(typeParam)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function moveHouseEntranceCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayer(client, "You need to be near or inside a house!");
		return false;
	}

	getHouseData(houseId).entrancePosition = getPlayerPosition(client);
	getHouseData(houseId).entranceDimension = getPlayerDimension(client);
	getHouseData(houseId).entranceInterior = getPlayerInterior(client);

	//deleteAllHouseBlips(houseId);
	//deleteAllHousePickups(houseId);
	//createAllHouseBlips(houseId);
	//createAllHousePickups(houseId);

	resetHouseBlips();
	resetHousePickups();

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}moved house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}entrance to their position`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function moveHouseExitCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayer(client, "You need to be near or inside a house!");
		return false;
	}

	getHouseData(houseId).locations = [];

	getHouseData(houseId).exitPosition = getPlayerPosition(client);
	getHouseData(houseId).exitDimension = getPlayerDimension(client);
	getHouseData(houseId).exitInterior = getPlayerInterior(client);

	//deleteAllHouseBlips(houseId);
	//deleteAllHousePickups(houseId);
	//createAllHouseBlips(houseId);
	//createAllHousePickups(houseId);

	deleteHouseExitPickup(houseId);
	deleteHouseExitBlip(houseId);
	createHouseExitPickup(houseId);
	createHouseExitBlip(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}moved house {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}exit to their position`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function deleteHouseCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted house {houseGreen}${getHouseData(houseId).description}`);
	deleteHouse(houseId, getPlayerData(client).accountData.databaseId);
}

// ===========================================================================

/**
 * This function deletes a house by house data array index
 *
 * @param {number} houseId - The index of the house in the house data array to delete
 * @param {number} whoDeleted - The parameters/args string used with the command by the player
 * @return {bool} Whether or not the house was successfully deleted
 *
 */
function deleteHouse(houseId, whoDeleted = 0) {
	let tempHouseData = getServerData().houses[houseId];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `DELETE FROM house_main WHERE house_id = ${tempHouseData.databaseId}`);
		if(dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);

	deleteHouseEntranceBlip(houseId);
	deleteHouseExitBlip(houseId);

	removePlayersFromHouse(houseId);

	getServerData().houses.splice(houseId, 1);
}

// ===========================================================================

/**
 * This function removes a client/player from their current house (teleports them outside)
 *
 * @param {Client} client - The client/player to remove from their current house
 * @return {bool} Whether or not the player was successfully removed from the house
 *
 */
function removePlayerFromHouses(client) {
	if(isPlayerInAnyHouse(client)) {
		exitHouse(client);
	}
}

// ===========================================================================

/**
 * This function creates a house
 *
 * @param {string} description - The description of the house (displayed as the name in the world label)
 * @param {houseLocationData} entranceLocation - The houseLocationData object for the main entrance to the house
 * @return {bool} Whether or not the player was successfully removed from the house
 *
 */
function createHouse(description, entranceLocation) {
	let tempHouseData = new HouseData(false);
	tempHouseData.description = description;

	tempHouseData.entrancePosition = entranceLocation.entrancePosition;
	tempHouseData.entranceRotation = entranceLocation.entranceRotation;
	tempHouseData.entrancePickupModel = entranceLocation.entrancePickupModel;
	tempHouseData.entranceBlipModel = entranceLocation.entranceBlipModel;
	tempHouseData.entranceInterior = entranceLocation.entranceInterior;
	tempHouseData.entranceDimension = entranceLocation.entranceDimension;

	tempHouseData.exitPosition = entranceLocation.exitPosition;
	tempHouseData.exitRotation = entranceLocation.exitRotation;
	tempHouseData.exitPickupModel = entranceLocation.exitPickupModel;
	tempHouseData.exitBlipModel = entranceLocation.exitBlipModel;
	tempHouseData.exitInterior = entranceLocation.exitInterior;
	tempHouseData.entranceDimension = entranceLocation.entranceDimension;

	return tempHouseData;
}

// ===========================================================================

function getHouseDataFromDatabaseId(databaseId) {
	let matchingHouses = getServerData().houses.filter(b => b.databaseId == databaseId)
	if(matchingHouses.length == 1) {
		return matchingHouses[0];
	}
	return false;
}

// ===========================================================================

function getClosestHouseEntrance(position, dimension) {
	let closest = 0;
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].entranceDimension == dimension) {
			if(getDistance(getServerData().houses[i].entrancePosition, position) <= getDistance(getServerData().houses[closest].entrancePosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getClosestHouseExit(position, dimension) {
	let closest = 0;
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].entranceDimension == dimension) {
			if(getDistance(getServerData().houses[i].exitPosition, position) <= getDistance(getServerData().houses[closest].exitPosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getPlayerHouse(client) {
	let closestEntrance = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
	if(getDistance(getPlayerPosition(client), getHouseData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
		return getHouseData(closestEntrance).index
	}

	for(let i in getServerData().houses) {
		if(getServerData().houses[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function saveAllHousesToDatabase() {
	logToConsole(LOG_INFO, `[VRR.House]: Saving all server houses to database ...`);
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].needsSaved) {
			saveHouseToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, `[VRR.House]: Saving all server houses to database ...`);
}

// ===========================================================================

function saveHouseToDatabase(houseId) {
	let tempHouseData = getServerData().houses[houseId];

	logToConsole(LOG_VERBOSE, `[VRR.House]: Saving house '${tempHouseData.databaseId}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeHouseDescription = escapeDatabaseString(dbConnection, tempHouseData.description);

		let data = [
			["house_server", getServerId()],
			["house_description", safeHouseDescription],
			["house_owner_type", tempHouseData.ownerType],
			["house_owner_id", tempHouseData.ownerId],
			["house_locked", boolToInt(tempHouseData.locked)],
			//["house_entrance_fee", tempHouseData.entranceFee],
			["house_entrance_pos_x", tempHouseData.entrancePosition.x],
			["house_entrance_pos_y", tempHouseData.entrancePosition.y],
			["house_entrance_pos_z", tempHouseData.entrancePosition.z],
			["house_entrance_rot_z", tempHouseData.entranceRotation],
			["house_entrance_int", tempHouseData.entranceInterior],
			["house_entrance_vw", tempHouseData.entranceDimension],
			["house_entrance_pickup", tempHouseData.entrancePickupModel],
			["house_entrance_blip", tempHouseData.entranceBlipModel],
			["house_exit_pos_x", tempHouseData.exitPosition.x],
			["house_exit_pos_y", tempHouseData.exitPosition.y],
			["house_exit_pos_z", tempHouseData.exitPosition.z],
			["house_exit_rot_z", tempHouseData.exitRotation],
			["house_exit_int", tempHouseData.exitInterior],
			["house_exit_vw", tempHouseData.exitDimension],
			["house_exit_pickup", tempHouseData.exitPickupModel],
			["house_exit_blip", tempHouseData.exitBlipModel],
			["house_buy_price", tempHouseData.buyPrice],
			["house_rent_price", tempHouseData.rentPrice],
			["house_has_interior", boolToInt(tempHouseData.hasInterior)],
			["house_interior_lights", boolToInt(tempHouseData.interiorLights)],
		];

		let dbQuery = null;
		if(tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_main", data);
			logToConsole(queryString);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().houses[houseId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_main", data, `house_id=${tempHouseData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getHouseData(houseId).needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[VRR.House]: Saved house '${tempHouseData.description}' to database!`);

	return false;
}

// ===========================================================================

function saveHouseLocationToDatabase(houseId, locationId) {
	let tempHouseLocationData = getServerData().houses[houseId].locations[locationId];

	logToConsole(LOG_VERBOSE, `[VRR.House]: Saving house location '${locationId}' for house '${getHouseData(houseId).databaseId}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeHouseDescription = escapeDatabaseString(dbConnection, getHouseData(houseId).description);

		let data = [
			["house_loc_house", getHouseData(houseId).databaseId],
			["house_loc_type", tempHouseLocationData.type],
			["house_loc_enabled", boolToInt(tempHouseLocationData.enabled)],
			["house_loc_locked", boolToInt(tempHouseLocationData.locked)],
			["house_loc_pos1_x", tempHouseLocationData.positionOne.x],
			["house_loc_pos1_y", tempHouseLocationData.positionOne.y],
			["house_loc_pos1_z", tempHouseLocationData.positionOne.z],
			["house_loc_rot1_z", tempHouseLocationData.rotationOne.z],
			["house_loc_int1", tempHouseLocationData.interiorOne],
			["house_loc_vw1", tempHouseLocationData.dimensionOne],
			["house_loc_pickup1", tempHouseLocationData.pickupModelOne],
			["house_loc_blip1", tempHouseLocationData.blipModelOne],
			["house_loc_pos2_x", tempHouseLocationData.positionTwo.x],
			["house_loc_pos2_y", tempHouseLocationData.positionTwo.y],
			["house_loc_pos2_z", tempHouseLocationData.positionTwo.z],
			["house_loc_rot2_z", tempHouseLocationData.rotationTwo],
			["house_loc_int2", tempHouseLocationData.interiorTwo],
			["house_loc_vw2", getHouseData(houseId).databaseId+getGlobalConfig().houseDimensionStart],
			["house_loc_pickup2", tempHouseLocationData.pickupTwo],
			["house_loc_blip2", tempHouseLocationData.blipTwo],
		];

		let dbQuery = null;
		if(tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().houses[houseId].locations[locationId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_loc", data, `house_loc_id=${tempHouseLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getServerData().houses[houseId].locations[locationId].needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[VRR.House]: Saved house '${tempHouseData.description}' to database!`);

	return false;
}

// ===========================================================================

function createAllHousePickups() {
	for(let i in getServerData().houses) {
		createHouseEntrancePickup(i);
		createHouseExitPickup(i);
	}
}

// ===========================================================================

function createAllHouseBlips() {
	for(let i in getServerData().houses) {
		createHouseEntranceBlip(i);
		createHouseExitBlip(i);
	}
}

// ===========================================================================

function createHouseEntrancePickup(houseId) {
	if(!getServerConfig().createHousePickups) {
		return false;
	}

	if(getHouseData(houseId).entrancePickupModel != -1) {
		let pickupModelId = getGameConfig().pickupModels[getServerGame()].house;

		if(getServerData().houses[houseId].entrancePickupModel != 0) {
			pickupModelId = getHouseData(houseId).entrancePickupModel;
		}

		getHouseData(houseId).entrancePickup = createGamePickup(pickupModelId, getHouseData(houseId).entrancePosition, getGameConfig().pickupTypes[getServerGame()].house);
		setElementOnAllDimensions(getHouseData(houseId).entrancePickup, false);
		setElementDimension(getHouseData(houseId).entrancePickup, getHouseData(houseId).entranceDimension);
		setEntityData(getHouseData(houseId).entrancePickup, "vrr.owner.type", VRR_PICKUP_HOUSE_ENTRANCE, false);
		setEntityData(getHouseData(houseId).entrancePickup, "vrr.owner.id", houseId, false);
		setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.type", VRR_LABEL_HOUSE, true);
		setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.name", getHouseData(houseId).description, true);
		setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.locked", getHouseData(houseId).locked, true);
		if(getHouseData(houseId).buyPrice > 0) {
			setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.price", getHouseData(houseId).buyPrice, true);
			setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_BUYHOUSE, true);
		} else {
			if(getHouseData(houseId).rentPrice > 0) {
				setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.rentprice", getHouseData(houseId).rentPrice, true);
				setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_RENTHOUSE, true);
			}
		}

		addToWorld(getHouseData(houseId).entrancePickup);
	}
}

// ===========================================================================

function createHouseEntranceBlip(houseId) {
	if(!getServerConfig().createHouseBlips) {
		return false;
	}

	if(getHouseData(houseId).entranceBlipModel != -1) {
		let blipModelId = getGameConfig().blipSprites[getServerGame()].house;

		if(getServerData().houses[houseId].entranceBlipModel != 0) {
			blipModelId = getHouseData(houseId).entranceBlipModel;
		}

		getHouseData(houseId).entranceBlip = createGameBlip(getHouseData(houseId).entrancePosition, blipModelId, 1, getColourByName("houseGreen"));
		setElementDimension(getHouseData(houseId).entranceBlip, getHouseData(houseId).entranceDimension);
		setElementOnAllDimensions(getHouseData(houseId).entranceBlip, false);
		//getHouseData(houseId).entranceBlip.streamInDistance = 300;
		//getHouseData(houseId).entranceBlip.streamOutDistance = 350;
		setEntityData(getHouseData(houseId).entranceBlip, "vrr.owner.type", VRR_BLIP_HOUSE_ENTRANCE, false);
		setEntityData(getHouseData(houseId).entranceBlip, "vrr.owner.id", houseId, false);
		addToWorld(getHouseData(houseId).entranceBlip);
	}
}

// ===========================================================================

function createHouseExitPickup(houseId) {
	if(!getServerConfig().createHousePickups) {
		return false;
	}

	if(getHouseData(houseId).hasInterior) {
		if(getHouseData(houseId).exitPickupModel != -1) {
			let pickupModelId = getGameConfig().pickupModels[getServerGame()].exit;

			if(getServerData().houses[houseId].exitPickupModel != 0) {
				pickupModelId = getHouseData(houseId).exitPickupModel;
			}

			getHouseData(houseId).exitPickup = createGamePickup(pickupModelId, getHouseData(houseId).exitPosition, getGameConfig().pickupTypes[getServerGame()].house);
			setElementDimension(getHouseData(houseId).exitPickup, getHouseData(houseId).exitDimension);
			setElementOnAllDimensions(getHouseData(houseId).exitPickup, false);
			setEntityData(getHouseData(houseId).exitPickup, "vrr.owner.type", VRR_PICKUP_HOUSE_EXIT, false);
			setEntityData(getHouseData(houseId).exitPickup, "vrr.owner.id", houseId, false);
			setEntityData(getHouseData(houseId).exitPickup, "vrr.label.type", VRR_LABEL_EXIT, true);
			addToWorld(getHouseData(houseId).exitPickup);
		}
	}
}

// ===========================================================================

function createHouseExitBlip(houseId) {
	if(!getServerConfig().createHouseBlips) {
		return false;
	}

	if(getHouseData(houseId).hasInterior) {
		if(getHouseData(houseId).exitBlipModel != -1) {
			let blipModelId = getGameConfig().blipSprites[getServerGame()].house;

			if(getServerData().houses[houseId].exitBlipModel != 0) {
				blipModelId = getHouseData(houseId).exitBlipModel;
			}

			getHouseData(houseId).exitBlip = createGameBlip(blipModelId, getHouseData(houseId).exitPosition, 1, getColourByName("houseGreen"));
			setElementDimension(getHouseData(houseId).exitBlip, getHouseData(houseId).entranceDimension);
			setElementOnAllDimensions(getHouseData(houseId).exitBlip, false);
			setEntityData(getHouseData(houseId).exitBlip, "vrr.owner.type", VRR_BLIP_HOUSE_EXIT, false);
			setEntityData(getHouseData(houseId).exitBlip, "vrr.owner.id", houseId, false);
			addToWorld(getHouseData(houseId).exitBlip);
		}
	}
}

// ===========================================================================

function getHouseOwnerTypeText(ownerType) {
	switch(ownerType) {
		case VRR_HOUSEOWNER_CLAN:
			return "clan";

		case VRR_HOUSEOWNER_PLAYER:
			return "player";

		case VRR_BIZOWNER_NONE:
			return "not owned";

		case VRR_BIZOWNER_PUBLIC:
			return "not owned";

		case VRR_BIZOWNER_JOB:
			return "job";

		default:
			return "unknown";
	}
}

// ===========================================================================

function getHouseInfoCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!areParamsEmpty(params)) {
		houseId = toInteger(params);
	}

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let ownerName = "Unknown";
	switch(getHouseData(houseId).ownerType) {
		case VRR_HOUSEOWNER_CLAN:
			ownerName = getClanData(getHouseData(houseId).ownerId).name;
			break;

		case VRR_HOUSEOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(getHouseData(houseId).ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case VRR_HOUSEOWNER_NONE:
			ownerName = "None";
			break;

		case VRR_HOUSEOWNER_PUBLIC:
			ownerName = "Public";
			break;

		case VRR_HOUSEOWNER_JOB:
			ownerName = getJobData(getHouseData(houseId).ownerId).name;
			break;
	}

	messagePlayerNormal(client, `🏠 {houseGreen}[House Info] {MAINCOLOUR}Description: {ALTCOLOUR}${getHouseData(houseId).description}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName} (${getHouseOwnerTypeText(getHouseData(houseId).ownerType)}), {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(getHouseData(houseId).locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${houseId}/${getHouseData(houseId).databaseId}`);
}

// ===========================================================================

function setHouseBuyPriceCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).buyPrice = amount;
	setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.price", getHouseData(houseId).buyPrice, true);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s {MAINCOLOUR}for-sale price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function setHouseRentPriceCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).rentPrice = amount;
	setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.price", `Rent: ${getHouseData(houseId).rentPrice}`, true);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s {MAINCOLOUR}rent price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function buyHouseCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(getHouseData(houseId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "HouseNotForSale"));
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getHouseData(houseId).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "HousePurchaseNotEnoughMoney"));
		return false;
	}

	getHouseData(houseId).ownerType = VRR_BIZOWNER_PLAYER;
	getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
	getHouseData(houseId).buyPrice = 0;

	updateHousePickupLabelData(houseId);

	messagePlayerSuccess(client, `You are now the owner of {houseGreen}${getHouseData(houseId).description}`);
}

// ===========================================================================

function isPlayerInAnyHouse(client) {
	return doesEntityDataExist(client, "vrr.inHouse");
}

// ===========================================================================

function getHouseData(houseId) {
	if(typeof getServerData().houses[houseId] != "undefined") {
		return getServerData().houses[houseId];
	}
}

// ===========================================================================

function doesHouseHaveInterior(houseId) {
	return getHouseData(houseId).hasInterior;
}

// ===========================================================================

function deleteHouseEntrancePickup(houseId) {
	if(getHouseData(houseId).entrancePickup != null) {
		//removeFromWorld(getHouseData(houseId).entrancePickup);
		deleteGameElement(getHouseData(houseId).entrancePickup);
		getHouseData(houseId).entrancePickup = null;
	}
}

// ===========================================================================

function deleteHouseExitPickup(houseId) {
	if(getHouseData(houseId).exitPickup != null) {
		//removeFromWorld(getHouseData(houseId).exitPickup);
		deleteGameElement(getHouseData(houseId).exitPickup);
		getHouseData(houseId).exitPickup = null;
	}
}

// ===========================================================================

function deleteHouseEntranceBlip(houseId) {
	if(getHouseData(houseId).entranceBlip != null) {
		//removeFromWorld(getHouseData(houseId).entranceBlip);
		deleteGameElement(getHouseData(houseId).entranceBlip);
		getHouseData(houseId).entranceBlip = null;
	}
}

// ===========================================================================

function deleteHouseExitBlip(houseId) {
	if(getHouseData(houseId).exitBlip != null) {
		//removeFromWorld(getHouseData(houseId).exitBlip);
		deleteGameElement(getHouseData(houseId).exitBlip);
		getHouseData(houseId).exitBlip = null;
	}
}

// ===========================================================================

function reloadAllHousesCommand(command, params, client) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerInAnyHouse(clients[i])) {
			removePlayerFromHouses(clients[i]);
		}
	}

	for(let i in getServerData().houses) {
		deleteHouseExitBlip(i);
		deleteHouseEntranceBlip(i);
		deleteHouseExitPickup(i);
		deleteHouseEntrancePickup(i);
	}

	clearArray(getServerData().houses);
	getServerData().houses = loadHousesFromDatabase();
	createAllHousePickups();
	createAllHouseBlips();

	messageAdminAction(`All houses have been reloaded by an admin!`);
}

// ===========================================================================

function exitHouse(client) {
	let houseId = getPlayerHouse(client);
	if(isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().house[houseId].entranceInterior);
		setPlayerDimension(client, getServerData().house[houseId].entranceDimension);
		setPlayerPosition(client, getServerData().house[houseId].entrancePosition);
	}
	removeEntityData(client, "vrr.inHouse");
}

// ===========================================================================

function setAllHouseIndexes() {
	for(let i in getServerData().houses) {
		getServerData().houses[i].index = i;

		//for(let j in getServerData().houses[i].locations) {
		//	getServerData().houses[i].locations[j].index = j;
		//	getServerData().houses[i].locations[j].houseIndex = i;
		//}

		//for(let j in getServerData().houses[i].gameScripts) {
		//	getServerData().houses[i].gameScripts[j].index = j;
		//	getServerData().houses[i].gameScripts[j].houseIndex = i;
		//}
	}
}

// ===========================================================================

function cacheAllHouseItems() {
	for(let i in getServerData().houses) {
		cacheHouseItems(i);
	}
}

// ===========================================================================

function cacheHouseItems(houseId) {
	getHouseData(houseId).itemCache = [];

	for(let i in getServerData().items) {
		if(getItemData(i).ownerType == VRR_ITEM_OWNER_HOUSE && getItemData(i).ownerId == getHouseData(houseId).databaseId) {
			getHouseData(houseId).itemCache.push(i);
		}
	}
}

// ===========================================================================

function getHouseIdFromDatabaseId(databaseId) {
	let houses = getServerData().houses;
	for(let i in houses) {
		if(houses[i].databaseId == databaseId) {
			return i;
		}
	}
}

// ===========================================================================

function sendPlayerHouseGameScripts(client, houseId) {
	for(let i in getHouseData(houseId).gameScripts) {
		sendPlayerGameScriptState(client, getHouseData(houseId).gameScripts[i].state);
	}
}

// ===========================================================================

function clearPlayerHouseGameScripts(client, houseId) {
	for(let i in getHouseData(houseId).gameScripts) {
		sendPlayerGameScriptState(client, VRR_GAMESCRIPT_DENY);
	}
}

// ===========================================================================

function updateHouseInteriorLightsForOccupants(houseId) {
	let clients = getClients()
	for(let i in clients) {
		if(getPlayerHouse(clients[i]) == houseId) {
			updateInteriorLightsForPlayer(clients[i], getHouseData(houseId).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerSetHouseInteriorLights(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockHouse(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function resetHousePickups(houseId) {
	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);
	createHouseEntrancePickup(houseId);
	createHouseExitPickup(houseId);
}

// ===========================================================================

function resetHouseBlips(houseId) {
	deleteHouseEntranceBlip(houseId);
	deleteHouseExitBlip(houseId);
	createHouseEntranceBlip(houseId);
	createHouseExitBlip(houseId);
}

// ===========================================================================

function resetAllHousePickups() {
	for(let i in getServerData().houses) {
		resetHousePickups(i);
	}
}

// ===========================================================================

function resetAllHouseBlips() {
	for(let i in getServerData().houses) {
		resetHouseBlips(i);
	}
}

// ===========================================================================

function canPlayerManageHouse(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER) {
		if(getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN) {
		if(getHouseData(houseId).ownerId == getPlayerClan(client)) {
			if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
				return true;
			}
			//if(getHouseData(houseId).clanRank <= getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level) {
			//	return true;
			//}
		}
	}

	return false;
}

// ===========================================================================

function getHouseFromParams(params) {
	if(isNaN(params)) {
		for(let i in getServerData().houses) {
			if(toLowerCase(getServerData().houses[i].description).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().houses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================