// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: sync.js
// DESC: Provides some elements and data sync
// TYPE: Client (JavaScript)
// ===========================================================================

function processSync(event, deltaTime) {
    if(localPlayer != null) {
        if(!areServerElementsSupported()) {
            sendNetworkEventToServer("vrr.player.position", localPlayer.position);
            sendNetworkEventToServer("vrr.player.heading", localPlayer.heading);
        }

        //if(game.game == VRR_GAME_GTA_SA) {
        //    let lookAtPos = getLocalPlayerLookAtPosition();
        //    sendNetworkEventToServer("vrr.player.lookat", lookAtPos);
        //    setEntityData(localPlayer, "vrr.headLook", lookAtPos);
        //    let peds = getPeds();
        //    for(let i in peds) {
        //        if(doesEntityDataExist(peds[i], "vrr.headLook")) {
        //            peds[i].lookAt(getEntityData(peds[i], "vrr.headLook"), 99999);
        //        }
        //    }
        //}

        if(localPlayer.health <= 0) {
            if(!calledDeathEvent) {
                logToConsole(LOG_DEBUG, `Local player died`);
                localPlayer.clearWeapons();
                calledDeathEvent = true;
                sendNetworkEventToServer("vrr.playerDeath");
            }
        }

        if(streamingRadioElement) {
            streamingRadio.position = getElementPosition(streamingRadioElement);
            //streamingRadio.volume = getStreamingRadioVolumeForPosition(streamingRadio.position);
        }
    }
}

// ===========================================================================

function setVehicleEngine(vehicleId, state) {
    getElementFromId(vehicleId).engine = state;
}

// ===========================================================================

function setVehicleLights(vehicleId, state) {
    if(getGame() != VRR_GAME_MAFIA_ONE) {
        if(!state) {
            getElementFromId(vehicleId).lightStatus = 2;
        } else {
            getElementFromId(vehicleId).lightStatus = 1;
        }
    } else {
        if(!state) {
            getElementFromId(vehicleId).lights = false;
        } else {
            getElementFromId(vehicleId).lights = true;
        }
    }
}

// ===========================================================================

function repairVehicle(syncId) {
    getVehicleFromSyncId(syncId).fix();
}

// ===========================================================================

function syncVehicleProperties(vehicle) {
    if(doesEntityDataExist(vehicle, "vrr.lights")) {
        let lightStatus = getEntityData(vehicle, "vrr.lights");
        if(!lightStatus) {
            vehicle.lightStatus = 2;
        } else {
            vehicle.lightStatus = 1;
        }
    }

    //if(doesEntityDataExist(vehicle, "vrr.panelStatus")) {
    //    let panelsStatus = getEntityData(vehicle, "vrr.panelStatus");
    //    for(let i in panelsStatus) {
    //        vehicle.setPanelStatus(i, panelsStatus[i]);
    //    }
    //}

    //if(doesEntityDataExist(vehicle, "vrr.wheelStatus")) {
    //    let wheelsStatus = getEntityData(vehicle, "vrr.wheelStatus");
    //    for(let i in wheelsStatus) {
    //        vehicle.setWheelStatus(i, wheelsStatus[i]);
    //    }
    //}

    //if(doesEntityDataExist(vehicle, "vrr.lightStatus")) {
    //    let lightStatus = getEntityData(vehicle, "vrr.lightStatus");
    //    for(let i in lightStatus) {
    //        vehicle.setLightStatus(i, lightStatus[i]);
    //    }
    //}

    //if(doesEntityDataExist(vehicle, "vrr.suspensionHeight")) {
    //    let suspensionHeight = getEntityData(vehicle, "vrr.suspensionHeight");
    //    vehicle.setSuspensionHeight(suspensionHeight);
    //}

    if(getGame() == VRR_GAME_GTA_SA) {
        if(doesEntityDataExist(vehicle, "vrr.upgrades")) {
            let upgrades = getEntityData(vehicle, "vrr.upgrades");
            for(let i in upgrades) {
                if(upgrades[i] != 0) {
                    vehicle.addUpgrade(upgrades[i]);
                }
            }
        }
    }

    if(getGame() == VRR_GAME_GTA_SA || getGame() == VRR_GAME_GTA_IV) {
        if(doesEntityDataExist(vehicle, "vrr.livery")) {
            let livery = getEntityData(vehicle, "vrr.livery");
            if(getGame() == VRR_GAME_GTA_SA) {
                vehicle.setPaintJob(livery);
            } else if(getGame() == VRR_GAME_GTA_IV) {
                vehicle.livery = livery;
            }
        }
    }

    if(getGame() == VRR_GAME_GTA_III) {
        if(vehicle.isOwner && vehicle.modelIndex == 116) {
            vehicle.colour1 = 0;
            vehicle.colour2 = 1;
        }
    } else if(getGame() == VRR_GAME_GTA_VC) {
        if(vehicle.isOwner && vehicle.modelIndex == 156) {
            vehicle.colour1 = 0;
            vehicle.colour2 = 1;
        }
    }
}

