"use strict";
// ===========================================================================

game.hud.enableMoney(true);
let Hospital = [-758.792, 13.2488, 761.116];
let SongLink = "";
let SongFromURL = null;
let MTheme = null;
let IntroSong = null;
let IntroSongPath = 'dvolhintro.mp3';


addNetworkHandler("playAudio", function() {
    message("Call is working")
    MTheme = audio.createSoundFromURL("https://d167.d2mefast.net/tb/e/76/mafia_soundtrack_theme_music_mp3_83338.mp3");

    if(MTheme != null || !MTheme) {
        MTheme.play();
        message('Audio working');
    } else {
        message('Audio not working')
    }

})
// ===========================================================================
addEventHandler("OnPedDeath", function(event, ped) {
    if(localPlayer != null) {
        message(`${localPlayer.name} got got.`)
        localPlayer.playAnimation(`game12 sara01 chyceni f.i3d`);
        game.fadeCamera(fadeIn, 3.0);
    } else {
        message('Debugging localPlayer');
    }
});
// ===========================================================================
addEventHandler("OnResourceReady", function(event, resource) {

    message(`${MTheme}`);
});

addEventHandler("OnPedJackVehicle", function(event, ped) {
    message(`${ped.name} jacked a car`)
})

addEventHandler('onPedInflictDamage', function(event, ped, responsibleEntity, weapon, loss, pedPiece) {

});

addEventHandler("OnDrawnHUD", function () {

});

addEventHandler("OnAddActor", function(event, actorType, actorName, model) {

    if(actorType.isType(ACTOR_TYPE_HUMAN)) {
        event.preventDefault();
    }

    if(actorType.isType(ACTOR_TYPE_CAR)) {
        event.preventDefault();
    }

    if(actorName == "Radni") {
        event.preventDefault();
    }
});
// ===========================================================================
function loadSong() {
    let audioFile = openFile(IntroSongPath);
    let objIntroSong = null;
    if(audioFile != null) {
        objIntroSong = createSound(audioFile, true);
        audioFile.close();
    }

    return objIntroSong;
}


// ===========================================================================


addEventHandler("onPedSpawn", (event, ped) => {
    message(`${ped.name} spawned`);
    if(ped != localPlayer) {
        ped.playAnimation(`Gestikulace05.i3d`);
    }
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


// const loginDialog = new GUIWindow("LoginDialog", "Login/Register", 100, 100, 400, 200);

// const usernameLabel = new GUIText("UsernameLabel", "Username:", 20, 30);
// const usernameInput = new GUITextInput("UsernameInput", "", 120, 30, 200);
// const passwordLabel = new GUIText("PasswordLabel", "Password:", 20, 60);
// const passwordInput = new GUITextInput("PasswordInput", "", 120, 60, 200, "password");
// const loginButton = new GUIButton("LoginButton", "Login", 120, 100);
// const registerButton = new GUIButton("RegisterButton", "Register", 240, 100);

// loginDialog.addElement(usernameLabel);
// loginDialog.addElement(usernameInput);
// loginDialog.addElement(passwordLabel);
// loginDialog.addElement(passwordInput);
// loginDialog.addElement(loginButton);
// loginDialog.addElement(registerButton);








