// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

let builtInCommands = [
	"refresh",
	"restart",
	"stop",
	"start",
	"reconnect",
	"setname",
	"connect",
	"disconnect",
	"say",
	"dumpdoc",
];

// ===========================================================================

let disconnectReasons = [
	"LostConnection",
	"Disconnected",
	"UnsupportedClient",
	"WrongGame",
	"IncorrectPassword",
	"UnsupportedExecutable",
	"Disconnected",
	"Banned",
	"Failed",
	"InvalidName",
	"Crashed",
	"ModifiedGame"
];

// ===========================================================================

function getPlayerPosition(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncPosition;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).position;
		}
	}
}

// ===========================================================================

function setPlayerPosition(client, position) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s position to ${position.x}, ${position.y}, ${position.z}`);
	sendPlayerSetPosition(client, position);
}

// ===========================================================================

function getPlayerHeading(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncHeading;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).heading;
		}
	}
}

// ===========================================================================

function setPlayerHeading(client, heading) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s heading to ${heading}`);
	sendPlayerSetHeading(client, heading);
}

// ===========================================================================

function getPlayerVehicle(client) {
	if (isNull(client)) {
		return null;
	}

	if (!areServerElementsSupported()) {
		return getPlayerData().syncVehicle;
	} else {
		if (getPlayerPed(client).vehicle) {
			return getPlayerPed(client).vehicle;
		}
	}
	return false;
}

// ===========================================================================

function getPlayerDimension(client) {
	if (!isGameFeatureSupported("dimension")) {
		return 0;
	}

	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncDimension;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).dimension;
		}
	}
}

// ===========================================================================

function getPlayerInterior(client) {
	if (!isGameFeatureSupported("interior")) {
		return 0;
	}

	return getPlayerCurrentSubAccount(client).interior || 0;
}

// ===========================================================================

function setPlayerDimension(client, dimension) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s dimension to ${dimension}`);
	if (!areServerElementsSupported()) {
		getPlayerData(client).syncDimension = dimension;
	} else {
		if (getPlayerPed(client) != null) {
			getPlayerPed(client).dimension = dimension;
		}
	}
}

// ===========================================================================

function setPlayerInterior(client, interior) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s interior to ${interior}`);
	sendPlayerSetInterior(client, interior);
	if (isPlayerLoggedIn(client) && isPlayerSpawned(client)) {
		getPlayerCurrentSubAccount(client).interior = interior;
	}
}

// ===========================================================================

function isPlayerInAnyVehicle(client) {
	if (!areServerElementsSupported()) {
		return (getPlayerData().syncVehicle != null);
	} else {
		return (getPlayerPed(client).vehicle != null);
	}
}

// ===========================================================================

