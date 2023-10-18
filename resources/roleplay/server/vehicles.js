//DEFINES


//NETWORK HANDLERS
addNetworkHandler("OnServerVehicle", function(playerVeh) {
	playerVeh = client.player.vehicle;
	let vehCheck = getVehicleData(playerVeh, "forRent");
	if(vehCheck == true) {
		console.log("[TRMPOSO] PLayer's vehicle is server's. Success")
	} else {
		console.log("[TRMPOSO] Player's vehicle is not a server's. Failure")
	}
})
//EVENT HANDLERS

addEventHandler("OnPedEnteredVehicle", function(event, client, vehicle, seat) {
    message(`${client.name} has entered vehicle ${vehicle.id} seat ${seat}`);
	let vDebugS = getVehicleData(vehicle);
	if(vDebugS == true) {
		messageClient("You need to rent this vehicle. use /rentveh", client, COLOUR_ORANGE);
	} else {
		messageClient("You don't need to rent this vehicle.", client, COLOUR_GREEN);
	}
});


//FUNCTIONS
function getVehicleData(vehicle, dataName) {
    if (vehicle != null) {
        if (vehicle.getData != null) {
            return vehicle.getData(dataName);
        }
    }
    return null;
}

function setVehicleData(vehicle, dataName, dataValue, syncToClients = true) {
    if (vehicle != null) {
        if (typeof server != "undefined") {
            return vehicle.setData(dataName, dataValue, syncToClients);
        } else {
            return vehicle.setData(dataName, dataValue);
        }
    }
}


function createServerVehicles() {
	for (let vehID = 1; vehID <= 23; vehID++) {
		let modelQuery = db.query(`SELECT model FROM svehs WHERE vehID = '${vehID}'`);
		let posxQuery = db.query(`SELECT posX FROM svehs WHERE vehID = '${vehID}'`);
		let posyQuery = db.query(`SELECT posY FROM svehs WHERE vehID = '${vehID}'`);
		let poszQuery = db.query(`SELECT posZ FROM svehs WHERE vehID = '${vehID}'`);
		let headingQuery = db.query(`SELECT heading FROM svehs WHERE vehID = '${vehID}'`);
		if(modelQuery) {
			let aModel = String(modelQuery);
			let aposX = parseFloat(posxQuery);
			let aposY = parseFloat(posyQuery);
			let aposZ = parseFloat(poszQuery);
			let aHeading = parseFloat(headingQuery);
			let asVehPos = new Vec3(aposX, aposY, aposZ);
			let tempServerVehicle = game.createVehicle(`${aModel}.i3d`, asVehPos, aHeading)
			if(tempServerVehicle) {
                setVehicleData(tempServerVehicle, 'forRent', true)
				console.log(`Vehicle ${vehID} created successfully`);
			} else {
				console.log(`Vehicle ${vehID} failed to create.`);
			}
		}
	}
}

function initVehicleScript() {
	console.log('[TRMPOSO] Initialising vehicle script...')
	createServerVehicles();
	console.log('[TRMPOSO] Vehicle script initialised successfully.');
}

//COMANDS

addCommandHandler("engine", (command, params, client) => {
	if (!client.player.vehicle) {
		messageClient("You need to be in a vehicle!", client, COLOUR_RED);
		return false;
	}
    let vDebug = getVehicleData(client.player.vehicle, 'forRent');
    if(vDebug == true) {
		messageClient("You need to rent this vehicle before starting its engine.", client, COLOUR_RED);
	} else {
		client.player.vehicle.engine = !client.player.vehicle.engine;
		messageInfo(`${client.name} turned their vehicle engine ${(client.player.vehicle.engine) ? "on" : "off"}`);
	}

	if(game.mapName == "FREERIDENOC") {
		client.player.vehicle.lights = !client.player.vehicle.lights;
		return;
	}

});


addCommandHandler("sveh", (command, params, client) => {
	if(client.administrator) {
		let model = getVehicleModelFromParams(params);

		if (!model) {
			messageClient("That vehicle model is invalid!");
			return false;
		}

		let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
		let sVehicle = game.createVehicle(`${model}.i3d`, frontOfPlayer, client.player.heading);

		if (sVehicle) {
			messageClient(`${client.name} spawned a ${vehicleNames[vehicleModels.indexOf(model)]} vehicle`, client, COLOUR_YELLOW);
			let sVehDebug = db.query(`INSERT INTO svehs (model, posX, posY, posZ, heading) VALUES ('${model}', '${frontOfPlayer.x}', '${frontOfPlayer.y}', '${frontOfPlayer.z}', '${client.player.heading}')`);
			if(sVehDebug) {
				messageClient('Vehicle saved successfully.', client, COLOUR_GREEN)
			} else {
				messageClient('Something wrong happened', client, COLOUR_ORANGE);
			}
		} else {
			messageClient(`Vehicle failed to create!`, client, COLOUR_ORANGE);
		}
	} else {
			messageClient('Youre not an admin.', client, COLOUR_ORANGE);
	}
});


//FACTION VEHS
