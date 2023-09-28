"use strict";













addCommandHandler("spawn", (command, params, client) => {
	let Hospital = [-758.792, 13.2488, 761.116];
	let hoboken = [328.71826, -3.187930, 267.53866];
	let saliery = [-1774.30, -5.56, 7.62];
	let asalier = [-1774.0, -3.93, 7.32];
	let salieryDoor = [-1774.6744384765625, -5.628890037536621, 3.844797372817993];
	let hoboApart = [453.92, -3.66, 297];
	

	const tpplace = params.toLowerCase();
	if (tpplace === '1') {
		
		spawnPlayer(client, asalier, 0.0, "TommyHighHAT.i3d");


	} else if (tpplace === '2') {
		
		spawnPlayer(client, hoboken, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '3') {
		spawnPlayer(client, hoboApart, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '4') {
		spawnPlayer(client, salieryDoor, 0.0, "TommyHighHAT.i3d");
	} else if (tpplace === '5') {
		spawnPlayer(client, bongioEmmetPosition, 0.0, "TommyHighHAT.i3d");
	} else {
		  messageClient("USAGE: /spawn 1/2/3/4/5", client, COLOUR_ORANGE);
		}
	  });

// ===========================================================================
bindEventHandler("OnResourceStart", thisResource, (event, resource) => {


});


// ===========================================================================
addCommandHandler("changemap", (command, params, client) => {
	client.despawnPlayer();
	game.changeMap("MISE03-SALIERYKONEC");
});


addNetworkHandler("mapLoaded", function(client, mapNew) {
	if(mapNew == "MISE03-SALIERYKONEC") {
		spawnPlayer(client, [-1774.0, -3.93, 7.32], 0.0, 'TommyHighHAT.i3d');
	}
});




addEventHandler("OnPlayerJoined", (event, client) => {

});

// ===========================================================================




addEventHandler("OnPlayerJoin", (event, client) => {
	console.log(`${client.name} is joining!`);
	let littleitaly = [-1980.949, -4.982666, 23.199167];
	spawnPlayer(client, littleitaly, 0.0, 'TommyHighHAT.i3d');
});

// ===========================================================================
addEventHandler("OnPedDeath", (event, ped) => {
    let Hospital = [-758.792, 13.2488, 761.116];
    messageClient("You died foo", client, COLOUR_RED);

    spawnPlayer(client, Hospital, 0.0, "TommyHighHAT.i3d");
});


addEventHandler("OnPlayerQuit", (event, client, reasonId) => {
	console.log(`${client.name} has left!`);
});

// ===========================================================================
function getPlayerPosition() {
    let position = client.player.position;
    if(client.player.vehicle) {
        position = client.player.vehicle.position;
    }

    return position;
}



function setLocalPlayerHealth(health) {
    client.player.health = health;
}





function SendPlayer(mapNew, client) {
	triggerNetworkEvent("mapLoaded", client, mapNew);
}


function updatePlayerMoney(newMoney, client) {
    triggerNetworkEvent("updateMoney", client, newMoney);
}




addCommandHandler("veh", (command, params, client) => {
	let model = getVehicleModelFromParams(params);
	if (!model) {
		message("That vehicle model is invalid!");
		return false;
	}

	let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
	let vehicle = game.createVehicle(`${model}.i3d`, frontOfPlayer, client.player.heading);
    updatePlayerMoney(1000);

	if (vehicle) {
		message(`${client.name} spawned a ${vehicleNames[vehicleModels.indexOf(model)]} vehicle`, COLOUR_YELLOW);
	} else {
		messageClient(`Vehicle failed to create!`, COLOUR_ORANGE);
	}

});
// ===========================================================================

addCommandHandler("ped", (command, params, client) => {
	let model = getSkinModelFromParams(params);

	if (!model) {
		message("That ped skin is invalid!");
		return false;
	}

	let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
	let ped = game.createPed(`${model}.i3d`, frontOfPlayer, client.player.heading);

	if (ped) {
		message(`${client.name} created a ${skinModels[skinModels.indexOf(model)]} ped`, COLOUR_YELLOW);
	} else {
		messageClient(`Ped failed to create!`, COLOUR_ORANGE);
	}
});

// ===========================================================================

addCommandHandler("gun", (command, params, client) => {
	let weaponId = Number(params) || 8;

	client.player.giveWeapon(weaponId, 0, 999);
	message(`${client.name} gave themself a ${weaponNames[weaponId]}`);
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

function getPosInFrontOfPos(pos, angle, distance) {
	let x = (pos.x + ((Math.cos(angle - (Math.PI / 2))) * distance));
	let y = pos.y;
	let z = (pos.z + ((Math.sin(angle + (Math.PI / 2))) * distance))

	return new Vec3(x, y, z);
}

// ===========================================================================

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ===========================================================================

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ===========================================================================
addCommandHandler("spawn", (command, params, client) => {
	let Hospital = [-758.792, 13.2488, 761.116];
	let hoboken = [328.71826, -3.187930, 267.53866];
	let saliery = [-1774.30, -5.56, 7.62];
	let salieryDoor = [-1774.6744384765625, -5.628890037536621, 3.844797372817993];
	let motorest  = [-7.22, 2.4, 20.15];
	let littleitaly = [-1980.949, -4.982666, 23.199167];
	let bartest = [-387.11, 15.47, -515];
	let kingbed = [-545.79, 15.38, -436.02];


	const tpplace = params.toLowerCase();
	if (tpplace === '1') {

		spawnPlayer(client, littleitaly, 0.0, "TommyHighHAT.i3d");


	} else if (tpplace === '2') {

		spawnPlayer(client, hoboken, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '3') {

		spawnPlayer(client, saliery, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '4') {

		spawnPlayer(client, salieryDoor, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === '5') {

		spawnPlayer(client, kingbed, 0.0, "TommyHighHAT.i3d");

	} else if (tpplace === 'h') {

		spawnPlayer(client, Hospital, 0.0, "TommyHighHAT.i3d");

	}else if (tpplace === 'mo') {

		spawnPlayer(client, motorest, 0.0, "TommyHighHAT.i3d");

	}else {
		  messageClient("USAGE: /spawn 1/2/3/4/5/h/mo", client, COLOUR_ORANGE);
		}
});


function getClientFromPlayer(player) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player == player) {
			return clients[i];
		}
	}
}



function getDistance(pos1, pos2) {
		let dx = pos1[0] - pos2[0];
		let dy = pos1[1] - pos2[1];
		let dz = pos1[2] - pos2[2];
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

function messageCloser(messageText) {
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
	}





function getClientFromPed(ped) {
		let clients = getClients();
		for (let i in clients) {
			if (clients[i].player == ped) {
				return clients[i];
			}
		}

		return false;
}







function getPlayerPed(client) {
	return client.player;
}

// ===========================================================================

function getScreenWidth() {
	return game.width;
}

// ===========================================================================

function getScreenHeight() {
	return game.height;
}

/*
// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: login.js
// DESC: Provides login GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let login = {
	window: null,
	logoImage: null,
	messageLabel: null,
	passwordInput: null,
	loginButton: null,
	forgotPasswordButton: null,
	resetPasswordLabel: null,
};

// ===========================================================================

let loginHTML =
	`<html>
    <head>
        <title>Asshat Gaming Roleplay: Login</title>
        <style type="text/css" rel="stylesheet">
            .input-box
            {
                font-family: "Roboto";
                font-size: 14px;
                border-style: solid;
                border-colour: #0066AA;
                border-radius: 2px;
                color: #0066AA;
            };
        </style>
    </head>
    <body>
    </body>
</html>`;

// ===========================================================================

function initLoginGUI() {
	console.log(LOG_DEBUG, `[AGRP.GUI] Creating login GUI ...`);
	login.window = mexui.window(getScreenWidth() / 2 - 150, getScreenHeight() / 2 - 135, 300, 275, 'LOGIN', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
			transitionTime: 500,
		},
		title: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		icon: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});
	login.window.titleBarIconSize = toVector2(0, 0);
	login.window.titleBarHeight = 0;
	login.window.titleBarShown = false;

	login.logoImage = login.window.image(100, 20, 100, 100, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	login.messageLabel = login.window.text(20, 135, 260, 20, 'Please enter your password!', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	login.passwordInput = login.window.textInput(20, 170, 260, 25, '', {
		main: {
			backgroundColour: toColour(0, 0, 0, 120),
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], textInputAlpha),
			textColour: toColour(200, 200, 200, 255),
			textSize: 10.0,
			textFont: mainFont,
		},
		caret: {
			lineColour: toColour(255, 255, 255, 255),
		},
		placeholder: {
			textColour: toColour(200, 200, 200, 150),
			textSize: 10.0,
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 255),
		},
	});
	login.passwordInput.masked = true;
	login.passwordInput.placeholder = "Password";

	login.loginButton = login.window.button(20, 205, 260, 30, 'LOGIN', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 12.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, checkLogin);

	login.forgotPasswordButton = login.window.button(180, 240, 100, 15, 'RESET PASS', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 8.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, switchToPasswordResetGUI);

	login.resetPasswordLabel = login.window.text(110, 240, 60, 15, 'Forgot your password?', {
		main: {
			textSize: 8.0,
			textAlign: 1.0,
			textColour: toColour(180, 180, 180, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	console.log(LOG_DEBUG, `[AGRP.GUI] Created login GUI`);
}

// ===========================================================================

function showLoginGUI() {
	closeAllWindows();
	console.log(LOG_DEBUG, `[AGRP.GUI] Showing login window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	login.window.shown = true;
	mexui.focusedControl = login.passwordInput;
	guiSubmitKey = checkLogin;

	showLocaleChooserGUI(new Vec2(getScreenWidth() / 2 - (localeChooser.window.size.x / 2), login.window.position.y + login.window.size.y + 20));
	//showSmallGameMessage(`If you don't have a mouse cursor, press ${toUpperCase(getKeyNameFromId(disableGUIKey))} to disable GUI`, COLOUR_WHITE, 7500);
}

// ===========================================================================

function checkLogin() {
	console.log(LOG_DEBUG, `[AGRP.GUI] Checking login with server ...`);
	sendNetworkEventToServer("v.rp.checkLogin", login.passwordInput.lines[0]);
}

// ===========================================================================

function loginFailed(errorMessage) {
	console.log(LOG_DEBUG, `[AGRP.GUI] Server reports login failed`);
	login.messageLabel.text = errorMessage;
	login.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	login.passwordInput.text = "";
}

// ===========================================================================

function loginSuccess() {
	console.log(LOG_DEBUG, `[AGRP.GUI] Server reports login was successful`);
	guiSubmitKey = false;
	closeAllWindows();
}

// ===========================================================================

function switchToPasswordResetGUI() {
	//closeAllWindows();
	//console.log(LOG_DEBUG, `[AGRP.GUI] Showing password reset dialog window`);
	showResetPasswordGUI();
	sendNetworkEventToServer("v.rp.checkResetPassword", "");
	return false;
}

// ===========================================================================

// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: gui.js
// DESC: Provides GUI functionality and styles (using MexUI)
// TYPE: Client (JavaScript)
// ===========================================================================

var app = {};

let mainFont = "Roboto"; // "Arial"

let mainLogoPath = (typeof gta == "undefined") ? "files/images/mafiac-logo.png" : "files/images/gtac-logo.png";
//let mainLogoPath = "files/images/server-logo.png";

let primaryColour = [200, 200, 200];
let secondaryColour = [16, 16, 16];
let primaryTextColour = [0, 0, 0];
let focusedColour = [200, 200, 200];
let invalidValueColour = [200, 200, 200];

let focusedColourOffset = 50;

let windowAlpha = 200;
let windowTitleAlpha = 180;
let buttonAlpha = 180;
let textInputAlpha = 180;

let guiReady = false;

// ===========================================================================

let characterData = [];
let currentCharacter = 0;

let inCharacterSelectScreen = false;
let creatingCharacter = false;

// ===========================================================================

function initGUIScript() {
	console.log(LOG_DEBUG, "[V.RP.GUI]: Initializing GUI script ...");
	console.log(LOG_DEBUG, "[V.RP.GUI]: GUI script initialized!");
}

// ===========================================================================

function initGUI() {
	console.log(LOG_DEBUG, `[AGRP.GUI] Initializing GUI ...`);

	initLoginGUI();
	initRegisterGUI();
	initNewCharacterGUI();
	initCharacterSelectGUI();
	initInfoDialogGUI();
	initErrorDialogGUI();
	initYesNoDialogGUI();
	initTwoFactorAuthenticationGUI();
	initListGUI();
	initResetPasswordGUI();
	initChangePasswordGUI();
	initLocaleChooserGUI();
	//initInventoryGUI();
	//initInventoryBulkGUI();
	//initClanManagerGUI();
	//initBusinessManagerGUI();
	//initHouseManagerGUI();
	//initFiveCardPokerGUI();
	//initBettingGUI();
	//initBlackJackGUI();

	closeAllWindows();
	guiReady = true;

	console.log(LOG_DEBUG, `[AGRP.GUI] All GUI created successfully!`);

	sendNetworkEventToServer("v.rp.guiReady", true);
};

// ===========================================================================

function closeAllWindows() {
	console.log(LOG_DEBUG, `[AGRP.GUI] Closing all GUI windows`);
	infoDialog.window.shown = false;
	yesNoDialog.window.shown = false;
	errorDialog.window.shown = false;
	register.window.shown = false;
	login.window.shown = false;
	newCharacter.window.shown = false;
	characterSelect.window.shown = false;
	twoFactorAuth.window.shown = false;
	listDialog.window.shown = false;
	passwordReset.window.shown = false;
	passwordChange.window.shown = false;
	localeChooser.window.shown = false;
	//houseManager.window.shown = false;
	//businessManager.window.shown = false;
	//clanManager.window.shown = false;
	//inventoryGUI.window.shown = false;
	//inventoryBulkGUI.window.shown = false;
	//bettingGUI.window.shown = false;
	//blackJackGUI.window.shown = false;
	//fiveCardPokerGUI.window.shown = false;

	mexui.setInput(false);
	mexui.focusedControl = false;

	guiSubmitKey = false;
	guiLeftKey = false;
	guiRightKey = false;
	guiUpKey = false;
	guiDownKey = false;

	setChatWindowEnabled(true);
}

// ===========================================================================

function isAnyGUIActive() {
	if (!guiReady) {
		return false;
	}

	if (infoDialog.window.shown == true) {
		return true;
	}

	if (yesNoDialog.window.shown == true) {
		return true;
	}

	if (errorDialog.window.shown == true) {
		return true;
	}

	if (register.window.shown == true) {
		return true;
	}

	if (login.window.shown == true) {
		return true;
	}

	if (newCharacter.window.shown == true) {
		return true;
	}

	if (characterSelect.window.shown == true) {
		return true;
	}

	if (twoFactorAuth.window.shown == true) {
		return true;
	}

	if (listDialog.window.shown == true) {
		return true;
	}

	if (passwordReset.window.shown == true) {
		return true;
	}

	if (passwordChange.window.shown == true) {
		return true;
	}

	if (localeChooser.window.shown == true) {
		return true;
	}

	//if (clanManager.window.shown == true) {
	//	return true;
	//}

	//if (businessManager.window.shown == true) {
	//	return true;
	//}

	//if (houseManager.window.shown == true) {
	//	return true;
	//}

	//if (inventoryGUI.window.shown == true) {
	//	return true;
	//}

	//if (inventoryBulkGUI.window.shown == true) {
	//	return true;
	//}

	//if (bettingGUI.window.shown == true) {
	//	return true;
	//}

	//if (blackJackGUI.window.shown == true) {
	//	return true;
	//}

	//if (fiveCardPokerGUI.window.shown == true) {
	//	return true;
	//}

	return false;
}

// ===========================================================================

function setGUIColours(red1, green1, blue1, red2, green2, blue2, red3, green3, blue3) {
	console.log(LOG_DEBUG, `[AGRP.GUI] Received new GUI colours from server: ${red1}, ${green1}, ${blue1} / ${red2}, ${green2}, ${blue2} / ${red3}, ${green3}, ${blue3}`);
	primaryColour = [red1, green1, blue1];
	secondaryColour = [red2, green2, blue2];
	primaryTextColour = [red3, green3, blue3];
	focusedColour = [red1 + focusedColourOffset, green1 + focusedColourOffset, blue1 + focusedColourOffset];

	initGUI();
}

// ===========================================================================

function hideAllGUI() {
	closeAllWindows();
	setChatWindowEnabled(true);
	guiSubmitKey = false;
}

// ===========================================================================

function processGUIKeyPress(keyCode) {
	console.log(LOG_DEBUG, `[AGRP.GUI] Processing key press: ${keyCode}`);

	if (!guiReady) {
		return false;
	}

	if (!isAnyGUIActive()) {
		console.log(LOG_DEBUG, `[AGRP.GUI] GUI is not active. Cancelling keypress processing.`);
		return false;
	}

	if (keyCode == SDLK_RETURN || keyCode == SDLK_RETURN2) {
		console.log(LOG_DEBUG, `[AGRP.GUI] Key press is submit (${guiSubmitKey})`);
		if (guiSubmitKey != false) {
			console.log(LOG_DEBUG, `[AGRP.GUI] Calling submit key function`);
			guiSubmitKey.call();
		}
	} else if (keyCode == getKeyIdFromParams("left") || keyCode == getKeyIdFromParams("a")) {
		console.log(LOG_DEBUG, `[AGRP.GUI] Key press is left (${guiLeftKey})`);
		if (guiLeftKey != false) {
			console.log(LOG_DEBUG, `[AGRP.GUI] Calling left key function`);
			guiLeftKey.call();
		}
	} else if (keyCode == getKeyIdFromParams("right") || keyCode == getKeyIdFromParams("d")) {
		console.log(LOG_DEBUG, `[AGRP.GUI] Key press is right (${guiRightKey})`);
		if (guiRightKey != false) {
			console.log(LOG_DEBUG, `[AGRP.GUI] Calling right key function`);
			guiRightKey.call();
		}
	} else if (keyCode == getKeyIdFromParams("down") || keyCode == getKeyIdFromParams("s")) {
		console.log(LOG_DEBUG, `[AGRP.GUI] Key press is down (${guiDownKey})`);
		if (guiDownKey != false) {
			console.log(LOG_DEBUG, `[AGRP.GUI] Calling down key function`);
			guiDownKey.call();
		}
	} else if (keyCode == getKeyIdFromParams("up") || keyCode == getKeyIdFromParams("w")) {
		console.log(LOG_DEBUG, `[AGRP.GUI] Key press is up (${guiUpKey})`);
		if (guiUpKey != false) {
			console.log(LOG_DEBUG, `[AGRP.GUI] Calling up key function`);
			guiUpKey.call();
		}
	}
}

// ===========================================================================

function processToggleGUIKeyPress(keyCode) {
	if (keyCode == disableGUIKey) {
		sendNetworkEventToServer("v.rp.toggleGUI");
	}
}

// ===========================================================================

function resetGUIStrings() {
	if (!guiReady) {
		return false;
	}

	// Login GUI
	login.messageLabel.text = getLocaleString("GUILoginWindowLabelEnterPassword");
	login.passwordInput.placeholder = getLocaleString("GUILoginWindowPasswordPlaceholder");
	login.loginButton.text = toUpperCase(getLocaleString("GUILoginWindowSubmitButton"));
	login.forgotPasswordButton.text = toUpperCase(getLocaleString("GUILoginWindowResetPasswordButton"));
	login.resetPasswordLabel.text = getLocaleString("GUILoginWindowForgotPasswordLabel");

	// Register GUI
	register.messageLabel.text = getLocaleString("GUIRegisterWindowLabelCreateAccount");
	register.passwordInput.placeholder = getLocaleString("GUIRegisterWindowPasswordPlaceholder");
	register.confirmPasswordInput.placeholder = getLocaleString("GUIRegisterWindowConfirmPasswordPlaceholder");
	register.emailInput.placeholder = getLocaleString("GUIRegisterWindowEmailPlaceholder");
	register.registerButton.text = toUpperCase(getLocaleString("GUIRegisterWindowSubmitButton"));

	// Change Password GUI
	passwordChange.window.title = toUpperCase(getLocaleString("GUIChangePasswordWindowTitle"));
	passwordChange.messageLabel.text = getLocaleString("GUIChangePasswordPasswordLabel");
	passwordChange.passwordInput.placeholder = getLocaleString("GUIChangePasswordPasswordPlaceholder");
	passwordChange.confirmPasswordInput.placeholder = getLocaleString("GUIChangePasswordConfirmPasswordPlaceholder");
	passwordChange.submitButton.text = toUpperCase(getLocaleString("GUIChangePasswordSubmitButton"));

	// Reset Password GUI
	passwordReset.messageLabel.text = toUpperCase(getLocaleString("GUIResetPasswordConfirmEmailLabel"));
	passwordReset.emailInput.placeholder = getLocaleString("GUIResetPasswordEmailPlaceholder");
	passwordReset.resetPasswordButton.text = toUpperCase(getLocaleString("GUIResetPasswordSubmitButton"));
	passwordReset.backToLoginButton.text = toUpperCase(getLocaleString("GUIResetPasswordLoginButton"));
	passwordReset.backToLoginLabel.text = getLocaleString("GUIResetPasswordRememberMessage");

	// Character Selection GUI
	characterSelect.window.title = toUpperCase(getLocaleString("GUICharacterSelectWindowTitle"));
	characterSelect.cashText.text = getLocaleString("GUICharacterSelectMoneyLabel", "0");
	characterSelect.clanText.text = getLocaleString("GUICharacterSelectClanLabel", "None");
	characterSelect.lastPlayedText.text = getLocaleString("GUICharacterSelectLastPlayedLabel", "Never");
	characterSelect.previousCharacterButton.text = toUpperCase(getLocaleString("GUIPreviousCharacterButton"));
	characterSelect.nextCharacterButton.text = toUpperCase(getLocaleString("GUINextCharacterButton"));
	characterSelect.selectCharacterButton.text = toUpperCase(getLocaleString("GUIPlayAsCharacterButton"));
	characterSelect.newCharacterButton.text = toUpperCase(getLocaleString("GUINewCharacterButton"));

	// Character Creation GUI
	newCharacter.messageLabel.text = getLocaleString("GUINewCharacterMessageLabel");
	newCharacter.firstNameInput.placeholder = getLocaleString("GUINewCharacterFirstNamePlaceholder");
	newCharacter.lastNameInput.placeholder = getLocaleString("GUINewCharacterLastNamePlaceholder");
	newCharacter.createCharacterButton.text = toUpperCase(getLocaleString("GUINewCharacterSubmitButton"));
}

// ===========================================================================

function dimAllGUIElementsInWindow(guiObject) {
	for (let i in guiObject) {
		if (i != "window") {
			guiObject[i].shown = false;
		}
	}
}
*/
// ===========================================================================