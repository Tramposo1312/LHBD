// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: client.js
// DESC: Provides client communication and cross-endpoint operations
// TYPE: Server (JavaScript)
// ===========================================================================

function initClientScript() {
    logToConsole(LOG_DEBUG, "[VRR.Client]: Initializing client script ...");
    addAllNetworkHandlers();
    logToConsole(LOG_DEBUG, "[VRR.Client]: Client script initialized!");
}

// ===========================================================================

function addAllNetworkHandlers() {
    logToConsole(LOG_DEBUG, "[VRR.Client]: Adding network handlers ...");

    // KeyBind
    addNetworkEventHandler("vrr.useKeyBind", playerUsedKeyBind);

    // GUI
    addNetworkEventHandler("vrr.promptAnswerNo", playerPromptAnswerNo);
    addNetworkEventHandler("vrr.promptAnswerYes", playerPromptAnswerYes);
    addNetworkEventHandler("vrr.toggleGUI", playerToggledGUI);
    addNetworkEventHandler("vrr.2fa", checkPlayerTwoFactorAuthentication);

    // AFK
    addNetworkEventHandler("vrr.afk", playerChangeAFKState);

    // Event
    addNetworkEventHandler("vrr.pickup", onPlayerNearPickup);
    addNetworkEventHandler("vrr.enteredSphere", onPlayerEnteredSphere);
    addNetworkEventHandler("vrr.exitedSphere", onPlayerExitedSphere);
    addNetworkEventHandler("vrr.playerDeath", onPlayerDeath);
    addNetworkEventHandler("vrr.onPlayerEnterVehicle", onPlayerEnteredVehicle);
    addNetworkEventHandler("vrr.onPlayerExitVehicle", onPlayerExitedVehicle);

    // Job
    addNetworkEventHandler("vrr.arrivedAtJobRouteStop", playerArrivedAtJobRouteStop);

    // Client
    addNetworkEventHandler("vrr.clientReady", playerClientReady);
    addNetworkEventHandler("vrr.guiReady", playerGUIReady);
    addNetworkEventHandler("vrr.clientStarted", playerClientStarted);
    addNetworkEventHandler("vrr.clientStopped", playerClientStopped);

    // Account
    addNetworkEventHandler("vrr.checkLogin", checkLogin);
    addNetworkEventHandler("vrr.checkRegistration", checkRegistration);
    addNetworkEventHandler("vrr.checkResetPassword", checkAccountResetPasswordRequest);
    addNetworkEventHandler("vrr.checkChangePassword", checkAccountChangePassword);

    // Developer
    addNetworkEventHandler("vrr.runCodeSuccess", clientRunCodeSuccess);
    addNetworkEventHandler("vrr.runCodeFail", clientRunCodeFail);

    // SubAccount
    addNetworkEventHandler("vrr.checkNewCharacter", checkNewCharacter);
    addNetworkEventHandler("vrr.nextCharacter", checkNextCharacter);
    addNetworkEventHandler("vrr.previousCharacter", checkPreviousCharacter);
    addNetworkEventHandler("vrr.selectCharacter", selectCharacter);

    // Item
    addNetworkEventHandler("vrr.itemActionDelayComplete", playerItemActionDelayComplete);

    addNetworkEventHandler("vrr.weaponDamage", playerDamagedByPlayer);

    addNetworkEventHandler("vrr.player.position", updatePositionInPlayerData);
    addNetworkEventHandler("vrr.player.heading", updateHeadingInPlayerData);
    addNetworkEventHandler("vrr.player.lookat", setPlayerHeadLookPosition);

    addNetworkEventHandler("vrr.skinSelected", playerFinishedSkinSelection);

    addNetworkEventHandler("vrr.clientInfo", updateConnectionLogOnClientInfoReceive);
}

// ===========================================================================

function updatePlayerNameTag(client) {
    //logToConsole(LOG_DEBUG, `[VRR.Client] Sending ${getPlayerDisplayForConsole(client)}'s updated nametag to all players`);
	sendNetworkEventToPlayer("vrr.nametag", null, getPlayerName(client), getPlayerNameForNameTag(client), getPlayerColour(client), false, client.ping);
}

// ===========================================================================

