let PLAYER_HAS_JOB = 0;
let PLAYER_IS_WORKING = 0;
let PLAYER_FINISHED_WORKING = 0;
let PLAYER_IS_TRANSPORTER = 0;
const TRUCKER_JOB_POS = [, ,];

addCommandHandler("truckbiz", (command, params, client) => {
    if(client.administrator) {
        if(client.player.vehicle || client.player.vehicle != null) {
            messageClient("Get out the vehicle first, fucker.", client, COLOUR_RED);
        } else {
            let frontOfPlayer = getPosInFrontOfPos(client.player.position, client.player.heading, 5);
		    let bizTruck = game.createVehicle(`TruckBxx00.i3d`, frontOfPlayer, client.player.heading);
            if(bizTruck) {
                messageClient(`${client.name} spawned a business truck.`, client, COLOUR_YELLOW);
			    let truckDebug = db.query(`INSERT INTO transporter_vehs (model, posX, posY, posZ, heading) VALUES ('TruckBxx00', '${frontOfPlayer.x}', '${frontOfPlayer.y}', '${frontOfPlayer.z}', '${client.player.heading}')`);
                if(truckDebug) {
                    messageClient("You spawned a business truck successfully.", client, COLOUR_GREEN);
                } else {
                    messageClient("Somethings wrong, pal.", client, COLOUR_RED);
                }
            } else {
                messageClient("Truck failed to create.");
            }
        }
    } else {
        messageClient("You're not an admin, kid.", client, COLOUR_RED);
        return;
    }
})


function createServerBizTrucks() {
    let queryTruck = parseInt(db.query(`SELECT truck_id FROM transporter_vehs WHERE truck_id = '1'`));
    if (queryTruck == 1) {

        for (let vehID = 1; vehID <= 23; vehID++) {
            let modelQuery = db.query(`SELECT model FROM transporter_vehs WHERE truck_id = '${vehID}'`);
            let posxQuery = db.query(`SELECT posX FROM transporter_vehs WHERE truck_id = '${vehID}'`);
            let posyQuery = db.query(`SELECT posY FROM transporter_vehs WHERE truck_id = '${vehID}'`);
            let poszQuery = db.query(`SELECT posZ FROM transporter_vehs WHERE truck_id = '${vehID}'`);
            let headingQuery = db.query(`SELECT heading FROM transporter_vehs WHERE truck_id = '${vehID}'`);
            if(modelQuery) {
                let aModel = String(modelQuery);
                let aposX = parseFloat(posxQuery);
                let aposY = parseFloat(posyQuery);
                let aposZ = parseFloat(poszQuery);
                let aHeading = parseFloat(headingQuery);
                let asBizTruckPos = new Vec3(aposX, aposY, aposZ);
                let tempBizTruck = game.createVehicle(`${aModel}.i3d`, asBizTruckPos, aHeading)
                if(tempBizTruck) {
                    setVehicleData(tempBizTruck, 'bizTruck', true)
                    console.log(`Truck ${vehID} created successfully`);
                } else {
                    console.log(`Vehicle ${vehID} failed to create.`);
                }
            }
        }

    } else {
        console.log("No business trucks added yet.");
    }
}

function initBizTrucksScript() {
	console.log('[TRMPOSO] Initialising business trucks script...')
	createServerBizTrucks();
	console.log('[TRMPOSO] Business trucks script initialised successfully.');
}

