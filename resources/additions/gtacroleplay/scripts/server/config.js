// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: config.js
// DESC: Provides server configuration
// TYPE: Server (JavaScript)
// ===========================================================================

let serverConfig = {};
let databaseConfig = {};
let emailConfig = {};
let gameConfig = {};

// ===========================================================================

let globalConfig = {
	accountPasswordHash: "SHA512",
	npcFarProximity: 100,
	npcMediumProximity: 40,
	npcCloseProximity: 12,
	meActionDistance: 20,
	doActionDistance: 15,
	shoutDistance: 30,
	talkDistance: 10,
	whisperDistance: 2,
	megaphoneDistance: 40,
	vehicleLockDistance: 5,
	startWorkingDistance: 5,
	takeJobDistance: 5,
	stopWorkingDistance: 10,
	spawnCarDistance: 5,
	payAndSprayDistance: 5,
	keyBind: [],
	exitPropertyDistance: 3.0,
	enterPropertyDistance: 3.0,
	businessDimensionStart: 5000,
	houseDimensionStart: 100,
	buyVehicleDriveAwayDistance: 25.0,
	returnToJobVehicleTime: 30,
	walkieTalkieSpeakerDistance: 15,
	walkieTalkieTalkDistance: 15,
	phoneSpeakerDistance: 15,
	phoneTalkDistance: 15,
	tazerEffectDuration: 15000,
	vehicleRepairDistance: 5,
	itemActionStateReset: 5000,
	subAccountNameAllowedCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	emailValidationRegex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
	itemActionDelayExtraTimeout: 1000,
	geoIPCountryDatabaseFilePath: "geoip-country.mmdb",
	geoIPCityDatabaseFilePath: "geoip-city.mmdb",
	randomTipInterval: 600000,
	weaponEquippableTypes: [
		VRR_ITEM_USETYPE_WEAPON,
		VRR_ITEM_USETYPE_TAZER,
		VRR_ITEM_USETYPE_EXTINGUISHER,
		VRR_ITEM_USETYPE_SPRAYPAINT,
		VRR_ITEM_USETYPE_PEPPERSPRAY,
	],
	onFootOnlyItems: [
		VRR_ITEM_USETYPE_VEHREPAIR,
		VRR_ITEM_USETYPE_VEHCOLOUR,
		VRR_ITEM_USETYPE_VEHUPGRADE_PART,
		VRR_ITEM_USETYPE_VEHLIVERY,
		VRR_ITEM_USETYPE_VEHTIRE,
	],
	vehicleInactiveRespawnDelay: 1800000, // 20 minutes
	chatSectionHeaderLength: 96,
	economy: {},
	locales: [],
	accents: [],
};

// ===========================================================================

function loadGameConfig() {
	return gameData;
};

// ===========================================================================

function loadGlobalConfig() {
	getGlobalConfig().economy = loadEconomyConfig();
	getGlobalConfig().locales = loadLocaleConfig();
	getGlobalConfig().accents = loadAccentConfig();
}

// ===========================================================================

function initConfigScript() {
	logToConsole(LOG_INFO, "[VRR.Config]: Initializing config script ...");
	gameConfig = loadGameConfig();
	serverConfig = loadServerConfigFromGameAndPort(server.game, server.port, getMultiplayerMod());
	applyConfigToServer(serverConfig);

	loadGlobalConfig();

	logToConsole(LOG_INFO, "[VRR.Config]: Config script initialized!");
}

// ===========================================================================

function loadServerConfigFromGameAndPort(gameId, port, mpMod) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_game = ${gameId} AND svr_port = ${port} AND svr_mpmod = ${mpMod} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
				let tempServerConfigData = new ServerData(dbAssoc);
				freeDatabaseQuery(dbQuery);
				return tempServerConfigData;
			}
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function loadServerConfigFromId(tempServerId) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_id = ${tempServerId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
				let tempServerConfigData = new ServerData(dbAssoc);
				freeDatabaseQuery(dbQuery);
				return tempServerConfigData;
			}
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function applyConfigToServer(tempServerConfig) {
	if(isTimeSupported()) {
		setGameTime(tempServerConfig.hour, tempServerConfig.minute, tempServerConfig.minuteDuration)
	}

	if(isWeatherSupported()) {
		game.forceWeather(tempServerConfig.weather);
	}

	updateServerRules();
}

// ===========================================================================

