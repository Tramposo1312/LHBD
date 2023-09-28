// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_INFO, "[VRR.Business]: Initializing business script ...");
	getServerData().businesses = loadBusinessesFromDatabase();

	cacheAllBusinessItems();

	if(getServerConfig().createBusinessPickups) {

	}

	if(getServerConfig().createBusinessBlips) {

	}
	createAllBusinessPickups();
	createAllBusinessBlips();

	setAllBusinessIndexes();

	logToConsole(LOG_INFO, "[VRR.Business]: Business script initialized successfully!");
	return true;
}

// ===========================================================================

function loadBusinessFromId(businessId) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM biz_main WHERE biz_id = ${businessId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new BusinessData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadBusinessesFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Business]: Loading businesses from database ...");

	let tempBusinesses = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM biz_main WHERE biz_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessData = new BusinessData(dbAssoc);
					tempBusinessData.locations = loadBusinessLocationsFromDatabase(tempBusinessData.databaseId);
					tempBusinessData.gameScripts = loadBusinessGameScriptsFromDatabase(tempBusinessData.databaseId);
					tempBusinesses.push(tempBusinessData);
					logToConsole(LOG_INFO, `[VRR.Business]: Business '${tempBusinessData.name}' (ID ${tempBusinessData.databaseId}) loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Business]: ${tempBusinesses.length} businesses loaded from database successfully!`);
	return tempBusinesses;
}

// ===========================================================================

function loadBusinessLocationsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[VRR.Business]: Loading business locations for business ${businessId} from database ...`);

	let tempBusinessLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if(dbConnection) {
		dbQueryString = `SELECT * FROM biz_loc WHERE biz_loc_biz = ${businessId}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessLocationData = new BusinessLocationData(dbAssoc);
					tempBusinessLocations.push(tempBusinessLocationData);
					logToConsole(LOG_VERBOSE, `[VRR.Business]: Location '${tempBusinessLocationData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[VRR.Business]: ${tempBusinessLocations.length} location for business ${businessId} loaded from database successfully!`);
	return tempBusinessLocations;
}

// ===========================================================================

function loadBusinessGameScriptsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[VRR.Business]: Loading business game scripts for business ${businessId} from database ...`);

	let tempBusinessGameScripts = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if(dbConnection) {
		dbQueryString = `SELECT * FROM biz_script WHERE biz_script_biz = ${businessId}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessGameScriptData = new BusinessGameScriptData(dbAssoc);
					tempBusinessGameScripts.push(tempBusinessGameScriptData);
					logToConsole(LOG_VERBOSE, `[VRR.Business]: Game script '${tempBusinessGameScriptData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[VRR.Business]: ${tempBusinessGameScripts.length} game scripts for business ${businessId} loaded from database successfully!`);
	return tempBusinessGameScripts;
}

// ===========================================================================

function createBusinessCommand(command, params, client) {
	let tempBusinessData = createBusiness(params, getPlayerPosition(client), toVector3(0.0, 0.0, 0.0), getGameConfig().pickupModels[getServerGame()].business, getGameConfig().blipSprites[getServerGame()].business, getPlayerInterior(client), getPlayerDimension(client));
	tempBusinessData.needsSaved = true;
	let businessId = getServerData().businesses.push(tempBusinessData);
	setAllBusinessIndexes();

	saveAllBusinessesToDatabase();

	createBusinessEntrancePickup(businessId-1);
	createBusinessExitPickup(businessId-1);
	createBusinessEntranceBlip(businessId-1);
	createBusinessExitBlip(businessId-1);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}created business {businessBlue}${tempBusinessData.name}`);
}

// ===========================================================================

function createBusinessLocationCommand(command, params, client) {
	if(!isPlayerSpawned(client)) {
		messagePlayerError(client, "You must be spawned to use this command!");
		return false;
	}

	let locationType = toString(getParam(params, " ", 1));
	let businessId = (isPlayerInAnyBusiness(getParam(params, " ", 2))) ? getPlayerBusiness(client) : getClosestBusinessEntrance(getPlayerPosition(client));

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempBusinessLocationData = createBusinessLocation(locationType, businessId);
	getServerData().businesses[businessId].push(tempBusinessLocationData);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}created location {businessBlue}${params} {MAINCOLOUR}for business {businessBlue}${tempBusinessData.name}`);
}

// ===========================================================================

function createBusiness(name, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInteriorId = 0, entranceVirtualWorld = 0, exitInteriorId = -1, exitVirtualWorld = -1, exitPickupModel = -1, exitBlipModel = -1) {
	let tempBusinessData = new BusinessData(false);
	tempBusinessData.name = name;

	tempBusinessData.entrancePosition = entrancePosition;
	tempBusinessData.entranceRotation = 0.0;
	tempBusinessData.entrancePickupModel = entrancePickupModel;
	tempBusinessData.entranceBlipModel = entranceBlipModel;
	tempBusinessData.entranceInterior = entranceInteriorId;
	tempBusinessData.entranceDimension = entranceVirtualWorld;

	tempBusinessData.exitPosition = exitPosition;
	tempBusinessData.exitRotation = 0.0;
	tempBusinessData.exitPickupModel = exitPickupModel;
	tempBusinessData.exitBlipModel = exitBlipModel;
	tempBusinessData.exitInterior = exitInteriorId;
	tempBusinessData.exitDimension = exitVirtualWorld;

	return tempBusinessData;
}

// ===========================================================================

function deleteBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted business {businessBlue}${getBusinessData(businessId).name}`);
	deleteBusiness(businessId, getPlayerData(client).accountData.databaseId);
}

// ===========================================================================

function deleteBusinessLocationCommand(command, params, client) {
	//let businessId = toInteger(getParam(params, " ", 2));
	//deleteBusinessLocation(businessId);
	//messagePlayerSuccess(client, `Business '${tempBusinessData.name} deleted!`);
}

// ===========================================================================