// ===========================================================================

function syncCivilianProperties(civilian) {
    if(getGame() == VRR_GAME_GTA_III) {
        if(doesEntityDataExist(civilian, "vrr.scale")) {
            let scaleFactor = getEntityData(civilian, "vrr.scale");
            let tempMatrix = civilian.matrix;
            tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
            let tempPosition = civilian.position;
            civilian.matrix = tempMatrix;
            tempPosition.z += scaleFactor.z;
            civilian.position = tempPosition;
        }
    }

    if(getGame() == VRR_GAME_GTA_SA) {
        if(doesEntityDataExist(civilian, "vrr.fightStyle")) {
            let fightStyle = getEntityData(civilian, "vrr.fightStyle");
            civilian.setFightStyle(fightStyle[0], fightStyle[1]);
        }
    }

    if(getGame() == VRR_GAME_GTA_III) {
        if(doesEntityDataExist(civilian, "vrr.walkStyle")) {
            let walkStyle = getEntityData(civilian, "vrr.walkStyle");
            civilian.walkStyle = walkStyle;
        }
    }

    if(getGame() == VRR_GAME_GTA_IV) {
        if(doesEntityDataExist(civilian, "vrr.bodyPropHair")) {
            let bodyPropHair = getEntityData(civilian, "vrr.bodyPropHair");
            civilian.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropHead")) {
            let bodyPropHead = getEntityData(civilian, "vrr.bodyPropHead");
            civilian.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropEyes")) {
            let bodyPropEyes = getEntityData(civilian, "vrr.bodyPropEyes");
            civilian.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropLeftHand")) {
            let bodyPropLeftHand = getEntityData(civilian, "vrr.bodyPropLeftHand");
            civilian.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropRightHand")) {
            let bodyPropRightHand = getEntityData(civilian, "vrr.bodyPropRightHand");
            civilian.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropLeftWrist")) {
            let bodyPropLeftWrist = getEntityData(civilian, "vrr.bodyPropLeftWrist");
            civilian.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropRightWrist")) {
            let bodyPropRightWrist = getEntityData(civilian, "vrr.bodyPropRightWrist");
            civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropRightWrist")) {
            let bodyPropRightWrist = getEntityData(civilian, "vrr.bodyPropRightWrist");
            civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropHip")) {
            let bodyPropHip = getEntityData(civilian, "vrr.bodyPropHip");
            civilian.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropLeftFoot")) {
            let bodyPropLeftFoot = getEntityData(civilian, "vrr.bodyPropLeftFoot");
            civilian.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
        }

        if(doesEntityDataExist(civilian, "vrr.bodyPropRightFoot")) {
            let bodyPropRightFoot = getEntityData(civilian, "vrr.bodyPropRightFoot");
            civilian.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
        }
    }

    if(doesEntityDataExist(civilian, "vrr.anim")) {
        let animData = getEntityData(vehicle, "vrr.anim");
        civilian.addAnimation(animData[0], animData[1]);
    }
}

// ===========================================================================

