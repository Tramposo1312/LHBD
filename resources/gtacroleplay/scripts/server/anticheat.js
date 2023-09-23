// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: anticheat.js
// DESC: Provides anticheat functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initAntiCheatScript() {
    logToConsole(LOG_DEBUG, "[VRR.AntiCheat]: Initializing anticheat script ...");
    getServerData().antiCheat.whiteListedGameScripts = loadAntiCheatGameScriptWhiteListFromDatabase();
    getServerData().antiCheat.blackListedGameScripts = loadAntiCheatGameScriptBlackListFromDatabase();
	logToConsole(LOG_DEBUG, "[VRR.AntiCheat]: Anticheat script initialized!");
}
// ===========================================================================

function loadAntiCheatGameScriptWhiteListFromDatabase() {
    logToConsole(LOG_DEBUG, `[VRR.AntiCheat] Loading whitelisted game scripts ...`);
    let dbConnection = connectToDatabase();
    let tempWhiteListedGameScripts = [];

	if(dbConnection) {
		let dbQueryString = `SELECT * FROM ac_script_wl WHERE ac_script_wl_enabled = 1 AND ac_script_wl_server = ${getServerId()}`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
                let tempWhiteListedGameScriptData = new WhiteListedGameScriptData(dbAssoc);
                tempWhiteListedGameScripts.push(tempWhiteListedGameScriptData);
                logToConsole(LOG_DEBUG, `[VRR.AntiCheat] Whitelisted game script '${tempWhiteListedGameScriptData.scriptName}' loaded successfully!`);
            }
        }
        disconnectFromDatabase(dbConnection);
    }
    logToConsole(LOG_DEBUG, `[VRR.AntiCheat] ${tempWhiteListedGameScripts.length} whitelisted game scripts loaded!`);
    return tempWhiteListedGameScripts;
}

// ===========================================================================

function loadAntiCheatGameScriptBlackListFromDatabase() {
    logToConsole(LOG_DEBUG, `[VRR.AntiCheat] Loading blacklisted game scripts ...`);
    let dbConnection = connectToDatabase();
    let tempBlackListedGameScripts = [];

	if(dbConnection) {
		let dbQueryString = `SELECT * FROM ac_script_bl WHERE ac_script_bl_enabled = 1 AND ac_script_bl_server = ${getServerId()}`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
                let tempBlackListedGameScriptData = new BlackListedGameScriptData(dbAssoc);
                tempBlackListedGameScripts.push(tempBlackListedGameScriptData);
                logToConsole(LOG_DEBUG, `[VRR.AntiCheat] Blacklisted game script '${tempBlackListedGameScriptData.scriptName}' loaded successfully!`);
            }
        }
        disconnectFromDatabase(dbConnection);
    }
    logToConsole(LOG_DEBUG, `[VRR.AntiCheat] ${tempBlackListedGameScripts.length} blacklisted game scripts loaded!`);
    return tempBlackListedGameScripts;
}

// ===========================================================================

