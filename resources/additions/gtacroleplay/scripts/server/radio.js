// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: radio.js
// DESC: Provides radio station streaming
// TYPE: Server (JavaScript)
// ===========================================================================

function initRadioScript() {
	logToConsole(LOG_INFO, "[VRR.Radio]: Initializing radio script ...");
    getServerData().radioStations = loadRadioStationsFromDatabase();
	setRadioStationIndexes();
	logToConsole(LOG_INFO, "[VRR.Radio]: Radio script initialized successfully!");
	return true;
}

// ===========================================================================

function loadRadioStationsFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Radio]: Loading radio stations from database ...");
	let dbConnection = connectToDatabase();
	let tempRadioStations = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM radio_main`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempRadioStationData = new RadioStationData(dbAssoc);
				tempRadioStations.push(tempRadioStationData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Radio]: ${tempRadioStations.length} radio stations loaded from database successfully!`);
	return tempRadioStations;
}

// ===========================================================================

function playStreamingRadioCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		messagePlayerInfo(client, "Use /radiostations for a list of available radio stations.");
		return false;
	}

	let radioStationId = getRadioStationFromParams(params);

	if(radioStationId != 0 && typeof getServerData().radioStations[radioStationId-1] == "undefined") {
		messagePlayerError(client, getLocaleString(client, "InvalidRadioStation"));
		return false;
	}

	if(isPlayerInAnyVehicle(client)) {
		if(!getVehicleData(getPlayerVehicle(client))) {
			messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
			return false;
		}

		if(radioStationId == 0) {
			getVehicleData(getPlayerVehicle(client)).streamingRadioStation = -1;
			getPlayerData(client).streamingRadioStation = -1;
			meActionToNearbyPlayers(client, `turns off their vehicle's radio`);

			let clients = getClients();
			for(let i in clients) {
				if(getPlayerVehicle(client) == getPlayerVehicle(clients[i])) {
					playRadioStreamForPlayer(clients[i], "");
				}
			}
			return false;
		}

		getVehicleData(getPlayerVehicle(client)).streamingRadioStation = radioStationId-1;
		getPlayerData(client).streamingRadioStation = radioStationId-1;
		meActionToNearbyPlayers(client, getLocaleString(client, "ActionVehicleRadioStationChange", getRadioStationData(radioStationId-1).name, getRadioStationData(radioStationId-1).genre));

		let clients = getClients();
		for(let i in clients) {
			if(getPlayerVehicle(client) == getPlayerVehicle(clients[i])) {
				setPlayerVanillaRadioStation(clients[i], 0);
				playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId-1).url, true, getPlayerStreamingRadioVolume(client));
			}
		}
	} else {
		if(doesEntityDataExist(client, "vrr.inHouse")) {
			let houseId = getEntityData(client, "vrr.inHouse");
			if(radioStationId == 0) {
				getHouseData(houseId).streamingRadioStation = -1;
				getPlayerData(client).streamingRadioStation = -1;
				meActionToNearbyPlayers(client, `turns off the house radio`);

				let clients = getClients();
				for(let i in clients) {
					if(getEntityData(clients[i], "vrr.inHouse") == houseId) {
						playRadioStreamForPlayer(clients[i], "");
					}
				}
			} else {
				getHouseData(houseId).streamingRadioStation = radioStationId-1;
				getPlayerData(client).streamingRadioStation = radioStationId-1;
				meActionToNearbyPlayers(client, getLocaleString(client, "ActionHouseRadioStationChange", getRadioStationData(radioStationId-1).name, getRadioStationData(radioStationId-1).genre));

				let clients = getClients();
				for(let i in clients) {
					if(getEntityData(clients[i], "vrr.inHouse") == houseId) {
						setPlayerVanillaRadioStation(clients[i], 0);
						playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId-1).url, true, getPlayerStreamingRadioVolume(clients[i]));
					}
				}
			}
		} else if(isPlayerInAnyBusiness(client)) {
			let businessId = getPlayerBusiness(client);
			if(radioStationId == 0) {
				getBusinessData(businessId).streamingRadioStation = -1;
				getPlayerData(client).streamingRadioStation = -1;
				meActionToNearbyPlayers(client, `turns off the business radio`);

				let clients = getClients();
				for(let i in clients) {
					if(getPlayerBusiness(clients[i]) == businessId) {
						stopRadioStreamForPlayer(clients[i]);
					}
				}
			} else {
				getBusinessData(businessId).streamingRadioStation = radioStationId-1;
				getPlayerData(client).streamingRadioStation = radioStationId-1;
				meActionToNearbyPlayers(client, getLocaleString(client, "ActionBusinessRadioStationChange", getRadioStationData(radioStationId-1).name, getRadioStationData(radioStationId-1).genre));

				let clients = getClients();
				for(let i in clients) {
					if(getPlayerBusiness(clients[i]) == businessId) {
						setPlayerVanillaRadioStation(clients[i], 0);
						playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId-1).url, true, getPlayerStreamingRadioVolume(clients[i]));
					}
				}
			}
		} else {
			messagePlayerError(client, getLocaleString(client, "RadioStationLocationInvalid"));
			return false;
		}
	}
}

// ===========================================================================

function setStreamingRadioVolumeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let volumeLevel = params;

	if(isNaN(volumeLevel)) {
		messagePlayerError(client, getLocaleString(client, "RadioVolumeNotNumber"));
		return false;
	}

	setPlayerStreamingRadioVolume(client, toInteger(volumeLevel));
	getPlayerData(client).accountData.streamingRadioVolume = toInteger(volumeLevel);
	let volumeEmoji = '';
	if(volumeLevel >= 60) {
		volumeEmoji = '🔊';
	} else if(volumeLevel >= 30 && volumeLevel < 60) {
		volumeEmoji = '🔉';
	} else if(volumeLevel > 0 && volumeLevel < 30) {
		volumeEmoji = '🔈';
	} else if(volumeLevel <= 0) {
		volumeEmoji = '🔇';
	}

	messagePlayerSuccess(client, getLocaleString(client, "RadioVolumeChanged", volumeEmoji, volumeLevel));
}

// ===========================================================================

function getPlayerStreamingRadioVolume(client) {
	if(!getPlayerData(client) || !isPlayerLoggedIn(client) || !isPlayerSpawned(client)) {
		return 20;
	}
	return getPlayerData(client).accountData.streamingRadioVolume;
}

// ===========================================================================

function showRadioStationListCommand(command, params, client) {
	let stationList = getServerData().radioStations.map(function(x) { return `{ALTCOLOUR}${toInteger(x.index)+1}: {MAINCOLOUR}${x.name}`; });

	let chunkedList = splitArrayIntoChunks(stationList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderRadioStationsList")));

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setRadioStationIndexes() {
	for(let i in getServerData().radioStations) {
		getServerData().radioStations[i].index = i;
	}
}

// ===========================================================================

function getRadioStationData(radioStationId) {
	return getServerData().radioStations[radioStationId];
}

// ===========================================================================

function reloadAllRadioStationsCommand(command, params, client) {
	stopRadioStreamForPlayer(null);
	clearArray(getServerData().radioStations);
	getServerData().radioStations = loadRadioStationsFromDatabase();
	setRadioStationIndexes();

	messageAdminAction(`All radio stations have been reloaded by an admin!`);
}

// ===========================================================================