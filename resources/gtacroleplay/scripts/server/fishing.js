// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: fishing.js
// DESC: Provides fishing functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

let fishingLocations = [
    false,
    [
        // GTA III

    ],
    [
        // GTA Vice City

    ],
    [   // GTA San Andreas
        toVector3(403.8266, -2088.7598, 7.8359),
        toVector3(398.7553, -2088.7490, 7.8359),
        toVector3(396.2197,-2088.6692,7.8359),
        toVector3(391.1094,-2088.7976,7.8359),
        toVector3(383.4157,-2088.7849,7.8359),
        toVector3(374.9598,-2088.7979,7.8359),
        toVector3(369.8107,-2088.7927,7.8359),
        toVector3(367.3637,-2088.7925,7.8359),
        toVector3(362.2244,-2088.7981,7.8359),
        toVector3(354.5382,-2088.7979,7.8359),
    ],
    false,
    [
        // GTA IV

    ],
];

// ===========================================================================

let fishingCatchables = [
    // Fish
    ["Salmon", 0, 500, 1, 15],
    ["Tuna", 0, 700, 1, 15],
    ["Crab", 0, 200, 1, 5],
    ["Trout", 0, 250, 1, 15],
    ["Sea Bass", 0, 550, 1, 8],
    ["Shark", 0, 150, 1, 15],
    ["Turtle", 0, 50, 1, 25],
    ["Manta Ray", 0, 250, 1, 25],
    ["Cat Fish", 0, 350, 1, 5],
    ["Blue Marlin", 0, 450, 1, 5],

    // Junk
    ["Can", 0, 0, 0, 0],
    ["Pants", 0, 0, 0, 0],
    ["Shoes", 0, 0, 0, 0],
    ["Garbage", 0, 0, 0, 0],
    ["Baby Diaper", 0, 0, 0, 0],
    ["Tire", 0, 0, 0, 0],
    ["Car Battery", 0, 0, 0, 0],
    ["Horse Hoove", 0, 0, 0, 0],
    ["Log", 0, 0, 0, 0],
    ["Soggy Dildo", 0, 0, 0, 0],
];

// ===========================================================================

function initFishingScript() {
	logToConsole(LOG_INFO, "[VRR.Fishing]: Initializing fishing script ...");
	logToConsole(LOG_INFO, "[VRR.Fishing]: Fishing script initialized successfully!");
}

// ===========================================================================