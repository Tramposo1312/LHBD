// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: clan.js
// DESC: Provides clan functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initClanScript() {
	logToConsole(LOG_INFO, "[VRR.Clan]: Initializing clans script ...");
	getServerData().clans = loadClansFromDatabase();
	setAllClanDataIndexes();
	logToConsole(LOG_INFO, "[VRR.Clan]: Clan script initialized successfully!");
	return true;
}

// ===========================================================================

function loadClansFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Clan]: Loading clans from database ...");

	let tempClans = [];
	let dbConnection = connectToDatabase();
	let dbAssoc;

	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM clan_main WHERE clan_deleted = 0 AND clan_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempClanData = new ClanData(dbAssoc);
					//tempClanData.members = loadClanMembersFromDatabase(tempClanData.databaseId);
					tempClanData.ranks = loadClanRanksFromDatabase(tempClanData.databaseId);
					tempClans.push(tempClanData);
					logToConsole(LOG_VERBOSE, `[VRR.Clan]: Clan '${tempClanData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Clan]: ${tempClans.length} clans loaded from database successfully!`);
	return tempClans;
}

// ===========================================================================

function loadClanMembersFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Clan]: Loading clans from database ...");

	let tempClans = [];
	let dbConnection = connectToDatabase();
	let dbAssoc;

	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM clan_main WHERE clan_deleted = 0 AND clan_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempClanData = new ClanData(dbAssoc);
					tempClans.push(tempClanData);
					logToConsole(LOG_VERBOSE, `[VRR.Clan]: Clan '${tempClanData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Clan]: ${tempClans.length} clans loaded from database successfully!`);
	return tempClans;
}

// ===========================================================================

function loadClanRanksFromDatabase(clanDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.Clan]: Loading ranks for clan ${clanDatabaseId} from database ...`);

	let dbConnection = connectToDatabase();
	let dbAssoc;
	let tempClanRanks = [];

	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM clan_rank WHERE clan_rank_clan = ${clanDatabaseId}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempClanRankData = new ClanRankData(dbAssoc);
					tempClanRanks.push(tempClanRankData);
					logToConsole(LOG_VERBOSE, `[VRR.Clan]: Clan rank '${tempClanRankData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Clan]: Loaded ranks for clan ${clanDatabaseId} from database successfully!`);
	return tempClanRanks;
}

// ===========================================================================

function createClanRank(clanId, rankId, rankName) {
	let tempClanRankData = new ClanRankData(false);
	tempClanRankData.level = rankId;
	tempClanRankData.name = rankName;
	tempClanRankData.clan = getClanData(clanId).databaseId;
	tempClanRankData.clanIndex = clanId;
	tempClanRankData.needsSaved = true;

	let rankIndex = getClanData(clanId).ranks.push(tempClanRankData);
	setAllClanDataIndexes();

	saveAllClanRanksToDatabase(clanId);
	return rankIndex;
}

// ===========================================================================

function removeClanRank(clanId, rankId) {
	let tempClanRankData = getClanRankData(clanId, rankId);
	if(!tempClanRankData) {
		return false;
	}

	quickDatabaseQuery(`DELETE FROM clan_rank WHERE clan_rank_id = ${tempClanRankData.database}`);
	getClanData(clanId).ranks.splice(tempClanRankData.index, 1);
}

// ===========================================================================

function listClansCommand(command, params, client) {
	let clans = getServerData().clans;

	if(!areParamsEmpty(params)) {
		clans = clans.filter(clan => toLowerCase(clan.name).indexOf(toLowerCase(params)) != -1);
		return false;
	}

	let nameList = clans.map((clan) => { return clan.name; });

	let chunkedList = splitArrayIntoChunks(nameList, 5);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clans {clanOrange}====================================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listClanRanksCommand(command, params, client) {
	let clanId = getPlayerClan(client);

	if(!areParamsEmpty(params)) {
		if(doesPlayerHaveStaffPermission(client, "ManageClans")) {
			clanId = getClanFromParams(params);
		}
	}

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankNameList = getClanData(clanId).ranks.map((clanRank) => { return `[${clanRank.level}] ${clanRank.name}`; });

	let chunkedList = splitArrayIntoChunks(rankNameList, 5);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clan Ranks (${getClanData(clanId).name}) {clanOrange}=====================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function createClanCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(doesClanNameExist(params)) {
		messagePlayerError(client, "A clan with that name already exists!");
		return false;
	}

	// Create clan without owner. Can set owner with /clanowner afterward
	createClan(params);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}created clan {clanOrange}${params}`);
}

// ===========================================================================

function deleteClanCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getClanFromParams(params);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}deleted clan {clanOrange}${getClanData(clanId).name}`);
	deleteClan(clanId);
}

