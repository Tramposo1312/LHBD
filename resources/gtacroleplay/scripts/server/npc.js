// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: npc.js
// DESC: Provides NPC usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

function initNPCScript() {
	loadNPCsFromDatabase();
	setAllNPCDataIndexes();
}

// ===========================================================================

function getNPCData(ped) {
    return ped.getData("vrr.dataIndex");
}

// ===========================================================================

function createNPCCommand(client, command, params) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let skinId = getSkinModelIndexFromParams(params);

	if(!skinId) {
		messagePlayerError(client, `Invalid skin`);
		return false;
	}

	let position = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), 3);

    let tempNPCData = new NPCData(false);
	tempNPCData.position = position;
	tempNPCData.heading = getPlayerHeading(client);
	tempNPCData.skin = skinId;

	let npcIndex = getServerData().npcs.push(tempNPCData);

	spawnNPC(npcIndex-1);
}

// ===========================================================================

function loadNPCsFromDatabase() {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPCs from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCs = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_main WHERE npc_server = ${getServerId()} AND npc_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCData = new NPCData(dbAssoc);
				tempNPCData.triggers = loadNPCTriggersFromDatabase();
				tempNPCs.push(tempNPCData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCs.length} NPCs loaded from database successfully!`);
	return tempNPCs;
}

// ===========================================================================

function loadNPCTriggersFromDatabase(npcDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC triggers for NPC ${npcDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggers = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_trig WHERE npc_trig_npc = ${npcDatabaseId} AND npc_trig_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerData = new NPCTriggerData(dbAssoc);
				tempNPCTriggerData.conditions = loadNPCTriggerConditionsFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggerData.responses = loadNPCTriggerResponsesFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggers.push(tempNPCTriggerData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggers.length} NPC triggers loaded for NPC ${npcDatabaseId} from database successfully!`);
	return tempNPCTriggers;
}

// ===========================================================================

function loadNPCTriggerConditionsFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger conditions for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerConditions = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_cond WHERE npc_cond_trig = ${npcTriggerDatabaseId} AND npc_cond_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerConditionData = new NPCTriggerConditionData(dbAssoc);
				tempNPCTriggerConditions.push(tempNPCTriggerConditionData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerConditions.length} conditions loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerConditions;
}

// ===========================================================================

function loadNPCTriggerResponsesFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger responses for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerResponses = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_resp WHERE npc_resp_trig = ${npcTriggerDatabaseId} AND npc_resp_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerResponseData = new NPCTriggerResponseData(dbAssoc);
				tempNPCTriggerResponses.push(tempNPCTriggerResponseData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerResponses.length} responses loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerResponses;
}

// ===========================================================================

function saveAllNPCsToDatabase() {
	for(let i in getServerData().npcs) {
		saveNPCToDatabase(i);
	}
}

// ===========================================================================

function saveNPCToDatabase() {

}

// ===========================================================================

function setAllNPCDataIndexes() {
	for(let i in getServerData().npcs) {
		getServerData().npcs[i].index = i;

		for(let j in getServerData().npcs[i].triggers) {
			getServerData().npcs[i].triggers[j].index = j;
			getServerData().npcs[i].triggers[j].npcIndex = i;

			for(let k in getServerData().npcs[i].triggers[j].conditions) {
				getServerData().npcs[i].triggers[j].conditions[k].index = k;
				getServerData().npcs[i].triggers[j].conditions[m].triggerIndex = j;
			}

			for(let m in getServerData().npcs[i].triggers[j].responses) {
				getServerData().npcs[i].triggers[j].responses[m].index = m;
				getServerData().npcs[i].triggers[j].responses[m].triggerIndex = j;
			}
		}
	}
}

// ===========================================================================

function spawnNPC(npcIndex) {
	let civilian = createGameCivilian(getNPCData(npcIndex).model, getNPCData(npcIndex).spawnPosition, getNPCData(npcIndex).spawnRotation);
	if(civilian) {
		civilian.setData("vrr.dataIndex", npcIndex);
	}
}

// ===========================================================================