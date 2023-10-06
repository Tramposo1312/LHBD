"use strict";
// ===========================================================================

game.hud.enableMoney(true);
let Hospital = [-758.792, 13.2488, 761.116];
let IntroSong = null;
let IntroSongPath = "mafiaintro.mp3";



// ===========================================================================
addEventHandler("OnPedDeath", function(event, ped) {
    if(localPlayer != null) {
        message(`${localPlayer.name} got got.`)
        localPlayer.playAnimation(`game12 sara01 chyceni f.i3d`);
        game.fadeCamera(false, 3.0);
    } else {
        message('Debugging localPlayer');
    }
});
// ===========================================================================
addEventHandler("OnResourceReady", function (event, resource) {
    IntroSong = loadSong();
    message("RESOURCE READY!");
    console.log("[TRAMPOSO] RESOURCE READY");
});

addEventHandler("OnPedJackVehicle", function(event, ped) {
    message(`${ped.name} jacked a car`)
})

addEventHandler('onPedInflictDamage', function(event, ped, responsibleEntity, weapon, loss, pedPiece) {
   message(`${ped.type}, lol ${responsibleEntity}`);
   message(`${ped.type} is getting hit by ${responsibleEntity} using ${weapon}, losing ${loss} and now debugging ${pedPiece}`);
});

addEventHandler("OnDrawnHUD", function () {
	
});


// ===========================================================================
function loadSong() {
    let audioFile = openFile(IntroSongPath);
    let audioObject = null;
    if (audioFile) {
        audioObject = audio.createSound(audioFile, true);
        audioFile.close();
    }


    return audioObject;
}

addNetworkHandler("playAudio", function() {
    if (IntroSong != null) {
		IntroSong.sound.play();
        message("AUDIO WORKING!!")
	} else {
        message(`${IntroSong}`);
        return;
    }
})
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








