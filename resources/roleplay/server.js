"use strict";

// ===========================================================================
let logMessagePrefix = "ADMIN:";
const initMoney = 100;
const db = new module.sqlite.Database("solhdatabase.db");

bindEventHandler("OnResourceStart", thisResource, function(event, resource, client) {

});




// ===========================================================================
const PaycheckMoney = 2000;
let LoggedIn = false;
let RegisteredPlayer = false;
let Teleported = false;
addEventHandler("OnPlayerJoin", (event, client) => {
	
	

})

addEventHandler("OnPlayerJoined", (event, client) => {
		if(game.mapName == "MISE03-SALIERYKONEC") {
			spawnPlayer(client, [-1774.0, -3.93, 7.32], 0.0, "TommyHighHAT.i3d");
		}
		let avariable = Boolean(Teleported);

		if(!avariable) {
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
		} 
});




addCommandHandler("mymoney", (command, params, client) => {
	let playerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
	messageClient(`You have a fat fucking $${playerMoney}, son.`, client, COLOUR_GREEN);
})

function hudPlayerMoney(newMoney, client) {
    triggerNetworkEvent("hudMoney", client, newMoney);
}


addCommandHandler("register", (command, params, client) => {
	let db = new module.sqlite.Database("solhdatabase.db");
    let splitParams = params.split(" ");
    let passwordParams = splitParams[0];
	if (RegisteredPlayer = true) {
		messageClient("Foo, you are already registered", client, COLOUR_RED);
		return;
	}
    if (!passwordParams) {
        messageClient("Usage: /register <password>", client, COLOUR_GREEN);
        return;
    }

    db.query(`SELECT * FROM users WHERE username = '${client.name}'`);
	let regQuery = db.query(`SELECT * FROM users WHERE username = '${client.name}'`);

		if (regQuery == ",,,") {

			hudPlayerMoney(initMoney);
			db.query(`INSERT INTO users (username, password, money) VALUES ('${client.name}', '${passwordParams}', '${initMoney}')`);
			messageClient("You are now registered. Use /login <password> to log in.", client, COLOUR_GREEN);

            } else if (regQuery !== ",,") {
				messageClient("You are already registered. Use /login <password> to log in.", client, COLOUR_AQUA);
            }
    });


addCommandHandler("login", (command, params, client) => {
	let db = new module.sqlite.Database("solhdatabase.db");
	let motorest  = [-7.22, 2.4, 20.15];
	let littleitaly = [-1980.949, -4.982666, 23.199167];
	let saliery = [-1774.30, -5.56, 7.62];
	let bartest = [-387.11, 15.47, -515];
	let kingbed = [-545.79, 15.38, -436.02];


		let splitParams = params.split(" ");
		let logpassParams = splitParams[0];

		db.query(`SELECT * FROM users WHERE username = '${client.name}'`);
		let loginQuery = db.query(`SELECT * FROM users WHERE username = '${client.name}'`);

		if (loginQuery == ",,,") {
			messageClient("You need to register first, stupid kid. Use /register <password>.", client, COLOUR_GREEN);
			return;
		} else if (!logpassParams) {
			messageClient("Usage: /login <password>", client, COLOUR_GREEN);
			console.log(loginQuery);
			return;
		}

		if (loginQuery.length >= 4) {
			const storedPassword = loginQuery[2].trim();
			if (logpassParams === storedPassword) {

				messageClient("Welcome back kid, don't get caught up lacking in the streets.", client, COLOUR_AQUA);
				spawnPlayer(client, littleitaly, 180.0, 'TommyHighHAT.i3d');
				const loggedIn = true;

				} else {
					messageClient("Are you dumb or are you fucking dumb? Pass is not correct. Try again, kid", client, COLOUR_RED);
			}
		}
	});

	addCommandHandler("givemoney", (command, params, client) => {
		let splitParams = params.split(" ");
		let targetParams = splitParams[0];
		let moneyAdded = parseInt(splitParams[1], 10); // Parse the moneyAdded parameter to an integer

		if (!client.administrator) {
			messageClient("You are not an admin, kid.", client, COLOUR_ORANGE);
			return;
		}

		if (!targetParams || isNaN(moneyAdded) || moneyAdded <= 0) { // Check if moneyAdded is a valid number
			messageClient("USAGE: /givemoney <id> <money>", client, COLOUR_ORANGE);
			return;
		}

		let targetClient = getClientFromParams(targetParams);
		if (!targetClient) {
			messageClient("The player you want to give money to is not online.", client, COLOUR_ORANGE);
			return;
		}



		let oldMoney = db.query(`SELECT money FROM users WHERE username = '${targetClient.name}'`); // Convert oldMoney to int32
		if (!oldMoney) {
			messageClient(`Error: Failed to retrieve the money for ${targetClient.name}.`, client, COLOUR_ORANGE);
			return;
		}
		if (targetClient) {
			if (targetClient.index === client.index) {
				let oldMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`)
				oldMoney = parseInt(oldMoney, 10);
				let playerMoney = oldMoney + moneyAdded;

				db.query(`UPDATE users SET money = ${playerMoney} WHERE username = '${client.name}'`);
				messageClient(`You gave yourself $${moneyAdded}`, client, COLOUR_GREEN);
				playerMoney = parseInt(playerMoney, 10);
				hudPlayerMoney(playerMoney);
			} else {
				oldMoney = parseInt(oldMoney, 10);
				let playerMoney = oldMoney + moneyAdded;
				db.query(`UPDATE users SET money = ${playerMoney} WHERE username = '${targetClient.name}'`);
				messageClient(`You gave ${targetClient.name} $${moneyAdded}`, client, COLOUR_GREEN);
				hudPlayerMoney(playerMoney, targetClient);
			}

			if(targetClient) {
				messageClient(`You have been given $${moneyAdded}`, client, COLOUR_GREEN);
			}
		}
	});







// ===========================================================================











// ===========================================================================



addCommandHandler("cmap", (command, params, client) => {

	client.despawnPlayer();
	let newMap = "MISE03-SALIERYKONEC";
	game.changeMap(newMap);
	Teleported = true;
	
});

addCommandHandler("spawn", (command, params, client) => {
	let Hospital = [-758.792, 13.2488, 761.116];
	let hoboken = [328.71826, -3.187930, 267.53866];
	let saliery = [-1774.30, -5.56, 7.62];
	let asalier = [-1774.0, -3.93, 7.32];
	let salieryDoor = [-1774.6744384765625, -5.628890037536621, 3.844797372817993];
	let hoboApart = [453.92, -3.66, 297];
	

	const tpplace = params.toLowerCase();
	if (tpplace === '1') {
		client.despawnPlayer();
		spawnPlayer(client, asalier, 0.0, "TommyHighHAT.i3d");


	} else if (tpplace === '2') {
		client.despawnPlayer();
		spawnPlayer(client, hoboken, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '3') {
		client.despawnPlayer();
		spawnPlayer(client, hoboApart, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '4') {
		client.despawnPlayer();
		spawnPlayer(client, salieryDoor, 0.0, "TommyHighHAT.i3d");
	} else if (tpplace === '5') {
		client.despawnPlayer();
		spawnPlayer(client, bongioEmmetPosition, 0.0, "TommyHighHAT.i3d");
	} else {
		  messageClient("USAGE: /spawn 1/2/3/4/5", client, COLOUR_ORANGE);
		}
	  });

// ===========================================================================
function getClientFromPlayer(player) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player == player) {
			return clients[i];
		}
	}
}


function messageCloser(messageText, client) {
	if (localPlayer != null) {
		let messageRadius = 20.0;
		let playerPos = localPlayer.position;

		getClients().forEach((element) => {
			if (element.type == ELEMENT_PLAYER && element !== localPlayer) {
				let closePlayerPos = element.position;
				let distance = getDistance(playerPos, closePlayerPos);

				if (distance < messageRadius) {
					messageClient(`${client.name} says: [#FFFFFF]${messageText}`, element, COLOUR_WHITE);
				}
			}
		});
 	};
	messageClient(`${messageText}`, client, COLOUR_WHITE);
}