function updateAllPlayerNameTags() {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending updated nametags to all players`);
    let clients = getClients();
	for(let i in clients) {
        updatePlayerNameTag(clients[i]);
    }
}

// ===========================================================================

function updatePlayerPing(client) {
    //logToConsole(LOG_DEBUG, `[VRR.Client] Sending ${getPlayerDisplayForConsole(client)}'s ping to all players`);
	sendNetworkEventToPlayer("vrr.ping", null, getPlayerName(client), client.ping);
}

// ===========================================================================

function playerClientReady(client) {
	setEntityData(client, "vrr.isReady", true, false);
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources are downloaded and ready!`);
	if(client.getData("vrr.isStarted") == true) {
		initClient(client);
	}
}

// ===========================================================================

function playerGUIReady(client) {
	setEntityData(client, "vrr.guiReady", true, false);
    logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client GUI is initialized and ready!`);
}

// ===========================================================================

function playerClientStarted(client) {
	setEntityData(client, "vrr.isStarted", true, false);
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources are started and running!`);
	if(client.getData("vrr.isReady") == true) {
		initClient(client);
	}
}

// ===========================================================================

function playerClientStopped(client) {
    logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources have stopped (possibly error?). Kicking them from the server ...`);
	client.disconnect();
}

// ===========================================================================

function showGameMessage(client, text, colour, duration) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Showing game message to ${getPlayerDisplayForConsole(client)} (${text}) for ${duration} milliseconds`);
    sendNetworkEventToPlayer("vrr.smallGameMessage", client, text, colour, duration);
}

// ===========================================================================

function enableCityAmbienceForPlayer(client, clearElements = false) {
    //if(server.getCVar("civilians") == false) {
    //    return false;
    //}

    //logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
    //sendNetworkEventToPlayer("vrr.ambience", client, true);
}

// ===========================================================================

function disableCityAmbienceForPlayer(client, clearElements = false) {
    //if(server.getCVar("civilians") == true) {
    //    return false;
    //}

    //logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
    //sendNetworkEventToPlayer("vrr.ambience", client, false, clearElements);
}

// ===========================================================================

function clearPlayerOwnedPeds(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Clearing peds owned by ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.clearPeds", client);
}

// ===========================================================================

function updatePlayerSpawnedState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s spawned state ${toUpperCase(getOnOffFromBool(state))}`);
    getPlayerData(client).spawned = true;
    sendNetworkEventToPlayer("vrr.spawned", client, state);
}

// ===========================================================================

function setPlayerControlState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s control state ${toUpperCase(getOnOffFromBool(state))}`);
    sendNetworkEventToPlayer("vrr.control", client, state, !state);
}

// ===========================================================================

function updatePlayerShowLogoState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s logo state ${toUpperCase(getOnOffFromBool(state))}`);
    sendNetworkEventToPlayer("vrr.logo", client, state);
}

// ===========================================================================

function restorePlayerCamera(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Restoring ${getPlayerDisplayForConsole(client)}'s camera`);
    sendNetworkEventToPlayer("vrr.restoreCamera", client);
}

// ===========================================================================

function setPlayer2DRendering(client, hudState = false, labelState = false, smallGameMessageState = false, scoreboardState = false, hotBarState = false, itemActionDelayState = false) {
	sendNetworkEventToPlayer("vrr.set2DRendering", client, hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState);
}

// ===========================================================================

function syncPlayerProperties(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to sync ${getPlayerDisplayForConsole(client)}'s player ped properties`);
    sendNetworkEventToPlayer("vrr.player.sync", null, client.player);
}

// ===========================================================================

