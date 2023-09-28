// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let localPlayerJobType = 0;
let localPlayerWorking = false;
let jobRouteStopBlip = null;
let jobRouteStopSphere = null;

// ===========================================================================

function initJobScript() {
	logToConsole(LOG_DEBUG, "[VRR.Job]: Initializing job script ...");
	logToConsole(LOG_DEBUG, "[VRR.Job]: Job script initialized!");
}

// ===========================================================================

function setLocalPlayerJobType(tempJobType) {
    logToConsole(LOG_DEBUG, `[VRR.Main] Set local player job type to ${tempJobType}`);
    localPlayerJobType = tempJobType;
}

// ===========================================================================

function setLocalPlayerWorkingState(tempWorking) {
    logToConsole(LOG_DEBUG, `[VRR.Main] Setting working state to ${tempWorking}`);
    localPlayerWorking = tempWorking;
}

// ===========================================================================

function showJobRouteStop(position, colour) {
    logToConsole(LOG_DEBUG, `[VRR.Job] Showing route stop`);
    if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
        if(game.game == VRR_GAME_GTA_SA) {
            jobRouteStopSphere = game.createPickup(1318, position, 1);
        } else {
            jobRouteStopSphere = game.createSphere(position, 3);
            jobRouteStopSphere.colour = colour;
        }

        if(jobRouteStopBlip != null) {
            destroyElement(jobRouteStopBlip);
        }

        blinkJobRouteStopBlip(10, position, colour);
    }
}

// ===========================================================================

function enteredJobRouteSphere() {
    logToConsole(LOG_DEBUG, `[VRR.Job] Entered job route sphere`);
    tellServerPlayerArrivedAtJobRouteStop();
    destroyElement(jobRouteStopSphere);
    destroyElement(jobRouteStopBlip);
    jobRouteStopSphere = null;
    jobRouteStopBlip = null;
}

// ===========================================================================

function blinkJobRouteStopBlip(times, position, colour) {
    for(let i = 1 ; i <= times ; i++) {
        setTimeout(function() {
            if(jobRouteStopBlip != null) {
                destroyElement(jobRouteStopBlip);
                jobRouteStopBlip = null;
            } else {
                jobRouteStopBlip = game.createBlip(position, 0, 2, colour);
            }
        }, 500*i);
    }

    setTimeout(function() {
        jobRouteStopBlip = game.createBlip(position, 0, 2, colour);
    }, 500*times+1);
}