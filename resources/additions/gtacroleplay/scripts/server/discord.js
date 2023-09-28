// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: discord.js
// DESC: Provides discord bridging and connection functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initDiscordScript() {
	logToConsole(LOG_INFO, "[VRR.Discord]: Initializing discord script ...");
	logToConsole(LOG_INFO, "[VRR.Discord]: Discord script initialized successfully!");
}

// ===========================================================================

/*
addEventHandler("OnDiscordCommand", function(command, params, discordUser) {
    let commandData = getCommand(command);

    if(!commandData) {
        messagePlayerError(discordUser, "That command does not exist!");
        return false;
    }

    if(isCommandAllowedOnDiscord(command)) {
        messagePlayerError(discordUser, "That command can not be used on Discord!");
        return false;
    }

    if(doesClientHavePermission(discordUser, getCommandRequiredPermissions(command))) {
        messagePlayerError(discordUser, "You do not have permission to use that command!");
        return false;
    }

    commandData.handlerFunction(command, params, discordUser);
});
*/

// ===========================================================================

function messageDiscordUser(discordUser, messageText) {
    let socketData = JSON.stringify({
		type: "chat.message.text",
		payload: {
			author: discordUser.name,
			text: messageText,
		}
	});
	sendDiscordSocketData(socketData);
}

// ===========================================================================

function sendDiscordSocketData(socketData) {
    if(!getDiscordSocket()) {
        return false;
    }

    getDiscordSocket().send(module.hash.encodeBase64(socketData) + "\r\n");
}

// ===========================================================================

function isClientFromDiscord(client) {
    if(client == null) {
        return false;
    }

    if(client instanceof Client) {
        return false;
    } else {
        return true;
    }
}

// ===========================================================================

function getDiscordSocket() {
    return false;
}

// ===========================================================================

function getDiscordUserData(discordUserId) {
    return loadAccountFromDiscordUserId(discordUserId);
}

// ===========================================================================

function messageDiscordChatChannel(message) {
    if(!getServerConfig().discordConfig.sendChat) {
        return false;
    }

    message = removeColoursInMessage(message);
    console.warn(message);
    let payloadData = {
        "username": "Chat",
        "content": message,
    };

    triggerWebHook(getServerConfig().discordConfig.chatChannelWebHookURL, JSON.stringify(payloadData));
}

// ===========================================================================

function messageDiscordAdminChannel(message) {
    if(!getServerConfig().discordConfig.sendAdminEvents) {
        return false;
    }

    message = removeColoursInMessage(message);
    console.warn(message);
    let payloadData = {
        "username": "Admin Event",
        "content": message,
    };

    triggerWebHook(getServerConfig().discordConfig.adminChannelWebHookURL, JSON.stringify(payloadData));
}

// ===========================================================================

function messageDiscordEventChannel(message) {
    if(!getServerConfig().discordConfig.sendEvents) {
        return false;
    }

    message = removeColoursInMessage(message);
    console.warn(message);
    let payloadData = {
        "username": "Event",
        "content": message,
    };

    triggerWebHook(getServerConfig().discordConfig.eventChannelWebHookURL, JSON.stringify(payloadData));
}

// ===========================================================================