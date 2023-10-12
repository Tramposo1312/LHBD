"use strict";
// ===========================================================================

    let motorest  = [-7.22, 2.4, 20.15];
	let littleitaly = [38.48, -0.07, -29.46];
    let camPos = [-1961.32, 4.93, 3.31];
	let saliery = [-1774.30, -5.56, 7.62];
	let bartest = [-387.11, 15.47, -515];
	let kingbed = [-545.79, 15.38, -436.02];
	let vila = [106.33, -5.11, 171.22];
    let lookAt = [-1958.32, -3.88, -20.16];


// ===========================================================================

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
addNetworkHandler("TutorialCam", function() {
    game.setCameraLookAt(camPos, lookAt, true);

})

addNetworkHandler("fadeThatCam", function() {
    
})


// ===========================================================================