function getPlayerVehicleSeat(client) {
	if (!isPlayerInAnyVehicle(client)) {
		return false;
	}

	if (!areServerElementsSupported()) {
		return getPlayerData().syncVehicleSeat;
	} else {
		for (let i = 0; i <= 8; i++) {
			if (getPlayerVehicle(client).getOccupant(i) == getPlayerPed(client)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================

function isPlayerSpawned(client) {
	return getPlayerData(client).spawned;
}

// ===========================================================================

function getVehiclePosition(vehicle) {
	return vehicle.position;
}

// ===========================================================================

function getVehicleHeading(vehicle) {
	return vehicle.heading;
}

// ===========================================================================

function setVehicleHeading(vehicle, heading) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	return sendNetworkEventToPlayer("v.rp.vehPosition", null, getVehicleForNetworkEvent(vehicle), heading);
	//}
	return vehicle.heading = heading;
}

// ===========================================================================

function getElementTransient(element) {
	if (typeof element.transient != "undefined") {
		return element.transient;
	}
	return false;
}

// ===========================================================================

function setElementTransient(element, state) {
	if (typeof element.transient != "undefined") {
		element.transient = state;
		return true;
	}
	return false;
}

// ===========================================================================

function getVehicleSyncer(vehicle) {
	return getElementSyncer(vehicle);
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicle) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	if (getVehicleData(vehicle).ivNetworkId != -1) {
	//		return getVehicleData(vehicle).ivNetworkId;
	//	}
	//	return -1;
	//}
	return vehicle.id;
}

// ===========================================================================

function deleteGameElement(element) {
	try {
		if (element != null) {
			destroyElement(element);
			return true;
		}
	} catch (error) {
		return false;
	}
}

// ===========================================================================

function isPlayerInFrontVehicleSeat(client) {
	return (getPlayerVehicleSeat(client) == 0 || getPlayerVehicleSeat(client) == 1);
}

// ===========================================================================

function removePlayerFromVehicle(client) {
	logToConsole(LOG_DEBUG, `Removing ${getPlayerDisplayForConsole(client)} from their vehicle`);
	sendPlayerRemoveFromVehicle(client);
	return true;
}

// ===========================================================================

function setPlayerSkin(client, skinIndex) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s skin to ${getGameConfig().skins[getGame()][skinIndex][0]} (Index: ${skinIndex}, Name: ${getGameConfig().skins[getGame()][skinIndex][1]})`);
	if (getGame() == V_GAME_GTA_IV) {
		let position = getPlayerPosition(client);
		let heading = getPlayerHeading(client);
		let interior = getPlayerInterior(client);
		let dimension = getPlayerDimension(client);
		//triggerNetworkEvent("v.rp.localPlayerSkin", client, getGameConfig().skins[getGame()][skinIndex][0]);
		spawnPlayer(client, position, heading, getGameConfig().skins[getGame()][skinIndex][0], interior, dimension);
	} else {
		getPlayerPed(client).modelIndex = getGameConfig().skins[getGame()][skinIndex][0];
	}
}

// ===========================================================================

function getPlayerSkin(client) {
	return getPlayerCurrentSubAccount(client).skin; //getSkinIndexFromModel(getPlayerData().modelIndex);
}

// ===========================================================================

function setPlayerHealth(client, health) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${health}`);
	sendPlayerSetHealth(client, health);
	getServerData(client).health = health;
}

// ===========================================================================

function getPlayerHealth(client) {
	return getPlayerData(client).health;
}

// ===========================================================================

function setPlayerArmour(client, armour) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${armour}`);
	sendPlayerSetArmour(client, armour);
	//client.player.armour = armour;
}

// ===========================================================================

function getPlayerArmour(client) {
	if (areServerElementsSupported(client)) {
		return getPlayerPed(client).armour;
	} else {
		return getPlayerData(client).syncArmour;
	}
}

// ===========================================================================

function setPlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function givePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash + toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function takePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash - toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function disconnectPlayer(client) {
	logToConsole(LOG_DEBUG, `Disconnecting (kicking) ${getPlayerDisplayForConsole(client)}`);
	disconnectPlayer(client);
	return false;
}

// ===========================================================================

function getElementSyncer(element) {
	return getClients()[element.syncer];
}

// ===========================================================================

function getPlayerWeaponAmmo(client) {
	return getPlayerPed(client).weaponAmmunition;
}

// ===========================================================================

function setPlayerVelocity(client, velocity) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s velocity to ${velocity.x}, ${velocity.y}, ${velocity.z}`);
	if (typeof getPlayerPed(client).velocity != "undefined") {
		getPlayerPed(client).velocity = velocity;
	}
}

// ===========================================================================

function getPlayerVelocity(client) {
	if (typeof getPlayerPed(client).velocity != "undefined") {
		return getPlayerPed(client).velocity;
	}
	return toVector3(0.0, 0.0, 0.0);
}

// ===========================================================================

function getElementDimension(element) {
	if (typeof element.dimension != "undefined") {
		return element.dimension;
	}
	return 0;
}

// ===========================================================================

function setElementDimension(element, dimension) {
	if (typeof element.dimension != "undefined") {
		logToConsole(LOG_VERBOSE, `Setting element ${element} (${element.id}) dimension to ${dimension}`);
		element.dimension = dimension;
		return true;
	}
	return false;
}

// ===========================================================================

function setElementRotation(element, rotation) {
	if (typeof element.setRotation != "undefined") {
		element.setRotation(rotation);
	} else {
		return element.rotation = rotation;
	}
}

// ===========================================================================