addEventHandler("OnPlayerJoin", (event, client) => {
	console.log(`${client.name} is joining!`);
});

// ===========================================================================

addEventHandler("OnPlayerQuit", (event, client, reasonId) => {
	console.log(`${client.name} has left!`);
});

// ===========================================================================

addEventHandler("OnPlayerChat", (event, client, messageText) => {
	event.preventDefault();

	let colour = COLOUR_WHITE;
	messageCloser(`${client.name} says: [#FFFFFF]${messageText}`, client, colour);
});




function vectorDistance(vec1, vec2) {
	const dx = vec2[0] - vec1[0];
	const dy = vec2[1] - vec1[1];
	const dz = vec2[2] - vec1[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}




// ===========================================================================


addCommandHandler("veh", (command, params, client) => {
	let model = getVehicleModelFromParams(params);

	if (!model) {
		messageClient("That vehicle model is invalid!");
		return false;
	}

	let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
	let vehicle = game.createVehicle(`${model}.i3d`, frontOfPlayer, client.player.heading);

	if (vehicle) {
		messageClient(`${client.name} spawned a ${vehicleNames[vehicleModels.indexOf(model)]} vehicle`, client, COLOUR_YELLOW);
	} else {
		messageClient(`Vehicle failed to create!`, client, COLOUR_ORANGE);
	}
});

// ===========================================================================

addCommandHandler("ped", (command, params, client) => {
	let model = getSkinModelFromParams(params);

	if (!model) {
		messageClient("That ped skin is invalid!");
		return false;
	}

	let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
	let ped = game.createPed(`${model}.i3d`, frontOfPlayer, client.player.heading);

	if (ped) {
		messageClient(`${client.name} created a ${skinModels[skinModels.indexOf(model)]} ped`, client, COLOUR_YELLOW);
	} else {
		messageClient(`Ped failed to create!`, COLOUR_ORANGE);
	}
});

// ===========================================================================

addCommandHandler("gun", (command, params, client) => {
	let weaponId = Number(params) || 8;

	client.player.giveWeapon(weaponId, 50, 999);
	messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
});

// ===========================================================================

addCommandHandler("siren", (command, params, client) => {
	if (!client.player.vehicle) {
		messageClient("You need to be in a vehicle!", client, COLOUR_RED);
		return false;
	}

	client.player.vehicle.siren = !client.player.vehicle.siren;
	message(`${client.name} turned their vehicle siren ${(client.player.vehicle.siren) ? "on" : "off"}`);
});


// ===========================================================================

addCommandHandler("lights", (command, params, client) => {
	if (client.player.vehicle == null) {
		message("You need to be in a vehicle!");
		return false;
	}

	client.player.vehicle.lights = !client.player.vehicle.lights;
	message(`${client.name} turned their vehicle lights ${(client.player.vehicle.lights) ? "on" : "off"}`);
});

// ===========================================================================

addCommandHandler("engine", (command, params, client) => {
	if (!client.player.vehicle) {
		messageClient("You need to be in a vehicle!", client, COLOUR_RED);
		return false;
	}

	client.player.vehicle.engine = !client.player.vehicle.engine;
	message(`${client.name} turned their vehicle engine ${(client.player.vehicle.engine) ? "on" : "off"}`);
});
// ----------------------------------------------------------------------------

addCommandHandler("me", (command, params, client) => {
	if (!params) {
		messageClient("USAGE: /me <text>", client, COLOUR_SILVER)
		return false;
		}
	message(`${client.name} ${params}`, toColour(177, 156, 217, 255));
});

addCommandHandler("do", (command, params, client) => {
	if (!params) {
	messageClient("USAGE: /do <text>", client, COLOUR_SILVER)
	return false;
	}
	message(`${params} ((${client.name})) `, toColour(177, 156, 217, 255));
});

addCommandHandler("my", (command, params, client) => {
	if (!params) {
	messageClient("USAGE: /my <text>", client, COLOUR_SILVER)
	return false;
	}
	message(`${client.name}'s ${params} `, toColour(177, 156, 217, 255));
});


// ----------------------------------------------------------------------------

addCommandHandler("s", (command, params, client) => {
	if (!params) {
		messageClient("USAGE: /shout <text>!", client, COLOUR_SILVER)
		return false;
		}
	message(`${client.name} shouts: ${params}!`, toColour(255, 255, 200, 255));
});


// ===========================================================================

addCommandHandler("lock", (command, params, client) => {
	if (!client.player.vehicle) {
		messageClient("You need to be in a vehicle!", client, COLOUR_RED);
		return false;
	}

	client.player.vehicle.locked = !client.player.vehicle.locked;
	message(`${client.name} ${(client.player.vehicle.engine) ? "locked" : "unlocked"} their vehicle`);
});

// ===========================================================================

addCommandHandler("skin", (command, params, client) => {
	let model = getSkinModelFromParams(params);

	if (!model) {
		message("That skin is invalid!");
		return false;
	}

	client.player.model = `${model}.i3d`;
});

// ===========================================================================

function getVehicleModelFromParams(params) {
	if (isNaN(params)) {
		let tempVehicleNames = vehicleNames.toLowerCase();
		let indexName = tempVehicleNames.indexOf(params.toLowerCase());
		if (indexName != -1) {
			return vehicleNames[indexName];
		}

		let tempVehicleModels = vehicleModels.toLowerCase();
		let indexModel = tempVehicleModels.indexOf(params.toLowerCase());
		if (indexModel != -1) {
			return vehicleModels[indexModel];
		}
	} else {
		if (typeof vehicleModels[Number(params)] != "undefined") {
			return vehicleModels[Number(params)];
		}
	}

	return false;
}

// ===========================================================================

function getSkinModelFromParams(params) {
	//for(let i in skinNames) {
	//	if(skinNames[i].toLowerCase().indexOf(params.toLowerCase()) == -1) {
	//		return skinModels[i];
	//	}
	//}

	for (let i in skinModels) {
		if (skinModels[i].toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return skinModels[i];
		}
	}

	return false;
}

// ===========================================================================

let vehicleModels = [
	"fordtTud00",
	"fordtTud01",
	"fordtTud02",
	"fordtTud03",
	"fordtTud04",
	"fordtto00",
	"fordtto01",
	"fordtto02",
	"fordtto03",
	"fordtto04",
	"fordtru00",
	"fordtru01",
	"fordtru02",
	"fordtru03",
	"fordtru04",
	"fordtpi00",
	"fordtpi01",
	"fordtpi02",
	"fordtpi03",
	"fordtpi04",
	"fordtFor00",
	"fordtFor01",
	"fordtFor02",
	"fordtFor03",
	"fordtFor04",
	"fordtco00",
	"fordtco01",
	"fordtco02",
	"fordtco03",
	"fordtco04",
	"forAtu00",
	"ForAtu01",
	"ForAtu02",
	"ForAtu03",
	"ForAro00",
	"ForAro01",
	"ForAro02",
	"ForAro03",
	"ForApic00",
	"ForApic01",
	"ForApic02",
	"ForApic03",
	"ForAfo00",
	"ForAfo01",
	"ForAfo02",
	"ForAfo03",
	"ForAde00",
	"ForAde01",
	"ForAde02",
	"ForAde03",
	"ForAcou00",
	"ForAcou01",
	"ForAcou02",
	"ForAcou03",
	"ForAtu00",
	"ForAtu01",
	"ForAtu02",
	"ForAtu03",
	"forVco00",
	"forVco01",
	"forVco02",
	"forVco03",
	"forVfor00",
	"forVfor01",
	"forVfor02",
	"forVfor03",
	"forVro00",
	"forVro01",
	"forVro02",
	"forVro03",
	"forVto00",
	"forVto01",
	"forVto02",
	"forVto03",
	"forVtud00",
	"forVtud01",
	"forVtud02",
	"forVtud03",
	"miller00",
	"speedster00",
	"speedster01",
	"speedster02",
	"alfa00",
	"alfa8C00",
	"alfa8C01",
	"merced500K00",
	"merced500K01",
	"bugatti00",
	"bugatti01",
	"pontFor00",
	"pontFor01",
	"pontTud00",
	"pontTud01",
	"blackha00",
	"blackha01",
	"black00",
	"taxi00",
	"hudcou00",
	"hudcou01",
	"hudcou02",
	"hudfor00",
	"hudfor01",
	"hudfor02",
	"hudtu00",
	"hudtu01",
	"hudtu02",
	"cad_ford00",
	"cad_phaeton00",
	"cad_road00",
	"hartmann00",
	"hearseCa00",
	"polCad00",
	"chemaFor00",
	"chemaFor01",
	"chemaFor02",
	"polimFor00",
	"chematud00",
	"chematud01",
	"chematud02",
	"polimTud00",
	"chev00",
	"chev01",
	"chev02",
	"poli00",
	"arrow00",
	"cordca00",
	"cordca01",
	"cordph00",
	"cordph01",
	"cordse00",
	"cordse01",
	"deuseJco00",
	"duesenberg00",
	"airflFor00",
	"airflFor01",
	"airfltud00",
	"airfltud01",
	"buiCou00",
	"buiCou01",
	"buiCou02",
	"buigang00",
	"buikFor00",
	"buikFor01",
	"buikFor02",
	"Ambulance00",
	"fire00",
	"hearseA00",
	"truckA00",
	"truckB00",
	"TruckBxx00",
	"truckBx00",
	"phantom00",
	"thunderbird00",
	"FordHOT00",
	"Blackdragon00",
	"cord_sedanH00",
	"Flamer00",
	"fordApick00",
	"fordApicktaxi00",
	"fordTH00",
	"FThot00",
	"hotrodp200",
	"hotrodp300",
	"hotrodp400",
	"hotrodp500",
	"chevroletm6H00",
	"TBirdold00",
	"fordAdelH00",
	"hotrodp600",
	"phantomtaxi00",
];

// ===========================================================================

let vehicleNames = [
	"Blue Bolt Ace Tudor", 					// 0
	"Dark Blue Bolt Ace Tudor",
	"Brown Bolt Ace Tudor",
	"Green Bolt Ace Tudor",
	"Red Bolt Ace Tudor",
	"Blue Bolt Ace Touring", 				// 5
	"Dark Blue Bolt Ace Touring",
	"Brown Bolt Ace Touring",
	"Green Bolt Ace Touring",
	"Red Bolt Ace Touring",
	"Blue Bolt Ace Runabout", 				// 10
	"Dark Blue Bolt Ace Runabout",
	"Brown Bolt Ace Runabout",
	"Green Bolt Ace Runabout",
	"Red Bolt Ace Runabout",
	"Blue Bolt Ace Pickup", 				// 15
	"Dark Blue Bolt Ace Pickup",
	"Brown Bolt Ace Pickup",
	"Green Bolt Ace Pickup",
	"Red Bolt Ace Pickup",
	"Blue Bolt Ace Fordor",					// 20
	"Dark Blue Bolt Ace Fordor",
	"Brown Bolt Ace Fordor",
	"Green Bolt Ace Fordor",
	"Red Bolt Ace Fordor",
	"Blue Bolt Ace Coupe",					// 25
	"Dark Blue Bolt Ace Coupe",
	"Brown Bolt Ace Coupe",
	"Green Bolt Ace Coupe",
	"Red Bolt Ace Coupe",
	"Brown Bolt Model B Tudor",				// 30
	"Red Bolt Model B Tudor",
	"Green Bolt Model B Tudor",
	"Dark Blue Bolt Model B Tudor",
	"Brown Bolt Model B Roadster",
	"Red Bolt Model B Roadster",			// 35
	"Green Bolt Model B Roadster",
	"Dark Blue Bolt Model B Roadster",
	"Brown Bolt Model B Pickup",
	"Red Bolt Model B Pickup",
	"Green Bolt Model B Pickup",			// 40
	"Dark Blue Bolt Model B Pickup",
	"Brown Bolt Model B Fordor",
	"Red Bolt Model B Fordor",
	"Green Bolt Model B Fordor",
	"Dark Blue Bolt Model B Fordor",		// 45
	"Brown Bolt Model B Delivery",
	"Red Bolt Model B Delivery",
	"Green Bolt Model B Delivery",
	"Dark Blue Bolt Model B Delivery",
	"Brown Bolt Model B Coupe",				// 50
	"Red Bolt Model B Coupe",
	"Green Bolt Model B Coupe",
	"Dark Blue Bolt Model B Coupe",
	"Brown Bolt Model B Tudor",
	"Red Bolt Model B Tudor",				// 55
	"Green Bolt Model B Tudor",
	"Dark Blue Bolt Model B Tudor",
	"Green Bolt V8 Coupe",
	"Red Bolt V8 Coupe",
	"Blue Bolt V8 Coupe",					// 60
	"Grey Bolt V8 Coupe",
	"Green Bolt V8 Forder",
	"Red Bolt V8 Forder",
	"Blue Bolt V8 Forder",
	"Grey Bolt V8 Forder",					// 65
	"Green Bolt V8 Roadster",
	"Red Bolt V8 Roadster",
	"Blue Bolt V8 Roadster",
	"Grey Bolt V8 Roadster",
	"Green Bolt V8 Touring",				// 70
	"Red Bolt V8 Touring",
	"Blue Bolt V8 Touring",
	"Grey Bolt V8 Touring",
	"Green Bolt V8 Tudor",
	"Red Bolt V8 Tudor",					// 75
	"Blue Bolt V8 Tudor",
	"Grey Bolt V8 Tudor",
	"Brubaker",
	"Silver Bruno Speedster 851",
	"Red Bruno Speedster 851",				// 80
	"Green Bruno Speedster 851",
	"Caesar 8C 2300 Racing",
	"Red Caesar 8C Mostro",
	"Black Caesar 8C Mostro",
	"White Celeste Marque 500",				// 85
	"Brown Celeste Marque 500",
	"Blue Corrozella C-Otto",
	"Green Corrozella C-Otto",
	"Blue Crusader Chromium Forder",
	"Violet Crusader Chromium Forder",		// 90
	"Green Crusader Chromium Forder",
	"Dark Blue Crusader Chromium Forder",
	"Blue Falconer",
	"Red Falconer",
	"Gangster Falconer",					// 95
	"Falconer Yellowcar",
	"Umber Guardian Terraplane Coupe",
	"Beige Guardian Terraplane Coupe",
	"Black Guardian Terraplane Coupe",
	"Umber Guardian Terraplane Fordor",		// 100
	"Beige Guardian Terraplane Fordor",
	"Black Guardian Terraplane Fordor",
	"Umber Guardian Terraplane Tudor",
	"Beige Guardian Terraplane Tudor",
	"Black Guardian Terraplane Tudor",		// 105
	"Lassister Fordor",
	"Lassister Phaeton",
	"Lassister Roadster",
	"Lassister Appolyon",
	"Lassister Charon",						// 110
	"Lassister Police",						// 111
	"Green Shubert Extra Six Forder",
	"White Shubert Extra Six Forder",
	"Blue Shubert Extra Six Forder",
	"Shubert Extra Six Forder Police",		// 115
	"Green Shubert Extra Six Tudor",
	"White Shubert Extra Six Tudor",
	"Blue Shubert Extra Six Tudor",
	"Shubert Extra Six Tudor Police",		// 119
	"Red Shubert Six",						// 120
	"White Shubert Six",
	"Black Shubert Six",
	"Shubert Six Police",					// 123
	"Silver Fletcher",
	"Orange Thor 810 Cabriolet",			// 125
	"Black Thor 810 Cabriolet",
	"Orange Thor 810 Phaeton",
	"Black Thor 810 Phaeton",
	"Orange Thor 810 Sedan",
	"Black Thor 810 Sedan",					// 130
	"Trautenberg Model J",
	"Trautenberg Racer 4WD",
	"Yellow Ulver Airstream Fordor",
	"Green Ulver Airstream Fordor",
	"Yellow Ulver Airstream Tudor",			// 135
	"Green Ulver Airstream Tudor",
	"Blue Wright Coupe",
	"Red Wright Coupe",
	"Green Wright Coupe",
	"Gangster Wright Coupe",				// 140
	"Blue Wright Fordor",
	"Red Wright Fordor",
	"Green Wright Fordor",
	"Bolt Ambulance",
	"Bolt Firetruck",						// 145
	"Bolt Hearse",
	"Bolt Hearse",
	"Bolt Truck Flatbed",
	"Bolt Truck Covered",
	"Bolt Truck (Atlantic Import)",
	"Bolt Truck",							// 150
	"phantom00",
	"thunderbird00",
	"FordHOT00",
	"Blackdragon00",
	"cord_sedanH00",
	"Flamer00",
	"fordApick00",
	"fordApicktaxi00",
	"fordTH00",
	"FThot00",
	"hotrodp200",
	"hotrodp300",
	"hotrodp400",
	"hotrodp500",
	"chevroletm6H00",
	"TBirdold00",
	"fordAdelH00",
	"hotrodp600",
	"phantomtaxi00",
];

// ===========================================================================

let skinModels = [
	"Tommy",
	"TommyBOXER",
	"TommyCOAT",
	"TommyCOATHAT",
	"TommyDELNIK",
	"TommyDELNIKHIGH",
	"TommyFREERIDER",
	"TommyGUN",
	"TommyHAT",
	"TommyHIGH",
	"TommyHIGHBLOOD",
	"TommyHighCOATHAT",
	"TommyHighHAT",
	"TommyNAHAC",
	"TommyOLD",
	"TommyOLDBLOOD",
	"TommyPYTEL",
	"TommyRACER",
	"TommyRACER2",
	"TommyRUKAV",
	"TommySAILOR",
	"TommyTAXIDRIVER",
	"TommyTAXIdriverHIGH",
	"AsisPZ1",
	"Barman01",
	"Bclerk01",
	"Bclerk02",
	"Bguard01",
	"Bguard01M",
	"Bguard02",
	"Bguard03",
	"Bguard03M",
	"Biff",
	"BigDig",
	"BnkO01",
	"BnkO02",
	"BnkO03",
	"BobAut01",
	"Bookmaker01",
	"Bookmaker02",
	"Boxer01",
	"Boxer02",
	"Boxer03",
	"Boxer04",
	"Carlo",
	"China1",
	"Chulig1",
	"Chulig1b",
	"David",
	"Delnik01",
	"Delnik02",
	"Delnik03",
	"Detektiv01",
	"Detektiv02",
	"Detektiv03",
	"Enemy01+",
	"Enemy01",
	"Enemy02+",
	"Enemy02",
	"Enemy03+",
	"Enemy03",
	"Enemy04",
	"Enemy04BLOOD",
	"Enemy04K",
	"Enemy05",
	"Enemy06+",
	"Enemy06",
	"Enemy07+",
	"Enemy07",
	"Enemy08+",
	"Enemy08",
	"Enemy08K",
	"Enemy09+",
	"Enemy09",
	"Enemy09K",
	"Enemy10+",
	"Enemy10",
	"Enemy10K",
	"Enemy11K",
	"Enemy12",
	"Enemy12K",
	"Enemy13C",
	"Enemy91",
	"Enemy92",
	"FMVENemy11K",
	"FREEgang01",
	"FREEgang02",
	"FrankHIGH",
	"Friend1",
	"Friend2",
	"Gangster01",
	"Gangster02",
	"Gangster03",
	"Gangster04",
	"Gangster05",
	"GodzMan1",
	"Guard01",
	"Guard02",
	"Hasic01",
	"HighCivil",
	"HighCivilBLOOD",
	"Homeless01",
	"Hoolig01",
	"Hoolig02",
	"Hoolig03",
	"Hoolig04",
	"Hoolig05",
	"Hoolig06",
	"I04Delnik01+",
	"I04Delnik01",
	"Joe",
	"Kasar",
	"Knez",
	"LifeG01",
	"Lucas",
	"Luigi",
	"Malticka1",
	"MorelloHIGH",
	"MorelloLOW",
	"NormanHIGH",
	"Organizator01",
	"Paulie",
	"PaulieCOATHAT",
	"PaulieCTHIGH",
	"PaulieCorpse",
	"PaulieHIGH",
	"Pepe",
	"PoliceMan01",
	"PoliceMan02",
	"Politik",
	"PortGuard01",
	"PortGuard02",
	"ProdZ1",
	"Prokur",
	"Radni01",
	"Radni02",
	"Ralph",
	"RalphHIGH",
	"ReditelB",
	"ReditelH",
	"RidicNakladaku",
	"SalMan01K",
	"SalMan02K",
	"SalMan03",
	"SalMan03K",
	"SalMan04",
	"SalMan05",
	"SalMan05K",
	"Salieri2",
	"SalieriHIGH",
	"SalieriHIGH2",
	"SalieriLOW",
	"Sam",
	"SamCOATHAT",
	"SamHIGH",
	"SamHIGHblood1",
	"SamHIGHblood2",
	"SamHIGHblood3",
	"SamHIGHblood4",
	"Samblood1",
	"Sergio",
	"SergioBLOOD",
	"SynRad1",
	"SynRad1BLOOD",
	"SynRad1DEAD",
	"Tony",
	"VincenzoHIGH",
	"VincenzoLOW",
	"Vrabec",
	"Vratny1",
	"Vypravci",
	"Vypravci2",
	"WillG1",
	"WillG2",
	"WillMan01",
	"WillMan02",
	"Zavod1",
	"Zavod2",
	"Zavod3",
	"ZavodFMV1",
	"ZavodFMV2",
	"civil02",
	"civil03",
	"civil04",
	"civil05",
	"civil06",
	"civil11",
	"civil11M",
	"civil12",
	"civil13",
	"civil14",
	"civil15",
	"civil16",
	"civil16M",
	"civil17",
	"civil18",
	"civil19",
	"civil19M",
	"civil21",
	"civil21N",
	"civil22",
	"civil31",
	"civil32",
	"civil33",
	"civil34",
	"civil35",
	"civil36",
	"civil36M",
	"civil37",
	"civil38",
	"civil39",
	"civil40",
	"civil41",
	"civil42",
	"civil42M",
	"civil43",
	"civil44",
	"civil51",
	"civil51M",
	"civil52",
	"civil53",
	"civil54",
	"civil54M",
	"civil55",
	"civil55M",
	"civil56",
	"civil56M",
	"civil57",
	"civil57M",
	"civil60",
	"civil61",
	"civil62",
	"civil63",
	"civil70",
	"civil70M",
	"civil71",
	"civil72",
	"frank",
	"ohorelec01",
	"pianist1",
	"pol01",
	"pol02",
	"pol03",
	"pol11",
	"pol12",
	"pol13",
	"polim62",
	"pumpar01",
	"recep",
	"sailor01",
	"sailor01M",
	"sailor02",
	"sailor02M",
	"sailor03",
	"waiter01",
	"waiter01M",
	"waiter02",
	"waiter02M",
	"waiter03",
	"Alice1",
	"Berta",
	"Bitch01",
	"Bitch02",
	"Bitch02Mask",
	"Bitch03M",
	"CarlZen1",
	"Czena01",
	"Czena02",
	"Czena03",
	"Czena04",
	"Czena05",
	"Czena06",
	"Czena07",
	"Czena07M",
	"Czena08",
	"Czena09",
	"Czena09M",
	"Czena10",
	"Czena10M",
	"Czena11",
	"Czena11M",
	"Czena12",
	"Czena13",
	"FMVCzena03",
	"FMVCzena04",
	"March1",
	"Michelle",
	"MichelleLOW",
	"Milenka1",
	"Sarah1",
	"Sarah1Obl",
	"Sarah2",
	"Sarah2HIGH",
	"Sarah2HIGHnaha",
	"Sarah2LOW",
	"Serv01",
	"ZenaRad01",
	"gab",
	"ShadowGirlHIGH",
	"ShadowMan",
	"ShadowManHIGH",
	"ShadowManLOW2",
	"UfoPanak",
	"invisible"
];

// ===========================================================================
let gunNames = {
	1: "S&W Model 10 M&P",
	2: "Colt 1911",
	3: "S&W Model 27 Magnum",
	4: "Colt Detective Special",
	5: "Sawed-off Shotgun",
	6: "Thompson 1928"
}

let weaponNames = {
	2: "Knuckle Duster",
	3: "Knife",
	4: "Baseball Bat",
	5: "Molotov Cocktail",
	6: "Colt Detective Special",
	7: "S&W Model 27 Magnum",
	8: "S&W Model 10 M&P",
	9: "Colt 1911",
	10: "Thompson 1928",
	11: "Pump-action Shotgun",
	12: "Sawed-off Shotgun",
	13: "US Rifle, M1903 Springfield",
	14: "Mosin-Nagant 1891/30",
	15: "Grenade",
	17: "Bucket",
	20: "Steel Bar",
	25: "Crowbar",
	28: "Wooden Plank",
	29: "Bottle",
	31: "Sword",
	32: "Dogs Head",
};

let objectNames = [
	"bakery01",
	"bakery02",
	"baliksena",
	"barel_exp"
]

function getPosInFrontOfPos(pos, angle, distance) {
	let x = (pos.x + ((Math.cos(angle - (Math.PI / 2))) * distance));
	let y = pos.y;
	let z = (pos.z + ((Math.sin(angle + (Math.PI / 2))) * distance))

	return new Vec3(x, y, z);
}

// ===========================================================================


// ===========================================================================

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ===========================================================================

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ===========================================================================


// Function to calculate the distance between two points in 3D space


addCommandHandler("pm", (command, params, client) => {
	let splitParams = params.split(" ");
	let targetName = splitParams[0];
	let pmessageParams = splitParams.slice(1).join(" ");
	let pmSender = client.name;
	let targetClient = getClientFromParams(targetName);

	if (pmessageParams === "" || targetClient === "") {
		messageClient("Use /pm <id> <message>. Don't get on my nerves.", client, COLOUR_ORANGE);
		return;
	}

	if (targetClient) {
		if (targetClient.index != client.index) {
			messageClient(`"((You sent a PM to ${targetClient.name}: ${pmessageParams}))"`, client, COLOUR_YELLOW);
			messageClient(`"((You received a message from ${pmSender})): ${pmessageParams}"`, targetClient, COLOUR_ORANGE);
		} else if (targetClient.index === client.index) {
			messageClient("You can't PM yourself, you lonely idiot.", client, COLOUR_RED);
		}
	} else {
		messageClient("The kid is not online.", client, COLOUR_RED);
	}
});





function getClientFromParams(params) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].index == Number(params)) {
			return clients[i];
		}
	}

	for (let i in clients) {
		if (clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
			return clients[i];
		}
	}

	return false;
}



