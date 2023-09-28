// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: afk.js
// DESC: Provides AFK detection
// TYPE: Client (JavaScript)
// ===========================================================================

function initAFKScript() {
	logToConsole(LOG_DEBUG, "[VRR.AFK]: Initializing AFK script ...");
	logToConsole(LOG_DEBUG, "[VRR.AFK]: AFK script initialized!");
}

// ===========================================================================

function processLostFocusAFK(event) {
	sendServerNewAFKStatus(true);
}

// ===========================================================================

function processFocusAFK(event) {
    sendServerNewAFKStatus(false);
}

// ===========================================================================