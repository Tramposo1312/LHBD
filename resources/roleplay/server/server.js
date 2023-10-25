"use strict";

// ===========================================================================
let DisconnectedReason ={1: "Lost Connection", 2: "Disconnected", 3: "Unsupported Client",4: "Incorrect Password",5: "Unsupported Executable", 6: "Disconnected", 7: "Banned", 8: "Failed", 9: "Invalid Name", 10: "Crashed"}
const initMoney = 100;
const db = new module.sqlite.Database("lhbddatabase.db");
const pendingInvitations = [];

//DYNCBUILDS

let dyncbuilds = [];
let LastPlayerPosition = new Vec3 (0, 0, 0);

const VehicleOwnerType = {
	None: 0,
	Player: 1,
	Faction: 2,
	PublicJob: 3,
	Temp: 4
};


// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function(event, resource, client) {
	//INIT FUNCTIONS
	if(game.mapName == "FREERIDENOC" || game.mapName == "FREERIDE") {
		initVehicleScript();
	}
	initFactionScript();
	initBusinessScript();


	//GLOBAL CONFIGS
	const PedSkins = {
		Detectives: [52, 53, 54],
		Police: [34, 35, 36, 127, 128, 240, 241, 242, 243, 244, 245, 246],
		Normal: [3, 4, 8, 14, 16, 20, 21, 23, 24, 25, 26, 27, 29, 30, 32, 33, 37, 38, 39, 40, 41, 44, 46, 47, 48, 49, 50, 51, 55, 56, 57, 58, 59, 60, 61, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 75, 76, 79, 81, 88, 90, 91, 92, 93, 94, 95, 96, 97, 99, 101, 102, 103, 104, 105, 106, 107, 108, 110, 111, 113, 114, 115, 116, 118, 119, 120, 121, 122, 126, 129, 130, 131, 133, 134, 135, 136, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 151, 152, 153, 160, 162, 165, 167, 168, 169, 171, 172, 173, 174, 175, 181, 182, 183, 184, 185, 186, 188, 189, 190, 191, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 215, 216, 217, 219, 220, 221, 223, 225, 227, 229, 230, 231, 232, 233, 235, 236, 237, 239, 247, 248, 249, 251, 253, 254, 256, 258, 260, 261, 262, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 277, 279, 281, 282, 283, 284, 285, 287, 288, 290, 291, 292, 294, 295, 296],
		Blocked: [1, 2, 5, 6, 7, 9, 10, 11, 12, 13, 15, 17, 18, 19, 22, 28, 31, 42, 43, 45, 62, 63, 74, 77, 78, 80, 82, 83, 84, 85, 86, 87, 89, 98, 100, 109, 112, 117, 123, 124, 125, 132, 137, 149, 150, 154, 155, 156, 157, 158, 159, 161, 163, 164, 166, 170, 176, 177, 178, 179, 170, 187, 193, 197, 199, 214, 218, 222, 224, 226, 228, 234, 238, 250, 252, 255, 257, 259, 263, 279, 278, 280, 286, 289, 293, 297, 298, 299, 300, 301, 302, 303],
		Gangsters: [],
	  };
	//DECLARES

});




// ===========================================================================
//NATIVES
const PaycheckMoney = 1500;
let loggedIn = false;
let RegisteredPlayer = false;
let Teleported = false;
let factionsSpawn = null;
// ===========================================================================
//LOCATIONS
let motorest  = [-7.22, 2.4, 20.15];
let littleitaly = [-1980.949, -4.982666, 23.199167];
let saliery = [-1774.30, -5.56, 7.62];
let bartest = [-387.11, 15.47, -515];
let kingbed = [-545.79, 15.38, -436.02];
let vila = [106.33, -5.11, 171.22];
// ===========================================================================
//SPAWNS
let PlayerFactionSpawn = new Vec3 (0, 0, 0);