function givePlayerHealth(client, amount) {
	if (getPlayerHealth(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to 100`);
		setPlayerHealth(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${getPlayerHealth(client) + amount}`);
		setPlayerHealth(client, getPlayerHealth(client) + amount);
	}
}

// ===========================================================================

function givePlayerArmour(client, amount) {
	if (getPlayerArmour(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to 100`);
		setPlayerArmour(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${getPlayerArmour(client) + amount}`);
		setPlayerArmour(client, getPlayerArmour(client) + amount);
	}
}

// ===========================================================================

function consolePrint(text) {
	console.log(text);
}

// ===========================================================================

function consoleWarn(text) {
	console.warn(text);
}

// ===========================================================================

function consoleError(text) {
	console.error(text);
}

// ===========================================================================

function getPlayerName(client) {
	return client.name;
}

// ===========================================================================

function getServerName() {
	return "Asshat Gaming RP";
}

// ===========================================================================

function createGamePickup(modelIndex, position, type) {
	if (!isGameFeatureSupported("pickup")) {
		return false;
	}
	return game.createPickup(modelIndex, position, type);
}

// ===========================================================================

function createGameDummyElement(position) {
	if (!isGameFeatureSupported("dummyElement")) {
		return false;
	}
	return game.createDummy(position);
}

// ===========================================================================

function createGameBlip(position, type = 0, size = 1, colour = toColour(255, 255, 255, 255)) {
	if (!isGameFeatureSupported("blip")) {
		return false;
	}
	return game.createBlip(type, position, size, colour);
}

// ===========================================================================

function createGameSphere(position, size = 1, colour = toColour(255, 255, 255, 255)) {
	if (!isGameFeatureSupported("sphere")) {
		return false;
	}

	let sphere = game.createSphere(position, size);
	//sphere.colour = colour;
	return sphere;
}

// ===========================================================================

function createGameObject(modelIndex, position) {
	if (!isGameFeatureSupported("object")) {
		return false;
	}
	return game.createObject(getGameConfig().objects[getGame()][modelIndex][0], position);
}

// ===========================================================================

function setElementOnAllDimensions(element, state) {
	if (!isNull(element) && element != false) {
		if (typeof element.netFlags != "undefined") {
			if (typeof element.netFlags.onAllDimensions != "undefined") {
				element.netFlags.onAllDimensions = state;
			}
		} else {
			if (typeof element.onAllDimensions != "undefined") {
				element.onAllDimensions = state;
			}
		}
	}
}

// ===========================================================================

function destroyGameElement(element) {
	if (!isNull(element) && element != false) {
		destroyElement(element);
	}
}

// ===========================================================================

function isMeleeWeapon(weaponId, gameId = getGame()) {
	return (getGameConfig().meleeWeapons[gameId].indexOf(weaponId) != -1);
}

// ===========================================================================

function getPlayerLastVehicle(client) {
	return getPlayerData(client).lastVehicle;
}

// ===========================================================================

function isVehicleObject(vehicle) {
	if (vehicle == null || vehicle == undefined) {
		return false;
	}
	return (vehicle.type == ELEMENT_VEHICLE);
}

// ===========================================================================

function repairVehicle(vehicle) {
	vehicle.fix();
}

// ===========================================================================

function setVehicleLights(vehicle, lights) {
	setEntityData(vehicle, "v.rp.lights", lights, true);
	sendNetworkEventToPlayer("v.rp.veh.lights", null, vehicle.id, lights);
}

// ===========================================================================

function setVehicleEngine(vehicle, engine) {
	//vehicle.engine = engine;
	setEntityData(vehicle, "v.rp.engine", engine, true);
	sendNetworkEventToPlayer("v.rp.veh.engine", null, vehicle.id, engine);
}

// ===========================================================================

function setVehicleLocked(vehicle, locked) {
	vehicle.locked = locked;
	setEntityData(vehicle, "v.rp.locked", locked, true);
	sendNetworkEventToPlayer("v.rp.veh.locked", null, vehicle.id, locked);
}

// ===========================================================================

function setVehicleSiren(vehicle, siren) {
	vehicle.siren = siren;
}

