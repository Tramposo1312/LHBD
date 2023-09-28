// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Client (JavaScript)
// ===========================================================================

function initEventScript() {
    logToConsole(LOG_DEBUG, "[VRR.Event]: Initializing event script ...");
    addCustomEvents();
    addAllEventHandlers();
    logToConsole(LOG_DEBUG, "[VRR.Event]: Event script initialized!");
}

// ===========================================================================

function addCustomEvents() {
    addEvent("OnLocalPlayerEnterSphere", 1);
    addEvent("OnLocalPlayerExitSphere", 1);
    addEvent("OnLocalPlayerEnteredVehicle", 1);
    addEvent("OnLocalPlayerExitedVehicle", 1);
    addEvent("OnLocalPlayerSwitchWeapon", 2);
}

// ===========================================================================

function addAllEventHandlers() {
    bindEventHandler("OnResourceStart", thisResource, onResourceStart);
    bindEventHandler("OnResourceReady", thisResource, onResourceReady);
    bindEventHandler("OnResourceStop", thisResource, onResourceStop);

    addEventHandler("OnProcess", onProcess);
    addEventHandler("OnKeyUp", onKeyUp);
    addEventHandler("OnDrawnHUD", onDrawnHUD);

    addEventHandler("OnPedWasted", onPedWasted);

    addEventHandler("OnElementStreamIn", onElementStreamIn);

    addEventHandler("OnLocalPlayerEnteredVehicle", onLocalPlayerEnteredVehicle);
    addEventHandler("OnLocalPlayerExitedVehicle", onLocalPlayerExitedVehicle);
    addEventHandler("OnLocalPlayerEnterSphere", onLocalPlayerEnterSphere);
    addEventHandler("OnLocalPlayerExitSphere", onLocalPlayerExitSphere);
    addEventHandler("OnLocalPlayerSwitchWeapon", onLocalPlayerSwitchWeapon);

    addEventHandler("OnPedInflictDamage", onPedInflictDamage);

    addEventHandler("OnLostFocus", onLostFocus);
    addEventHandler("OnFocus", onFocus);

    addEventHandler("OnCameraProcess", onCameraProcess);
}

// ===========================================================================

function onResourceStart(event, resource) {
    sendResourceStartedSignalToServer();
    setUpInitialGame();
    garbageCollectorInterval = setInterval(collectAllGarbage, 1000*60);
}

// ===========================================================================

function onResourceStop(event, resource) {
    sendResourceStoppedSignalToServer();
}

// ===========================================================================

function onResourceReady(event, resource) {
    sendResourceReadySignalToServer();
}

// ===========================================================================

function onProcess(event, deltaTime) {
    if(localPlayer == null) {
        return false;
    }

    if(!isSpawned) {
        return false;
    }

    processSync();
    processLocalPlayerControlState();
    processLocalPlayerVehicleControlState();
    processLocalPlayerSphereEntryExitHandling();
    processLocalPlayerVehicleEntryExitHandling();
    processJobRouteSphere();
    forceLocalPlayerEquippedWeaponItem();
    processWantedLevelReset();
    processGameSpecifics();
    processNearbyPickups();
    processVehiclePurchasing();
}

// ===========================================================================

function onKeyUp(event, keyCode, scanCode, keyModifiers) {
    processSkinSelectKeyPress(keyCode);
    //processKeyDuringAnimation();
    processGUIKeyPress(keyCode);
    processToggleGUIKeyPress(keyCode);
}

// ===========================================================================

function onDrawnHUD(event) {
    if(!renderHUD) {
        return false;
    }

    if(localPlayer == null) {
        return false;
    }

    processSmallGameMessageRendering();
    processScoreBoardRendering();
    processLabelRendering();
    processLogoRendering();
    processItemActionRendering();
    processSkinSelectRendering();
    processNameTagRendering();
    processInteriorLightsRendering();
}

// ===========================================================================

function onPedWasted(event, wastedPed, killerPed, weapon, pedPiece) {
    logToConsole(LOG_DEBUG, `[VRR.Event] Ped ${wastedPed.name} died`);
    wastedPed.clearWeapons();
}

// ===========================================================================

function onElementStreamIn(event, element) {
    syncElementProperties(element);
}

// ===========================================================================

function onLocalPlayerExitedVehicle(event, vehicle, seat) {
    logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited vehicle`);
    if(areServerElementsSupported()) {
        sendNetworkEventToServer("vrr.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);
    }

    if(inVehicleSeat) {
        parkedVehiclePosition = false;
        parkedVehicleHeading = false;
    }
}

// ===========================================================================

function onLocalPlayerEnteredVehicle(event, vehicle, seat) {
    logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered vehicle`);

    if(areServerElementsSupported()) {
        sendNetworkEventToServer("vrr.onPlayerEnterVehicle", getVehicleForNetworkEvent(vehicle), seat);

        if(inVehicleSeat == 0) {
            if(inVehicle.owner != -1) {
                inVehicle.engine = false;
                if(!inVehicle.engine) {
                    parkedVehiclePosition = inVehicle.position;
                    parkedVehicleHeading = inVehicle.heading;
                }
            }
        }
    }
}

// ===========================================================================

function onPedInflictDamage(event, damagedEntity, damagerEntity, weaponId, healthLoss, pedPiece) {
    //let damagerEntityString = (!isNull(damagedEntity)) ? `${damagerEntity.name} (${damagerEntity.name}, ${damagerEntity.type} - ${typeof damagerEntity})` : `Unknown ped`;
    //let damagedEntityString = (!isNull(damagedEntity)) ? `${damagedEntity.name} (${damagedEntity.name}, ${damagedEntity.type} - ${typeof damagedEntity})` : `Unknown ped`;
    //logToConsole(LOG_DEBUG, `[VRR.Event] ${damagerEntityString} damaged ${damagedEntityString}'s '${pedPiece} with weapon ${weaponId}`);
    if(!isNull(damagedEntity) && !isNull(damagerEntity)) {
        if(damagedEntity.isType(ELEMENT_PLAYER)) {
            if(damagedEntity == localPlayer) {
                //if(!weaponDamageEnabled[damagerEntity.name]) {
                    event.preventDefault();
                    sendNetworkEventToServer("vrr.weaponDamage", damagerEntity.name, weaponId, pedPiece, healthLoss);
                //}
            }
        }
    }
}

// ===========================================================================

function onLocalPlayerEnterSphere(event, sphere) {
    logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered sphere`);
    if(sphere == jobRouteStopSphere) {
        enteredJobRouteSphere();
    }
}

// ===========================================================================

function onLocalPlayerExitSphere(event, sphere) {
    logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited sphere`);
}

// ===========================================================================

function onLostFocus(event) {
    processLostFocusAFK();
}

// ===========================================================================

function onFocus(event) {
    processFocusAFK();
}

// ===========================================================================

function onLocalPlayerSwitchWeapon(oldWeapon, newWeapon) {
}

// ===========================================================================

function onCameraProcess(event) {
}

// ===========================================================================