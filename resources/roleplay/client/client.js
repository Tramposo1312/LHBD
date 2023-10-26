"use strict";
// ===========================================================================

/////////////////////////////////////////////////////////////////////////////////////////////
game.hud.enableMoney(true);
let Hospital = [-758.792, 13.2488, 761.116];
let SongLink = "";
let SongFromURL = null;
let MTheme = null;
let IntroSong = null;
let IntroSongPath = 'matheme.mp3';
let deathCam = new Vec3 (0, 0, 0);


function CreateAudio() {
    let audioFile = openFile(IntroSongPath);
    let tempIntroSong = null;
    if(audioFile != null) {
        tempIntroSong = audio.createSound(audioFile, false);
    }

    return tempIntroSong;
}

bindEventHandler("OnResourceReady", thisResource, function(event, resource) {
    IntroSong = CreateAudio();
    triggerNetworkEvent("AudioDownloaded", IntroSong);
})





// ===========================================================================
addEventHandler("OnPedDeath", function(event, ped) {
    if(ped.name != localPlayer.name) {
        ped.playAnimation(`game12 sara01 chyceni f.i3d`);
        ped.despawnPlayer();
    } else {
        let deathCam = new Vec3 (0, 0, 0);
        deathCam.x = localPlayer.position.x + 3;
        deathCam.y = localPlayer.position.y + 3;
        deathCam.z = localPlayer.position.z;
        game.setCameraLookAt(deathCam, localPlayer.position, true);
        localPlayer.playAnimation(`game12 sara01 chyceni f.i3d`);
        localPlayer.respawn(Hospital);
    }});
// ===========================================================================
addEventHandler("OnMapLoaded", function(event, mapName) {
    if(mapName == "MISE11-VILA") {
        spawnPlayer(localPlayer, vila, 0.0, 'TommyHighHAT.i3d');
    }
})

addEventHandler("OnPedJackVehicle", function(event, ped) {
    message(`${ped.name} jacked a car`)
})

addEventHandler('onPedInflictDamage', function(event, ped, responsibleEntity, weapon, loss, pedPiece) {

});
addEventHandler("OnRender", function() {

});

addEventHandler("OnDrawnHUD", function () {

});

addEventHandler("OnAddActor", function(event, actorType, actorName, model) {
    event.preventDefault();
});
// ===========================================================================

function getPosBehindPos( fX , fY , fZ , fAngle , fDistance ) {

    let fX2 = ( fX + ( ( cos( -fAngle + ( PI / 2 ) ) ) * fDistance ) );
    let fZ2 = ( fZ + ( ( sin( -fAngle + ( PI / 2 ) ) ) * fDistance ) );

    return [ fX2 , fY , fZ2 ];
}

function degreesToRadians( fDegrees ) {
    return fDegrees * ( PI / 180 );
}
// ===========================================================================


addEventHandler("onPedSpawn", (event, ped) => {
    if(ped.name == "Charles Guiliano") {
        ped.playAnimation(`Gestikulace05.i3d`);
    }
    // createLoginGUI();
});

addNetworkHandler("mapChanging", function(newMap) {
    game.changeMap(newMap, true);
    
})

addNetworkHandler("hudMoney", function(newMoney) {
    game.hud.setMoney(newMoney);
});

addNetworkHandler("AnimationPlay", function(animation) {
    localPlayer.playAnimation(animation);
})

addNetworkHandler("CamFade", function() {
    game.fadeCamera(true, 1.0, 0);
})

addNetworkHandler("playAudio", function() {
    message("Call is working")
    if(IntroSong != null) {
        IntroSong.play();
        message('Audio working');
    } else {
        message('Audio not working')
    }

})

addEventHandler("OnPedEnteringVehicle", function(event, ped, vehicle, seat) {


    message(`${ped.name} is entering THE AHAHA FUCKING vehicle ${vehicle.id} seat ${seat}`);
    let vehCheck = getVehicleData(vehicle, "forRent");
    if(vehCheck == true) {
        message("True Veh");
	} else {
        message("False Veh");
    }
});



/*
const loginDialog = new GUIWindow("LoginDialog", "Login/Register", 100, 100, 400, 200);

const usernameLabel = new GUIText("UsernameLabel", "Username:", 20, 30);
const usernameInput = new GUITextInput("UsernameInput", "", 120, 30, 200);
const passwordLabel = new GUIText("PasswordLabel", "Password:", 20, 60);
const passwordInput = new GUITextInput("PasswordInput", "", 120, 60, 200, "password");
const loginButton = new GUIButton("LoginButton", "Login", 120, 100);
const registerButton = new GUIButton("RegisterButton", "Register", 240, 100);

loginDialog.addElement(usernameLabel);
loginDialog.addElement(usernameInput);
loginDialog.addElement(passwordLabel);
loginDialog.addElement(passwordInput);
loginDialog.addElement(loginButton);
loginDialog.addElement(registerButton);
*/