// ===========================================================================

function getVehicleLights(vehicle) {
	return vehicle.lights;
}

// ===========================================================================

function getVehicleEngine(vehicle) {
	return vehicle.engine;
}

// ===========================================================================

function getVehicleLocked(vehicle) {
	return vehicle.lockedStatus;
}

// ===========================================================================

function getVehicleSiren(vehicle) {
	return vehicle.siren;
}

// ===========================================================================

function setVehicleColours(vehicle, colour1, colour2, colour3 = -1, colour4 = -1) {
	vehicle.colour1 = colour1;
	vehicle.colour2 = colour2;

	if (colour3 != -1) {
		vehicle.colour3 = colour3;
	}

	if (colour4 != -1) {
		vehicle.colour4 = colour4;
	}
}

// ===========================================================================

function createGameVehicle(modelIndex, position, heading, toClient = null) {
	if (areServerElementsSupported()) {
		return game.createVehicle(getGameConfig().vehicles[getGame()][modelIndex][0], position, heading);
	}
}

// ===========================================================================

function createGamePed(modelIndex, position, heading, toClient = null) {
	if (areServerElementsSupported()) {
		let ped = game.createPed(getGameConfig().skins[getGame()][modelIndex][0], position);
		if (ped) {
			//ped.position = position;
			ped.heading = heading;
			return ped;
		}
	}

	return false;
}

// ===========================================================================

function getIsland(position) {
	if (getGame() == V_GAME_GTA_III) {
		if (position.x > 616) {
			return V_ISLAND_PORTLAND;
		} else if (position.x < -283) {
			return V_ISLAND_SHORESIDEVALE;
		}
		return V_ISLAND_STAUNTON;
	} else {
		return V_ISLAND_NONE;
	}

	//return game.getIslandFromPosition(position);
}

// ===========================================================================

function isValidVehicleModel(model) {
	if (getVehicleModelIndexFromModel(model) != false) {
		return true;
	}

	return false;
}

// ===========================================================================

function setGameTime(hour, minute, minuteDuration = 1000) {
	if (isTimeSupported()) {
		game.time.hour = hour;
		game.time.minute = minute;
		game.time.minuteDuration = minuteDuration;
	}
}

// ===========================================================================

function setGameWeather(weather) {
	if (isWeatherSupported()) {
		mp.world.weather = weather;
	}
}

// ===========================================================================

function setPlayerFightStyle(client, fightStyleId) {
	if (!isPlayerSpawned(client)) {
		return false;
	}

	if (!areFightStylesSupported()) {
		return false;
	}

	setEntityData(getPlayerElement(client), "v.rp.fightStyle", [getGameConfig().fightStyles[getGame()][fightStyleId][1][0], getGameConfig().fightStyles[getGame()][fightStyleId][1][1]]);
	forcePlayerToSyncElementProperties(null, getPlayerElement(client));
}

// ===========================================================================

function isPlayerAtGym(client) {
	return true;
}

// ===========================================================================

function getPlayerElement(client) {
	return client.player;
}

// ===========================================================================

function setElementPosition(element, position) {
	sendNetworkEventToPlayer("v.rp.elementPosition", null, element.id, position);
}

// ===========================================================================

function getElementPosition(element) {
	return element.position;
}

// ===========================================================================

function getElementHeading(element) {
	return element.heading;
}

// ===========================================================================

function setElementInterior(element, interior) {
	setEntityData(element, "v.rp.interior", interior, true);
	forcePlayerToSyncElementProperties(null, element);
}

// ===========================================================================

function setElementCollisionsEnabled(element, state) {
	sendNetworkEventToPlayer("v.rp.elementCollisions", null, element.id, state);
}

// ===========================================================================

