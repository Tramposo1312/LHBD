
class Faction {
    constructor(name, slots, vehicles = [], businesses = [], soldiers, leader) {
      this.name = name;
      this.slots = slots;
      this.vehicles = vehicles;
      this.businesses = businesses;
      this.soldiers = soldiers;
      this.leader = leader;
    }

    toString() {
        return `Faction: ${this.name}, Slots: ${this.slots}, Vehicles: ${this.vehicles.split(', ')}, Businesses: ${this.businesses.split(', ')}, Soldiers: ${this.soldiers.split(', ')}, Leader: ${this.leader}`;
    }
  
    addVehicle(vehicle) {
      this.vehicles.push(vehicle);
    }
  
    removeVehicle(vehicle) {
      const index = this.vehicles.indexOf(vehicle);
      if (index !== -1) {
        this.vehicles.splice(index, 1);
      }
    }
  
    addBusiness(business) {
      this.businesses.push(business);
    }
  
    removeBusiness(business) {
      const index = this.businesses.indexOf(business);
      if (index !== -1) {
        this.businesses.splice(index, 1);
      }
    }
  }

function retrieveFactionsFromDatabase() {
    const factions = [];
  
    for (let factionID = 1; factionID <= 10; factionID++) { // Assuming you have 10 factions
      const nameQuery = db.query(`SELECT fac FROM factions WHERE id = '${factionID}'`);
      const slotsQuery = db.query(`SELECT slots FROM factions WHERE id = '${factionID}'`);
      const vehiclesQuery = db.query(`SELECT fVeh FROM factions WHERE id = '${factionID}'`);
      const businessesQuery = db.query(`SELECT fBiz FROM factions WHERE id = '${factionID}'`);
      const soldiersQuery = db.query(`SELECT soldiers FROM factions WHERE id = '${factionID}'`);
      const leaderQuery = db.query(`SELECT leader FROM factions WHERE id = '${factionID}'`);
  
      if (String(nameQuery).length > 3) {
        const name = String(nameQuery);
        const slots = parseInt(slotsQuery);
        const vehicles = String(vehiclesQuery); 
        const businesses = String(businessesQuery);
        const soldiers = String(soldiersQuery);
        const leader = String(leaderQuery);
  
        const faction = new Faction(name, slots, vehicles, businesses, soldiers, leader);
        factions.push(faction);
        console.log(`${nameQuery} faction retrieved successfully`);
        console.log(faction);
      } 
    }
    return factions;  
}
  

// =====================================================================================




function initFactionScript() {
    console.log('[TRMPOSO] Faction script initialising...')
    let fQuery = retrieveFactionsFromDatabase();
    if(fQuery) {
        console.log('[TRMPOSO] Faction script initialised successfully')
    } else {
        console.log('[TRMPOSO] Faction script failed to initialise')
    }
}


addCommandHandler("createfac", (command, params, client) => {
    if (client.administrator) {
        let factionName = params.trim();

        if (factionName === "") {
            messageClient("Usage: /createfac <factionName>", client, COLOUR_GREEN);
            return;
        }

       	db.query(`INSERT INTO factions (fac, soldiers, leader) VALUES ('${factionName}', '${client.name}', '${client.name}')`, );
        messageClient(`Faction "${factionName}" has been created.`, client, COLOUR_GREEN);


    } else {
        messageClient("You are not authorized to create factions.", client, COLOUR_ORANGE);
    }
});

addCommandHandler("f", (command, params, client) => {
	let factionMessageText = params;
	if(!factionMessageText) {
		messageClient("/f <text>, kid.", client, COLOUR_RED);
	} else {
		messageFaction(`${client.name}: ${factionMessageText}`);
	}

});

function messageFaction(messageText) {

	getClients().forEach((client) => {

		db.query(`SELECT fac FROM factions WHERE soldiers = '${client.name}'`);
		let cFaction = db.query(`SELECT fac FROM factions WHERE soldiers = '${client.name}'`);
		if(cFaction == "") {
			messageClient("You don't belong to any family, kid.", client, COLOUR_RED)
			return;
		} else {
			let txtSoldiers = db.query(`SELECT soldiers FROM factions WHERE fac = '${cFaction}'`);
			if(txtSoldiers !== "") {
				messageClient(`(([${cFaction}] ${messageText}))`, client, COLOUR_AQUA);
			}
		}
	});
}

addCommandHandler("fsetspawn", (command, params, client) => {
    let facLeader = db.query(`SELECT leader FROM factions WHERE leader = '${client.name}'`);
    if (facLeader == "") {
        messageClient("You are not a faction leader, kid.", client, COLOUR_RED);
    } else {
        factionsSpawn = client.player.position;
        let faction = db.query(`SELECT fac FROM factions WHERE leader = '${client.name}'`);
        let query = db.query(`UPDATE factions SET facX = '${factionsSpawn.x}', facY = '${factionsSpawn.y}', facZ = ${factionsSpawn.z} WHERE leader = '${client.name}'`);
        if (query) {
            messageClient(`You have set a new faction spawn for ${faction}`, client, COLOUR_GREEN);
        } else {
			messageClient("Something bad happened")
		}
    }
});
