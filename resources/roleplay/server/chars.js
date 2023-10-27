"use strict";

addEventHandler("OnPlayerJoined", (event, client) => {
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
})