function saveServerConfigToDatabase() {
	logToConsole(LOG_DEBUG, `[VRR.Config]: Saving server ${getServerConfig().databaseId} configuration to database ...`);
	if(getServerConfig().needsSaved) {
		let dbConnection = connectToDatabase();
		if(dbConnection) {
			let data = [
				["svr_logo", boolToInt(getServerConfig().showLogo)],
				["svr_gui", boolToInt(getServerConfig().useGUI)],
				["svr_start_time_hour", getServerConfig().hour],
				["svr_start_time_min", getServerConfig().minute],
				["svr_start_weather", getServerConfig().weather],
				["svr_start_snow_falling", boolToInt(getServerConfig().fallingSnow)],
				["svr_start_snow_ground", boolToInt(getServerConfig().groundSnow)],
				["svr_newchar_pos_x", getServerConfig().newCharacter.spawnPosition.x],
				["svr_newchar_pos_y", getServerConfig().newCharacter.spawnPosition.y],
				["svr_newchar_pos_z", getServerConfig().newCharacter.spawnPosition.z],
				["svr_newchar_rot_z", getServerConfig().newCharacter.spawnHeading],
				["svr_newchar_skin", getServerConfig().newCharacter.skin],
				["svr_newchar_money", getServerConfig().newCharacter.money],
				["svr_gui_col1_r", getServerConfig().guiColourPrimary[0]],
				["svr_gui_col1_g", getServerConfig().guiColourPrimary[1]],
				["svr_gui_col1_b", getServerConfig().guiColourPrimary[2]],
				["svr_gui_col2_r", getServerConfig().guiColourSecondary[0]],
				["svr_gui_col2_g", getServerConfig().guiColourSecondary[1]],
				["svr_gui_col2_b", getServerConfig().guiColourSecondary[2]],
				["svr_connectcam_pos_x", getServerConfig().connectCameraPosition.x],
				["svr_connectcam_pos_y", getServerConfig().connectCameraPosition.y],
				["svr_connectcam_pos_z", getServerConfig().connectCameraPosition.z],
				["svr_connectcam_lookat_x", getServerConfig().connectCameraLookAt.x],
				["svr_connectcam_lookat_y", getServerConfig().connectCameraLookAt.y],
				["svr_connectcam_lookat_z", getServerConfig().connectCameraLookAt.z],
				["svr_charselect_cam_pos_x", getServerConfig().characterSelectCameraPosition.x],
				["svr_charselect_cam_pos_y", getServerConfig().characterSelectCameraPosition.y],
				["svr_charselect_cam_pos_z", getServerConfig().characterSelectCameraPosition.z],
				["svr_charselect_cam_lookat_x", getServerConfig().characterSelectCameraLookAt.x],
				["svr_charselect_cam_lookat_y", getServerConfig().characterSelectCameraLookAt.y],
				["svr_charselect_cam_lookat_z", getServerConfig().characterSelectCameraLookAt.z],
				["svr_charselect_ped_pos_x", getServerConfig().characterSelectPedPosition.x],
				["svr_charselect_ped_pos_y", getServerConfig().characterSelectPedPosition.y],
				["svr_charselect_ped_pos_z", getServerConfig().characterSelectPedPosition.z],
				["svr_charselect_ped_rot_z", getServerConfig().characterSelectPedHeading],
				["svr_charselect_int", getServerConfig().characterSelectInterior],
				["svr_charselect_vw", getServerConfig().characterSelectDimension],
				["svr_inflation_multiplier", getServerConfig().inflationMultiplier],
				["svr_ac_enabled", boolToInt(getServerConfig().antiCheat.enabled)],
				["svr_ac_check_scripts", boolToInt(getServerConfig().antiCheat.checkGameScripts)],
				["svr_ac_script_wl", boolToInt(getServerConfig().antiCheat.gameScriptWhiteListEnabled)],
				["svr_ac_script_bl", boolToInt(getServerConfig().antiCheat.gameScriptBlackListEnabled)],
				["svr_job_pickups", boolToInt(getServerConfig().createJobPickups)],
				["svr_job_blips", boolToInt(getServerConfig().createJobBlips)],
				["svr_biz_pickups", boolToInt(getServerConfig().createBusinessPickups)],
				["svr_biz_blips", boolToInt(getServerConfig().createBusinessBlips)],
				["svr_house_pickups", boolToInt(getServerConfig().createHousePickups)],
				["svr_house_blips", boolToInt(getServerConfig().createHouseBlips)],
				["svr_intro_music", getServerConfig().introMusicURL],
			];

			let dbQuery = null;
			let queryString = createDatabaseUpdateQuery("svr_main", data, `svr_id=${getServerConfig().databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);

			getServerConfig().needsSaved = false;
			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);

		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Config]: Server ${getServerConfig().databaseId} configuration saved to database!`);
}

// ===========================================================================

/**
 *
 * @return {ServerConfigData} - Server configuration data
 *
 */
function getServerConfig() {
	return serverConfig;
}

// ===========================================================================

function getGameConfig() {
	return gameConfig;
}

// ===========================================================================

function getGlobalConfig() {
	return globalConfig;
}

// ===========================================================================

function getServerId() {
	return getServerConfig().databaseId;
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
function setTimeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let hour = toInteger(getParam(params, " ", 1));
	let minute = toInteger(getParam(params, " ", 2)) || 0;

	if(hour > 23 || hour < 0) {
		messagePlayerError(client, "The hour must be between 0 and 23!");
		return false;
    }

	if(minute > 59 || minute < 0) {
		messagePlayerError(client, "The minute must be between 0 and 59!");
		return false;
    }

	getServerConfig().hour = hour;
	getServerConfig().minute = minute;

    game.time.hour = getServerConfig().hour;
    game.time.minute = getServerConfig().minute;

	//checkServerGameTime();

	getServerConfig().needsSaved = true;

	messageAdminAction(`${getPlayerName(client)} set the time to ${makeReadableTime(hour, minute)}`);
	return true;
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
function setMinuteDurationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let minuteDuration = toInteger(params);
	getServerConfig().minuteDuration = minuteDuration;
	setTimeMinuteDuration(null, minuteDuration);

	getServerConfig().needsSaved = true;

	messageAdminAction(`${getPlayerName(client)} set the minute duration to ${minuteDuration}ms`);
	return true;
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
function setWeatherCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let weatherId = getWeatherFromParams(getParam(params, " ", 1));

	if(!weatherId) {
		messagePlayerError(client, `That weather ID or name is invalid!`);
		return false;
    }

    game.forceWeather(toInteger(weatherId));
	getServerConfig().weather = weatherId;

	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} set the weather to {ALTCOLOUR}${getGameData().weatherNames[getServerGame()][toInteger(weatherId)]}`);
    updateServerRules();
	return true;
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
function setSnowingCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
    let falling = toInteger(getParam(params, " ", 1));
	let ground = toInteger(getParam(params, " ", 2));

	getServerConfig().fallingSnow = intToBool(falling);
	getServerConfig().groundSnow = intToBool(ground);

	updatePlayerSnowState(null);

	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned falling snow ${getBoolRedGreenInlineColour(falling)}${getOnOffFromBool(falling)} {MAINCOLOUR}and ground snow ${getBoolRedGreenInlineColour(ground)}${getOnOffFromBool(ground)}`);
    updateServerRules();
	return true;
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
function setServerGUIColoursCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
    let colourRed = toInteger(getParam(params, " ", 1)) || 255;
	let colourGreen = toInteger(getParam(params, " ", 2)) || 255;
	let colourBlue = toInteger(getParam(params, " ", 3)) || 255;

	getServerConfig().guiColour = [colourRed, colourGreen, colourBlue];

	let clients = getClients();
	for(let i in clients) {
		sendPlayerGUIColours(clients[i]);
	}

	getServerConfig().needsSaved = true;

    //messageAdminAction(`${getPlayerName(client)} ${getInlineChatColourByName("orange")}set the server ${getBoolRedGreenInlineColour(fallingSnow)}${getOnOffFromBool(fallingSnow)} ${getInlineChatColourByName("orange")}and ground snow ${getBoolRedGreenInlineColour(groundSnow)}${getOnOffFromBool(groundSnow)}`);
    //updateServerRules();
	return true;
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
function toggleServerLogoCommand(command, params, client) {
	getServerConfig().useLogo = !getServerConfig().useLogo;
	getServerConfig().needsSaved = true;

	updatePlayerShowLogoState(null, getServerConfig().useLogo);

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned the server logo image ${getBoolRedGreenInlineColour(getServerConfig().useLogo)}${toUpperCase(getOnOffFromBool(getServerConfig().useLogo))}`);
    updateServerRules();
	return true;
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
 function toggleServerJobBlipsCommand(command, params, client) {
	getServerConfig().createJobBlips = !getServerConfig().createJobBlips;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createJobBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createJobBlips))} {MAINCOLOUR}all job blips`);
	resetAllJobBlips();
	return true;
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
 function toggleServerJobPickupsCommand(command, params, client) {
	getServerConfig().createJobPickups = !getServerConfig().createJobPickups;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createJobPickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createJobPickups))} {MAINCOLOUR}all job pickups`);
	resetAllJobPickups();
	return true;
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
 function toggleServerBusinessBlipsCommand(command, params, client) {
	getServerConfig().createBusinessBlips = !getServerConfig().createBusinessBlips;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createBusinessBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createBusinessBlips))} {MAINCOLOUR}all business blips`);
	resetAllBusinessBlips();
	return true;
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
 function toggleServerBusinessPickupsCommand(command, params, client) {
	getServerConfig().createBusinessPickups = !getServerConfig().createBusinessPickups;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createBusinessPickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createBusinessPickups))} {MAINCOLOUR}all business pickups`);
	resetAllBusinessPickups();
	return true;
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
 function toggleServerHouseBlipsCommand(command, params, client) {
	getServerConfig().createHouseBlips = !getServerConfig().createHouseBlips;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createHouseBlips)}${toUpperCase(getOnOffFromBool(getServerConfig().createHouseBlips))} {MAINCOLOUR}all house blips`);
	resetAllHouseBlips();
	return true;
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
 function toggleServerHousePickupsCommand(command, params, client) {
	getServerConfig().createHousePickups = !getServerConfig().createHousePickups;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned ${getBoolRedGreenInlineColour(getServerConfig().createHousePickups)}${toUpperCase(getOnOffFromBool(getServerConfig().createHousePickups))} {MAINCOLOUR}all house pickups`);
	resetAllHousePickups();
	return true;
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
function toggleServerGUICommand(command, params, client) {
    getServerConfig().useGUI = !getServerConfig().useGUI;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned GUI ${toLowerCase(getOnOffFromBool(getServerConfig().useGUI))} for this server`);
    updateServerRules();
	return true;
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
function toggleServerUseRealWorldTimeCommand(command, params, client) {
    getServerConfig().useRealTime = !getServerConfig().useRealTime;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned real-world time ${toLowerCase(getOnOffFromBool(getServerConfig().useRealTime))} for this server (GMT ${addPositiveNegativeSymbol(getServerConfig().realTimeZone)})`);
	updateServerGameTime();
    updateServerRules();
	return true;
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
function setServerRealWorldTimeZoneCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    getServerConfig().realTimeZone = toInteger(params);
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}set the time zone for in-game's real-world time to GMT ${addPositiveNegativeSymbol(getServerConfig().realTimeZone)}`);
	updateServerGameTime();
    updateServerRules();
	return true;
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
function reloadServerConfigurationCommand(command, params, client) {
	serverConfig = loadServerConfigFromGameAndPort(server.game, server.port);
	applyConfigToServer(serverConfig);
	updateServerRules();

    messagePlayerSuccess(client, `You reloaded the server configuration!`);
	return true;
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
function reloadEmailConfigurationCommand(command, params, client) {
	emailConfig = loadEmailConfiguration();
    messagePlayerSuccess(client, `You reloaded the email configuration!`);
	return true;
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
function reloadDatabaseConfigurationCommand(command, params, client) {
	if(databaseConfig.usePersistentConnection && isDatabaseConnected(persistentDatabaseConnection)) {
		console.warn(`[VRR.Database] Closing persistent database connection`);
		persistentDatabaseConnection.close();
		persistentDatabaseConnection = null;
	}
	databaseEnabled = false;
	databaseConfig = loadEmailConfig();
	messagePlayerSuccess(client, `You reloaded the database configuration!`);
	databaseEnabled = true;
	if(databaseConfig.usePersistentConnection) {
		connectToDatabase();
	}

	return true;
}

// ===========================================================================

function getServerIntroMusicURL() {
	return getServerConfig().introMusicURL;
}

// ===========================================================================

function loadLocaleConfig() {
	let localeConfig = JSON.parse(loadTextFile(`config/locale.json`));
	if(localeConfig != null) {
		return localeConfig;
	}
}

// ===========================================================================

function loadEconomyConfig() {
	let economyConfig = JSON.parse(loadTextFile(`config/economy.json`));
	if(economyConfig != null) {
		return economyConfig;
	}
}

// ===========================================================================

function loadAccentConfig() {
	let accentConfig = JSON.parse(loadTextFile(`config/accent.json`));
	if(accentConfig != null) {
		return accentConfig;
	}
}

// ===========================================================================