function updatePlayerSnowState(client) {
    if(isSnowSupported(getServerGame())) {
        logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s snow state (Falling: ${toUpperCase(getOnOffFromBool(getServerConfig().fallingSnow))}, Ground: ${toUpperCase(getOnOffFromBool(getServerConfig().groundSnow))})`);
        sendNetworkEventToPlayer("vrr.snow", client, getServerConfig().fallingSnow, getServerConfig().groundSnow);
    }
}

// ===========================================================================

function sendExcludedModelsForGroundSnowToPlayer(client) {
    if(getGameConfig().excludedGroundSnowModels[getServerGame()].length > 0) {
        for(let i in getGameConfig().excludedGroundSnowModels[getServerGame()]) {
            logToConsole(LOG_DEBUG, `[VRR.Misc] Sending excluded model ${i} for ground snow to ${getPlayerName(client)}`);
            sendNetworkEventToPlayer("vrr.excludeGroundSnow", client, getGameConfig().excludedGroundSnowModels[getServerGame()][i]);
        }
    }
}

// ===========================================================================

function sendRemovedWorldObjectsToPlayer(client) {
    if(getGameConfig().removedWorldObjects[getServerGame()].length > 0) {
        for(let i in getGameConfig().removedWorldObjects[getServerGame()]) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Sending removed world object ${i} (${getGameConfig().removedWorldObjects[getServerGame()][i][0]}) to ${getPlayerName(client)}`);
            sendNetworkEventToPlayer("vrr.removeWorldObject", client, getGameConfig().removedWorldObjects[getServerGame()][i][0], getGameConfig().removedWorldObjects[getServerGame()][i][1], getGameConfig().removedWorldObjects[getServerGame()][i][2]);
        }
    }
	return true;
}

// ===========================================================================

function updatePlayerHotBar(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending updated hotbar data to ${getPlayerDisplayForConsole(client)}`);
    let tempHotBarItems = [];
    for(let i in getPlayerData(client).hotBarItems) {
        let itemImage = "";
        let itemValue = 0;
        let itemExists = false;
        if(getPlayerData(client).hotBarItems[i] != -1) {
            if(getItemData(getPlayerData(client).hotBarItems[i])) {
                let itemData = getItemData(getPlayerData(client).hotBarItems[i]);
                let itemTypeData = getItemTypeData(itemData.itemTypeIndex);
                itemExists = true;
                itemImage = itemTypeData.hotbarImage;
                itemValue = itemData.value;
            }
        }
        tempHotBarItems.push([i, itemExists, itemImage, itemValue]);
    }
    sendNetworkEventToPlayer("vrr.hotbar", client, getPlayerData(client).activeHotBarSlot, tempHotBarItems);
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending weapon damage state for ${getPlayerDisplayForConsole(client)} to all players`);
    sendNetworkEventToPlayer("vrr.weaponDamageEnabled", null, getPlayerName(client), state);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(client, eventType) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending weapon damage event (${eventType}) for ${getPlayerDisplayForConsole(client)} to all players`);
    sendNetworkEventToPlayer("vrr.weaponDamageEvent", null, getPlayerName(client), eventType);
    getPlayerData(client).weaponDamageEvent = eventType;
}

// ===========================================================================

function sendJobRouteStopToPlayer(client, position, colour) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending job route stop data to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showJobRouteStop", client, position, colour);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending change password GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.changePassword", client);
}

// ===========================================================================

function showPlayerLoginSuccessGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending login success GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.loginSuccess", client);
}

// ===========================================================================

function showPlayerLoginFailedGUI(client, errorMessage) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending login failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.loginFailed", client, errorMessage);
}

// ===========================================================================

function showPlayerRegistrationSuccessGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending registration success GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.registrationSuccess", client);
}

// ===========================================================================

function showPlayerRegistrationFailedGUI(client, errorMessage) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending registration failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.registrationFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerGUIColours(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending GUI colours to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.guiColour", client, getServerConfig().guiColourPrimary[0], getServerConfig().guiColourPrimary[1], getServerConfig().guiColourPrimary[2], getServerConfig().guiColourSecondary[0], getServerConfig().guiColourSecondary[1], getServerConfig().guiColourSecondary[2], getServerConfig().guiTextColourPrimary[0], getServerConfig().guiTextColourPrimary[1], getServerConfig().guiTextColourPrimary[2]);
}

// ===========================================================================

function sendPlayerGUIInit(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending GUI init signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.guiInit", client);
}

// ===========================================================================

function showPlayerLoginGUI(client, errorMessage = "") {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show login GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showLogin", client);
}

// ===========================================================================

function showPlayerRegistrationGUI(client, errorMessage = "") {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show registration GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showRegistration", client);
}

// ===========================================================================

function showPlayerNewCharacterGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show new character GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showNewCharacter", client);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client, errorMessage = "") {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show change password GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showChangePassword", client);
}

// ===========================================================================

function showPlayerResetPasswordCodeInputGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show reset password GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showResetPasswordCodeInput", client);
}

// ===========================================================================

function showPlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.showCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function updatePlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending update character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.switchCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function showPlayerCharacterSelectSuccessGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select success GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.characterSelectSuccess", client);
}

// ===========================================================================

function showPlayerCharacterSelectFailedGUI(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.characterSelectFailed", client);
}

// ===========================================================================

function showPlayerPromptGUI(client, promptMessage, promptTitle) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show prompt GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${promptTitle}, Message: ${promptMessage})`);
    sendNetworkEventToPlayer("vrr.showPrompt", client, promptMessage, promptTitle);
}