//FUNCTIONS
function getCardinalDirection(fX1, fZ1, fX2, fZ2) {
    const a = fX1 - fX2;
    const b = fZ1 - fZ2;
    const x = Math.abs(a);
    const y = Math.abs(b);

    const no = 0;
    const ne = 1;
    const ea = 2;
    const se = 3;
    const so = 4;
    const sw = 5;
    const we = 6;
    const nw = 7;
    const na = 8; // Unknown (not available)

    if (b < 0 && a < 0) {
        if (x < y / 2) {
            return no;
        } else if (y < x / 2) {
            return ea;
        } else {
            return ne;
        }
    } else if (b < 0 && a >= 0) {
        if (x < y / 2) {
            return no;
        } else if (y < x / 2) {
            return we;
        } else {
            return nw;
        }
    } else if (b >= 0 && a >= 0) {
        if (x < y / 2) {
            return so;
        } else if (y < x / 2) {
            return we;
        } else {
            return sw;
        }
    } else if (b >= 0 && a < 0) {
        if (x < y / 2) {
            return so;
        } else if (y < x / 2) {
            return ea;
        } else {
            return se;
        }
    } else {
        return na;
    }
}







// ===========================================================================


addCommandHandler("vdbg", (command, params, client) => {
	if(client.player.vehicle) {
		if(client.player.vehicle == sVehicle) {
			messageClient("This is a server vehicle", client, COLOUR_AQUA)
		} else {
			messageClient("This is NOT THE FUCKING server vehicle.", client, COLOUR_RED)
			messageClient(`Debugging: '${client.player.vehicle}'`, client, COLOUR_AQUA)
		}
	}
})
addEventHandler("OnPlayerJoined", (event, client) => {
	//POSITION
	LastPlayerPosition.x = parseFloat(db.query(`SELECT lastX from users WHERE username = '${client.name}'`));
	LastPlayerPosition.y = parseFloat(db.query(`SELECT lastY from users WHERE username = '${client.name}'`));
	LastPlayerPosition.z = parseFloat(db.query(`SELECT lastZ from users WHERE username = '${client.name}'`));

	console.log(`[TRMPOSO] ${client.name} => LastPosX: ${LastPlayerPosition.x}`);
	console.log(`[TRMPOSO] ${client.name} => LastPosY: ${LastPlayerPosition.y}`);
	console.log(`[TRMPOSO] ${client.name} => LastPosZ: ${LastPlayerPosition.z}`);

	//START LOGGING QUERY
			triggerNetworkEvent("IntroPlayAudio", client);
			db.query(`SELECT username FROM users WHERE username = '${client.name}'`);
			let checkUser = db.query(`SELECT username FROM users WHERE username = '${client.name}'`);
			if (checkUser == "") {
				messageClient("Welcome to Lost Heaven: Broken Dreams", client, COLOUR_GREEN);
				messageClient("To register, type /register <password>", client, COLOUR_GREEN);
				return;
			} else if (checkUser !== "") {
				messageClient("Look who's back...", client, COLOUR_AQUA);
				messageClient('Use /login <password> before i touch you, stupid kid.', client, COLOUR_AQUA);



				messageClient(`You will receive a paycheck of $${PaycheckMoney} every one hour ingame.`, client, COLOUR_GREEN);

				const paycheckInterval = 3600000;

				setInterval(() => {
					let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
					PlayerMoney = parseInt(PlayerMoney, 10) | 0;
					hudClientMoney(PlayerMoney)
				}, 1000)


				setInterval(() => {

					ClientMoney = ClientMoney + PaycheckMoney;
					db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);


					messageClient("== Payday! =============================", client, COLOUR_YELLOW);
					messageClient(`Paycheck: $${PaycheckMoney}`, client, COLOUR_GREEN);
					hudClientMoney(ClientMoney);
				}, paycheckInterval);

	}
	//SPAWNS CHECK
	let pFaction = db.query(`SELECT fac FROM factions WHERE soldiers = '${client.name}'`)
	if(pFaction == "") {
		console.log(`[TRMPOSO] Player ${client.name} is not rolling with a faction`)
	} else {
		PlayerFactionSpawn.x = parseFloat(db.query(`SELECT facX FROM factions WHERE soldiers= '${client.name}'`));
		PlayerFactionSpawn.y = parseFloat(db.query(`SELECT facY FROM factions WHERE soldiers= '${client.name}'`));
		PlayerFactionSpawn.z = parseFloat(db.query(`SELECT facZ FROM factions WHERE soldiers= '${client.name}'`));
	}


	//GUNS

});

