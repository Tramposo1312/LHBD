"use strict";

// ----------------------------------------------------------------------------
const db = new module.sqlite.Database("lhbddatabase.db");

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	setInterval(updatePlayerScoreboardPing, 2000);
	setInterval(setPlayersFactions, 2000);
});

// ----------------------------------------------------------------------------

function updatePlayerScoreboardPing() {
	getClients().forEach((client) => {
		client.setData("v.ping", client.ping, true);
	});
}

// ----------------------------------------------------------------------------
function setPlayersFactions() {
	getClients().forEach((client) => {
		let fGet = db.query(`SELECT fac FROM factions WHERE soldiers = '${client.name}'`);
		if(fGet !== "") {
			client.setData("t.faction", fGet, true);
		} else {
			client.setData("t.faction", "No Faction", true);
		}
	})

}


// ----------------------------------------------------------------------------

function getClientFromParams(params) {
	if(typeof server == "undefined") {
		let clients = getClients();
		for(let i in clients) {
			if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
				return clients[i];
			}
		}
	} else {
		let clients = getClients();
		if(isNaN(params)) {
			for(let i in clients) {
				if(clients[i].name.toLowerCase().indexOf(params.toLowerCase()) != -1) {
					return clients[i];
				}
			}
		} else {
			let clientID = Number(params) || 0;
			if(typeof clients[clientID] != "undefined") {
				return clients[clientID];
			}
		}
	}

	return false;
}

// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------