// ===========================================================================

function showPlayerInfoGUI(client, infoMessage, infoTitle) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show info GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${infoTitle}, Message: ${infoMessage})`);
    sendNetworkEventToPlayer("vrr.showInfo", client, infoMessage, infoTitle);
}

// ===========================================================================

function showPlayerErrorGUI(client, errorMessage, errorTitle) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending show error GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${errorTitle}, Message: ${errorMessage})`);
    sendNetworkEventToPlayer("vrr.showInfo", client, errorMessage, errorTitle);
}

// ===========================================================================

function sendRunCodeToClient(client, code, returnTo) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending runcode to ${getPlayerDisplayForConsole(client)} (returnTo: ${getPlayerDisplayForConsole(getClientFromIndex(returnTo))}, Code: ${code})`);
    sendNetworkEventToPlayer("vrr.runCode", client, code, returnTo);
}

// ===========================================================================

function sendPlayerWorkingState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending working state (${toUpperCase(getYesNoFromBool(state))}) to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.working", client, state);
}

// ===========================================================================

function sendPlayerJobType(client, jobType) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending job type (${jobType}) to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.jobType", client, jobType);
}

// ===========================================================================

function sendPlayerStopJobRoute(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to abort job route to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.stopJobRoute", client);
}

// ===========================================================================

function sendPlayerMouseCameraToggle(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.mouseCamera", client);
}

// ===========================================================================

function setPlayerMouseCameraState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.mouseCameraForce", client, state);
}

// ===========================================================================

function sendPlayerMouseCursorToggle(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse cursor ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.mouseCursor", client);
}

// ===========================================================================

function sendAddAccountKeyBindToClient(client, key, keyState) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
    sendNetworkEventToPlayer("vrr.addKeyBind", client, toInteger(key), (keyState) ? KEYSTATE_DOWN : KEYSTATE_UP);
}

// ===========================================================================

function sendClearKeyBindsToClient(client, key, keyState) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
    sendNetworkEventToPlayer("vrr.clearKeyBinds", client);
}

// ===========================================================================

function sendRemoveAccountKeyBindToClient(client, key) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending deleted keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))})`);
    sendNetworkEventToPlayer("vrr.delKeyBind", client, toInteger(key));
}

// ===========================================================================

function sendPlayerSetPosition(client, position) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending set position signal to ${getPlayerDisplayForConsole(client)} (Position: ${position.x}, ${position.y}, ${position.z})`);
    sendNetworkEventToPlayer("vrr.position", client, position);
}

// ===========================================================================

function sendPlayerSetHeading(client, heading) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending set heading signal to ${getPlayerDisplayForConsole(client)} (Heading: ${heading})`);
    sendNetworkEventToPlayer("vrr.heading", client, heading);
}

// ===========================================================================

function sendPlayerSetInterior(client, interior) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending set interior signal to ${getPlayerDisplayForConsole(client)} (Interior: ${interior})`);
    sendNetworkEventToPlayer("vrr.interior", client, interior);
}

// ===========================================================================

function sendPlayerFrozenState(client, state) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending set frozen signal to ${getPlayerDisplayForConsole(client)} (State: ${toUpperCase(getYesNoFromBool(state))})`);
    sendNetworkEventToPlayer("vrr.frozen", client, state);
}

// ===========================================================================