addCommandHandler("spark", (command, params, client) => {
	if(client.administrator) {
		if(client.player.vehicle) {
			messageClient(`Debugging: This vehicle is ${client.player.vehicle}`, client, COLOUR_ORANGE)
		} else {
			messageClient('You are not in a vehicle.', client, COLOUR_RED);
		}
	} else {
		messageClient('Youre not an admin, kid', client, COLOUR_RED);
	}
})
addCommandHandler("spawntype", (command, params, client) => {
	let spwnTp = params
	if(!spwnTp || spwnTp == "") {
		messageClient("Spawn Types===============================", client, COLOUR_YELLOW);
		messageClient("1: Last Position, 2: Faction Spawn", client, COLOUR_WHITE);
		messageClient("Usage: /spawntype 1/2", client, COLOUR_WHITE);
	}

	if(spwnTp == "1") {
		messageClient("You set your spawn to your last position", client, COLOUR_GREEN)
		db.query(`UPDATE users SET spawnT = '1' WHERE username = '${client.name}'`)
	} else if(spwnTp == "2") {
		if(PlayerFactionSpawn != [0, 0, 0]) {
			messageClient("You set your spawn to your faction spawn", client, COLOUR_GREEN)
			db.query(`UPDATE users SET spawnT = '2' WHERE username = '${client.name}'`)
		} else {
			messageClient("Motherfucker you're not rolling with a family.", client, COLOUR_GREEN)
		}
	}
})

addCommandHandler("dummy", (command, params, client) => {
	let dummyPos = client.player.position;
	let dummy = game.createDummyElement(dummyPos);
	if(dummy) {
		messageInfo(`${client.name} created a dummy.`);
	} else {
		messageInfo("Failed to create a dummy.");
	}
})

addCommandHandler("audio", (command, params, client) => {
	triggerNetworkEvent("playAudio", client)
})

function changePlayerMap(aMap, client) {
	triggerNetworkEvent("mapChanging", client, aMap);
}

addCommandHandler("nmap", (command, params, client) => {
	let freeridenocm = "FREERIDENOC"
	changePlayerMap(freeridenocm);
})

addCommandHandler("mymoney", (command, params, client) => {
	let ClientMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
	messageClient(`You have a fat fucking $${ClientMoney}, son.`, client, COLOUR_GREEN);
})

function hudClientMoney(ClientMoney, client) {
    triggerNetworkEvent("hudMoney", client, ClientMoney);
}


addCommandHandler("register", (command, params, client) => {
    let splitParams = params.split(" ");
    let passwordParams = splitParams[0];

    if (!passwordParams) {
        messageClient("Usage: /register <password>", client, COLOUR_GREEN);
        return;
    }

	let regQuery = db.query(`SELECT username FROM users WHERE username = '${client.name}'`);

		if (regQuery == "") {

			hudClientMoney(initMoney);
			db.query(`INSERT INTO users (username, password, money) VALUES ('${client.name}', '${passwordParams}', '${initMoney}')`);
			messageClient("You are now registered. Use /login <password> to log in.", client, COLOUR_GREEN);
			db.query(`UPDATE users SET spawnT = '3' WHERE username = '${client.name}'`)
			RegisteredPlayer = true;

            } else if (regQuery !== "") {
				messageClient("You are already registered. Use /login <password> to log in.", client, COLOUR_AQUA);
            }
    });