function setBusinessNameCommand(command, params, client) {
	let newBusinessName = toString(params);

	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the name of this business!");
		return false;
	}

	let oldBusinessName = getBusinessData(businessId).name;
	getBusinessData(businessId).name = newBusinessName;
	setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.name", getBusinessData(businessId).name, true);
	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}renamed business {businessBlue}${oldBusinessName} {MAINCOLOUR}to {businessBlue}${newBusinessName}`);
}

// ===========================================================================

function setBusinessOwnerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newBusinessOwner = getPlayerFromParams(params);
	let businessId = getPlayerBusiness(client);

	if(!newBusinessOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the owner of this business!");
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_PLAYER;
	getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(newBusinessOwner).databaseId;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(`{MAINCOLOUR}You gave business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}to {ALTCOLOUR}${newBusinessOwner.name}`);
}

// ===========================================================================

function setBusinessJobCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);
	let businessId = getPlayerBusiness(client);

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the owner of this business!");
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(`{MAINCOLOUR}You set the owner of business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}to the {jobYellow}${getJobData(jobId).name}`);
}

// ===========================================================================

function setBusinessClanCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't give this business to a clan!");
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_CLAN;
	getBusinessData(businessId).ownerId = getClanData(clanId).databaseId;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(`{MAINCOLOUR}You gave business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
}

// ===========================================================================

function setBusinessRankCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let rankId = params;

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change this business rank level!");
		return false;
	}

	if(getVehicleData(vehicle).ownerType == VRR_VEHOWNER_CLAN) {
		let clanId = getClanIdFromDatabaseId(getBusinessData(businessId).ownerId);
		rankId = getClanRankFromParams(clanId, params);
		if(!getClanRankData(clanId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
			return false;
		}
		getBusinessData(businessId).rank = getClanRankData(clanId, rankId).databaseId;
		messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}rank to {ALTCOLOUR}${getClanRankData(clanId, rankId).name} {MAINCOLOUR}of the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
	} else if(getBusinessData(businessId).ownerType == VRR_VEHOWNER_JOB) {
		getBusinessData(businessId).rank = rankId;
		messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}rank to {ALTCOLOUR}${rankId} {MAINCOLOUR}of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getBusinessData(businessId).ownerId)).name} {MAINCOLOUR}job!`);
	}

	getBusinessData(businessId).needsSaved = true;
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
 function setBusinessRankCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanRankId = getClanRankFromParams(clanId, params);

	if(!getClanRankData(clanId, clanRankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change this business rank!");
		return false;
	}

	if(getClanRankData(clanId, clanRankId).level > getPlayerCurrentSubAccount(client).clanRank) {
		messagePlayerError(client, "That rank is above your level!");
		return false;
	}

	getBusinessData(businessId).clanRank = getClanRankData(clanId, clanRankId).level;

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(`{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR}'s clan rank to {clanOrange}${getClanRankData(clanId, clanRankId).name} {MAINCOLOUR}(level ${getClanRankData(clanId, clanRankId).level}) and above!`);
}

// ===========================================================================

function setBusinessJobCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if(!areParamsEmpty(params)) {
		jobId = getJobIdFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;

	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}owner to the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function setBusinessPublicCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_PUBLIC;
	getBusinessData(businessId).ownerId = 0;

	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}owner set to {ALTCOLOUR}public`);
}

// ===========================================================================

function removeBusinessOwnerCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_NONE;
	getBusinessData(businessId).ownerId = -1;

	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}removed business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}owner`);
}

// ===========================================================================

function lockUnlockBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change this business rank!");
		return false;
	}

	getBusinessData(businessId).locked = !getBusinessData(businessId).locked;
	setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.locked", getBusinessData(businessId).locked, true);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `${getLockedUnlockedEmojiFromBool((getBusinessData(businessId).locked))} Business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}${getLockedUnlockedFromBool((getBusinessData(businessId).locked))}!`);
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
 function toggleBusinessInteriorLightsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the interior lights for this business!");
		return false;
	}

	getBusinessData(businessId).interiorLights = !getBusinessData(businessId).interiorLights;
	updateBusinessInteriorLightsForOccupants(businessId);

	getBusinessData(businessId).needsSaved = true;
	meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(getBusinessData(businessId).interiorLights))} the business lights`);
}

// ===========================================================================

function setBusinessEntranceFeeCommand(command, params, client) {
	let entranceFee = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the entrance fee for this business!");
		return false;
	}

	getBusinessData(businessId).entranceFee = entranceFee;
	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}entrance fee to [#AAAAAAA]$${entranceFee}`);
}

// ===========================================================================

function getBusinessInfoCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let ownerName = "Unknown";
	switch(getBusinessData(businessId).ownerType) {
		case VRR_BIZOWNER_CLAN:
			ownerName = getClanData(getBusinessData(businessId).ownerId).name;
			break;

		case VRR_BIZOWNER_JOB:
			ownerName = getJobData(getBusinessData(businessId).ownerId).name;
			break;

		case VRR_BIZOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(getBusinessData(businessId).ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case VRR_BIZOWNER_NONE:
			ownerName = "None";
			break;

		case VRR_BIZOWNER_PUBLIC:
			ownerName = "Public";
			break;
	}

	messagePlayerInfo(client, `🏢 {businessBlue}[Business Info] {MAINCOLOUR}Name: {ALTCOLOUR}${getBusinessData(businessId).name}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName} (${getBusinessOwnerTypeText(getBusinessData(businessId).ownerType)}), {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(getBusinessData(businessId).locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${businessId}/${getBusinessData(businessId).databaseId}`);
}

// ===========================================================================

function getBusinessFloorItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	showBusinessFloorInventoryToPlayer(client, businessId);
}

// ===========================================================================

function getBusinessStorageItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	showBusinessStorageInventoryToPlayer(client, businessId);
}

// ===========================================================================

function setBusinessPickupCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(isNull(getGameConfig().pickupModels[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a pickup model ID");
			messagePlayerInfo(client, `Pickup Types: {ALTCOLOUR}${Object.keys(getGameConfig().pickupModels[getServerGame()]).join(", ")}`)
			return false;
		}

		getBusinessData(businessId).entrancePickupModel = getGameConfig().pickupModels[getServerGame()][typeParam];
	} else {
		getBusinessData(businessId).entrancePickupModel = toInteger(typeParam);
	}

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}pickup display to {ALTCOLOUR}${toLowerCase(typeParam)}'!`);
}