function isTaxiVehicle(vehicle) {
	if (taxiModels[getGame()].indexOf(vehicle.modelIndex) != -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getVehicleName(vehicle) {
	let model = getElementModel(vehicle);
	return getVehicleNameFromModel(model) || "Unknown";
}

// ===========================================================================

function getElementModel(element) {
	if (typeof element.modelIndex != "undefined") {
		return element.modelIndex;
	}

	if (typeof element.model != "undefined") {
		return element.model;
	}
}

// ===========================================================================

function givePlayerWeaponAmmo(client, ammo) {
	givePlayerWeapon(client, getPlayerWeapon(client), getPlayerWeaponAmmo(client) + ammo);
}

// ===========================================================================

function getPlayerWeapon(client) {
	if (areServerElementsSupported(client)) {
		return getPlayerPed(client).weapon;
	} else {
		return getPlayerData(client).syncWeapon;
	}
}

// ===========================================================================

function connectToDatabase() {
	if (getDatabaseConfig().usePersistentConnection) {
		if (persistentDatabaseConnection == null) {
			logToConsole(LOG_DEBUG, `[AGRP.Database] Initializing database connection ...`);
			persistentDatabaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port);
			if (persistentDatabaseConnection.error) {
				logToConsole(LOG_ERROR, `[AGRP.Database] Database connection error: ${persistentDatabaseConnection.error}`);
				persistentDatabaseConnection = null;
				return false;
			}

			logToConsole(LOG_DEBUG, `[AGRP.Database] Database connection successful!`);
			return persistentDatabaseConnection;
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Database] Using existing database connection.`);
			return persistentDatabaseConnection;
		}
	} else {
		let databaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port);
		if (databaseConnection.error) {
			logToConsole(LOG_ERROR, `[AGRP.Database] Database connection error: ${persistentDatabaseConnection.error}`);
			return false;
		} else {
			return databaseConnection;
		}
	}
}

// ===========================================================================

function disconnectFromDatabase(dbConnection, force = false) {
	if (!getDatabaseConfig().usePersistentConnection || force == true) {
		try {
			dbConnection.close();
			logToConsole(LOG_DEBUG, `[AGRP.Database] Database connection closed successfully`);
		} catch (error) {
			logToConsole(LOG_ERROR, `[AGRP.Database] Database connection could not be closed! (Error: ${error})`);
		}
	}
	return true;
}

// ===========================================================================

function queryDatabase(dbConnection, queryString, useThread = false) {
	logToConsole(LOG_DEBUG, `[AGRP.Database] Query string: ${queryString}`);
	if (useThread == true) {
		Promise.resolve().then(() => {
			let queryResult = dbConnection.query(queryString);
			return queryResult;
		});
	} else {
		return dbConnection.query(queryString);
	}
}

// ===========================================================================

function escapeDatabaseString(dbConnection, unsafeString = "") {
	if (!dbConnection) {
		dbConnection = connectToDatabase();
	}

	if (typeof unsafeString == "string") {
		return dbConnection.escapeString(unsafeString);
	}
	return unsafeString;
}

// ===========================================================================

function getDatabaseInsertId(dbConnection) {
	return dbConnection.insertId;
}

// ===========================================================================

function getQueryNumRows(dbQuery) {
	return dbQuery.numRows;
}

// ===========================================================================

function getDatabaseError(dbConnection) {
	return dbConnection.error;
}

// ===========================================================================

function freeDatabaseQuery(dbQuery) {
	if (dbQuery != null) {
		dbQuery.free();
	}
	return;
}

// ===========================================================================

function fetchQueryAssoc(dbConnection, queryString) {
	let assocArray = [];
	let dbAssoc = null;

	let dbQuery = dbConnection.query(queryString);
	if (dbQuery) {
		while (dbAssoc = dbQuery.fetchAssoc()) {
			assocArray.push(dbAssoc);
		}
		freeDatabaseQuery(dbQuery);
	}

	return assocArray;
}

// ===========================================================================

function quickDatabaseQuery(queryString) {
	let dbConnection = connectToDatabase();
	let insertId = 0;
	if (dbConnection) {
		//logToConsole(LOG_DEBUG, `[AGRP.Database] Query string: ${queryString}`);
		let dbQuery = queryDatabase(dbConnection, queryString);
		if (getDatabaseInsertId(dbConnection)) {
			insertId = getDatabaseInsertId(dbConnection);
			logToConsole(LOG_DEBUG, `[AGRP.Database] Query returned insert id ${insertId}`);
		}

		if (dbQuery) {
			try {
				freeDatabaseQuery(dbQuery);
				logToConsole(LOG_DEBUG, `[AGRP.Database] Query result free'd successfully`);
			} catch (error) {
				logToConsole(LOG_ERROR, `[AGRP.Database] Query result could not be free'd! (Error: ${error})`);
			}
		}

		disconnectFromDatabase(dbConnection);

		if (insertId != 0) {
			return insertId;
		}

		return true;
	}
	return false;
}

