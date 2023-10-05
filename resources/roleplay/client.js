"use strict";
// ===========================================================================

game.hud.enableMoney(true);
let Hospital = [-758.792, 13.2488, 761.116];



// ===========================================================================
addEventHandler("OnPedDeath", function(event, ped) {
    ped.addAnimation(`game12 sara01 chyceni f.i3d`);  

    if(localPlayer != null) { 
        message(`${localPlayer.name} got got.`)
        localPlayer.playAnimation(`game12 sara01 chyceni f.i3d`);
    } else {
        message('Debugging localPlayer');
    }

        
      

});
// ===========================================================================
addEventHandler("OnResourceReady", function (event, resource) {
	
});
addEventHandler("OnMapLoaded", function(event, ped) {
    if(ped != localPlayer) {
        ped.kill();
    }
       
})

// ===========================================================================

// ===========================================================================


addEventHandler("onPedSpawn", (event, ped) => {
    ped.playAnimation(`Gestikulace05.i3d`);
    if(ped === Radni) {
        ped.kill();
    }

});



addNetworkHandler("hudMoney", function(newMoney) {
    game.hud.setMoney(newMoney);
});

addNetworkHandler("AnimationPlay", function(animation) {
    localPlayer.playAnimation(animation);
})









