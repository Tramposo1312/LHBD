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
    ped.kill();
});

addEventHandler("onPedSpawn", (event, gunDealerPed) => {
    gunDealerPed.addAnimation(`${gunDealerAnim}.i3d`);
});




addNetworkHandler("hudMoney", function(newMoney) {
    game.hud.setMoney(newMoney);
});

addNetworkHandler("updateGoods", function(goodsData) {
    console.log("Received updated goods:", goodsData);
});

addEventHandler("OnMapLoaded", function(event, client) {
    db.query(`SELECT * FROM users WHERE username = '${client.name}'`);
	let playerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
    let checkUser = db.query(`SELECT * FROM users WHERE username = '${client.name}'`);
	if (checkUser == ",,,") {
		messageClient("Seems like you need to register, pal!", client, COLOUR_GREEN);
		messageClient("To register, type /register <password>", client, COLOUR_GREEN);
		console.log(checkUser);
		return;
	} else if (checkUser !== ",,,") {
		messageClient("Look who's back...", client, COLOUR_AQUA);
		messageClient('Use /login <password> before i touch you, stupid kid.', client, COLOUR_AQUA);
		playerMoney = parseInt(playerMoney, 10) | 0;
		hudPlayerMoney(playerMoney);
		const RegisteredPlayer = true;

		messageClient(`You will receive a paycheck of $${PaycheckMoney} every one hour ingame.`, client, COLOUR_GREEN);


		setInterval(() => {
			const theplayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
			hudPlayerMoney(theplayerMoney);
		 }, 1000);


		const paycheckInterval = 3600000;

		setInterval(() => {

            playerMoney += PaycheckMoney;
            db.query(`UPDATE users SET money = ${playerMoney} WHERE username = '${client.name}'`);


            messageClient(`You received a paycheck of $${PaycheckMoney}.`, client, COLOUR_GREEN);
        }, paycheckInterval);

    }
  });


