function syncPlayerProperties(player) {
    if(getGame() == VRR_GAME_GTA_III) {
        if(doesEntityDataExist(player, "vrr.scale")) {
            let scaleFactor = getEntityData(player, "vrr.scale");
            let tempMatrix = player.matrix;
            tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
            let tempPosition = player.position;
            player.matrix = tempMatrix;
            tempPosition.z += scaleFactor.z;
            player.position = tempPosition;
        }
    }

    if(getGame() == VRR_GAME_GTA_SA) {
        if(doesEntityDataExist(player, "vrr.fightStyle")) {
            let fightStyle = getEntityData(player, "vrr.fightStyle");
            player.setFightStyle(fightStyle[0], fightStyle[1]);
        }
    }

    //if(getGame() == VRR_GAME_GTA_SA) {
    //    if(doesEntityDataExist(player, "vrr.walkStyle")) {
    //        let walkStyle = getEntityData(player, "vrr.walkStyle");
    //        player.walkStyle = walkStyle;
    //    }
    //}

    if(getGame() == VRR_GAME_GTA_IV) {
        if(doesEntityDataExist(player, "vrr.bodyPartHair")) {
            let bodyPartHead = getEntityData(player, "vrr.bodyPartHair");
            player.changeBodyPart(0, bodyPartHead[0], bodyPartHair[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPartHead")) {
            let bodyPartHead = getEntityData(player, "vrr.bodyPartHead");
            player.changeBodyPart(1, bodyPartHead[0], bodyPartHead[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPartUpper")) {
            let bodyPartUpper = getEntityData(player, "vrr.bodyPartUpper");
            player.changeBodyPart(1, bodyPartUpper[0], bodyPartUpper[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPartLower")) {
            let bodyPartLower = getEntityData(player, "vrr.bodyPartLower");
            player.changeBodyPart(1, bodyPartLower[0], bodyPartLower[1]);
        }
    }

    if(getGame() == VRR_GAME_GTA_IV) {
        if(doesEntityDataExist(player, "vrr.bodyPropHair")) {
            let bodyPropHair = getEntityData(player, "vrr.bodyPropHair");
            player.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropHead")) {
            let bodyPropHead = getEntityData(player, "vrr.bodyPropHead");
            player.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropEyes")) {
            let bodyPropEyes = getEntityData(player, "vrr.bodyPropEyes");
            player.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropLeftHand")) {
            let bodyPropLeftHand = getEntityData(player, "vrr.bodyPropLeftHand");
            player.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropRightHand")) {
            let bodyPropRightHand = getEntityData(player, "vrr.bodyPropRightHand");
            player.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropLeftWrist")) {
            let bodyPropLeftWrist = getEntityData(player, "vrr.bodyPropLeftWrist");
            player.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropRightWrist")) {
            let bodyPropRightWrist = getEntityData(player, "vrr.bodyPropRightWrist");
            player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropRightWrist")) {
            let bodyPropRightWrist = getEntityData(player, "vrr.bodyPropRightWrist");
            player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropHip")) {
            let bodyPropHip = getEntityData(player, "vrr.bodyPropHip");
            player.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropLeftFoot")) {
            let bodyPropLeftFoot = getEntityData(player, "vrr.bodyPropLeftFoot");
            player.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
        }

        if(doesEntityDataExist(player, "vrr.bodyPropRightFoot")) {
            let bodyPropRightFoot = getEntityData(player, "vrr.bodyPropRightFoot");
            player.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
        }
    }
}

// ===========================================================================

function syncObjectProperties(object) {
    if(getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
        if(doesEntityDataExist(object, "vrr.scale")) {
            let scaleFactor = getEntityData(object, "vrr.scale");
            let tempMatrix = object.matrix;
            tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
            let tempPosition = object.position;
            object.matrix = tempMatrix;
            tempPosition.z += scaleFactor.z;
            object.position = tempPosition;
        }
    }
}

// ===========================================================================

function syncElementProperties(element) {
    if(doesEntityDataExist(element, "vrr.interior")) {
        if(typeof element.interior != "undefined") {
            element.interior = getEntityData(element, "vrr.interior");
        }
    }

    switch(element.type) {
        case ELEMENT_VEHICLE:
            syncVehicleProperties(element);
            break;

        case ELEMENT_PED:
            syncCivilianProperties(element);
            break;

        case ELEMENT_PLAYER:
            syncPlayerProperties(element);
            break;

        case ELEMENT_OBJECT:
            syncObjectProperties(element);
            break;

        default:
            break;
    }
}

// ===========================================================================