function givePlayerWeapon(client, weaponId, ammo, active = true) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to give weapon (Weapon: ${weaponId}, Ammo: ${ammo})`);
    sendNetworkEventToPlayer("vrr.giveWeapon", client, weaponId, ammo, active);
}

// ===========================================================================

function clearPlayerWeapons(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to clear weapons`);
    sendNetworkEventToPlayer("vrr.clearWeapons", client);
}

// ===========================================================================

function showPlayerNewCharacterFailedGUI(client, errorMessage) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending new character failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.newCharacterFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerRemoveFromVehicle(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Sending remove from vehicle signal to ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.removeFromVehicle", client);
}

// ===========================================================================

function sendChatBoxMessageToPlayer(client, message, colour) {
    sendNetworkEventToPlayer("vrr.m", client, message, colour)
    //messageClient(message, client, colour);
}

// ===========================================================================

function showPlayerItemTakeDelay(client, itemId) {
    if(getItemData(itemId)) {
        let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
        if(delay > 0) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
            sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    }
}

// ===========================================================================

function showPlayerItemUseDelay(client, itemSlot) {
    if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
        let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).useDelay;
        if(delay > 0) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
            sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    }
}

// ===========================================================================

function showPlayerItemDropDelay(client, itemSlot) {
    if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
        let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).dropDelay;
        if(delay > 0) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
            sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    }
}

// ===========================================================================

function showPlayerItemPickupDelay(client, itemId) {
    if(getItemData(itemId)) {
        let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
        if(delay > 0) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
            sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    }
}

// ===========================================================================

function showPlayerItemPutDelay(client, itemSlot) {
    if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
        let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).putDelay;
        if(delay > 0) {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
            sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    }
}

// ===========================================================================

function showPlayerItemSwitchDelay(client, itemSlot) {
    if(itemSlot != -1) {
        if(getPlayerData(client).hotBarItems[itemSlot] != -1) {
            let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).switchDelay;
            if(delay > 0) {
                logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
                sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
            } else{
                logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
                playerItemActionDelayComplete(client);
            }
        } else {
            logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
            playerItemActionDelayComplete(client);
        }
    } else {
        logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
        playerSwitchItem(client, itemSlot);
    }
}

// ===========================================================================

function sendPlayerDrunkEffect(client, amount, duration) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Setting drunk effect for ${getPlayerDisplayForConsole(client)} to ${amount} for ${duration} milliseconds`);
    sendNetworkEventToPlayer("vrr.drunkEffect", client, amount, duration);
}

// ===========================================================================

function sendPlayerClearPedState(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Clearing ped state for ${getPlayerDisplayForConsole(client)}`);
    sendNetworkEventToPlayer("vrr.clearPedState", client);
}

// ===========================================================================