function clearPlayerStateToEnterExitProperty(client) {
    if(getPlayerData(client).pedState != VRR_PEDSTATE_READY) {
		if(getPlayerData(client).pedState == VRR_PEDSTATE_ENTERINGVEHICLE) {
			sendPlayerClearPedState(client);
			getPlayerData(client).pedState = VRR_PEDSTATE_READY;
		} else {
			return false;
		}
	}
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
 function addAntiCheatBlackListedScriptCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let scriptName = params;
    let tempBlackListedGameScriptData = new BlackListedGameScriptData(false);
    tempBlackListedGameScriptData.scriptName = scriptName;
    tempBlackListedGameScriptData.serverId = getServerId();
    tempBlackListedGameScriptData.enabled = true;
	tempBlackListedGameScriptData.needsSaved = true;
	getServerConfig().antiCheat.blackListedGameScripts.push(tempBlackListedGameScriptData);

    if(getServerConfig().antiCheat.gameScriptBlackListEnabled) {
        sendPlayerGameScriptState(null, scriptName, VRR_GAMESCRIPT_DENY);
    }

	messagePlayerSuccess(client, `You added {ALTCOLOUR}${scriptName} {MAINCOLOUR} to the anticheat game script blacklist`);
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
 function addAntiCheatWhiteListedScriptCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let scriptName = params;
    let tempWhiteListedGameScriptData = new WhiteListedGameScriptData(false);
    tempWhiteListedGameScriptData.scriptName = scriptName;
    tempWhiteListedGameScriptData.serverId = getServerId();
    tempWhiteListedGameScriptData.enabled = true;
	tempWhiteListedGameScriptData.needsSaved = true;
	getServerConfig().antiCheat.whiteListedGameScripts.push(tempWhiteListedGameScriptData);

    if(getServerConfig().antiCheat.gameScriptWhiteListEnabled) {
        sendPlayerGameScriptState(null, scriptName, VRR_GAMESCRIPT_ALLOW);
    }

	messagePlayerSuccess(client, `You added {ALTCOLOUR}${scriptName} {MAINCOLOUR} to the anticheat game script whitelist`);
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
 function removeAntiCheatWhiteListedScriptCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let whiteListScriptId = getAntiCheatWhiteListedScriptFromParams(params);

	getServerConfig().antiCheat.whiteListedGameScripts.splice(whiteListScriptId, 1);

    if(getServerConfig().antiCheat.gameScriptWhiteListEnabled) {
        sendPlayerGameScriptState(null, scriptName, VRR_GAMESCRIPT_NONE);
    }

	messagePlayerSuccess(client, `You removed {ALTCOLOUR}${scriptName} {MAINCOLOUR} from the anticheat game script whitelist`);
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
 function removeAntiCheatBlackListedScriptCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let blackListScriptId = getAntiCheatBlackListedScriptFromParams(params);

	getServerConfig().antiCheat.blackListedGameScripts.splice(blackListScriptId, 1);

    if(getServerConfig().antiCheat.gameScriptBlackListEnabled) {
        sendPlayerGameScriptState(null, scriptName, VRR_GAMESCRIPT_NONE);
    }

	messagePlayerSuccess(client, `You removed {ALTCOLOUR}${scriptName} {MAINCOLOUR} from the anticheat game script blacklist`);
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
 function toggleAntiCheatScriptWhiteListCommand(command, params, client) {
	getServerConfig().antiCheat.gameScriptWhiteListEnabled = !getServerConfig().antiCheat.gameScriptWhiteListEnabled;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned anticheat game script whitelist ${getBoolRedGreenInlineColour(getServerConfig().antiCheat.gameScriptWhiteListEnabled)}${toUpperCase(getOnOffFromBool(getServerConfig().antiCheat.gameScriptWhiteListEnabled))}`);
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
function toggleAntiCheatScriptBlackListCommand(command, params, client) {
	getServerConfig().antiCheat.gameScriptBlackListEnabled = !getServerConfig().antiCheat.gameScriptBlackListEnabled;
	getServerConfig().needsSaved = true;

    messageAdminAction(`${getPlayerName(client)} {MAINCOLOUR}turned anticheat game script blacklist ${getBoolRedGreenInlineColour(getServerConfig().antiCheat.gameScriptBlackListEnabled)}${toUpperCase(getOnOffFromBool(getServerConfig().antiCheat.gameScriptBlackListEnabled))}`);
    updateServerRules();
	return true;
}

// ===========================================================================

function isPlayerExemptFromAntiCheat(client) {
	if(hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("ExemptFromAntiCheat"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function canPlayerUsePoliceJob(client) {
	if(getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.policeBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseFireJob(client) {
	if(getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.fireBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseAmmunations(client) {
	if(getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.AmmuBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseGuns(client) {
	if(getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.GunBanned) {
		return false;
	}

	return true;
}

// ===========================================================================