// ===========================================================================

function executeDatabaseQueryCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, "That player was not found!");
		return false;
	}

	if (targetCode == "") {
		messagePlayerError(client, "You didn't enter any code!");
		return false;
	}

	let success = quickDatabaseQuery(params);

	if (!success) {
		messagePlayerAlert(client, `Database query failed to execute: {ALTCOLOUR}${query}`);
	} else if (typeof success != "boolean") {
		messagePlayeSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
		messagePlayerInfo(client, `Returns: ${success}`);
	} else {
		messagePlayerSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
	}
	return true;
}

// ===========================================================================

function setConstantsAsGlobalVariablesInDatabase() {
	let dbConnection = connectToDatabase();
	let entries = Object.entries(global);
	for (let i in entries) {
		logToConsole(LOG_DEBUG, `[AGRP.Database] Checking entry ${i} (${entries[i]})`);
		if (toString(i).slice(0, 3).indexOf("V_") != -1) {
			logToConsole(LOG_DEBUG, `[AGRP.Database] Adding ${i} (${entries[i]}) to database global variables`);
		}
	}
}

// ===========================================================================

function createDatabaseInsertQuery(tableName, data) {
	let fields = [];
	let values = [];

	for (let i in data) {
		if (data[i][1] != "undefined" && data[i][1] != NaN && data[i][0] != 'NaN') {
			if (data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
				fields.push(data[i][0]);

				if (typeof data[i][1] == "string") {
					if (data[i][1] == "{UNIXTIMESTAMP}") {
						values.push("UNIX_TIMESTAMP()");
					} else {
						values.push(`'${data[i][1]}'`);
					}
				} else {
					values.push(data[i][1]);
				}
			}
		}
	}

	let queryString = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${values.join(", ")})`;
	return queryString;
}

// ===========================================================================

function createDatabaseUpdateQuery(tableName, data, whereClause) {
	let values = [];

	for (let i in data) {
		if (data[i][0] != "undefined" && data[i][0] != NaN && data[i][0] != 'NaN') {
			if (data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
				if (typeof data[i][1] == "string") {
					if (data[i][1] == "{UNIXTIMESTAMP}") {
						values.push(`${data[i][0]}=UNIX_TIMESTAMP()`);
					} else {
						values.push(`${data[i][0]}='${data[i][1]}'`);
					}
				} else {
					values.push(`${data[i][0]}=${data[i][1]}`);
				}
			}
		}
	}

	let queryString = `UPDATE ${tableName} SET ${values.join(", ")} WHERE ${whereClause}`;
	return queryString;
}

// ===========================================================================

function sendNetworkEventToPlayer(eventName, client, ...args) {
	let argsArray = [eventName, client];
	argsArray = argsArray.concat(args);
	triggerNetworkEvent.apply(null, argsArray);
}

// ===========================================================================

function addNetworkEventHandler(eventName, handlerFunction) {
	addNetworkHandler(eventName, handlerFunction);
}

// ===========================================================================

function getElementId(element) {
	return element.id;
}

// ===========================================================================

function getClientFromIndex(index) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].index == index) {
			return clients[i];
		}
	}
}

// ===========================================================================

function getClientsInRange(position, distance) {
	return getPlayersInRange(position, distance);
}

// ===========================================================================

function getCiviliansInRange(position, distance) {
	return getElementsByTypeInRange(ELEMENT_PED, position, distance).filter(x => !x.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getPlayersInRange(position, distance) {
	return getClients().filter(x => getDistance(position, getPlayerPosition(x)) <= distance);
}

// ===========================================================================

function getElementsByTypeInRange(elementType, position, distance) {
	return getElementsByType(elementType).filter(x => getDistance(position, getElementPosition(x)) <= distance);
}

// ===========================================================================

function getClosestCivilian(position) {
	return getClosestElementByType(ELEMENT_PED, position).filter(ped => !ped.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getVehiclesInRange(position, range) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	return getServerData().vehicles.reduce((i, j) => (getDistance(position, i.syncPosition) <= getDistance(position, j.syncPosition)) ? i : j);
	//}
	return getElementsByTypeInRange(ELEMENT_VEHICLE, position, range);
}

// ===========================================================================

function getClosestVehicle(position) {
	return getClosestElementByType(ELEMENT_VEHICLE, position);
}

// ===========================================================================

function getClosestElementByType(elementType, position) {
	return getElementsByType(elementType).reduce((i, j) => (getDistance(position, getElementPosition(i)) <= getDistance(position, getElementPosition(j))) ? i : j);
}

// ===========================================================================

function getVehicleFirstEmptySeat(vehicle) {
	for (let i = 0; i <= 4; i++) {
		if (vehicle.getOccupant(i) == null) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function isVehicleTrain(vehicle) {
	if (getGame() == V_GAME_GTA_III) {
		if (vehicle.modelIndex == 124) {
			return true;
		}
	}

	return false
}

// ===========================================================================

function warpPedIntoVehicle(ped, vehicle, seatId) {
	ped.warpIntoVehicle(vehicle, seatId);
}

// ===========================================================================

function getPlayerPing(client) {
	return client.ping
}

// ===========================================================================

function setVehicleHealth(vehicle, health) {
	vehicle.health = health;
}

// ===========================================================================

function givePlayerWeapon(client, weaponId, ammo, active = true) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to give weapon (Weapon: ${weaponId}, Ammo: ${ammo})`);
	sendNetworkEventToPlayer("v.rp.giveWeapon", client, weaponId, ammo, active);
}