function playerDamagedByPlayer(client, damagerEntityName, weaponId, pedPiece, healthLoss) {
    let damagerEntity = getPlayerFromParams(damagerEntityName);

    if(isNull(damagerEntity)) {
        logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager entity from ID is null`);
        return false;
    }

    logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)} was damaged by ${damagerEntity}`);

    if(isNull(damagerEntity)) {
        logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager client is INVALID`);
        return false;
    }

    if(!getPlayerData(damagerEntity) || !getPlayerData(client)) {
        logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager's client data is INVALID`);
        return false;
    }

    logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager is ${getPlayerDisplayForConsole(damagerEntity)}`);

    switch(getPlayerData(damagerEntity).weaponDamageEvent) {
        case VRR_WEAPON_DAMAGE_EVENT_TAZER:
            logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} is using a tazer`);
            if(!isPlayerTazed(client) && !isPlayerHandCuffed(client) && !isPlayerInAnyVehicle(client)) {
                logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)} was not previously tazed, binded, or in a vehicle. Taze successful`);
                meActionToNearbyPlayers(damagerEntity, `electrifies ${getCharacterFullName(client)} with their tazer`);
                tazePlayer(client);
            }
            break;

        case VRR_WEAPON_DAMAGE_EVENT_EXTINGUISH:
            break;

        case VRR_WEAPON_DAMAGE_EVENT_MACE:
            break;

        case VRR_WEAPON_DAMAGE_EVENT_NORMAL:
            logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss*getPlayerData(client).incomingDamageMultiplier)})`);
            setPlayerHealth(client, getPlayerHealth(client)-(healthLoss*getPlayerData(client).incomingDamageMultiplier));
            break;

        default:
            logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss*getPlayerData(client).incomingDamageMultiplier)})`);
            setPlayerHealth(client, getPlayerHealth(client)-(healthLoss*getPlayerData(client).incomingDamageMultiplier));
            break;
    }
}

// ===========================================================================

function setPlayerCameraLookAt(client, cameraPosition, lookAtPosition) {
	sendNetworkEventToPlayer("vrr.cameraLookAt", client, cameraPosition, lookAtPosition);
}

// ===========================================================================

function sendTimeMinuteDurationToPlayer(client, minuteDuration) {
	sendNetworkEventToPlayer("vrr.minuteDuration", client, minuteDuration);
}

// ===========================================================================

function updatePositionInPlayerData(client, position) {
    getPlayerData(client).syncPosition = position;
}

// ===========================================================================

function updateHeadingInPlayerData(client, heading) {
    getPlayerData(client).syncHeading = heading;
}

// ===========================================================================

function forcePlayerIntoSkinSelect(client) {
    if(getGameConfig().skinChangePosition[getServerGame()].length > 0) {
        getPlayerData(client).returnToPosition = getPlayerPosition(client);
        getPlayerData(client).returnToHeading = getPlayerHeading(client);
        getPlayerData(client).returnToInterior = getPlayerInterior(client);
        getPlayerData(client).returnToDimension = getPlayerDimension(client);
        getPlayerData(client).returnToType = VRR_RETURNTO_TYPE_SKINSELECT;

        setPlayerPosition(client, getGameConfig().skinChangePosition[getServerGame()][0]);
        setPlayerHeading(client, getGameConfig().skinChangePosition[getServerGame()][1]);
        setPlayerInterior(client, getGameConfig().skinChangePosition[getServerGame()][2]);
        setPlayerDimension(client, client.index+500);
    }

    sendNetworkEventToPlayer("vrr.skinSelect", client, true);
}

// ===========================================================================

function updatePlayerCash(client) {
	sendNetworkEventToPlayer("vrr.money", client, getPlayerCurrentSubAccount(client).cash);
}

// ===========================================================================

function sendAllPoliceStationBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].policeStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().policeStations[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].policeStation,
				getServerData().policeStations[getServerGame()][i].position.x,
				getServerData().policeStations[getServerGame()][i].position.y,
				getServerData().policeStations[getServerGame()][i].position.z,
				3,
				getColourByName("policeBlue"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFireStationBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].fireStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().fireStations[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].fireStation,
				getServerData().fireStations[getServerGame()][i].position.x,
				getServerData().fireStations[getServerGame()][i].position.y,
				getServerData().fireStations[getServerGame()][i].position.z,
				3,
				getColourByName("firefighterRed"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllHospitalBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].hospital != -1) {
		let tempBlips = [];
		for(let i in getServerData().hospitals[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].hospital,
				getServerData().hospitals[getServerGame()][i].position.x,
				getServerData().hospitals[getServerGame()][i].position.y,
				getServerData().hospitals[getServerGame()][i].position.z,
				3,
				getColourByName("medicPink"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllAmmunationBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].ammunation != -1) {
		let tempBlips = [];
		for(let i in getServerData().ammunations[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].ammunation,
				getServerData().ammunations[getServerGame()][i].position.x,
				getServerData().ammunations[getServerGame()][i].position.y,
				getServerData().ammunations[getServerGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllPayAndSprayBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].payAndSpray != -1) {
		let tempBlips = [];
		for(let i in getServerData().payAndSprays[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].payAndSpray,
				getServerData().payAndSprays[getServerGame()][i].position.x,
				getServerData().payAndSprays[getServerGame()][i].position.y,
				getServerData().payAndSprays[getServerGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFuelStationBlips(client) {
	if(getGameConfig().blipSprites[getServerGame()].fuelStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().fuelStations[getServerGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getServerGame()].fuelStation,
				getServerData().fuelStations[getServerGame()][i].position.x,
				getServerData().fuelStations[getServerGame()][i].position.y,
				getServerData().fuelStations[getServerGame()][i].position.z,
				3,
				getColourByName("burntOrange"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendPlayerSetHealth(client, health) {
    sendNetworkEventToPlayer("vrr.health", client, health);
}


// ===========================================================================

function sendPlayerSetArmour(client, armour) {
    sendNetworkEventToPlayer("vrr.armour", client, armour);
}

// ===========================================================================

function playerFinishedSkinSelection(client, allowedSkinIndex) {
    sendNetworkEventToPlayer("vrr.skinSelect", client, false);
    if(allowedSkinIndex == -1) {
        messagePlayerAlert(client, "You canceled the skin change.");
        restorePlayerCamera(client);

        if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_SKINSELECT) {
            setPlayerPosition(client, getPlayerData(client).returnToPosition);
            setPlayerHeading(client, getPlayerData(client).returnToHeading);
            setPlayerInterior(client, getPlayerData(client).returnToInterior);
            setPlayerDimension(client, getPlayerData(client).returnToDimension);

            getPlayerData(client).returnToPosition = null;
            getPlayerData(client).returnToHeading = null;
            getPlayerData(client).returnToInterior = null;
            getPlayerData(client).returnToDimension = null;
        }
        return false;
    } else {
        getPlayerCurrentSubAccount(client).skin = getSkinIndexFromModel(allowedSkins[allowedSkinIndex][0]);
        if(isPlayerWorking(client)) {
            messagePlayerAlert(client, "Your new skin has been saved but won't be shown until you stop working.");
            setPlayerSkin(client, getJobData(getPlayerCurrentSubAccount(client).job).uniforms[getPlayerData(client).jobUniform].skinId);
        } else {
            setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
        }

        if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_SKINSELECT) {
            setPlayerPosition(client, getPlayerData(client).returnToPosition);
            setPlayerHeading(client, getPlayerData(client).returnToHeading);
            setPlayerInterior(client, getPlayerData(client).returnToInterior);
            setPlayerDimension(client, getPlayerData(client).returnToDimension);

            getPlayerData(client).returnToPosition = null;
            getPlayerData(client).returnToHeading = null;
            getPlayerData(client).returnToInterior = null;
            getPlayerData(client).returnToDimension = null;
        }

        restorePlayerCamera(client);

        deleteItem(getPlayerData(client).itemActionItem);
        switchPlayerActiveHotBarSlot(client, -1);
        cachePlayerHotBarItems(client);

        meActionToNearbyPlayers(client, `changes their skin to ${allowedSkins[allowedSkinIndex][1]}`);
    }
}

// ===========================================================================

function sendPlayerChatScrollLines(client, amount) {
    sendNetworkEventToPlayer("vrr.chatScrollLines", client, amount);
}

// ===========================================================================

function playRadioStreamForPlayer(client, streamURL, loop = true, volume = 0, element = false) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to stream ${streamURL}`);
    sendNetworkEventToPlayer("vrr.radioStream", client, streamURL, loop, volume, element);
}