// ===========================================================================

function setBusinessInteriorTypeCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "None") {
			getBusinessData(businessId).exitPosition = toVector3(0.0, 0.0, 0.0);
			getBusinessData(businessId).exitDimension = 0;
			getBusinessData(businessId).exitInterior = -1;
			getBusinessData(businessId).hasInterior = false;
			getBusinessData(businessId).exitPickupModel = -1;
			messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}removed business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}interior`);
			return false;
		}

		if(isNull(getGameConfig().interiorTemplates[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(getGameConfig().interiorTemplates[getServerGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, `{clanOrange}== {jobYellow}Interior Types {clanOrange}=======================`);
			for(let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).exitPosition = getGameConfig().interiorTemplates[getServerGame()][typeParam][0];
		getBusinessData(businessId).exitInterior = getGameConfig().interiorTemplates[getServerGame()][typeParam][1];
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId+getGlobalConfig().businessDimensionStart;
		getBusinessData(businessId).exitPickupModel = getGameConfig().pickupModels[getServerGame()].exit;
		getBusinessData(businessId).hasInterior = true;
	}

	//deleteBusinessExitPickup(businessId);
	//deleteBusinessExitBlip(businessId);
	//createBusinessExitBlip(businessId);
	//createBusinessExitPickup(businessId);

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}interior type to {ALTCOLOUR}${toLowerCase(typeParam)}`);
}

// ===========================================================================

function setBusinessBlipCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(isNull(getGameConfig().blipSprites[getServerGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a blip image ID");
			messagePlayerInfo(client, `Blip Types: {ALTCOLOUR}${Object.keys(getGameConfig().blipSprites[getServerGame()]).join(", ")}`)
			return false;
		}

		getBusinessData(businessId).entranceBlipModel = getGameConfig().blipSprites[getServerGame()][typeParam];
	} else {
		getBusinessData(businessId).entranceBlipModel = toInteger(typeParam);
	}

	resetBusinessBlips(businessId);
	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}blip display to {ALTCOLOUR}${toLowerCase(typeParam)}`);
}

// ===========================================================================

function giveDefaultItemsToBusinessCommand(command, params, client) {
	let splitParams = params.split(" ");

	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!isNaN(typeParam)) {
	}

	if(isNull(getGameConfig().defaultBusinessItems[getServerGame()][typeParam])) {
		messagePlayerError(client, "Invalid business items type! Use a business items type name");
		messagePlayerInfo(client, `Blip Types: {ALTCOLOUR}${Object.keys(getGameConfig().defaultBusinessItems[getServerGame()]).join(", ")}`)
		return false;
	}

	for(let i in getGameConfig().defaultBusinessItems[getServerGame()][typeParam]) {
		let itemTypeId = getItemTypeFromParams(getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][0]);
		let itemTypeData = getItemTypeData(itemTypeId);
		if(itemTypeData) {
			let newItemIndex = createItem(itemTypeId, itemTypeData.orderValue, VRR_ITEM_OWNER_BIZFLOOR, getBusinessData(businessId).databaseId, getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][1]);
			getItemData(newItemIndex).buyPrice = applyServerInflationMultiplier(itemTypeData.orderPrice)*getGameConfig().defaultBusinessItems[getServerGame()][typeParam][i][2];
		}
	}

	cacheBusinessItems(businessId);
	updateBusinessPickupLabelData(businessId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}gave business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}the default items for ${toLowerCase(typeParam)}`);
}

// ===========================================================================

function setBusinessEntranceLabelToDealershipCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).labelHelpType == VRR_PROPLABEL_INFO_ENTERVEHICLE;
	updateBusinessPickupLabelData(businessId);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set the business type of {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}to dealership`);
}

// ===========================================================================

function deleteBusinessFloorItemsCommand(command, params, client) {
	let splitParams = params.split(" ");

	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	for(let i in getBusinessData(businessId).floorItemCache) {
		deleteItem(getBusinessData(businessId).floorItemCache);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted all on-sale items for business {businessBlue}${getBusinessData(businessId).name}`);
}

// ===========================================================================

function deleteBusinessStorageItemsCommand(command, params, client) {
	let splitParams = params.split(" ");

	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	for(let i in getBusinessData(businessId).storageItemCache) {
		deleteItem(getBusinessData(businessId).storageItemCache);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted all stored items for business {businessBlue}${getBusinessData(businessId).name}`);
}

// ===========================================================================

function withdrawFromBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't withdraw cash from this business!");
		return false;
	}

	if(getBusinessData(businessId).till < amount) {
		messagePlayerError(client, `Business {businessBlue}${tempBusinessData.name} doesn't have that much money! Use /bizbalance.`);
		return false;
	}

	getBusinessData(businessId).till -= amount;
	givePlayerCash(client, amount);
	updatePlayerCash(client);
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `You withdrew $${amount} from business {businessBlue}${getBusinessData(businessId).name} till`);
}

// ===========================================================================

function setBusinessBuyPriceCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the purchase price for this business!");
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getBusinessData(businessId).buyPrice = amount;
	setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.price", getBusinessData(businessId).buyPrice, true);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}'s {MAINCOLOUR}for-sale price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function depositIntoBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	// Let anybody deposit money
	//if(!canPlayerManageBusiness(client, businessId)) {
	//	messagePlayerError(client, "You can't deposit cash into this business!");
	//	return false;
	//}

	if(getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, `You don't have that much money! You only have $${getPlayerCurrentSubAccount(client).cash}`);
		return false;
	}

	getBusinessData(businessId).till += amount;
	takePlayerCash(client, amount);
	updatePlayerCash(client);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `You deposited $${amount} into business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}till`);
}

// ===========================================================================

function orderItemForBusinessCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 3, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemType = getItemTypeFromParams(splitParams.slice(0,-2).join(" "));

	if(!getItemTypeData(itemType)) {
		messagePlayerError(client, `Invalid item type name or ID!`);
		messagePlayerInfo(client, `Use {ALTCOLOUR}/itemtypes {MAINCOLOUR}for a list of items`);
		return false;
	}
	let pricePerItem = getOrderPriceForItemType(itemType);

	let amount = toInteger(splitParams.slice(-2, -1)) || 1;
	let value = toInteger(splitParams.slice(-1)) || getItemTypeData(itemType).capacity;
	let businessId = getPlayerBusiness(client);

	logToConsole(LOG_DEBUG, `[VRR.Business] ${getPlayerDisplayForConsole(client)} is ordering ${amount} ${splitParams.slice(0,-2).join(" ")} (${value})`);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't order items for this business!");
		return false;
	}

	let orderTotalCost = pricePerItem*amount;

	//getPlayerData(client).promptType = VRR_PROMPT_BIZORDER;
	getPlayerData(client).businessOrderAmount = amount;
	getPlayerData(client).businessOrderBusiness = businessId;
	getPlayerData(client).businessOrderItem = itemType;
	getPlayerData(client).businessOrderValue = value;
	getPlayerData(client).businessOrderCost = orderTotalCost;

	getBusinessData(businessId).needsSaved = true;
	showPlayerPrompt(client, VRR_PROMPT_BIZORDER, `Ordering ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${makeLargeNumberReadable(pricePerItem)} each will cost a total of $${makeLargeNumberReadable(orderTotalCost)}`, "Business Order Cost");
}

// ===========================================================================

function orderItemForBusiness(businessId, itemType, amount) {
	if(getBusinessData(businessId).till < orderTotalCost) {
		let neededAmount = orderTotalCost-getBusinessData(businessId).till;
		//messagePlayerError(client, `The business doesn't have enough money (needs {ALTCOLOUR}$${neededAmount} {MAINCOLOUR}more)! Use {ALTCOLOUR}/bizdeposit {MAINCOLOUR}to add money to the business.`);
		return false;
	}

	getBusinessData(businessId).till -= orderTotalCost;
	addToBusinessInventory(businessId, itemType, amount);
	//messagePlayerSuccess(client, `You ordered ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${getItemTypeData(itemType).orderPrice} each for business {businessBlue}${getBusinessData(businessId).name}`);
}

// ===========================================================================

function viewBusinessTillAmountCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't see the till amount for this business!");
		return false;
	}

	messagePlayerSuccess(client, `Business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}till has {ALTCOLOUR}$${getBusinessData(businessId).till}`);
}

// ===========================================================================

function buyBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(getBusinessData(businessId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "BusinessNotForSale"));
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getBusinessData(businessId).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "BusinessPurchaseNotEnoughMoney"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_PLAYER;
	getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
	getBusinessData(businessId).buyPrice = 0;

	updateBusinessPickupLabelData(businessId);
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `You are now the owner of {businessBlue}${getBusinessData(businessId).name}`);
}

// ===========================================================================

function moveBusinessEntranceCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).entrancePosition = getPlayerPosition(client);
	getBusinessData(businessId).entranceDimension = getPlayerDimension(client);
	getBusinessData(businessId).entranceInterior = getPlayerInterior(client);

	//deleteBusinessEntranceBlip(businessId);
	//deleteBusinessEntrancePickup(businessId);
	//createBusinessEntranceBlip(businessId);
	//createBusinessEntrancePickup(businessId);

	resetBusinessPickups(businessId);
	resetBusinessBlips(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}moved business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}entrance to their position`);
}

// ===========================================================================

function moveBusinessExitCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).exitPosition = getPlayerPosition(client);
	getBusinessData(businessId).exitDimension = getPlayerDimension(client);
	getBusinessData(businessId).exitInterior = getPlayerInterior(client);

	deleteBusinessExitBlip(businessId);
	deleteBusinessExitPickup(businessId);

	createBusinessExitBlip(businessId);
	createBusinessExitPickup(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}moved business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}exit to their position`);
}

// ===========================================================================

function getBusinessDataFromDatabaseId(databaseId) {
	let matchingBusinesses = getServerData().businesses.filter(b => b.databaseId == businessId)
	if(matchingBusinesses.length == 1) {
		return matchingBusinesses[0];
	}
	return false;
}

// ===========================================================================