// ===========================================================================

function setPlayerWantedLevel(client, wantedLevel) {
	sendNetworkEventToPlayer("v.rp.wantedLevel", client, wantedLevel);
	return true;
}

// ===========================================================================

function setElementStreamInDistance(element, distance) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamInDistance != "undefined") {
				element.streamInDistance = distance;
			}
		}
	}
}

// ===========================================================================

function setElementStreamOutDistance(element, distance) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamOutDistance != "undefined") {
				element.streamOutDistance = distance;
			}
		}
	}
}

// ===========================================================================

function getElementStreamInDistance(element) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamInDistance != "undefined") {
				return element.streamInDistance;
			}
		}
	}
}

// ===========================================================================

function getElementStreamOutDistance(element) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamOutDistance != "undefined") {
				return element.streamOutDistance;
			}
		}
	}
}

// ===========================================================================

function getPlayerPed(client) {
	if (isNull(client)) {
		return null;
	}

	//if (getGame() == V_GAME_GTA_IV) {
	//	return getPlayerData(client).ped;
	//} else {
	return client.player;
	//}
}

// ===========================================================================

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			return entity.setData(dataName, dataValue, syncToClients);
		}
	}
	return false;
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			return entity.removeData(dataName);
		}
	}
	return false;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			return (entity.getData(dataName) != null);
		} else {
			return false;
		}
	}
	return null;
}

// ===========================================================================

function disconnectPlayer(client) {
	client.disconnect();
}

// ===========================================================================

function getPlayerId(client) {
	return client.index;
}

// ===========================================================================

function getPlayerIP(client) {
	return client.ip;
}

// ===========================================================================

function getPlayerGameVersion(client) {
	client.gameVersion;
}

// ===========================================================================

function setPlayerNativeAdminState(client, state) {
	client.administrator = state;
}

// ===========================================================================

function despawnPlayer(client) {
	client.despawnPlayer();
}

// ===========================================================================

function getGame() {
	return server.game;
}

// ===========================================================================

function getCountryNameFromIP(ip) {
	if (module.geoip.getCountryName(ip)) {
		return module.geoip.getCountryName(ip);
	}
	return false;
}

// ===========================================================================

function getServerPort() {
	return server.port;
}

// ===========================================================================

function serverBanIP(ip) {
	server.banIP(ip);
}

// ===========================================================================