function closest(elementType, position = localPlayer.position) {
	return getElementsByType(elementType).reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}


addCommandHandler("getpos", (command, params, client) => {
	let player = client.player;
	if (player != null) {
	  let pos = client.player.position;
	  let rot = client.player.heading;
		console.log(`[${pos.x}, ${pos.y}, ${pos.z}], [${rot}]`);
	  messageClient(`Your current position is: [${pos.x}, ${pos.y}, ${pos.z}], [${rot}]`, client, COLOUR_GREEN);
	} else {
	  messageClient("Failed to retrieve player position.", client, COLOUR_RED);
	}
  });





function trackPlayerPositions() {
	// Get all the clients on the server
	let clients = getClients();

	// Loop through all the clients
	for (let i = 0; i < clients.length; i++) {
	  // Get the current client
	  let client = clients[i];
	  // Get the player object associated with the client
	  let player = client.player;

	  // Check if the playerPositions array has an entry for the player's ID
	  if (!playerPositions[player.id]) {
		// If not, create an empty array for the player's ID
		playerPositions[player.id] = [];
	  }

	  // Add the location and heading of the player to the array
	  playerPositions[player.id].push({
		pos: player.position,
		rot: player.heading
	  });
	}
  }



const spawnLocs = [
    { name: "pete", pos: [61.4763, 4.72524, 107.708 ]},
    { name: "tommy", pos: [8.62861251831, 22.8868865967, -602.147888184 ]},
    { name: "oakhill", pos: [738.030334473, 106.889381409, -228.563537598 ]},
    { name: "hoboken", pos: [537.296386719, -5.01502513885, 77.8488616943 ]},
    { name: "downtown", pos: [-188.796401978, 18.6846675873, -668.6328125 ]},
    { name: "hospital", pos: [-760.439697266, 12.6204996109, 753.350646973 ]},
    { name: "central", pos: [-1091.47839355, -7.27131414413, 5.55286931992 ]},
    { name: "china", pos: [-1709.24157715, 16.0029373169, 582.041442871 ]},
    { name: "salieri", pos: [-1774.59301758, -4.88487052917, -2.40491962433 ]},
    { name: "work", pos: [-2550.85546875, -3.96487784386, -554.806213379 ]},
    { name: "racing", pos: [-3534.42993164, 7.05113887787, -651.97338867 ]},
]

