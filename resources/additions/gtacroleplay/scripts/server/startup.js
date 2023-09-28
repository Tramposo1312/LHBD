// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: startup.js
// DESC: Provides startup/shutdown procedures
// TYPE: Server (JavaScript)
// ===========================================================================

function initServerScripts() {
	checkForAllRequiredModules();

	initClassScript();
	initDatabaseScript();
	initConfigScript();
	initEmailScript();
	initBitFlagScript();
	initItemScript();
	initBusinessScript();
	initClanScript();
	initHouseScript();
	initChatScript();
	initStaffScript();
	initAccountScript();
	initSubAccountScript();
	initChatScript();
	initJobScript();
	initVehicleScript();
	initDeveloperScript();
	initKeyBindScript();
	initEventScript();
	initAntiCheatScript();
	initClientScript();
	initMessagingScript();
	initHelpScript();
	initFishingScript();
	initGUIScript();
	initEconomyScript();
	initRadioScript();
	initLocaleScript();

	initCommandScript();
	initTimers();

	serverStartTime = getCurrentUnixTimestamp();

	initAllClients();
}

// ===========================================================================

function checkForHashingModule() {
	if(typeof module.hashing == "undefined") {
		return false;
	}
	return true;
}

// ===========================================================================

function checkForMySQLModule() {
	if(typeof module.mysql == "undefined") {
		return false;
	}

	return true;
}

// ===========================================================================

function checkForSMTPModule() {
	if(typeof module.smtp == "undefined") {
		return false;
	}

	return true;
}

// ===========================================================================

function checkForAllRequiredModules() {
	logToConsole(LOG_DEBUG, "[VRR.Startup]: Checking for required modules ...");

	if(!checkForHashingModule()) {
		console.warn("[VRR.Startup]: Hashing module is not loaded!");
		console.warn("[VRR.Startup]: This resource will now shutdown.");
		thisResource.stop();
	}

	if(!checkForMySQLModule()) {
		console.warn("[VRR.Startup]: MySQL module is not loaded!");
		console.warn("[VRR.Startup]: This resource will now shutdown.");
		thisResource.stop();
	}

	if(!checkForSMTPModule()) {
		console.warn("[VRR.Startup]: SMTP Email module is not loaded!");
		console.warn("[VRR.Startup]: Email features will NOT be available!");
	}

	logToConsole(LOG_DEBUG, "[VRR.Startup]: All required modules loaded!");
	return true;
}

// ===========================================================================

initServerScripts();

// ===========================================================================