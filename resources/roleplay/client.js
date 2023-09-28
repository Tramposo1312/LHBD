"use strict";


game.hud.enableMoney(true);

addEventHandler("OnPedEnteringVehicle", function(event, ped, vehicle, seat) {
    message(`${ped.name} is entering vehicle ${vehicle.id} seat ${seat}`);
});

// ===========================================================================

addEventHandler("OnPedExitingVehicle", function(event, ped, vehicle, seat) {
    message(`${ped.name} is exiting vehicle ${vehicle.id} seat ${seat}`);
});

// ===========================================================================

addEventHandler("OnPedEnteredVehicle", function(event, ped, vehicle, seat) {
    message(`${ped.name} has entered vehicle ${vehicle.id} seat ${seat}`);
});

// ===========================================================================

addEventHandler("OnPedExitedVehicle", function(event, ped, vehicle, seat) {
    message(`${ped.name} has exited vehicle ${vehicle.id} seat ${seat}`);
});

// ===========================================================================

addEventHandler("OnPedJackVehicle", function(event, ped, vehicle, seat) {
    message(`${ped.name} has jacked vehicle ${vehicle.id} seat ${seat}`);
});

// ===========================================================================
addEventHandler("OnPedDeath", function(event, ped) {
	
    ped.health = 100;
    
});

addEventHandler("onPedSpawn", (event, gunDealerPed) => {
    gunDealerPed.addAnimation(`Gestikulace05.i3d`);
});


addNetworkHandler("PlayerChat", function(player) {
    player.addAnimation(`xGestik01a.i3d`);
})

addNetworkHandler("hudMoney", function(newMoney) {
    game.hud.setMoney(newMoney);
});



addEventHandler("OnMapLoaded", function(event, client) {
  
});

















