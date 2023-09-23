// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: animation.js
// DESC: Provides animation functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function initAnimationScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Animation]: Initializing animation script ...");
	logToConsole(LOG_DEBUG, "[V.RP.Animation]: Animation script initialized!");
}

// ===========================================================================

function makePedPlayAnimation(pedId, animationSlot, positionOffset) {
	let ped = getElementFromId(pedId);

	if (ped == null) {
		return false;
	}

	let animationData = getAnimationData(animationSlot);
	logToConsole(LOG_DEBUG, `[AGRP.Animation] Playing animation ${animationData[0]} for ped ${pedId}`);

	let freezePlayer = false;
	switch (animationData.moveType) {
		case V_ANIMMOVE_FORWARD: {
			setElementCollisionsEnabled(pedId, false);
			if (ped.isSyncer) {
				setElementPosition(ped, getPosInFrontOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case V_ANIMMOVE_BACK: {
			setElementCollisionsEnabled(pedId, false);
			if (ped.isSyncer) {
				setElementPosition(pedId, getPosBehindPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case V_ANIMMOVE_LEFT: {
			setElementCollisionsEnabled(pedId, false);
			if (ped.isSyncer) {
				setElementPosition(pedId, getPosToLeftOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case V_ANIMMOVE_RIGHT: {
			setElementCollisionsEnabled(pedId, false);
			if (ped.isSyncer) {
				setElementPosition(pedId, getPosToRightOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		default: {
			break;
		}
	}

	if (getGame() < V_GAME_GTA_IV) {
		if (animationData.animType == V_ANIMTYPE_NORMAL || animationData.animType == V_ANIMTYPE_SURRENDER) {
			if (getGame() == V_GAME_GTA_VC || getGame() == V_GAME_GTA_SA) {
				ped.clearAnimations();
			} else {
				ped.clearObjective();
			}
			ped.addAnimation(animationData.groupId, animationData.animId);

			if (ped == localPlayer && freezePlayer == true) {
				inAnimation = true;
				setLocalPlayerControlState(false, false);
				localPlayer.collisionsEnabled = false;
			}
		} else if (animationData.animType == V_ANIMTYPE_BLEND) {
			ped.position = ped.position;
			ped.blendAnimation(animationData.groupId, animationData.animId, animationData.animSpeed);
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(ped, animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function forcePedAnimation(pedId, animSlot) {
	let ped = getElementFromId(pedId);

	if (ped == null) {
		return false;
	}

	let animationData = getAnimationData(animSlot);

	if (getGame() < V_GAME_GTA_IV) {
		ped.position = ped.position;
		ped.addAnimation(animationData.groupId, animationData.animId);

		if (ped == localPlayer) {
			inAnimation = true;
			setLocalPlayerControlState(false, false);
			localPlayer.collisionsEnabled = false;
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(ped, animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function makePedStopAnimation(pedId) {
	let ped = getElementFromId(pedId);

	if (ped == null) {
		return false;
	}

	if (getGame() != V_GAME_GTA_IV) {
		if (getGame() == V_GAME_GTA_VC || getGame() == V_GAME_GTA_SA) {
			ped.clearAnimations();
		} else {
			ped.clearObjective();
		}
	}

	if (ped == localPlayer) {
		if (getGame() != V_GAME_GTA_IV) {
			localPlayer.collisionsEnabled = true;
		}
		setLocalPlayerControlState(true, false);
	}
}

// ===========================================================================