// ===========================================================================

function setClanOwnerCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("owner"))) {
		messagePlayerError(client, "You must be the clan owner to use this command!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

let clanId = getClanFromParams(getParam(params, " ", 1));
	let targetClient = getPlayerFromParams(getParam(params, " ", 2));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).owner = getPlayerCurrentSubAccount(targetClient).databaseId;
	getPlayerCurrentSubAccount(targetClient).clan = getClanData(clanId).databaseId;
	getPlayerCurrentSubAccount(targetClient).clanFlags = getClanFlagValue("All");

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}owner to {ALTCOLOUR}${getCharacterFullName(targetClient)}`);
}

// ===========================================================================

function setClanTagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanTag"))) {
		messagePlayerError(client, "You can not change the clan tag!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).params = params;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}tag to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanNameCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanName"))) {
		messagePlayerError(client, "You can not change the clan name!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).name = params;

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}name to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function createClanRankCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can not add new clan ranks!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = toInteger(getParam(params, " ", 1));
	let rankName = getParam(params, " ", 2);

	let rankIndex = createClanRank(clanId, rankId, rankName);

	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${rankName} {MAINCOLOUR}rank (Level {ALTCOLOUR}${rankId}`);
	messagePlayerSuccess(client, `Use {ALTCOLOUR}/addclanrankflag ${rankName} <clan flag name> {MAINCOLOUR} to add permission flags to this rank.`);
}

// ===========================================================================

function deleteClanRankCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can not remove clan ranks!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankId = getClanRankFromParams(clanId, params);
	let tempRankName = getClanRankData(clanId, rankId);

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	removeClanRank(clanId, rankId);

	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${tempRankName} {MAINCOLOUR}rank`);
}

// ===========================================================================

function setClanMemberTagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, "You can not change clan member's tags!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!arePlayersInSameClan(client, targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, "You cannot set clan member flags!");
		return false;
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's flags!");
			return false;
		}
	}

	getPlayerCurrentSubAccount(targetClient).ClanTag = getParam(params, " ", 2);

	messagePlayerSuccess(client, `You set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}clan tag to {ALTCOLOUR}${getParam(params, " ", 2)}`);
	messagePlayerAlert(client, `{ALTCOLOUR}${getCharacterFullName(targetClient)} {MAINCOLOUR}set your clan tag to {ALTCOLOUR}${getParam(params, " ", 2)}`);
}

// ===========================================================================

function setClanRankTagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can't change any clan ranks's tag!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let newTag = splitParams[splitParams.length-1];

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, "You can't change this rank's tag (it's a higher rank than yours)");
			return false;
		}
	}

	getServerData().clans[clanId].rankId[rankId].customTag = newTag;
}

// ===========================================================================

function setClanRankLevelCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can't change any clan rank's level!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let newLevel = splitParams[splitParams.length-1];

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, "You can't change this rank's level (it's a higher rank than yours)");
			return false;
		}
	}

	if(isNaN(newLevel)) {
		messagePlayerError(client, "The level must be a number!");
		return false;
	}

	if(toInteger(newLevel) < 0) {
		messagePlayerError(client, "The level must be 0 or higher (no negative numbers)!");
		return false;
	}

	getServerData().clans[clanId].rankId[rankId].level = toInteger(newLevel);
}

// ===========================================================================

function addClanMemberFlagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, "You can't change clan member's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!arePlayersInSameClan(client, targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, "You cannot set clan member flags!");
		return false;
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's flags!");
			return false;
		}
	}

	let flagValue = getClanFlagValue(getParam(params, " ", 2));
	getPlayerCurrentSubAccount(client).clanFlags = getPlayerCurrentSubAccount(client).clanFlags | flagValue;
	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag to {ALTCOLOUR}${getCharacterFullName(client)}`);
}

