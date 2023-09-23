// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: bans.js
// DESC: Provides ban functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function initBanScript() {
    logToConsole(LOG_INFO, "[VRR.Ban]: Initializing ban script ...");
    logToConsole(LOG_INFO, "[VRR.Ban]: Ban script initialized!");
}

// ===========================================================================

function accountBanCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let splitParams = params.split(" ");
    let targetClient = getPlayerFromParams(getParam(params, " ", 1));
    let reason = splitParams.slice(1).join(" ");

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!")
        return false;
    }

	// Prevent banning admins with really high permissions
    if(doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanPlayer"));
        return false;
	}

    logToConsole(LOG_WARN, `[VRR.Ban]: ${getPlayerDisplayForConsole(targetClient)} (${getPlayerData(targetClient).accountData.name}) account was banned by ${getPlayerDisplayForConsole(client)}. Reason: ${reason}`);

	messageAdminAction(`${getPlayerDisplayForConsole(targetClient)} (${getPlayerData(targetClient).accountData.name}) has been account banned.`);
	banAccount(getPlayerData(targetClient).accountData.databaseId, getPlayerData(client).accountData.databaseId, reason);
	disconnectPlayer(client);
}

// ===========================================================================

function subAccountBanCommand(command, params, client, fromDiscord) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

    let splitParams = params.split(" ");
    let targetClient = getPlayerFromParams(getParam(params, " ", 1));
    let reason = splitParams.slice(1).join(" ");

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!")
        return false;
    }

	// Prevent banning admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanPlayer"));
		return false;
    }

    logToConsole(LOG_WARN, `[VRR.Ban]: ${getPlayerDisplayForConsole(targetClient)} (${getPlayerData(targetClient).accountData.name})'s subaccount was banned by ${getPlayerDisplayForConsole(client)}. Reason: ${reason}`);

	messageAdminAction(`${getPlayerData(targetClient).currentSubAccountData.name} has been character banned.`);
    banSubAccount(getPlayerData(targetClient).currentSubAccountData.databaseId, getPlayerData(client).accountData.databaseId, reason);

    disconnectPlayer(client);
}

// ===========================================================================

function ipBanCommand(command, params, client, fromDiscord) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
    }

    let splitParams = params.split(" ");
    let targetClient = getPlayerFromParams(getParam(params, " ", 1));
    let reason = splitParams.slice(1).join(" ");

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!")
        return false;
    }

	// Prevent banning admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanPlayer"));
		return false;
    }

    messageAdminAction(`${targetgetPlayerName(client)} has been IP banned.`);
    banIPAddress(targetClient.ip, getPlayerData(client).accountData.databaseId, reason);

    server.banIP(targetClient.ip);
    targetClient.disconnect();
}

// ===========================================================================

function subNetBanCommand(command, params, client, fromDiscord) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
    }

    let splitParams = params.split(" ");
    let targetClient = getPlayerFromParams(getParam(params, " ", 1));
    let octetAmount = Number(getParam(params, " ", 2));
    let reason = splitParams.slice(2).join(" ");

    if(!targetClient) {
        messagePlayerError(client, "That player is not connected!")
        return false;
    }

	// Prevent banning admins with really high permissions
	if(doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanPlayer"));
		return false;
    }

	messageAdminAction(`${targetgetPlayerName(client)} has been banned from the server (subnet ban).`);
	banSubNet(targetClient.ip, getSubNet(targetClient.ip, octetAmount), getPlayerData(client).accountData.databaseId, reason);

    server.banIP(targetClient.ip);
}

// ===========================================================================

function banAccount(accountId, adminAccountId, reason) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let safeReason = dbConnection.escapetoString(reason);
        let dbQuery = queryDatabase(dbConnection, `INSERT INTO ban_main (ban_type, ban_detail, ban_who_banned, ban_reason) VALUES (${VRR_BANTYPE_ACCOUNT}, ${accountId}, ${adminAccountId}, '${safeReason}');`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function banSubAccount(subAccountId, adminAccountId, reason) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let safeReason = dbConnection.escapetoString(reason);
        let dbQuery = queryDatabase(dbConnection, `INSERT INTO ban_main (ban_type, ban_detail, ban_who_banned, ban_reason) VALUES (${VRR_BANTYPE_SUBACCOUNT}, ${subAccountId}, ${adminAccountId}, '${safeReason}');`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function banIPAddress(ipAddress, adminAccountId, reason) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let safeReason = dbConnection.escapetoString(reason);
        let dbQuery = queryDatabase(dbConnection, `INSERT INTO ban_main (ban_type, ban_detail, ban_who_banned, ban_reason) VALUES (${VRR_BANTYPE_IPADDRESS}, INET_ATON(${ipAddress}), ${adminAccountId}, '${safeReason}');`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function banSubNet(ipAddressStart, ipAddressEnd, adminAccountId, reason) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let safeReason = dbConnection.escapetoString(reason);
        let dbQuery = queryDatabase(dbConnection, `INSERT INTO ban_main (ban_type, ban_ip_start, ban_ip_end, ban_who_banned, ban_reason) VALUES (${VRR_BANTYPE_SUBNET}, INET_ATON(${ipAddressStart}), INET_ATON(${ipAddressEnd}), ${adminAccountId}, '${safeReason}');`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function unbanAccount(accountId, adminAccountId) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${VRR_BANTYPE_ACCOUNT} AND ban_detail=${accountId}`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function unbanSubAccount(subAccountId, adminAccountId) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${VRR_BANTYPE_SUBACCOUNT} AND ban_detail=${subAccountId}`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function unbanIPAddress(ipAddress, adminAccountId) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${VRR_BANTYPE_IPADDRESS} AND ban_detail=INET_ATON(${ipAddress})`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function unbanSubNet(ipAddressStart, ipAddressEnd, adminAccountId) {
    let dbConnection = connectToDatabase();
    if(dbConnection) {
        let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${VRR_BANTYPE_SUBNET} AND ban_ip_start=INET_ATON(${ipAddressStart}) AND ban_ip_end=INET_ATON(${ipAddressEnd})`);
        freeDatabaseQuery(dbQuery);
        dbConnection.close();
        return true;
    }

    return false;
}

// ===========================================================================

function isAccountBanned(accountId) {
    let bans = getServerData().bans;
    for(let i in bans) {
        if(bans[i].type == VRR_BANTYPE_ACCOUNT) {
            if(bans[i].detail == accountId) {
                return true;
            }
        }
    }

    return false;
}

// ===========================================================================

function isSubAccountBanned(subAccountId) {
    let bans = getServerData().bans;
    for(let i in bans) {
        if(bans[i].type == VRR_BANTYPE_SUBACCOUNT) {
            if(bans[i].detail == subAccountId) {
                return true;
            }
        }
    }

    return false;
}

// ===========================================================================

function isIpAddressBanned(ipAddress) {
    let bans = getServerData().bans;
    for(let i in bans) {
        if(bans[i].type == VRR_BANTYPE_IPADDRESS) {
            if(bans[i].detail == ipAddress) {
                return true;
            }
        }
    }

    return false;
}

// ===========================================================================

