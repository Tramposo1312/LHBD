const serverVehicles = [];
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
				console.log(`Vehicle ${vehID} created successfully`);
			} else {
				console.log(`Vehicle ${vehID} failed to create.`);
			}
			serverVehicles.push(tempServerVehicle);

		}
	}
}

function initVehicleScript() {
	console.log('[TRMPOSO] Initialising vehicle script...')
	createServerVehicles();
	console.log('[TRMPOSO] Vehicle script initialised successfully.');
}

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

12