// ===========================================================================

function removeClanMemberFlagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, "You can't change clan member's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!arePlayersInSameClan(client, targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, "You cannot set clan member flags!");
		return false;
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's flags!");
			return false;
		}
	}

	let flagValue = getClanFlagValue(getParam(params, " ", 2));
	getPlayerCurrentSubAccount(client).clanFlags = getPlayerCurrentSubAccount(client).clanFlags & ~flagValue;
	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag from {ALTCOLOUR}${getCharacterFullName(client)}`);
}

// ===========================================================================

function addClanRankFlagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can not change a clan rank's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = getClanRankFromParams(clanId, getParam(params, " ", 1));

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(!getClanFlagValue(getParam(params, " ", 2))) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	let flagValue = getClanFlagValue(getParam(params, " ", 2));

	addBitFlag(getClanRankData(clanId, rankId).flags, flagValue);
	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag to rank {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function removeClanRankFlagCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can not change a clan rank's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = getClanRankFromParams(clanId, getParam(params, " ", 1));

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(!getClanFlagValue(getParam(params, " ", 2))) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	let flagValue = getClanFlagValue(getParam(params, " ", 2));

	removeBitFlag(getClanRankData(clanId, rankId).flags, flagValue);
	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag from rank {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function showClanRankFlagsCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, "You can not change a clan rank's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = getClanRankFromParams(clanId, getParam(params, " ", 1));

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	let currentFlags = getClanRankData(clanId, rankId).flags;
	let clanFlagKeys = getServerBitFlagKeys().clanFlagKeys.filter((flagKey) => flagKey != "None");
	let flagList = [];
	for(let i in clanFlagKeys) {
		if(hasBitFlag(currentFlags, getClanFlagValue(clanFlagKeys[i]))) {
			flagList.push(`{softGreen}${clanFlagKeys[i]}`);
		} else {
			flagList.push(`{softRed}${clanFlagKeys[i]}`);
		}
	}

	let chunkedList = splitArrayIntoChunks(flagList, 6);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clan Rank Flags (${getClanRankData(clanId, rankId).name}){clanOrange}===================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join("{MAINCOLOUR}, "));
	}
}

// ===========================================================================

function setClanMemberTitleCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, "You can not change a clan member's title!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!arePlayersInSameClan(client, targetClient)) {
		if(!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's custom title!");
			return false;
		}
	}

	let oldMemberTitle = getPlayerCurrentSubAccount(client).clanTitle;
	getPlayerCurrentSubAccount(client).clanTitle = getParam(params, " ", 2);
	messagePlayerSuccess(client, `You changed the name of {ALTCOLOUR}${getCharacterFullName(client)} {MAINCOLOUR}from {ALTCOLOUR}${oldMemberTitle} {MAINCOLOUR}to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanRankTitleCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("rankTitle"))) {
		messagePlayerError(client, "You can not change your clan's rank titles!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = getClanRankFromParams(clanId, getParam(params, " ", 1));

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	let oldRankName = getClanRankData(clanId, rankId).name;
	getClanRankData(clanId, rankId).name = getParam(params, " ", 2);
	messagePlayerSuccess(client, `You changed the name of rank ${rankId} from {ALTCOLOUR}${oldRankName} {MAINCOLOUR}to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanMemberRankCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("MemberRank"))) {
		messagePlayerError(client, "You can not change a clan member's rank!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let rankId = getClanRankFromParams(clanId, getParam(params, " ", 2));

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if(!arePlayersInSameClan(client, targetClient)) {
		if(!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's rank!");
			return false;
		}
	}

	if(getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if(!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You can't set a member's rank that high!");
			return false;
		}
	}

	let oldClanRank = getClanRankData(clanId, getPlayerClanRank(targetClient));
	getPlayerCurrentSubAccount(targetClient).clanRank = getClanRankData(clanId, rankId).databaseId;
	getPlayerCurrentSubAccount(targetClient).clanRankIndex = rankId;
	messagePlayerSuccess(client, `You changed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}rank from {ALTCOLOUR}${oldClanRank.name} {MAINCOLOUR}to {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function createClan(name) {
	let dbConnection = connectToDatabase();
	let escapedName = name;

	if(dbConnection) {
		escapedName = escapeDatabaseString(dbConnection, escapedName)
		queryDatabase(dbConnection, `INSERT INTO clan_main (clan_server, clan_name) VALUES (${getServerId()}, '${escapedName}')`);

		let tempClan = new ClanData(false);
		tempClan.databaseId = getDatabaseInsertId(dbConnection);
		tempClan.name = name;
		getServerData().clans.push(tempClan);

		setAllClanDataIndexes();
	}
	return true;
}

// ===========================================================================

function deleteClan(clanId) {
	saveClansToDatabase();

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE clan_main SET clan_deleted = 1 WHERE clan_id = ${clanId}`);
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);

		reloadAllClans();
		return true;
	}

	return false;
}

// ===========================================================================

function getClanData(clanId) {
	if(typeof getServerData().clans[clanId] != null) {
		return getServerData().clans[clanId];
	}
	return false;
}

// ===========================================================================

function doesClanNameExist(name) {
	let clans = getServerData().clans;
	for(let i in clans) {
		if(clans[i].name == name) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function doesClanIdExist(clanId) {
	let clans = getServerData().clans;
	for(let i in clans) {
		if(clans[i].databaseId == clanId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function reloadAllClans() {
	getServerData().clans = loadClansFromDatabase();
}

// ===========================================================================

function saveAllClanRanksToDatabase(clanId) {
	let ranks = getServerData().clans[clanId].ranks;
	for(let i in ranks) {
		saveClanRankToDatabase(clanId, i);
	}
}

// ===========================================================================

function saveClanToDatabase(clanId) {
	let tempClanData = getClanData(clanId);

	if(!tempClanData) {
		return false;
	}

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		if(tempClanData.needsSaved) {
			let safeName = escapeDatabaseString(dbConnection, tempClanData.name);
			let safeTag = escapeDatabaseString(dbConnection, tempClanData.tag);
			let safeMOTD = escapeDatabaseString(dbConnection, tempClanData.motd);

			let data = [
				["clan_main", safeName],
				["clan_owner", tempClanData.ownerId],
				["clan_tag", safeTag],
				["clan_motd", safeMOTD],
			];

			let dbQuery = null;
			if(tempClanData.databaseId == 0) {
				let queryString = createDatabaseInsertQuery("clan_main", data);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanData(clanId).databaseId = getDatabaseInsertId(dbConnection);
				getClanData(clanId).needsSaved = false;
			} else {
				let queryString = createDatabaseUpdateQuery("clan_main", data, `clan_id=${tempClanData.databaseId} LIMIT 1`);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanData(clanId).needsSaved = false;
			}

			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);
		}

		saveAllClanRanksToDatabase(clanId);
		return true;
	}

	return false;
}

// ===========================================================================

function saveClanRankToDatabase(clanId, rankId) {
	let tempClanRankData = getClanRankData(clanId, rankId);

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		if(tempClanRankData.needsSaved) {
			let safeName = escapeDatabaseString(dbConnection, tempClanRankData.name);
			let safeTag = escapeDatabaseString(dbConnection, tempClanRankData.customTag);
			//let safeTitle = escapeDatabaseString(dbConnection, tempClanRankData.name);

			let data = [
				["clan_rank_name", safeName],
				["clan_rank_clan", tempClanRankData.clan],
				["clan_rank_custom_tag", safeTag],
				//["clan_rank_title", safeTitle],
				["clan_rank_flags", tempClanRankData.flags],
				["clan_rank_level", tempClanRankData.level],
				["clan_rank_enabled", boolToInt(tempClanRankData.enabled)],
			];

			let dbQuery = null;
			if(tempClanRankData.databaseId == 0) {
				let queryString = createDatabaseInsertQuery("clan_rank", data);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanRankData(clanId, rankId).databaseId = getDatabaseInsertId(dbConnection);
				getClanRankData(clanId, rankId).needsSaved = false;
			} else {
				let queryString = createDatabaseUpdateQuery("clan_rank", data, `clan_rank_id=${tempClanRankData.databaseId} LIMIT 1`);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanRankData(clanId, rankId).needsSaved = false;
			}

			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);
			return true;
		}

	}

	return false;
}

// ===========================================================================

function setClanTag(clanId, tag) {
	getClanData(clanId).tag = tag;
	getClanData(clanId).needsSaved = true;
}

// ===========================================================================

function setClanOwner(clanId, ownerId) {
	getClanData(clanId).ownerId = ownerId;
	getClanData(clanId).needsSaved = true;
}

// ===========================================================================

function setClanRankTag(clanId, rankId, tag) {
	getClanRankData(clanId, rankId).tag = tag;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function setClanRankFlags(clanId, rankId, flags) {
	getClanRankData(clanId, rankId).flags = flags;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function setClanRankTitle(clanId, rankId, title) {
	getClanRankData(clanId, rankId).title = title;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function saveAllClansToDatabase() {
	for(let i in getServerData().clans) {
		saveClanToDatabase(i);
	}
}

// ===========================================================================

function setAllClanDataIndexes() {
	for(let i in getServerData().clans) {
		getServerData().clans[i].index = i;

		for(let j in getServerData().clans[i].ranks) {
			getServerData().clans[i].ranks[j].index = j;
			getServerData().clans[i].ranks[j].clanIndex = i;
		}
	}
}

// ===========================================================================

function arePlayersInSameClan(client1, client2) {
	if(getPlayerClan(client1) == getPlayerClan(client2)) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerClanRank(client) {
	return getPlayerCurrentSubAccount(client).clanRank;
}

// ===========================================================================

function getPlayerClan(client) {
	return getClanIdFromDatabaseId(getPlayerCurrentSubAccount(client).clan);
}

// ===========================================================================

function getClanIdFromDatabaseId(databaseId) {
	for(let i in getServerData().clans) {
		if(getServerData().clans[i].databaseId == databaseId) {
			return i;
		}
	}
}

// ===========================================================================

function getClanRankIdFromDatabaseId(clanId, databaseId) {
	for(let i in getServerData().clans[clanId].ranks) {
		if(getServerData().clans[clanId].ranks[i].databaseId == databaseId) {
			return i;
		}
	}
}

// ===========================================================================

function getClanRankData(clanId, rankId) {
	return getServerData().clans[clanId].ranks[rankId];
}

// ===========================================================================

function getPlayerSubAccountClanRank(client) {
	return getPlayerCurrentSubAccount(client).clanRank;
}

// ===========================================================================

function getPlayerClanRankName(client) {
	if(getPlayerClanRank(client) != 0) {
		let clanId = getPlayerClan(client);
		return getClanRankData(clanId, getClanRankIdFromDatabaseId(clanId, getPlayerCurrentSubAccount(client).clanRank)).name;
	} else {
		return false;
	}
}

// ===========================================================================

function showClanFlagListCommand(command, params, client) {
	let flagList = getServerBitFlagKeys().clanFlagKeys;

	let chunkedList = splitArrayIntoChunks(flagList, 10);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clan Permissions List {clanOrange}=====================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

/*
function showClanFlagListCommand(command, params, client) {
	if(!doesPlayerHaveClanPermission(client, getClanFlagValue("rankFlags"))) {
		messagePlayerError(client, "You can not change a clan rank's permissions!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

let rankId = getClanRankFromParams(clanId, getParam(params, " ", 1));

	if(!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	let tempClanRankData = getClanRankData(clanId, rankId).flags;
	for(let i in tempClanRankData) {
		if(getServerBitFlags().clanFlags.indexOf(tempClanRankData)))
	}
	let flagList = getServerBitFlag().clanFlags;

	let chunkedList = splitArrayIntoChunks(flagList, 10);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clan Permissions List {clanOrange}=====================`);

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}
*/

function getClanFromParams(params) {
	if(isNaN(params)) {
		for(let i in getServerData().clans) {
			if(toLowerCase(getServerData().clans[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().clans[params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getClanRankFromParams(clanId, params) {
	if(isNaN(params)) {
		for(let i in getClanData(clanId).ranks) {
			if((toLowerCase(getClanData(clanId).ranks[i].name).indexOf(toLowerCase(params)) != -1)) {
				return i;
			}
		}
	} else {
		for(let i in getClanData(clanId).ranks) {
			if(getClanData(clanId).ranks[i].level == toInteger(params)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================