// ===========================================================================

function playAudioFileForPlayer(client, audioName, loop = true, volume = 0, element = false) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to play audio ${audioName}`);
    sendNetworkEventToPlayer("vrr.audioFileStream", client, audioName, loop, volume);
}

// ===========================================================================

function stopRadioStreamForPlayer(client) {
    logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to stop their radio stream`);
    sendNetworkEventToPlayer("vrr.stopRadioStream", client);
}

// ===========================================================================

function setPlayerStreamingRadioVolume(client, volumeLevel, elementId = false) {
    getPlayerData(client).accountData.streamingRadioVolume = volumeLevel;
    getPlayerData(client).streamingRadioElement = elementId;
    sendNetworkEventToPlayer("vrr.radioVolume", client, volumeLevel, elementId);
}

// ===========================================================================

function setVehicleLightsState(vehicle, state) {
	setEntityData(vehicle, "vrr.lights", getVehicleData(vehicle).lights);
    sendNetworkEventToPlayer("vrr.veh.lights", null, vehicle.id, state);
}

// ===========================================================================

function sendPlayerEnterPropertyKey(client, key) {
    sendNetworkEventToPlayer("vrr.enterPropertyKey", client, key);
}

// ===========================================================================

function makePedPlayAnimation(ped, animationSlot, positionOffset) {
    let animationData = getAnimationData(animationSlot);
    let freezePlayer = false;
    //if(animationData[9] != VRR_ANIMMOVE_NONE) {
        switch(animationData[9]) {
            case VRR_ANIMMOVE_FORWARD:
                setElementCollisionsEnabled(ped, false);
                setElementPosition(ped, getPosInFrontOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
                freezePlayer = true;
                break;

            case VRR_ANIMMOVE_BACK:
                setElementCollisionsEnabled(ped, false);
                setElementPosition(ped, getPosBehindPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
                freezePlayer = true;
                break;

            case VRR_ANIMMOVE_LEFT:
                setElementCollisionsEnabled(ped, false);
                setElementPosition(ped, getPosToLeftOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
                freezePlayer = true;
                break;

            case VRR_ANIMMOVE_RIGHT:
                setElementCollisionsEnabled(ped, false);
                setElementPosition(ped, getPosToRightOfPos(getElementPosition(ped), fixAngle(getElementHeading(ped)), positionOffset));
                freezePlayer = true;
                break;
        }
    //}
    sendNetworkEventToPlayer("vrr.pedAnim", null, ped.id, animationData[1], animationData[2], animationData[3], animationData[4], animationData[5], positionOffset, freezePlayer);
}

// ===========================================================================

function makePedStopAnimation(ped) {
    sendNetworkEventToPlayer("vrr.pedStopAnim", null, ped.id);
}

// ===========================================================================

function forcePedAnimation(ped, animationSlot) {
    let animationData = getAnimationData(animationSlot);

    sendNetworkEventToPlayer("vrr.forcePedAnim", null, ped.id, animationData[1], animationData[2], animationData[3], animationData[4]);
}

// ===========================================================================

function hideAllPlayerGUI(client) {
    sendNetworkEventToPlayer("vrr.hideAllGUI", client);
}

// ===========================================================================

function setPlayerHeadLookPosition(client, position) {
    if(client.player != null) {
        setEntityData(client.player, "vrr.headLook", position, true);
    }
}

// ===========================================================================

function sendPlayerGameScriptState(client, scriptName, state) {
    sendNetworkEventToPlayer("vrr.gameScript", client, scriptName, state);
}

// ===========================================================================

function requestClientInfo(client) {
    sendNetworkEventToPlayer("vrr.clientInfo", client);
}

// ===========================================================================

function updateInteriorLightsForPlayer(client, state) {
    sendNetworkEventToPlayer("vrr.interiorLights", client, state);
}

// ===========================================================================

function forcePlayerToSyncElementProperties(client, element) {
    sendNetworkEventToPlayer("vrr.syncElement", client, element.id);
}

// ===========================================================================

function sendPlayerPedPartsAndProps(client) {
    sendNetworkEventToPlayer("vrr.ped")
}

// ===========================================================================

function setPlayerVanillaRadioStation(client, radioStationId) {
    sendNetworkEventToPlayer("vrr.vanillaRadio", client, radioStationId);
    return true;
}

// ===========================================================================

function forcePlayerWantedLevel(client, wantedLevel) {
    sendNetworkEventToPlayer("vrr.wantedLevel", client, wantedLevel);
    return true;
}

// ===========================================================================

function onPlayerNearPickup(client, pickupId) {
    getPlayerData(client).currentPickup = getElementFromId(pickupId);
}

// ===========================================================================

function updateAllInteriorVehiclesForPlayer(client, interior, dimension) {
    for(let i in getServerData().vehicles) {
        if(getServerData().vehicles[i].vehicle != false) {
            if(getServerData().vehicles[i].interior == interior && getServerData().vehicles[i].dimension == dimension) {
                forcePlayerToSyncElementProperties(client, getServerData().vehicles[i].vehicle);
            }
        }
    }
}

// ===========================================================================

function setPlayerBuyingVehicleState(state, vehicle, position) {

}

// ===========================================================================

function sendPlayerLogLevel(client, tempLogLevel = logLevel) {
    sendNetworkEventToPlayer("vrr.logLevel", client, tempLogLevel);
}

// ===========================================================================