function initKeyBindScript() {
	console.log(LOG_INFO, "[VRR.KeyBind]: Initializing key bind script ...");
    getGlobalConfig().keyBind = loadKeyBindConfiguration();
	console.log(LOG_INFO, "[VRR.KeyBind]: Key bind script initialized!");
}

function loadKeyBindConfiguration() {
	let keyBindConfigFile = loadTextFile("keybind.json");
	return JSON.parse(keyBindConfigFile);
}

function loadConfig() {
	let configFile = loadTextFile("economy.json");
	if (configFile == "") {
		logError("Could not load economy.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}

	logInfo("Loaded config file contents successfully.");

	scriptConfig = JSON.parse(configFile);
	if (scriptConfig == null) {
		logError("Could not parse economy.json. Resource stopping ...");
		thisResource.stop();
		return false;
	}

	fixMissingConfigStuff();
	logInfo("Parsed economy file successfully.");
}


function logInfo(messageText) {
	console.log(logMessagePrefix.trim() + " " + messageText);
}

// ----------------------------------------------------------------------------

function logWarn(messageText) {
	console.warn(logMessagePrefix.trim() + " " + messageText);
}

// ----------------------------------------------------------------------------

function logError(messageText) {
	console.error(logMessagePrefix.trim() + " " + messageText);
}

addCommandHandler("createfac", (command, params, client) => {
    if (client.administrator) {
        let factionName = params.trim();

        if (factionName === "") {
            messageClient("Usage: /createfac <factionName>", client, COLOUR_GREEN);
            return;
        }

       	db.query(`INSERT INTO factions (facs, soldiers, leader) VALUES ('${factionName}', '${client.name}', '${client.name}')`, );
        messageClient(`Faction "${factionName}" has been created.`, client, COLOUR_GREEN);


    } else {
        messageClient("You are not authorized to create factions.", client, COLOUR_ORANGE);
    }
});


function messageAdmins(messageText) {
	getClients().forEach((client) => {
		if (client.administrator) {
			messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, COLOUR_ORANGE);
		}
	});

	console.warn(`[ADMIN] [#FFFFFF]${messageText}`);
}
function messageFaction(messageText) {
	
	getClients().forEach((client) => {
		
		db.query(`SELECT facs FROM factions WHERE soldiers = '${client.name}'`);
		let faction = db.query(`SELECT facs FROM factions WHERE soldiers = '${client.name}'`);
		if(faction == "") {
			console.log('faction doesnt exist');
			messageClient("You don't belong to any family, kid.", client, COLOUR_RED)
			return;
		} else {

			db.query(`SELECT soldiers FROM factions WHERE facs = '${faction}'`);
			let txtSoldiers = db.query(`SELECT soldiers FROM factions WHERE facs = '${faction}'`);
			if(txtSoldiers !== "") {
				messageClient(`(([${faction}] ${messageText}))`, client, COLOUR_AQUA);
			}
		}
	});
} 


addCommandHandler("f", (command, params, client) => {
	messageFaction(`${client.name}: ${params}`)
});


addCommandHandler("pay", (command, params, client) => {

        const splitParams = params.split(" ");
        const recipientName = splitParams[0];
        const amount = parseInt(splitParams[1]);

        if (!recipientName || isNaN(amount) || amount <= 0) {
            messageClient("Usage: /pay <playerName> <amount>", client, COLOUR_ORANGE);
            return;
        }

        // Check if recipient exists and is not the sender
        const recipient = getClientFromParams(recipientName);

        if (recipient) {
            if (recipient.index !== client.index) {
                let playerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
                const senderMoney = playerMoney;

                if (senderMoney >= amount) {
                    // Update the sender's money
                    let newSenderMoney = senderMoney - amount;
                    db.query(`UPDATE users SET money = ${newSenderMoney} WHERE username = '${client.name}'`);

                    // Update the recipient's money

                    const recipientMoney = db.query(`SELECT money FROM users WHERE username = '${recipient.name}'`);
                    const newRecipientMoney = recipientMoney + amount;
                    db.query(`UPDATE users SET money = ${newRecipientMoney} WHERE username = '${recipient.name}'`);

                    // Notify both sender and recipient
                    messageClient(`You paid $${amount} to ${recipientName}.`, client, COLOUR_GREEN);
                    messageClient(`You received $${amount} from ${client.name}.`, recipient, COLOUR_GREEN);
                } else {
                    messageClient("You don't have enough money.", client, COLOUR_ORANGE);
                }
            } else {
                messageClient("You can't pay yourself.", client, COLOUR_ORANGE);
            }
        } else {
            messageClient(`The kid "${recipientName}" not found or not online.`, client, COLOUR_ORANGE);
        }

});

/* addCommandHandler("buyveh", (command, params, client) => {

        const vehicleModel = params.trim(); // The vehicle model to buy, e.g., "Inferno"

        // Query the database to get the price of the specified vehicle
        const vehiclePrice = db.query("SELECT price FROM vehicles WHERE model = ?", vehicleModel);

        if (!vehiclePrice) {
            messageClient(`Vehicle "${vehicleModel}" not found in the dealership.`, client, COLOUR_ORANGE);
            return;
        }

        const playerMoney = client.money || 0;

        if (playerMoney >= vehiclePrice) {
            // Deduct the vehicle price from the player's money
            const PlayerMoney = playerMoney - vehiclePrice;
            db.query("UPDATE users SET money = ? WHERE username = ?", [PlayerMoney, client.name]);

            // Assign the vehicle to the player by updating the 'owner' column
            db.query("UPDATE vehicles SET owner = ? WHERE model = ?", [client.name, vehicleModel]);

            messageClient(`You bought a ${vehicleModel} for $${vehiclePrice}.`, client, COLOUR_GREEN);
        } else {
            messageClient("You don't have enough money to buy this vehicle.", client, COLOUR_ORANGE);
        }

});




*/

//========================================================================================================================



//========================================================================================================



function isNull(val) {
	if(val == null) {
		return true;
	}

	if(typeof val === "undefined") {
		return true;
	}

	return false;
}


function getDistance(vec1, vec2) {
	if(isNull(vec1) || isNull(vec2)) {
		return false;
	}
    return vec1.distance(vec2);
}





const bongioEmmetPosition = [-1743.42, -5.35, -229.33];
const gunDealerModel = "TommyRUKAV";


const gunDealerPed = game.createPed(`${gunDealerModel}.i3d`, bongioEmmetPosition, 0.0);


addCommandHandler("buygun", (command, params, client) => {

	let gunID = params;
	const gunDealerRadius = 2;
    const GunDealerCloseDistance = getDistance(client.player.position, bongioEmmetPosition);
	
	
	let MnP = 980;
	let	Colt = 1200;
	let	Magnum = 1800;
	let	ColtDetective = 3200;
	let SawedOff = 8000;
	let	Thompson = 12000;
	

	let ThisPlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
    
		if(gunID == "" || !gunID) {
			messageClient("USAGE: /buygun <id>", client, COLOUR_GREEN);
			messageClient("1- S&W Model 10 M&P: $980", client, COLOUR_WHITE);
			messageClient("2- Colt 1911: $1200", client, COLOUR_WHITE);
			messageClient("3- S&W Model 27 Magnum: $1800", client, COLOUR_WHITE);
			messageClient("4- Colt Detective Special: $3200", client, COLOUR_WHITE);
			messageClient("5- Sawed-off Shotgun: $8000", client, COLOUR_WHITE);
			messageClient("6- Thompson 1928: $12000", client, COLOUR_WHITE);	 
		
		} 
		if (GunDealerCloseDistance <= gunDealerRadius) {
			 if(gunID == "1") {

				if(ThisPlayerMoney <= MnP) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;

					} else  {
						let PlayerMoney = ThisPlayerMoney - MnP;
						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(8, 20, 30);
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudPlayerMoney(PlayerMoney);						
						} else {
							if(userWeapons2 == ""){
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(8, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudPlayerMoney(PlayerMoney);
							} else {
								if(userWeapons3 == "") {
									db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(8, 20, 30);
									db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
									let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
									hudPlayerMoney(PlayerMoney);
							} else {
								messageClient("You can't hold any more weapons", client, COLOUR_ORANGE); 
								return;
							}
						} 							
					}
				}

			} else if(gunID == "2") {

					if(ThisPlayerMoney <= Colt) {
						messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
						return;
						} else  {
							let PlayerMoney = ThisPlayerMoney - Colt;
							const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
							const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
							const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


							if (userWeapons1 == "") {
								db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(9, 20, 30);	
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);	
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudPlayerMoney(PlayerMoney);				
							} else {
								if(userWeapons2 == ""){
									db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(9, 20, 30);
									messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
									db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
									let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
									hudPlayerMoney(PlayerMoney);
								} else {
									if(userWeapons3 == "") {
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(9, 20, 30);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudPlayerMoney(PlayerMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						} 							
					}
				}

			} else if(gunID == "3") {

					if(ThisPlayerMoney <= Magnum) {
						messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
						return;
					} else  {
						let PlayerMoney = ThisPlayerMoney - Magnum;
							const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
							const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
							const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


							if (userWeapons1 == "") {
								db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(7, 20, 30);	
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudPlayerMoney(PlayerMoney);
							} else {
								if(userWeapons2 == ""){
									db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(7, 20, 30);
									messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
									} else {
										if(userWeapons3 == "") {
											db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
											db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
											client.player.giveWeapon(7, 20, 30);
											messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
											db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
											let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
											hudPlayerMoney(PlayerMoney);
										} else {
										messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
										return;
								}
							}
						}
					}
			} else if(gunID == "4") {

					
				if(ThisPlayerMoney <= ColtDetective) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;
				} else  {
					let PlayerMoney = ThisPlayerMoney - ColtDetective;
						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(6, 20, 30);	
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudPlayerMoney(PlayerMoney);
						} else {
							if(userWeapons2 == ""){
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(6, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudPlayerMoney(PlayerMoney);
								} else {
									if(userWeapons3 == "") {
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(6, 20, 30);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudPlayerMoney(PlayerMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						}
					}
				}
			} else if(gunID == "5") { 

					
				if(ThisPlayerMoney <= SawedOff) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;
				} else  {
					let PlayerMoney = ThisPlayerMoney - SawedOff;
						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(12, 5, 10);		
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudPlayerMoney(PlayerMoney);
						} else {
							if(userWeapons2 == ""){
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(12, 5, 10);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								} else {
									if(userWeapons3 == "") {
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(12, 5, 10);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudPlayerMoney(PlayerMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						}
					}
				}

			} else if(gunID == "6") {

					
				if(ThisPlayerMoney <= Thompson) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;
				} else  {
					let PlayerMoney = ThisPlayerMoney - Thompson;
						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(10, 50, 50);
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudPlayerMoney(PlayerMoney);						
						} else {
							if(userWeapons2 == ""){
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(10, 50, 50);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudPlayerMoney(PlayerMoney);
								} else {
									if(userWeapons3 == "") {
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${PlayerMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(10, 50, 50);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudPlayerMoney(PlayerMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						}
					}
				}
			}
    } else {

		messageClient("There's no gun dealer next to you.", client, COLOUR_RED);
        console.log("Player is not near the gun dealer.");
    }

	
});

addCommandHandler("despawn", (command, params, client) => {
	client.despawnPlayer();
});


//==================================================================================
