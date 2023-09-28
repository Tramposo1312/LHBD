// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: core.js
// DESC: Provides core data structures, function, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

let scriptVersion = "1.0";
let serverStartTime = 0;
let logLevel = LOG_ERROR|LOG_WARN|LOG_INFO;

// ===========================================================================

let serverData = {
	vehicles: [],
	clients: new Array(128),
	businesses: [],
	houses: [],
	commands: {},
	groundItemCache: [],
	groundPlantCache: [],
	items: [],
	itemTypes: [],
	clans: [],
	antiCheat: {
		whiteListedGameScripts: [],
		blackListedGameScripts: [],
	},
	localeStrings: {},
};

// ===========================================================================

// Pre-cache allowed skins
let allowedSkins = getAllowedSkins(getGame());

// ===========================================================================

function initServerData() {
}

// ===========================================================================

function getServerData() {
	return serverData;
}

// ===========================================================================

function getModNatives() {
	return modNatives;
}

// ===========================================================================