function getClosestBusinessEntrance(position, dimension) {
	let closest = 0;
	for(let i in getServerData().businesses) {
		if(getServerData().businesses[i].entranceDimension == dimension) {
			if(getDistance(position, getServerData().businesses[i].entrancePosition) <= getDistance(position, getServerData().businesses[closest].entrancePosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getClosestBusinessExit(position, dimension) {
	let closest = 0;
	for(let i in getServerData().businesses) {
		if(getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == dimension) {
			if(getDistance(position, getServerData().businesses[i].exitPosition) <= getDistance(position, getServerData().businesses[closest].exitPosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function isPlayerInAnyBusiness(client) {
	for(let i in getServerData().businesses) {
		if(getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getPlayerBusiness(client) {
	let closestEntrance = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
	if(getDistance(getPlayerPosition(client), getBusinessData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
		return getBusinessData(closestEntrance).index;
	}

	for(let i in getServerData().businesses) {
		if(getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function saveAllBusinessesToDatabase() {
	for(let i in getServerData().businesses) {
		if(getServerData().businesses[i].needsSaved) {
			saveBusinessToDatabase(i);
		}
	}
}

// ===========================================================================

function saveBusinessToDatabase(businessId) {
	let tempBusinessData = getServerData().businesses[businessId]
	logToConsole(LOG_DEBUG, `[VRR.Business]: Saving business '${tempBusinessData.name}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeBusinessName = escapeDatabaseString(dbConnection, tempBusinessData.name);

		let data = [
			["biz_server", getServerId()],
			["biz_name", safeBusinessName],
			["biz_owner_type", tempBusinessData.ownerType],
			["biz_owner_id", tempBusinessData.ownerId],
			["biz_locked", boolToInt(tempBusinessData.locked)],
			["biz_entrance_fee", tempBusinessData.entranceFee],
			["biz_till", tempBusinessData.till],
			["biz_entrance_pos_x", tempBusinessData.entrancePosition.x],
			["biz_entrance_pos_y", tempBusinessData.entrancePosition.y],
			["biz_entrance_pos_z", tempBusinessData.entrancePosition.z],
			["biz_entrance_rot_z", tempBusinessData.entranceRotation],
			["biz_entrance_int", tempBusinessData.entranceInterior],
			["biz_entrance_vw", tempBusinessData.entranceDimension],
			["biz_entrance_pickup", tempBusinessData.entrancePickupModel],
			["biz_entrance_blip", tempBusinessData.entranceBlipModel],
			["biz_exit_pos_x", tempBusinessData.exitPosition.x],
			["biz_exit_pos_y", tempBusinessData.exitPosition.y],
			["biz_exit_pos_z", tempBusinessData.exitPosition.z],
			["biz_exit_rot_z", tempBusinessData.exitRotation],
			["biz_exit_int", tempBusinessData.exitInterior],
			["biz_exit_vw", tempBusinessData.exitDimension],
			["biz_exit_pickup", tempBusinessData.exitPickupModel],
			["biz_exit_blip", tempBusinessData.exitBlipModel],
			["biz_has_interior", boolToInt(tempBusinessData.hasInterior)],
			["biz_interior_lights", boolToInt(tempBusinessData.interiorLights)],
			["biz_label_help_type", tempBusinessData.labelHelpType],
			["biz_radiostation", tempBusinessData.streamingRadioStation],
		];

		let dbQuery = null;
		if(tempBusinessData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("biz_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().businesses[businessId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("biz_main", data, `biz_id=${tempBusinessData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getBusinessData(businessId).needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Business]: Saved business '${tempBusinessData.name}' to database!`);

	return false;
}

// ===========================================================================

function createAllBusinessPickups() {
	if(!getServerConfig().createBusinessPickups) {
		return false;
	}

	for(let i in getServerData().businesses) {
		createBusinessEntrancePickup(i);
		createBusinessExitPickup(i);
		updateBusinessPickupLabelData(i);
	}
}

// ===========================================================================

function createAllBusinessBlips() {
	if(!getServerConfig().createBusinessBlips) {
		return false;
	}

	for(let i in getServerData().businesses) {
		createBusinessEntranceBlip(i);
		createBusinessExitBlip(i);
	}
}

// ===========================================================================

function createBusinessEntrancePickup(businessId) {
	if(!getServerConfig().createBusinessPickups) {
		return false;
	}

	if(getBusinessData(businessId).entrancePickupModel != -1) {
		let pickupModelId = getGameConfig().pickupModels[getServerGame()].business;

		if(getServerData().businesses[businessId].entrancePickupModel != 0) {
			pickupModelId = getBusinessData(businessId).entrancePickupModel;
		}

		getBusinessData(businessId).entrancePickup = createGamePickup(pickupModelId, getBusinessData(businessId).entrancePosition, getGameConfig().pickupTypes[getServerGame()].business);
		setElementOnAllDimensions(getBusinessData(businessId).entrancePickup, false);
		setElementDimension(getBusinessData(businessId).entrancePickup, getBusinessData(businessId).entranceDimension);
		updateBusinessPickupLabelData(businessId);
		addToWorld(getBusinessData(businessId).entrancePickup);
	}
}

// ===========================================================================

function createBusinessEntranceBlip(businessId) {
	if(!getServerConfig().createBusinessBlips) {
		return false;
	}

	if(getBusinessData(businessId).entranceBlipModel != -1) {
		let blipModelId = getGameConfig().blipSprites[getServerGame()].business;

		if(getServerData().businesses[businessId].entranceBlipModel != 0) {
			blipModelId = getBusinessData(businessId).entranceBlipModel;
		}

		getBusinessData(businessId).entranceBlip = createGameBlip(getBusinessData(businessId).entrancePosition, blipModelId, 1, getColourByName("businessBlue"));
		setElementOnAllDimensions(getBusinessData(businessId).entranceBlip, false);
		setElementDimension(getBusinessData(businessId).entranceBlip, getBusinessData(businessId).entranceDimension);
		//getBusinessData(businessId).entranceBlip.streamInDistance = 300;
		//getBusinessData(businessId).entranceBlip.streamOutDistance = 350;
		//getBusinessData(businessId).entranceBlip.interior = getBusinessData(businessId).entranceInterior;
		//setEntityData(getBusinessData(businessId).entranceBlip, "vrr.owner.type", VRR_BLIP_BUSINESS_ENTRANCE, false);
		//setEntityData(getBusinessData(businessId).entranceBlip, "vrr.owner.id", businessId, false);
		addToWorld(getBusinessData(businessId).entranceBlip);
	}
}

// ===========================================================================

function createBusinessExitPickup(businessId) {
	if(!getServerConfig().createBusinessPickups) {
		return false;
	}

	if(getBusinessData(businessId).hasInterior) {
		if(getBusinessData(businessId).exitPickupModel != -1) {
			let pickupModelId = getGameConfig().pickupModels[getServerGame()].exit;

			if(getServerData().businesses[businessId].exitPickupModel != 0) {
				pickupModelId = getBusinessData(businessId).exitPickupModel;
			}

			getBusinessData(businessId).exitPickup = createGamePickup(pickupModelId, getBusinessData(businessId).exitPosition, getGameConfig().pickupTypes[getServerGame()].business);
			setElementDimension(getBusinessData(businessId).exitPickup, getBusinessData(businessId).exitDimension);
			setElementOnAllDimensions(getBusinessData(businessId).exitPickup, false);
			//setEntityData(getBusinessData(businessId).entranceBlip, "vrr.owner.type", VRR_PICKUP_BUSINESS_EXIT, false);
			//setEntityData(getBusinessData(businessId).entranceBlip, "vrr.owner.id", businessId, false);
			//getBusinessData(businessId).exitPickup.interior = getBusinessData(businessId).exitInterior;
			updateBusinessPickupLabelData(businessId);
			addToWorld(getBusinessData(businessId).exitPickup);
		}
	}
}

// ===========================================================================

function createBusinessExitBlip(businessId) {
	if(!getServerConfig().createBusinessBlips) {
		return false;
	}

	if(getBusinessData(businessId).hasInterior) {
		if(getBusinessData(businessId).exitBlipModel != -1) {
			let blipModelId = getGameConfig().blipSprites[getServerGame()].business;

			if(getServerData().businesses[businessId].exitBlipModel != 0) {
				blipModelId = getBusinessData(businessId).exitBlipModel;
			}

			getBusinessData(businessId).exitBlip = createGameBlip(getBusinessData(businessId).exitPosition, blipModelId, 1, getColourByName("businessBlue"));
			setElementDimension(getBusinessData(businessId).exitBlip, getBusinessData(businessId).entranceDimension);
			setElementOnAllDimensions(getBusinessData(businessId).exitBlip, false);
			//getBusinessData(businessId).exitBlip.interior = getBusinessData(businessId).exitInterior;
			//setEntityData(getBusinessData(businessId).exitBlip, "vrr.owner.type", VRR_BLIP_BUSINESS_EXIT, false);
			//setEntityData(getBusinessData(businessId).exitBlip, "vrr.owner.id", businessId, false);
			addToWorld(getBusinessData(businessId).exitBlip);
		}
	}
}

// ===========================================================================

function deleteBusiness(businessId, deletedBy = 0) {
	let tempBusinessData = getServerData().businesses[businessId];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `DELETE FROM biz_main WHERE biz_id = ${tempBusinessData.databaseId}`);
		if(dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	deleteBusinessBlips(businessId);
	deleteBusinessPickups(businessId);

	removePlayersFromBusiness(businessId);

	getServerData().businesses.splice(businessId, 1);
}

// ===========================================================================

function removePlayersFromBusiness(businessId) {
	getClients().forEach(function(client) {
		if(doesBusinessHaveInterior(businessId)) {
			if(isPlayerInAnyBusiness(client)) {
				if(getPlayerBusiness(client) == businessId) {
					exitBusiness(client);
				}
			}
		}
	});
}

// ===========================================================================

function removePlayerFromBusinesses(client) {
	if(isPlayerInAnyBusiness(client)) {
		exitBusiness(client);
	}
}

// ===========================================================================

function exitBusiness(client) {
	let businessId = getPlayerBusiness(client);
	if(isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().businesses[businessId].entranceInterior);
		setPlayerDimension(client, getServerData().businesses[businessId].entranceDimension);
		setPlayerPosition(client, getServerData().businesses[businessId].entrancePosition);
	}
}

// ===========================================================================

function getBusinessOwnerTypeText(ownerType) {
	switch(ownerType) {
		case VRR_BIZOWNER_CLAN:
			return "clan";

		case VRR_BIZOWNER_JOB:
			return "job";

		case VRR_BIZOWNER_PLAYER:
			return "player";

		case VRR_BIZOWNER_NONE:
		case VRR_BIZOWNER_PUBLIC:
			return "not owned";

		default:
			return "unknown";
	}
}

// ===========================================================================

function getBusinessData(businessId) {
	if(typeof getServerData().businesses[businessId] != null) {
		return getServerData().businesses[businessId];
	}
	return false;
}

// ===========================================================================

function doesBusinessHaveInterior(businessId) {
	return getBusinessData(businessId).hasInterior;
}

// ===========================================================================

function deleteBusinessEntrancePickup(businessId) {
	if(getBusinessData(businessId).entrancePickup != null) {
		//removeFromWorld(getBusinessData(businessId).entrancePickup);
		deleteGameElement(getBusinessData(businessId).entrancePickup);
		getBusinessData(businessId).entrancePickup = null;
	}
}

// ===========================================================================

function deleteBusinessExitPickup(businessId) {
	if(getBusinessData(businessId).exitPickup != null) {
		//removeFromWorld(getBusinessData(businessId).exitPickup);
		deleteGameElement(getBusinessData(businessId).exitPickup);
		getBusinessData(businessId).exitPickup = null;
	}
}

// ===========================================================================

function deleteBusinessEntranceBlip(businessId) {
	if(getBusinessData(businessId).entranceBlip != null) {
		//removeFromWorld(getBusinessData(businessId).entranceBlip);
		deleteGameElement(getBusinessData(businessId).entranceBlip);
		getBusinessData(businessId).entranceBlip = null;
	}
}

// ===========================================================================

function deleteBusinessExitBlip(businessId) {
	if(getBusinessData(businessId).exitBlip != null) {
		//removeFromWorld(getBusinessData(businessId).exitBlip);
		deleteGameElement(getBusinessData(businessId).exitBlip);
		getBusinessData(businessId).exitBlip = null;
	}
}

// ===========================================================================

function reloadAllBusinessesCommand(command, params, client) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerInAnyBusiness(clients[i])) {
			removePlayerFromBusinesses(clients[i]);
		}
	}

	for(let i in getServerData().businesses) {
		deleteBusinessExitBlip(i);
		deleteBusinessEntranceBlip(i);
		deleteBusinessExitPickup(i);
		deleteBusinessEntrancePickup(i);
	}

	//forceAllPlayersToStopWorking();
	clearArray(getServerData().businesses);
	getServerData().businesses = loadBusinessesFromDatabase();
	createAllBusinessPickups();
	createAllBusinessBlips();

	messageAdminAction(`All businesses have been reloaded by an admin!`);
}

// ===========================================================================

function setAllBusinessIndexes() {
	for(let i in getServerData().businesses) {
		getServerData().businesses[i].index = i;

		//for(let j in getServerData().businesses[i].locations) {
		//	getServerData().businesses[i].locations[j].index = j;
		//	getServerData().businesses[i].locations[j].businessIndex = i;
		//}

		//for(let j in getServerData().businesses[i].gameScripts) {
		//	getServerData().businesses[i].gameScripts[j].index = j;
		//	getServerData().businesses[i].gameScripts[j].businessIndex = i;
		//}
	}
}

// ===========================================================================

function addToBusinessInventory(businessId, itemType, amount, buyPrice) {
	let tempItemData = new ItemData(false);
	tempItemData.amount = amount;
	tempItemData.buyPrice = buyPrice;
	tempItemData.itemType = getItemTypeData(itemType).databaseId;
	tempItemData.ownerId = getBusinessData(business).databaseId;
	tempItemData.ownerType = VRR_ITEMOWNER_BIZ;
	tempItemData.ownerIndex = businessId;
	tempItemData.itemTypeIndex = itemType;
	saveItemToDatabase(tempItemData);
	getServerData().items.push(tempItemData);

	let index = getServerData().items.length-1;
	getServerData().items[index].index = index;
}

// ===========================================================================

function buyFromBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(areParamsEmpty(params)) {
		showBusinessFloorInventoryToPlayer(client, businessId);
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if(getBusinessData(businessId).locked) {
		messagePlayerError(client, `This business is closed!`);
		return false;
	}

	if(getBusinessData(businessId).hasInterior) {
		if(!getPlayerBusiness(client)) {
			if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
				messagePlayerTip(client, `You need to enter the business first! Press {ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "enter")).key)} {MAINCOLOUR}to enter and exit a business`);
			} else {
				messagePlayerNormal(client, `You need to enter the business first! Use /enter to enter and exit a business`);
			}
			return false;
		}
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 1;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let amount = 1;
	if(areThereEnoughParams(params, 2, " ")) {
		amount = toInteger(getParam(params, " ", 2)) || 1;
		if(amount <= 0) {
			messagePlayerError(client, "The amount must be more than 0!");
			return false;
		}
	}

	if(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount < amount) {
		messagePlayerError(client, `There are only ${getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount} ${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name} in slot ${itemSlot-1}`);
		return false;
	}

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if(firstSlot == -1) {
		messagePlayerError(client, `You don't have any space to carry this (full inventory)!`);
		return false;
	}

	let totalCost = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice*amount;
	let individualCost = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice;
	let itemName = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name;
	let priceEach = (amount > 1) ? `($${individualCost} each)` : ``;

	if(getPlayerCurrentSubAccount(client).cash < totalCost) {
		messagePlayerError(client, `You don't have enough money! You need {ALTCOLOUR}${getBusinessData(businessId).floorItemCache[itemSlot-1].buyPrice*amount-getPlayerCurrentSubAccount(client).cash} {MAINCOLOUR}more!`);
		return false;
	}

	takePlayerCash(client, totalCost);
	createItem(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex, getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).value, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId, amount);
	cachePlayerHotBarItems(client);
	getBusinessData(businessId).till = getBusinessData(businessId).till + totalCost;

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount = getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount - amount;
	if(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).amount == 0) {
		destroyItem(getBusinessData(businessId).floorItemCache[itemSlot-1]);
	}

	let useType = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).useType;
	if(useType == VRR_ITEM_USETYPE_WEAPON || VRR_ITEM_USETYPE_TAZER) {
		if(isPlayerWeaponBanned(client) && !isPlayerExemptFromAntiCheat(client)) {
			messagePlayerError(client, `You are not allowed to buy weapons`);
			return false;
		}
	}

	//messagePlayerSuccess(client, `You bought ${amount} {ALTCOLOUR}${itemName} {MAINCOLOUR}for ${totalCost} ${priceEach}`);
	meActionToNearbyPlayers(client, `buys a ${itemName}`);

	if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand("inv")) {
		let keyData = getPlayerKeyBindForCommand("inv");
		messagePlayerNewbieTip(client, `Press ${getKeyNameFromId(keyData.key)} to see your items.`);
	} else {
		messagePlayerNewbieTip(client, `Use /inv to see your items.`);
	}
}

// ===========================================================================

function setBusinessItemSellPriceCommand(command, params, client) {
	let businessId = getBusinessFromParams(getParam(params, " ", 3)) || getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot-1} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot-1} slot is empty!`);
		return false;
	}

	let oldPrice = getBusinessData(businessId).floorItemCache[itemSlot-1].buyPrice;
	let newPrice = toInteger(getParam(params, " ", 2)) || oldPrice;
	if(newPrice < 0) {
		messagePlayerError(client, "The price can't be negative!");
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).buyPrice = newPrice;

	messagePlayerSuccess(client, `You changed the price of the {ALTCOLOUR}${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).itemTypeIndex).name}'s {MAINCOLOUR}in slot {ALTCOLOUR}${itemSlot} {MAINCOLOUR}from $${makeLargeNumberReadable(oldPrice)} to $${makeLargeNumberReadable(newprice)}`);
}

// ===========================================================================

function storeItemInBusinessStorageCommand(command, params, client) {
	let businessId = getBusinessFromParams(getParam(params, " ", 3)) || getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if(typeof getBusinessData(businessId).floorItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).floorItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessStorageFirstFreeItemSlot(businessId);

	if(firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot-1]).ownerType = VRR_ITEM_OWNER_BIZSTORAGE;
	getBusinessData(businessId).storageItemCache[firstSlot] = getBusinessData(businessId).floorItemCache[itemSlot-1];
	getBusinessData(businessId).storageItemCache[itemSlot-1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} to the business storage in slot ${firstSlot}`);
}

// ===========================================================================

function stockItemOnBusinessFloorCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if(typeof getBusinessData(businessId).storageItemCache[itemSlot-1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if(getBusinessData(businessId).storageItemCache[itemSlot-1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessFloorFirstFreeItemSlot(businessId);

	if(firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).storageItemCache[itemSlot-1]).ownerType = VRR_ITEM_OWNER_BIZFLOOR;
	getBusinessData(businessId).floorItemCache[firstSlot] = getBusinessData(businessId).storageItemCache[itemSlot-1];
	getBusinessData(businessId).storageItemCache[itemSlot-1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} of the business storage to the business floor slot ${firstSlot}`);
}

// ===========================================================================

function getBusinessStorageFirstFreeItemSlot(businessId) {
	for(let i in getBusinessData(businessId).storageItemCache) {
		if(getBusinessData(businessId).storageItemCache[i] == -1) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getBusinessFloorFirstFreeItemSlot(businessId) {
	for(let i in getBusinessData(businessId).floorItemCache) {
		if(getBusinessData(businessId).floorItemCache[i] == -1) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function cacheAllBusinessItems() {
	logToConsole(LOG_DEBUG, "[VRR.Business] Caching all business items ...");
	for(let i in getServerData().businesses) {
		cacheBusinessItems(i);
	}
	logToConsole(LOG_DEBUG, "[VRR.Business] Cached all business items successfully!");
}

// ===========================================================================

function cacheBusinessItems(businessId) {
	getBusinessData(businessId).floorItemCache = [];
	getBusinessData(businessId).storageItemCache = [];

	logToConsole(LOG_VERBOSE, `[VRR.Business] Caching business items for business ${businessId} (${getBusinessData(businessId).name}) ...`);
	for(let i in getServerData().items) {
		if(getItemData(i).ownerType == VRR_ITEM_OWNER_BIZFLOOR && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).floorItemCache.push(i);
		} else if(getItemData(i).ownerType == VRR_ITEM_OWNER_BIZSTORAGE && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).storageItemCache.push(i);
		}
	}
	logToConsole(LOG_VERBOSE, `[VRR.Business] Successfully cached ${getBusinessData(businessId).floorItemCache.length} floor items and ${getBusinessData(businessId).storageItemCache} storage items for business ${businessId} (${getBusinessData(businessId).name})!`);
}

// ===========================================================================

function getBusinessIdFromDatabaseId(databaseId) {
	for(let i in getServerData().businesses) {
		if(getBusinessData(i).databaseId == databaseId) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function updateBusinessPickupLabelData(businessId) {
	if(getBusinessData(businessId).exitPickup != null) {
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.owner.type", VRR_PICKUP_BUSINESS_EXIT, false);
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.label.type", VRR_LABEL_EXIT, true);
	}

	if(getBusinessData(businessId).entrancePickup != null) {
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.owner.type", VRR_PICKUP_BUSINESS_ENTRANCE, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.type", VRR_LABEL_BUSINESS, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.name", getBusinessData(businessId).name, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.locked", getBusinessData(businessId).locked, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_NONE, true);
		if(getBusinessData(businessId).labelHelpType == VRR_PROPLABEL_INFO_ENTERVEHICLE) {
			setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTERVEHICLE, true);
		} else if(getBusinessData(businessId).labelHelpType == VRR_PROPLABEL_INFO_ENTER) {
			setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTER, true);
		} else if(getBusinessData(businessId).labelHelpType == VRR_PROPLABEL_INFO_REPAIR) {
			setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_REPAIR, true);
		} else {
			if(getBusinessData(businessId).buyPrice > 0) {
				setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.price", getBusinessData(businessId).buyPrice, true);
				setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_BUYBIZ, true);
			} else {
				if(getBusinessData(businessId).hasInterior) {
					setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTER, true);
				} else {
					if(doesBusinessHaveAnyItemsToBuy(businessId)) {
						setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_BUY, true);
					}
				}
			}
		}

		if(getBusinessData(businessId).buyPrice > 0) {
			setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.price", getBusinessData(businessId).buyPrice, true);
		}
	}
}

// ===========================================================================

function getBusinessIdFromDatabaseId(databaseId) {
	let businesses = getServerData().businesses;
	for(let i in businesses) {
		if(businesses[i].databaseId == databaseId) {
			return i;
		}
	}
}

// ===========================================================================

function resetBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function resetBusinessBlips(businessId) {
	deleteBusinessBlips(businessId);
	createBusinessEntranceBlip(businessId);
	createBusinessExitBlip(businessId);
}

// ===========================================================================

function resetAllBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function resetAllBusinessBlips() {
	for(let i in getServerData().businesses) {
		deleteBusinessBlips(i);
		createBusinessBlips(i);
	}
}

// ===========================================================================

function createBusinessBlips(businessId) {
	createBusinessEntranceBlip(businessId);
	createBusinessExitBlip(businessId);
}

// ===========================================================================

function resetAllBusinessPickups() {
	for(let i in getServerData().businesses) {
		deleteBusinessPickups(i);
		createBusinessPickups(i);
	}
}

// ===========================================================================

function createBusinessPickups(businessId) {
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function doesBusinessHaveAnyItemsToBuy(businessId) {
	return (getBusinessData(businessId).floorItemCache.length > 0);
}

// ===========================================================================

function sendPlayerBusinessGameScripts(client, businessId) {
	for(let i in getBusinessData(businessId).gameScripts) {
		sendPlayerGameScriptState(client, getBusinessData(businessId).gameScripts[i].state);
	}
}

// ===========================================================================

function clearPlayerBusinessGameScripts(client, businessId) {
	for(let i in getBusinessData(businessId).gameScripts) {
		sendPlayerGameScriptState(client, VRR_GAMESCRIPT_DENY);
	}
}

// ===========================================================================

function updateBusinessInteriorLightsForOccupants(businessId) {
	let clients = getClients()
	for(let i in clients) {
		if(getPlayerBusiness(clients[i]) == businessId) {
			updateInteriorLightsForPlayer(clients[i], getBusinessData(businessId).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerWithdrawFromBusinessTill(client, businessId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerSetBusinessInteriorLights(client, businessId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockBusiness(client, businessId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerManageBusiness(client, businessId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER) {
		if(getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN) {
		if(getBusinessData(businessId).ownerId == getPlayerClan(client)) {
			if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
				return true;
			}

			//if(getBusinessData(businessId).clanRank <= getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level) {
			//	return true;
			//}
		}
	}

	return false;
}

// ===========================================================================

function deleteBusinessBlips(business) {
	deleteBusinessExitBlip(business);
	deleteBusinessEntranceBlip(business);
}

// ===========================================================================

function deleteBusinessPickups(business) {
	deleteBusinessExitPickup(business);
	deleteBusinessEntrancePickup(business);
}

// ===========================================================================

function getBusinessFromParams(params) {
	if(isNaN(params)) {
		for(let i in getServerData().businesses) {
			if(toLowerCase(getServerData().businesses[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().businesses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

