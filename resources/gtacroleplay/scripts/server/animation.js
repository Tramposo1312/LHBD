// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: animation.js
// DESC: Provides animation functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initAnimationScript() {
	logToConsole(LOG_DEBUG, "[VRR.Animation]: Initializing animation script ...");
	logToConsole(LOG_DEBUG, "[VRR.Animation]: Animation script initialized!");
}

// ===========================================================================

function playPlayerAnimationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

let animationSlot = getAnimationFromParams(getParam(params, " ", 1));
    let animationPositionOffset = 1;

	if(!animationSlot) {
		messagePlayerError(client, getLocaleString(client, "AnimationNotFound"));
		messagePlayerInfo(client, getLocaleString(client, "AnimationHelpTip"), `{ALTCOLOUR}/animlist{MAINCOLOUR}`);
		return false;
	}

	if(toInteger(animationPositionOffset) < 0 || toInteger(animationPositionOffset) > 3) {
		messagePlayerError(client, getLocaleString(client, "AnimationInvalidDistance"));
		return false;
	}

	if(getAnimationData(animationSlot)[3] == VRR_ANIMTYPE_SURRENDER) {
		getPlayerData(client).pedState = VRR_PEDSTATE_HANDSUP;
	}

	if(isPlayerHandCuffed(client) || isPlayerTazed(client) || isPlayerInForcedAnimation(client)) {
		messagePlayerError(client, `You aren't able to do that`);
		return false;
	}

	messagePlayerTip(client, getLocaleString(client, "AnimationStopCommandTip", "{ALTCOLOUR}/stopanim{MAINCOLOUR}"));
	makePlayerPlayAnimation(client, animationSlot, animationPositionOffset);
}

// ===========================================================================

function stopPlayerAnimationCommand(command, params, client) {
	if(isPlayerHandCuffed(client) || isPlayerTazed(client) || isPlayerInForcedAnimation(client)) {
		messagePlayerError(client, `You aren't able to do that`);
		return false;
	}

	setPlayerPosition(client, getPlayerData(client).currentAnimationPositionReturnTo);
	makePedStopAnimation(getPlayerData(client).ped);

	getPlayerData(client).currentAnimation = -1;
	getPlayerData(client).currentAnimationPositionOffset = false;
	getPlayerData(client).currentAnimationPositionReturnTo = false;
    getPlayerData(client).animationStart = 0;
	getPlayerData(client).animationForced = false;

	setPlayerMouseCameraState(client, false);
}

// ===========================================================================

function showAnimationListCommand(command, params, client) {
	let animList = getGameData().animations[getServerGame()].map(function(x) { return x[0]; });

	let chunkedList = splitArrayIntoChunks(animList, 10);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAnimationsList")));

	for(let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getAnimationData(animationSlot, gameId = getServerGame()) {
    return getGameData().animations[gameId][animationSlot];
}

// ===========================================================================

function isPlayerInForcedAnimation(client) {
	return getPlayerData(client).animationForced;
}

// ===========================================================================

function makePlayerPlayAnimation(client, animationSlot, offsetPosition = 1) {
    getPlayerData(client).currentAnimation = animationSlot;
	getPlayerData(client).currentAnimationPositionOffset = offsetPosition;
	getPlayerData(client).currentAnimationPositionReturnTo = getPlayerPosition(client);
    getPlayerData(client).animationStart = getCurrentUnixTimestamp();
	getPlayerData(client).animationForced = false;

    makePedPlayAnimation(getPlayerData(client).ped, animationSlot, offsetPosition);

	if(getAnimationData(animationSlot)[9] != VRR_ANIMMOVE_NONE) {
		if(getGame() < VRR_GAME_GTA_SA) {
			setPlayerMouseCameraState(client, true);
		}
	}
}

// ===========================================================================

function forcePlayerPlayAnimation(client, animationSlot, offsetPosition = 1) {
    getPlayerData(client).currentAnimation = animationSlot;
	getPlayerData(client).currentAnimationPositionOffset = offsetPosition;
	getPlayerData(client).currentAnimationPositionReturnTo = getPlayerPosition(client);
    getPlayerData(client).animationStart = getCurrentUnixTimestamp();
	getPlayerData(client).animationForced = true;

	setPlayerControlState(client, false);
   	forcePedAnimation(getPlayerData(client).ped, animationSlot, offsetPosition);
}

// ===========================================================================

function makePlayerStopAnimation(client) {
	//setPlayerPosition(client, getPlayerData(client).currentAnimationPositionReturnTo);
	makePedStopAnimation(getPlayerData(client).ped);

	getPlayerData(client).currentAnimation = -1;
	getPlayerData(client).currentAnimationPositionOffset = false;
	getPlayerData(client).currentAnimationPositionReturnTo = false;
    getPlayerData(client).animationStart = 0;
	getPlayerData(client).animationForced = false;
}

// ===========================================================================

function getAnimationFromParams(params) {
	if(isNaN(params)) {
		for(let i in getGameData().animations[getServerGame()]) {
			if(toLowerCase(getGameData().animations[getServerGame()][i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameData().animations[getServerGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================