addCommandHandler("login", (command, params, client) => {
	let ClientMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);



	let splitParams = params.split(" ");
	let logpassParams = splitParams[0];
	if(!loggedIn) {

		db.query(`SELECT username FROM users WHERE username = '${client.name}'`);
		let loginQuery = db.query(`SELECT username FROM users WHERE username = '${client.name}'`);

		if (loginQuery == "") {
			messageClient("You need to register first, stupid kid. Use /register <password>.", client, COLOUR_GREEN);
			return;
		} else if (!logpassParams) {
			messageClient("Usage: /login <password>", client, COLOUR_GREEN);
			console.log(loginQuery);
			return;
		}

		if (loginQuery !== "") {
			const storedPassword = db.query(`SELECT password FROM users WHERE username = '${client.name}'`);
			if (logpassParams == storedPassword) {
				message(``)
				let spawnType = parseInt(db.query(`SELECT spawnT from users WHERE username = '${client.name}'`)) | 0;
				if(spawnType == 1) {
					spawnPlayer(client, LastPlayerPosition, 0.0, 'TommyHighHAT.i3d')
					messageClient("Welcome back kid, don't get caught up lacking in the streets.", client, COLOUR_AQUA);
					messageClient('[GENERAL INFO] Set your spawn type for next session using /spawntype', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Use /help to see the help list.', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Be aware that guns will disappear after quitting, since this retard client would not save ammo.', client, COLOUR_ORANGE)
				} else if(spawnType == 2) {
					spawnPlayer(client, PlayerFactionSpawn, 0.0, 'TommyHighHAT.i3d');
					messageClient("Welcome back kid, don't get caught up lacking in the streets.", client, COLOUR_AQUA);
					messageClient('[GENERAL INFO] Set your spawn type for next session using /spawntype', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Use /help to see the help list.', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Be aware that guns will disappear after quitting, since this retard client would not save ammo.', client, COLOUR_ORANGE)

				} else {
					spawnPlayer(client, littleitaly, 180.0, 'TommyHighHAT.i3d');
					messageClient("Welcome back kid, don't get caught up lacking in the streets.", client, COLOUR_AQUA);
					messageClient('[GENERAL INFO] Set your spawn type for next session using /spawntype', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Use /help to see the help list.', client, COLOUR_ORANGE)
					messageClient('[GENERAL INFO] Be aware that guns will disappear after quitting, since this retard client would not save ammo.', client, COLOUR_ORANGE)
					console.log(`[TRMPOSO] ${client.name}'s position is on default.`)
				}


				ClientMoney = parseInt(ClientMoney, 10) | 0;
				hudClientMoney(ClientMoney);

				loggedIn = true;

				} else {
					messageClient("Wrong password, you fucking idiot. Try again, kid", client, COLOUR_RED);
			}
		}
	} else {
		messageClient("You already logged in, kid. Wanna get on my nerves or what?", client, COLOUR_RED);
	}
	});

	addCommandHandler("givemoney", (command, params, client) => {
		let splitParams = params.split(" ");
		let targetParams = splitParams[0];
		let moneyAdded = parseInt(splitParams[1], 10);
		let ClientMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
		if (!client.administrator) {
			messageClient("You are not an admin, kid.", client, COLOUR_ORANGE);
			return;
		}

		if (!targetParams || isNaN(moneyAdded) || moneyAdded <= 0) {
			messageClient("USAGE: /givemoney <id> <money>", client, COLOUR_ORANGE);
			return;
		}

		let targetClient = getClientFromParams(targetParams);
		if (!targetClient) {
			messageClient("The player you want to give money to is not online.", client, COLOUR_ORANGE);
			return;
		}




		if (!ClientMoney) {
			messageClient(`Error: Failed to retrieve the money for ${targetClient.name}.`, client, COLOUR_ORANGE);
			return;
		}
		if (targetClient) {
			if (targetClient.index === client.index) {
				ClientMoney = parseInt(ClientMoney, 10);
				ClientMoney += moneyAdded;

				db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
				messageClient(`You gave yourself $${moneyAdded}`, client, COLOUR_GREEN);
				ClientMoney = parseInt(ClientMoney, 10);
				hudClientMoney(ClientMoney);
			} else {
				targetMoney = db.query(`SELECT money FROM users WHERE username = '${targetClient.name}'`);
				targetMoney = parseInt(targetMoney, 10);
				targetMoney += moneyAdded;
				db.query(`UPDATE users SET money = ${targetMoney} WHERE username = '${targetClient.name}'`);
				messageClient(`You gave ${targetClient.name} $${moneyAdded}`, client, COLOUR_GREEN);
				hudClientMoney(targetClient, targetMoney);
				messageClient(`You have been given $${moneyAdded}`, targetClient, COLOUR_GREEN);
			}

		}
	});







// ===========================================================================
addCommandHandler("scd", (command, params, client) => {
	localPlayer.health = 0;
})










// ===========================================================================

function updateMapPlayer(ToMap, client) {
	triggerNetworkEvent("mapChanging", client, ToMap);
}