function setVehicleTrunkState(vehicle, trunkState) {
	sendNetworkEventToPlayer("v.rp.veh.trunk", null, getVehicleForNetworkEvent(vehicle), trunkState);
}

// ===========================================================================

/*
function addAllEventHandlers() {
	bindServerEventHandler("onResourceStart", onResourceStart)
	bindServerEventHandler("onResourceStop", onResourceStart)
	addServerEventHandler("onServerStop", onResourceStart);

	addServerEventHandler("onResourceStart", onResourceStart);
	addServerEventHandler("onResourceStop", onResourceStop);
	addServerEventHandler("onServerStop", onResourceStop);

	addServerEventHandler("onProcess", onProcess);
	addServerEventHandler("onEntityProcess", onEntityProcess);

	addServerEventHandler("onPlayerConnect", onInitialConnectionToServer);
	addServerEventHandler("onPlayerJoin", onPlayerJoin);
	addServerEventHandler("onPlayerJoined", onPlayerJoined);
	addServerEventHandler("onPlayerChat", onPlayerChat);
	addServerEventHandler("onPlayerQuit", onPlayerQuit);
	addServerEventHandler("onElementStreamIn", onElementStreamIn);
	addServerEventHandler("onElementStreamOut", onElementStreamOut);

	addServerEventHandler("onPedSpawn", onPedSpawn);
	addServerEventHandler("onPedEnterVehicle", onPedEnteringVehicle);
	addServerEventHandler("onPedExitVehicle", onPedExitingVehicle);

	addServerEventHandler("onPedEnteringVehicle", onPedEnteringVehicle);
	addServerEventHandler("onPedExitingVehicle", onPedExitingVehicle);
}
*/

// ===========================================================================

function addServerCommandHandler(command, handlerFunction) {
	addCommandHandler(command, handlerFunction);
}

// ===========================================================================

function addServerEventHandler(eventName, handlerFunction) {
	addEventHandler(eventName, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
		if (result == false) {
			event.preventDefault();
		}
	});
}

// ===========================================================================

function bindServerEventHandler(eventName, bindTo, handlerFunction) {
	addEventHandler(eventName, bindTo, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
		if (result == false) {
			event.preventDefault();
		}
	});
}

// ===========================================================================

function setElementName(element, name) {
	element.name = name;
}

// ===========================================================================

function hideElementForPlayer(element, client) {
	if (isNull(element)) {
		return false;
	}

	if (typeof element.setExistsFor == "undefined") {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Native.Connected] Hiding element ${element.id} for player ${getPlayerDisplayForConsole(client)}`);
	element.setExistsFor(client, false);
}

// ===========================================================================

function showElementForPlayer(element, client) {
	if (isNull(element)) {
		return false;
	}

	if (typeof element.setExistsFor == "undefined") {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Native.Connected] Showing element ${element.id} for player ${getPlayerDisplayForConsole(client)}`);
	element.setExistsFor(client, true);
}

// ===========================================================================

function setElementShownByDefault(element, state) {
	if (typeof element.netFlags == "undefined") {
		return false;
	}

	if (typeof element.defaultExistance == "undefined") {
		return false;
	}

	element.netFlags.defaultExistance = state;
}

// ===========================================================================

function createAttachedGameBlip(element, type, size, colour = toColour(255, 255, 255, 255)) {
	if (isGameFeatureSupported("attachedBlip")) {
		return game.createBlipAttachedTo(element, type, size, colour, true, false);
	}
}

// ===========================================================================

function deletePlayerPed(client) {
	if (areServerElementsSupported()) {
		destroyElement(client.player);
	} else {
		sendNetworkEventToPlayer("v.rp.deleteLocalPlayerPed", client);
	}

}

// ===========================================================================

function isPlayerOnBoat(client) {
	return false;
}

// ===========================================================================

function setServerName(name) {
	server.name = name;
}

// ===========================================================================

function setServerPassword(password) {
	server.setPassword(password);
}

// ===========================================================================

function shutdownServer() {
	server.shutdown();
}

// ===========================================================================

function setServerRule(ruleName, ruleValue) {
	server.setRule(ruleName, ruleValue);
}

// ===========================================================================