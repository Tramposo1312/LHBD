// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Server (JavaScript)
// ===========================================================================

let disconnectReasons = [
	"Lost Connection",
	"Disconnected",
	"Unsupported Client",
	"Wrong Game",
	"Incorrect Password",
	"Unsupported Executable",
	"Disconnected",
	"Banned",
	"Failed",
	"Invalid Name",
	"Crashed"
];

// ===========================================================================

function getPositionArea(position) {
	if(typeof position == "Vec3") {
		position = vec3ToVec2(position);
	}

	let gameAreas = getGameAreas(getServerGame());
	for(let i in gameAreas) {
		if(isPositionInArea(position, gameAreas[i][1])) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getAreaName(position) {
	let areaId = getPositionArea(position);
	if(!areaId) {
		return false;
	}

	return getGameAreas()[areaId][0];
}

// ===========================================================================

function getGameAreas(gameId) {
	return gameAreas[gameId];
}

// ===========================================================================

function getPlayerData(client) {
	if(client != null) {
		return getServerData().clients[client.index];
	}
	return false;
}

// ===========================================================================

function initAllClients() {
	getClients().forEach(function(client) {
		initClient(client);
	});
}

// ===========================================================================

function updateServerRules() {
	if(isTimeSupported()) {
		server.setRule("Time", makeReadableTime(getServerConfig().hour, getServerConfig().minute));
	}

	if(isWeatherSupported()) {
		server.setRule("Weather", getGameData().weatherNames[getServerGame()][getServerConfig().weather]);
	}

	if(isSnowSupported()) {
		server.setRule("Snowing", getYesNoFromBool(getServerConfig().fallingSnow));
	}
}

// ===========================================================================

function getWeatherFromParams(params) {
	if(isNaN(params)) {
		for(let i in getGameData().weatherNames[getServerGame()]) {
			if(toLowerCase(getGameData().weatherNames[getServerGame()][i]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameData().weatherNames[getServerGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getFightStyleFromParams(params) {
	if(isNaN(params)) {
		for(let i in getGameData().fightStyles[getServerGame()]) {
			if(toLowerCase(getGameData().fightStyles[getServerGame()][i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameData().fightStyles[getServerGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getClosestHospital(position) {
	let closest = 0;
	for(let i in getGameData().hospitals[getServerGame()]) {
		if(getDistance(getGameData().hospitals[getServerGame()][i].position, position) < getDistance(getGameData().hospitals[getServerGame()][closest].position, position)) {
			closest = i;
		}
	}

	return getGameData().hospitals[getServerGame()][closest];
}

// ===========================================================================

function getClosestPoliceStation(position) {
	let closest = 0;
	for(let i in getGameData().policeStations[getServerGame()]) {
		if(getDistance(getGameData().policeStations[getServerGame()][i].position, position) < getDistance(getGameData().policeStations[getServerGame()][closest].position, position)) {
			closest = i;
		}
	}

	return getGameData().policeStations[getServerGame()][closest];
}

// ===========================================================================

function getPlayerDisplayForConsole(client) {
	if(isNull(client)) {
		return "(Unknown client)";
	}
	return `${getPlayerName(client)}[${client.index}]`;
}

// ===========================================================================

function getPlayerNameForNameTag(client) {
	if(isPlayerSpawned(client)) {
		return `${getPlayerCurrentSubAccount(client).firstName} ${getPlayerCurrentSubAccount(client).lastName}`;
	}
	return getPlayerName(client);
}

// ===========================================================================

function isPlayerSpawned(client) {
	if(!getPlayerData(client)) {
		return false;
	}
	return getPlayerData(client).spawned;
}

// ===========================================================================

function getPlayerIsland(client) {
	return getIsland(getPlayerPosition(client));
}

// ===========================================================================

function isAtPayAndSpray(position) {
	for(let i in getGameData().payAndSprays[getServerGame()]) {
		if(getDistance(position, getGameData().payAndSprays[getServerGame()][i]) <= getGlobalConfig().payAndSprayDistance) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function resetClientStuff(client) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Resetting client data for ${getPlayerDisplayForConsole(client)}`);

	if(!getPlayerData(client)) {
		return false;
	}

	if(isPlayerOnJobRoute(client)) {
		stopJobRoute(client, false, false);
	}

	if(getPlayerData(client).rentingVehicle) {
		stopRentingVehicle(client);
	}

	deleteJobItems(client);

	getPlayerData(client).lastVehicle = null;
}

// ===========================================================================

function getPlayerFromCharacterId(subAccountId) {
	let clients = getClients();
	for(let i in clients) {
		for(let j in getPlayerData(clients[i]).subAccounts) {
			if(getPlayerData(clients[i]).subAccounts[j].databaseId == subAccountId) {
				return clients[i];
			}
		}
	}

	return false;
}

// ===========================================================================

function checkPlayerPedStates() {
	let clients = getClients();
	for(let i in clients) {
		if(getPlayerData(clients[i])) {
			if(getPlayerData(clients[i]).pedState) {
				if(isPlayerInAnyVehicle(clients[i])) {
					if(getPlayerData(clients[i]).pedState == VRR_PEDSTATE_EXITINGVEHICLE) {
						getPlayerData(clients[i]).pedState == VRR_PEDSTATE_READY;
					}
				}
			}
		}
	}
}

// ===========================================================================

function showConnectCameraToPlayer(client) {
	if(isFadeCameraSupported()) {
		fadeCamera(client, true, 1);
	}

	if(isCustomCameraSupported()) {
		//setPlayerInterior(client, 0);
		//setPlayerDimension(client, 0);
		setPlayerCameraLookAt(client, getServerConfig().connectCameraPosition, getServerConfig().connectCameraLookAt);
	}
}

// ===========================================================================

function showCharacterSelectCameraToPlayer(client) {
	setPlayerCameraLookAt(client, getServerConfig().characterSelectCameraPosition, getServerConfig().characterSelectCameraPosition);
}

// ===========================================================================

function getClosestPlayer(position, exemptPlayer) {
	//let clients = getClients();
	//let closest = 0;
	//for(let i in clients) {
	//	if(exemptClient != clients[i]) {
	//		if(getDistance(getPlayerPosition(clients[i]), position) < getDistance(getPlayerPosition(clients[closest]), position)) {
	//			closest = i;
	//		}
	//	}
	//}

	return getElementsByType(ELEMENT_PLAYER).filter((fp) => fp != exemptPlayer).reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));

	//return clients[closest];
}

// ===========================================================================

function isPlayerMuted(client) {
	return getPlayerData(client).muted;
}

// ===========================================================================

function isSamePlayer(client1, client2) {
	return (client1 == client2);
}

// ===========================================================================

function getConsoleClient() {
	let clients = getClients();
	for(let i in clients) {
		if(isConsole(clients[i])) {
			return clients[i];
		}
	}
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if(isNaN(params)) {
		for(let i in clients) {
			if(!clients[i].console) {
				if(toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}

				if(toLowerCase(getCharacterFullName(clients[i])).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if(typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}


// ===========================================================================

function getSyncerFromId(syncerId) {
	let clients = getClients();
	return clients[syncerId];
}

// ===========================================================================

function isConsole(client) {
	if(client == null) {
		return false;
	}

	return client.console;
}

// ===========================================================================

function updateConnectionLogOnQuit(client, quitReasonId) {
	if(getPlayerData(client) != false) {
		quickDatabaseQuery(`UPDATE conn_main SET conn_when_disconnect=NOW(), conn_how_disconnect=${quitReasonId} WHERE conn_id = ${getPlayerData(client).connectionId}`);
	}
}

// ===========================================================================

function updateConnectionLogOnAuth(client, authId) {
	quickDatabaseQuery(`UPDATE conn_main SET conn_auth=${authId} WHERE conn_id = ${getPlayerData(client).connectionId}`);
}

// ===========================================================================

function updateConnectionLogOnClientInfoReceive(client, clientVersion, screenWidth, screenHeight) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeClientVersion = escapeDatabaseString(dbConnection, clientVersion);
		let safeScreenWidth = escapeDatabaseString(dbConnection, toString(screenWidth));
		let safeScreenHeight = escapeDatabaseString(dbConnection, toString(screenHeight));
    	quickDatabaseQuery(`UPDATE conn_main SET conn_client_version='${safeClientVersion}', conn_screen_width='${safeScreenWidth}', conn_screen_height='${safeScreenHeight}' WHERE conn_id = ${getPlayerData(client).connectionId}`);
	}
}

// ===========================================================================

function generateRandomPhoneNumber() {
	return getRandom(100000, 999999);
}

// ===========================================================================

function doesNameContainInvalidCharacters(name) {
	let disallowedCharacters = getGlobalConfig().subAccountNameAllowedCharacters;
	name = toLowerCase(name);
	for(let i = 0; i < name.length; i++) {
		if(disallowedCharacters.toLowerCase().indexOf(name.charAt(i)) == -1) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function fixCharacterName(name) {
	return String(name.charAt(0).toUpperCase()) + String(name.slice(1).toLowerCase());
}

// ===========================================================================

function getCurrentTimeStampWithTimeZone(timeZone) {
	let date = new Date();

	let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
	let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
	let offset = utcDate.getTime() - tzDate.getTime();

	date.setTime( date.getTime() + offset );

	return date;
};

// ===========================================================================

function getClientFromSyncerId(syncerId) {
	return getClients().filter(c => c.index == syncerId)[0];
}

// ===========================================================================

async function triggerWebHook(webHookURL, payloadData) {
	return new Promise(resolve => {
		//console.warn(webHookURL);
		httpGet(
			webHookURL,
			`data=${payloadData}`,
			function(data) {
				//console.warn(JSON.parse(data));
			},
			function(data) {
			}
		);
	});
}



// ===========================================================================

function clearTemporaryVehicles() {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(vehicles[i].owner == -1) {
			if(!getVehicleData(vehicles[i])) {
				if(isVehicleUnoccupied(vehicles[i])) {
					destroyElement(vehicles[i]);
				}
			}
		}
	}
}

// ===========================================================================

function clearTemporaryPeds() {
	let peds = getElementsByType(ELEMENT_PED);
	for(let i in peds) {
		if(peds[i].owner == -1) {
			if(!peds[i].isType(ELEMENT_PLAYER)) {
				if(peds[i].vehicle == null) {
					if(!getNPCData(peds[i])) {
						destroyElement(peds[i]);
					}
				}
			}
		}
	}
}

// ===========================================================================

function fillStringWithCharacter(character, amount) {
	let tempString = "";
	for(let i = 0; i <= amount; i++) {
		tempString = tempString + toString(character);
	}
	return tempString;
}

// ===========================================================================