addCommandHandler("cmap", (command, params, client) => {
	let ToMap = "MISE11-VILA";
	client.despawnPlayer();
	updateMapPlayer(ToMap);
	Teleported = true;
});
addCommandHandler("exit", (command, params, client) => {

	client.despawnPlayer();
	let newMap = "FREERIDE";
	game.changeMap(newMap);
	spawnPlayer(client, lastPos, 0.0, "TommyHighHAT.i3d");

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
		spawnPlayer(client, vila, 0.0, "TommyHighHAT.i3d");


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





addEventHandler("OnPlayerJoin", (event, client) => {
	console.log(`${client.name} IP:${client.ip} is joining!`);
});

// ===========================================================================

addEventHandler("OnPlayerQuit", (event, client, reasonId) => {
    console.log(`${client.name} IP:${client.ip} has left! Reason: ${DisconnectedReason[reasonId]}`);
    if(loggedIn){
		db.query(`UPDATE users SET lastX = '${client.player.position.x}', lastY = '${client.player.position.y}', lastZ = '${client.player.position.z}' WHERE username = '${client.name}'`);
		db.query(`UPDATE users SET weapon1 = '', weapon2 = '', weapon3 = '' WHERE username = '${client.name}'`)
	}
	loggedIn = false;
});


// ===========================================================================

addEventHandler("OnPlayerChat", (event, client, messageText) => {
	event.preventDefault();

	if (localPlayer != null) {
		let messageRadius = 30.0;
		let playerPos = client.player.position;

		getClients().forEach((client) => {
			if (client.player != localPlayer) {
				let closePlayerPos = client.player.position;
				let distance = getDistance(playerPos, closePlayerPos);

				if (distance < messageRadius) {
					if (distance <= 10.0) {
						messageClient(`${client.name} says: [#FFFFFF]${messageText}`, client, COLOUR_WHITE);
					}
					if (distance > 10.0 && distance <= 20.0) {
						messageClient(`${client.name} says: [#FFFFFF]${messageText}`, client, toColour(169, 169, 169));
					}
					if (distance > 20.0 && distance <= 30.0) {
						messageClient(`${client.name} says: [#FFFFFF]${messageText}`, client, toColour(85, 85, 85));
					}
				}
			}
		})
 	}
	messageClient(`${client.name} says: ${messageText}`, client, COLOUR_WHITE);
});



function vectorDistance(vec1, vec2) {
	const dx = vec2[0] - vec1[0];
	const dy = vec2[1] - vec1[1];
	const dz = vec2[2] - vec1[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}




// ===========================================================================



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
	messageInfo(`${client.name} turned their vehicle siren ${(client.player.vehicle.siren) ? "on" : "off"}`);
});


// ===========================================================================

addCommandHandler("lights", (command, params, client) => {
	if (client.player.vehicle == null) {
		message("You need to be in a vehicle!");
		return false;
	}

	client.player.vehicle.lights = !client.player.vehicle.lights;
	messageInfo(`${client.name} turned their vehicle lights ${(client.player.vehicle.lights) ? "on" : "off"}`);
});

// ===========================================================================
function messageInfo(infoText) {
	let infoRadius = 30.0;
	let playerPos = client.player.position;

	getClients().forEach((client) => {
		let closePlayerPos = client.player.position;
		let distance = getDistance(playerPos, closePlayerPos);

		if (distance < infoRadius) {
			if (distance <= 10.0) {
				messageClient(`${infoText}`, client, toColour(177, 156, 217));
			}
			if (distance > 10.0 && distance <= 20.0) {
				messageClient(`${infoText}`, client, toColour(194, 24, 91));
			}
			if (distance > 20.0 && distance <= 30.0) {
				messageClient(`${infoText}`, client, toColour(136, 14, 79));
			}
		}

	})
}
// ----------------------------------------------------------------------------

addCommandHandler("me", (command, params, client) => {
	if (!params) {
		messageClient("USAGE: /me <text>", client, COLOUR_SILVER)
		return false;
	}

		let meMessageRadius = 30.0;
		let playerPos = client.player.position;

		getClients().forEach((client) => {
				let closePlayerPos = client.player.position;
				let distance = getDistance(playerPos, closePlayerPos);

				if (distance < meMessageRadius) {
					if (distance <= 10.0) {
						messageClient(`${client.name} ${params}`, client, toColour(177, 156, 217));
					}
					if (distance > 10.0 && distance <= 20.0) {
						messageClient(`${client.name} ${params}`, client, toColour(194, 24, 91));
					}
					if (distance > 20.0 && distance <= 30.0) {
						messageClient(`${client.name} ${params}`, client, toColour(136, 14, 79));
					}
				}

		})
});

addCommandHandler("do", (command, params, client) => {
	if (!params) {
	messageClient("USAGE: /do <text>", client, COLOUR_SILVER)
	return false;
	}

	let doMessageRadius = 30.0;
	let playerPos = client.player.position;

	getClients().forEach((client) => {
			let closePlayerPos = client.player.position;
			let distance = getDistance(playerPos, closePlayerPos);

			if (distance < doMessageRadius) {
				if (distance <= 10.0) {
					messageClient(`${params} ((${client.name}))`, client, toColour(177, 156, 217));
				}
				if (distance > 10.0 && distance <= 20.0) {
					messageClient(`${params} ((${client.name}))`, client, toColour(194, 24, 91));
				}
				if (distance > 20.0 && distance <= 30.0) {
					messageClient(`${params} ((${client.name}))`, client, toColour(136, 14, 79));
				}
			}

	})

})
addCommandHandler("my", (command, params, client) => {
	if (!params) {
	messageClient("USAGE: /my <text>", client, COLOUR_SILVER)
	return false;
	}

	let myMessageRadius = 30.0;
	let playerPos = client.player.position;

	getClients().forEach((client) => {
			let closePlayerPos = client.player.position;
			let distance = getDistance(playerPos, closePlayerPos);

			if (distance < myMessageRadius) {
				if (distance <= 10.0) {
					messageClient(`${client.name}'s ${params}`, client, toColour(177, 156, 217));
				}
				if (distance > 10.0 && distance <= 20.0) {
					messageClient(`${client.name}'s ${params}`, client, toColour(194, 24, 91));
				}
				if (distance > 20.0 && distance <= 30.0) {
					messageClient(`${client.name}'s ${params} `, client, toColour(136, 14, 79));
				}
			}

	})

});


// ----------------------------------------------------------------------------

addCommandHandler("s", (command, params, client) => {
	if (!params) {
		messageClient("USAGE: /shout <text>!", client, COLOUR_SILVER)
		return false;
	}

	let shoutRadius = 50.0;
	let playerPos = client.player.position;

	getClients().forEach((client) => {
			let closePlayerPos = client.player.position;
			let distance = getDistance(playerPos, closePlayerPos);

			if (distance < shoutRadius) {
				if (distance <= 10.0) {
					messageClient(`${client.name} shouts: ${params}!`, client, COLOUR_WHITE);
				}
				if (distance > 10.0 && distance <= 35.0) {
					messageClient(`${client.name} shouts: ${params}!`, client, COLOUR_SILVER);
				}
				if (distance > 35.0 && distance <= 50.0) {
					messageClient(`${client.name} shouts: ${params}!`, client, toColour(66, 66, 66));
				}
			}

	})
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
			message(`Oi, ${client.name} tried to PM himself, laugh at this lonely fucking idiot.`, COLOUR_RED);
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




function messageAdmins(messageText) {
	getClients().forEach((client) => {
		if (client.administrator) {
			messageClient(`[ADMIN] [#FFFFFF]${messageText}`, client, COLOUR_ORANGE);
		}
	});

	console.warn(`[ADMIN] [#FFFFFF]${messageText}`);
}






addCommandHandler("pay", (command, params, client) => {

        const splitParams = params.split(" ");
        const recipientName = splitParams[0];
        const amount = parseInt(splitParams[1]);

        if (!recipientName || isNaN(amount) || amount <= 0) {
            messageClient("Usage: /pay <playerName> <amount>", client, COLOUR_ORANGE);
            return;
        }

        const recipient = getClientFromParams(recipientName);

        if (recipient) {
            if (recipient.index !== client.index) {
                let ClientMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
                const senderMoney = ClientMoney;

                if (senderMoney >= amount) {

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

        const ClientMoney = client.money || 0;

        if (ClientMoney >= vehiclePrice) {
            // Deduct the vehicle price from the player's money
            const ClientMoney = ClientMoney - vehiclePrice;
            db.query("UPDATE users SET money = ? WHERE username = ?", [ClientMoney, client.name]);

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
gunDealerPed.name = "Charles Guiliano";

addCommandHandler("cguns", (command, params, client) => {
	db.query(`UPDATE users SET weapon1 = NULL, weapon2 = NULL, weapon3 = NULL WHERE username = '${client.name}'`);
	let Debug = db.query(`UPDATE users SET weapon1 = NULL, weapon2 = NULL, weapon3 = NULL WHERE username = '${client.name}'`);
	messageClient(`'Your guns are removed. // ${Debug}`, client, COLOUR_RED);
})

addCommandHandler("buygun", (command, params, client) => {

	let gunID = params;
	const gunDealerRadius = 2;
    const GunDealerCloseDistance = getDistance(client.player.position, bongioEmmetPosition);
	let MnP = 980;
	let	Colt = 1200;
	let	Magnum = 1800;
	let	ColtDetective = 3200;
	let SawedOff = 8000;




		if(gunID == "" || !gunID) {
			messageClient("USAGE: /buygun <id>", client, COLOUR_GREEN);
			messageClient("1- S&W Model 10 M&P: $980", client, COLOUR_WHITE);
			messageClient("2- Colt 1911: $1200", client, COLOUR_WHITE);
			messageClient("3- S&W Model 27 Magnum: $1800", client, COLOUR_WHITE);
			messageClient("4- Colt Detective Special: $3200", client, COLOUR_WHITE);
			messageClient("5- Sawed-off Shotgun: $8000", client, COLOUR_WHITE);

		}
		if (GunDealerCloseDistance <= gunDealerRadius) {
			let ClientMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
			ClientMoney = parseInt(ClientMoney);
			 if(gunID == "1") {

				if(ClientMoney <= MnP) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;

					} else  {

						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							ClientMoney = ClientMoney - MnP;
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(8, 20, 30);
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

							hudClientMoney(ClientMoney);
						} else {
							if(userWeapons2 == ""){
								ClientMoney = ClientMoney - MnP;
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(8, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

								hudClientMoney(ClientMoney);
							} else {
								if(userWeapons3 == "") {
									ClientMoney = ClientMoney - MnP;
									db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(8, 20, 30);
									db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

									hudClientMoney(ClientMoney);
							} else {
								messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
								return;
							}
						}
					}
				}

			} else if(gunID == "2") {

					if(ClientMoney <= Colt) {
						messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
						return;
						} else  {

							const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
							const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
							const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


							if (userWeapons1 == "") {
								ClientMoney = ClientMoney - Colt;
								db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(9, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

								hudClientMoney(ClientMoney);
							} else {
								if(userWeapons2 == ""){
									ClientMoney = ClientMoney - Colt;
									db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(9, 20, 30);
									messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
									db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

									hudClientMoney(ClientMoney);
								} else {
									if(userWeapons3 == "") {
										ClientMoney = ClientMoney - Colt;
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(9, 20, 30);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

										hudClientMoney(ClientMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						}
					}
				}

			} else if(gunID == "3") {

					if(ClientMoney <= Magnum) {
						messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
						return;
					} else  {

							const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
							const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
							const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


							if (userWeapons1 == "") {
								ClientMoney = ClientMoney - Magnum;
								db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(7, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);

								hudClientMoney(ClientMoney);
							} else {
								if(userWeapons2 == ""){
									ClientMoney = ClientMoney - Magnum;
									db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
									db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
									client.player.giveWeapon(7, 20, 30);
									messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
									hudClientMoney(ClientMoney);
									} else {
										if(userWeapons3 == "") {
											ClientMoney = ClientMoney - Magnum;
											db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
											db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
											client.player.giveWeapon(7, 20, 30);
											messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
											db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
											hudClientMoney(ClientMoney);
										} else {
										messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
										return;
								}
							}
						}
					}
			} else if(gunID == "4") {


				if(ClientMoney <= ColtDetective) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;
				} else  {

						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							ClientMoney = ClientMoney - ColtDetective;
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(6, 20, 30);
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudClientMoney(ClientMoney);
						} else {
							if(userWeapons2 == ""){
								ClientMoney = ClientMoney - ColtDetective;
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(6, 20, 30);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
								hudClientMoney(ClientMoney);
								} else {
									if(userWeapons3 == "") {
										ClientMoney = ClientMoney - ColtDetective;
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(6, 20, 30);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudClientMoney(ClientMoney);
									} else {
									messageClient("You can't hold any more weapons", client, COLOUR_ORANGE);
									return;
							}
						}
					}
				}
			} else if(gunID == "5") {


				if(ClientMoney <= SawedOff) {
					messageClient("Not enough money, fucker.", client, COLOUR_ORANGE);
					return;
				} else  {

						const userWeapons1 = db.query(`SELECT weapon1 FROM users WHERE username = '${client.name}'`);
						const userWeapons2 = db.query(`SELECT weapon2 FROM users WHERE username = '${client.name}'`);
						const userWeapons3 = db.query(`SELECT weapon3 FROM users WHERE username = '${client.name}'`);


						if (userWeapons1 == "") {
							ClientMoney = ClientMoney - SawedOff;
							db.query(`UPDATE users SET weapon1 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
							db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
							client.player.giveWeapon(12, 5, 10);
							messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
							db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
							hudClientMoney(ClientMoney);
						} else {
							if(userWeapons2 == ""){
								ClientMoney = ClientMoney - SawedOff;
								db.query(`UPDATE users SET weapon2 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
								db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
								client.player.giveWeapon(12, 5, 10);
								messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
								hudClientMoney(ClientMoney);
								} else {
									if(userWeapons3 == "") {
										ClientMoney = ClientMoney - SawedOff;
										db.query(`UPDATE users SET weapon3 = '${gunNames[gunID]}' WHERE username = '${client.name}'`);
										db.query(`UPDATE users SET money = ${ClientMoney} WHERE username = '${client.name}'`);
										client.player.giveWeapon(12, 5, 10);
										messageClient("There you go.. Hide it and fuck off!!", client, COLOUR_WHITE);
										db.query(`SELECT money FROM users WHERE username = '${client.name}'`);
										hudClientMoney(ClientMoney);
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


addCommandHandler("invfac", (command, params, client) => {
	let targetClient = getClientFromParams(params);
	let isLeader = db.query(`SELECT leader FROM factions WHERE leader = '${client.name}'`);
	let pFaction = db.query(`SELECT fac FROM factions WHERE soldiers = '${client.name}'`);
	let tpFaction = db.query(`SELECT fac FROM factions WHERE soldiers = '${targetClient.name}'`);

	if (isLeader !== "") {
        if(targetClient) {
			if (targetClient.index !== client.index) {
				if(tpFaction !== "") {
					messageClient("This player is already rolling with a family.", client, COLOUR_RED);
					return;
				} else {

					const invitation = {
                        inviter: client.name,
                        invitee: targetClient.name,
                        faction: String(pFaction),
                    };

                    pendingInvitations.push(invitation);

					messageClient(`You've sent an invitation to ${targetClient.name}`, client, COLOUR_ORANGE);
					messageClient(`${client.name} has sent you an invitation to ${pFaction} family. Use /accfam to accept.`, targetClient, COLOUR_YELLOW);
				}
			} else {
				message(`This kid ${client.name} from ${pFaction} tried to send a family invitation to himself, laugh at this lonely idiot.`);
			}
		} else {
			message(`This kid ${client.name} from ${pFaction} tried to send a family invitation to an offline player, laugh at this blindfuck.`);
		}
	} else {
		messageClient("You are not a family leader, fool.", client, COLOUR_RED);
		return;
	}
});


addCommandHandler("accfam", (command, params, client) => {
    const pendingInvitation = pendingInvitations.find((invitation) => invitation.invitee === client.name);

    if (pendingInvitation) {
        db.query(`INSERT INTO factions (fac, soldiers) VALUES('${pendingInvitation.faction}', '${client.name}')`)
        messageClient(`You've accepted the invitation to join ${pendingInvitation.faction} family.`, client, COLOUR_GREEN);

        const inviterClient = pendingInvitation.inviter;
        if (inviterClient) {
            messageClient(`${client.name} has accepted your invitation to join ${pendingInvitation.faction} family.`, inviterClient, COLOUR_GREEN);
        }

        pendingInvitations.splice(pendingInvitations.indexOf(pendingInvitation), 1);
    } else {
        messageClient("You don't have any pending family invitations.", client, COLOUR_RED);
    }
});

//===========================================================================================================
// ANIMAIONS

//===========================================================================================================





//==========================================================================================================================
//HANDLING INVENTORY SYSTEM




//==========================================================================================================================
//FACTION SYSTEM

//======================================================================================================
/*
addCommandHandler("caparts", (command, params, client) => {
	if(client.administrator) {
		apartPos = client.player.position;
		db.query(`INSERT INTO dyncbuilds (builds, apartX, apartY, apartZ) VALUES ('Apartement','${apartPos.x}', '${apartPos.y}', '${apartPos.z}'`)
		messageClient("You created an apartment entry successfully!", client, COLOUR_GREEN);
	} else {
		messageClient("You're not allowed to do that, kid.", client, COLOUR_RED);
	}
});

addCommandHandler("enter", (command, params, client) => {
	let entryRadius = 2.0;
})
*/
