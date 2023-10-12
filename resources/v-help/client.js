"use strict";

// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------

addCommandHandler("help", function(command, params) {
	if(!params || params == "") {
		showMainHelpList();
	} else {
		switch(params.toLowerCase()) {
			case "veh":
			case "v":
			case "car":
			case "vehicle":
				message("/veh, /engine, /lights, /lock", COLOUR_WHITE);
				break;

			case "ped":
			case "civ":
			case "c":
			case "npc":
			case "bot":
			case "civilian":
				message("[#666666]/ped <id/name>[#FFFFFF]to spawn a ped.", COLOUR_WHITE);
				break;

			case "plr":
			case "player":
				message("[#666666]The following commands can be used on your player:", COLOUR_WHITE);
				message("/skin /health /armour /gun /goto /god /input /clear /hud /collisions /interior /dimension", COLOUR_WHITE);
				break;

			case "admin":
				message("[#666666]The following commands can be used for admin access:", COLOUR_WHITE);
				message("/admin " + String((localClient.administrator) ? "/makeadmin /removeadmin /goto /gethere" : ""), COLOUR_WHITE);
				break;

			case "code":
				message("[#666666]The following commands can be used for code execution:", COLOUR_WHITE);
				message("/jce /sce /lce /jcr /scr /lcr " + String((localClient.administrator) ? "/jse /sse /lse /jsr /ssr /lsr " : ""), COLOUR_WHITE);
				break;

			case "afk":
				message("[#666666]The following commands can be used for AFK status:", COLOUR_WHITE);
				message("/autoafk /afk", COLOUR_WHITE);
				break;

			case "keys":
				let enabledKeys = "";
				if(findResourceByName("v-passenger") != null) {
					enabledKeys += "[#FFFFFF]G: [#AAAAAA]Passenger";
				}

				if(findResourceByName("v-togglehud") != null) {
					enabledKeys += " 🔹 [#FFFFFF]F7: [#AAAAAA]Toggle HUD";
				}

				if(findResourceByName("cheatkeys") != null) {
					enabledKeys += " 🔹 [#FFFFFF]2: [#AAAAAA]Speed Boost 🔹 [#FFFFFF]3: [#AAAAAA]Stop 🔹 [#FFFFFF]5: [#AAAAAA]Reverse 🔹 [#FFFFFF]6: [#AAAAAA]Fix & Heal 🔹 [#FFFFFF]7: [#AAAAAA]Jump";
				}

				message("Keys: " + enabledKeys, COLOUR_WHITE);
				break;

			default:
				showMainHelpList();
				break;

		}
	}
});

// ----------------------------------------------------------------------------

function showMainHelpList() {
	message("❓  [#0088FF]HELP [#FFFF00]=================================================", COLOUR_YELLOW);

	let enabledCategories = "";
	let enabledKeys = "";
	if(findResourceByName("sandbox") != null) {
		enabledCategories += " 🔹 vehicle";
		enabledCategories += " 🔹 ped";
		enabledCategories += " 🔹 player";
		enabledCategories += " 🔹 other";
		enabledCategories += " 🔹 keys";
	}

	if(findResourceByName("v-admin") != null) {
		enabledCategories += " 🔹 admin"
	}

	if(findResourceByName("v-runcode") != null) {
		enabledCategories += " 🔹 code"
	}

	if(findResourceByName("v-afk") != null) {
		enabledCategories += " 🔹 afk"
	}

	message("Categories: [#FFFFFF]" + enabledCategories, toColour(200, 200, 200, 255));
	message("Use /help <name> for information", toColour(220, 220, 220, 255));
	message("Example: [#FFFFFF]/help vehicle", toColour(200, 200, 200, 255));
}

/*	if(findResourceByName("v-passenger") != null) {
		enabledKeys += "[#FFFFFF]G: [#AAAAAA]Passenger";
	}

	if(findResourceByName("v-togglehud") != null) {
		enabledKeys += " 🔹 [#FFFFFF]F7: [#AAAAAA]Toggle HUD";
	}

	if(findResourceByName("cheatkeys") != null) {
		enabledKeys += " 🔹 [#FFFFFF]2: [#AAAAAA]Speed Boost 🔹 [#FFFFFF]3: [#AAAAAA]Stop 🔹 [#FFFFFF]5: [#AAAAAA]Reverse 🔹 [#FFFFFF]6: [#AAAAAA]Fix & Heal 🔹 [#FFFFFF]7: [#AAAAAA]Jump";
	}
*/

// ----------------------------------------------------------------------------

/*
addEventHandler("OnPlayerChat", function(event, client, chatMessage) {
	let gunCheats = ["gunsgunsguns", "thugstools", "nuttertools", "professionaltools", "lxgiwyl", "professionalskit", "uzumymw"];
	gunCheats.forEach(function(gunCheat) {
		if(chatMessage.toLowerCase().search(gunCheat.toLowerCase()) != -1) {
			message("Use /gun for a weapon!", COLOUR_YELLOW);
		}
	});

	let vehicleCheats = ["AIWPRTON", "OLDSPEEDDEMON", "JQNTDMH", "VROCKPOKEY", "VPJTQWV", "WHERESTHEFUNERAL", "CELEBRITYSTATUS", "TRUEGRIME", "RZHSUEW", "JUMPJET", "KGGGDKP", "OHDUDE", "FOURWHEELFUN", "AMOMHRER", "ITSALLBULL", "FLYINGTOSTUNT", "MONSTERMASH"]
	vehicleCheats.forEach(function(vehicleCheat) {
		if(chatMessage.toLowerCase().search(vehicleCheat.toLowerCase()) != -1) {
			message("Use /veh for a vehicle!", COLOUR_YELLOW);
		}
	});
});
*/

// ----------------------------------------------------------------------------