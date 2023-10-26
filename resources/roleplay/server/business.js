const businessInvitations = [];
const ServerBusinesses = [];

let playerBusinessPos = new Vec3(0, 0, 0);

const claimBizMoneyDistance = 5.0;


class Business {
    constructor(name, type, owner = null, employees = [], posX, posY, posZ, items, money) {
        this.name = name;
        this.type = type;
        this.owner = owner;
        this.employees = employees;
        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;
        this.items = items;
        this.money = money;
        this.lastIncomeTime = Date.now(); 
        this.incomeInterval = 3600000;
    }

    toString() {
        return `Business: ${this.name}, Type: ${this.type}, Items: ${this.items}, Owner: ${this.owner}, Employees: ${this.employees}, Money: ${this.money}`;
    }
    //EMPLOYEES
    hireEmployee(employee) {
      this.employees.push(employee);
    }

    fireEmployee(employee) {
      const index = this.employees.indexOf(employee);
      if (index !== -1) {
        this.employees.splice(index, 1);
      }
    }

    getEmployees() {
        return this.employees;
    }


    changeOwner(newOwner) {
      this.owner = newOwner;
    }

    //ITEMS + MONEY
    addItem(item, quantity) {
        if (this.items[item]) {
            this.items[item] += quantity;
        } else {
            this.items[item] = quantity;
        }
    }

    removeItem(item, quantity) {
        if (this.items[item]) {
            this.items[item] -= quantity;
            if (this.items[item] <= 0) {
                delete this.items[item];
            }
        }
    }
    //GENERATING INCOME STUFF

    generateIncome() {
        const currentTime = Date.now();
        const timeSinceLastIncome = currentTime - this.lastIncomeTime;
    
        if (timeSinceLastIncome >= this.incomeInterval) {
            let baseIncome = 0;
    
            switch (this.type) {
                case 'Clothing Store':
                    baseIncome = 300;
                    break;
                case 'Restaurant':
                    baseIncome = 600;
                    break;
                case 'Bar':
                    baseIncome = 800;
                    break;
                case 'New Car Dealership':
                    baseIncome = 1200;
                    break;
                case 'Used Car Dealership':
                    baseIncome = 1000;
                    break;
                case '24/7':
                    baseIncome = 1000;
                    break;
                case 'Gun Shop':
                    baseIncome = 1500;
                    break;
                default:
                    baseIncome = 500;
            }
    
            this.money += baseIncome;
            this.lastIncomeTime = currentTime;
            return this.money;
        } else {
            return 0; // No income generated yet within the interval
        }
    }
}
    
   


const businessTypes = {
    1: "Clothing Store",
    2: "Restaurant",
    3: "Bar",
    4: "24/7",
    5: "Used Car Dealership",
    6: "New Car Dealership",
    7: "Gun Shop",
};

function getBusinessTypeName(type) {
    return businessTypes[type] || "Undefined";
}

addCommandHandler("cbiz", (command, params, client) => {

    let splitParams = params.split(" ");
    let tmpBusinessName = splitParams[0];
    let tmpBusinessType = parseInt(splitParams[1]);


    if(tmpBusinessName == "" || !tmpBusinessName) {
        messageClient("Name your business using /cbiz <name> <type id>", client, COLOUR_ORANGE);
        messageClient("1: Clothing Store, 2: Restaurant, 3: Bar, 4: 24/7", client, COLOUR_ORANGE);
    }
    if(tmpBusinessType == "" || !tmpBusinessType) {
        messageClient("Name your business using /cbiz <name> <type id>", client, COLOUR_ORANGE);
    } else {
        const tempBusiness = new Business();

        tempBusiness.name = tmpBusinessName;
        tempBusiness.type = getBusinessTypeName(tmpBusinessType);
        tempBusiness.owner = owner;
        tempBusiness.employees = employees;
        tempBusiness.posX = client.player.position.x;
        tempBusiness.posY = client.player.position.y;
        tempBusiness.posZ = client.player.position.z;
        tempBusiness.items = items;
        tempBusiness.money = 0;

        ServerBusinesses.push(tempBusiness);

        messageClient(`Business ${tmpBusinessName} (${tempBusiness.type}) created successfully.`, client, COLOUR_GREEN);
    }

})

function saveBusinessesToDatabase(businesses) {
    businesses.forEach((business, index) => {
        const bizID = index + 1;
        const updateQueries = [
            `UPDATE biznizs SET bizName = '${business.name}' WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizItems = '${business.items}' WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizposX = ${business.posX} WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizposY = ${business.posY} WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizposZ = ${business.posZ} WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizOwner = '${business.owner}' WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizType = '${business.type}' WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizEmployees = '${business.employees}' WHERE id = ${bizID}`,
            `UPDATE biznizs SET bizMoney = ${business.money} WHERE id = ${bizID}`,
        ];
        updateQueries.forEach(query => {
            db.query(query);
        })
    })
}
function retrieveBusinessesFromDatabase() {


    for (let bizID = 1; bizID <= 10; bizID++) {
    const nameQuery = db.query(`SELECT bizName FROM biznizs WHERE id = '${bizID}'`);
    const itemsQuery = db.query(`SELECT bizItems FROM biznizs WHERE id = '${bizID}'`);
    const xPosQuery = db.query(`SELECT bizposX FROM biznizs WHERE id = '${bizID}'`);
    const yPosQuery = db.query(`SELECT bizposY FROM biznizs WHERE id = '${bizID}'`);
    const zPosQuery = db.query(`SELECT bizposZ FROM biznizs WHERE id = '${bizID}'`);
    const ownerQuery = db.query(`SELECT bizOwner FROM biznizs WHERE id = '${bizID}'`);
    const typeQuery = db.query(`SELECT bizType FROM biznizs WHERE id = '${bizID}'`);
    const employeesQuery = db.query(`SELECT bizEmployees FROM biznizs WHERE id = '${bizID}'`);
    const moneyQuery = db.query(`SELECT bizMoney FROM biznizs WHERE id = '${bizID}'`);

    if (String(nameQuery).length > 1) {
        const name = String(nameQuery);
        const items = String(itemsQuery);
        const xPos = parseFloat(xPosQuery);
        const yPos = parseFloat(yPosQuery);
        const zPos = parseFloat(zPosQuery);
        const owner = String(ownerQuery);
        const type = String(typeQuery);
        const employees = String(employeesQuery);
        const money = parseFloat(moneyQuery);

        const serverbusiness = new Business(name, type, owner, employees, xPos, yPos, zPos, items, money);

        ServerBusinesses.push(serverbusiness);
        console.log(`${serverbusiness.name} retrieved successfully.`);
    }
}
return ServerBusinesses;
}

function initBusinessScript() {
    console.log('[TRMPOSO] Business script initialising...')
    let bQuery = retrieveBusinessesFromDatabase();
    if(bQuery) {
        console.log('[TRMPOSO] Business script initialised successfully')
    } else {
        console.log('[TRMPOSO] Businessscript failed to initialise')
    }
}



//COMMANDS

addCommandHandler("binvite", (command, params, client) => {

    let targetClient = getClientFromParams(params);
	let businessOwner = db.query(`SELECT bizOwner FROM biznizs WHERE bizOwner = '${client.name}'`);
	let pBusiness = db.query(`SELECT bizName FROM biznizs WHERE bizOwner = '${client.name}'`);
	let tpBusiness = db.query(`SELECT bizName FROM biznizs WHERE bizEmployees = '${targetClient.name}'`);


    if (businessOwner !== "") {
        if(targetClient) {
			if (targetClient.index !== client.index) {
				if(tpBusiness !== "") {
					messageClient("This player is already working for another business.", client, COLOUR_RED);
					return;
				} else {

					const bInvitation = {
                        inviter: client.name,
                        invitee: targetClient.name,
                        business: String(pBusiness),
                    };

                    businessInvitations.push(bInvitation);

					messageClient(`You've sent an invitation to ${targetClient.name}`, client, COLOUR_ORANGE);
					messageClient(`${client.name} has sent you an invitation to work for ${pbusiness}. Use /accbiz to accept.`, targetClient, COLOUR_YELLOW);
				}
			} else {
				message(`This kid ${client.name} from ${pBusiness} tried to send a work invitation to himself. Laugh at this fucking autistic.`);
			}
		} else {
			message(`This kid ${client.name} from ${pBusiness} tried to send a work invitation to an offline player, laugh at this blindfuck.`);
		}
	} else {
		messageClient("You are not a business owner, fucking autistic.", client, COLOUR_RED);
		return;
	}

})



addCommandHandler("accbiz", (command, params, client) => {
    const businessInvitation = businessInvitations.find((bInvitation) => bInvitation.invitee === client.name);

    if (businessInvitation) {
        db.query(`INSERT INTO businesss (fac, soldiers) VALUES('${businessInvitation.business}', '${client.name}')`)
        messageClient(`You've accepted the invitation to work for ${businessInvitation.business} business.`, client, COLOUR_GREEN);

        const inviterClient = businessInvitation.inviter;
        if (inviterClient) {
            messageClient(`${client.name} has accepted your invitation to work for ${businessInvitation.business} business.`, inviterClient, COLOUR_GREEN);
        }

        businessInvitations.splice(businessInvitations.indexOf(businessInvitation), 1);
    } else {
        messageClient("You don't have any pending business jobs invitations.", client, COLOUR_RED);
    }
});


addCommandHandler("claimmoney", (command, params, client) => {
    const playerLocation = client.player.position;
    let playerBusiness = db.query(`SELECT bizName FROM biznizs WHERE bizOwner = '${client.name}'`);
    if(playerBusiness == "" || !playerBusiness) {
        messageClient("You don't own any business.", client, COLOUR_RED);
    } else {

        let playerBusinessType = String(db.query(`SELECT bizType FROM biznizs WHERE bizOwner = '${client.name}'`));


        let playerBusinessX = db.query(`SELECT bizposX FROM biznizs WHERE bizName = "${String(playerBusiness)}"`);
        let playerBusinessY = db.query(`SELECT bizposY FROM biznizs WHERE bizName = "${String(playerBusiness)}"`);
        let playerBusinessZ = db.query(`SELECT bizposZ FROM biznizs WHERE bizName = "${String(playerBusiness)}"`);

        playerBusinessPos.x = parseFloat(playerBusinessX);
        playerBusinessPos.y = parseFloat(playerBusinessY);
        playerBusinessPos.z = parseFloat(playerBusinessZ);

        let playerAtClaimPos = getDistance(playerBusinessPos, playerLocation)

        if (playerAtClaimPos <= claimBizMoneyDistance) {
            const targetBusiness = ServerBusinesses.find((serverbusiness) => serverbusiness.name == playerBusiness);
            const generatedIncome = targetBusiness.generateIncome();
            
            if (generatedIncome > 0) {
                let PlayerMoney = db.query(`SELECT money FROM users WHERE username = '${client.name}'`)
                const finalPay = generatedIncome + parseInt(PlayerMoney);
                messageClient(`You've claimed $${generatedIncome} from your ${playerBusinessType}.`, client, COLOUR_GREEN);
        
                // Reset the business's money to 0 after claiming
                targetBusiness.money = 0;
                db.query(`UPDATE users SET money = '${finalPay}' WHERE username = '${client.name}'`);
                db.query(`UPDATE biznizs SET bizMoney = 0 WHERE bizName = "${String(playerBusiness)}"`);
            } else {
                messageClient(`No income available to claim from your ${playerBusinessType}.`, client, COLOUR_ORANGE);
            }
        } else {
            messageClient("You are not at your business location or you don't own a business here.", client, COLOUR_RED);
        }     
    }
});


/*
// Advanced Income Generation and Claiming Code
  // Distance for claiming money

// Create a timer to periodically check businesses for income generation
setInterval(() => {
    const currentTime = new Date().getTime();

    // Iterate through each business
    for (const business of ServerBusinesses) {
        const lastIncomeGenerationTime = business.lastIncomeGenerationTime;
        const incomeGenerationInterval = business.incomeGenerationInterval;

        // Check if it's time to generate income
        if (currentTime >= lastIncomeGenerationTime + incomeGenerationInterval) {
            // Generate income and update the business's state
            const generatedIncome = business.generateIncome();
            business.money += generatedIncome;
            business.lastIncomeGenerationTime = currentTime;

            // Update the database with the new income and time
            db.query(`UPDATE biznizs SET bizMoney = '${business.money}', lastIncomeGenerationTime = '${currentTime}' WHERE bizName = '${business.name}'`);
        }
    }
}, 1000); // Check every second, adjust the interval as needed

// Command to claim business income
addCommandHandler("claimmoney", (command, params, client) => {
    const playerLocation = client.player.position;
    const playerName = client.name;

    // Query the database to get the player's business
    const playerBusinessData = db.query(`SELECT bizName, bizType, bizposX, bizposY, bizposZ, bizMoney, lastIncomeGenerationTime FROM biznizs WHERE bizOwner = '${playerName}'`);

    if (!playerBusinessData || playerBusinessData.length === 0) {
        messageClient("You don't own any business.", client, COLOUR_RED);
        return;
    }

    const business = new Business(
        playerBusinessData.bizName,
        playerBusinessData.bizType,
        playerName,
        [],
        playerBusinessData.bizposX,
        playerBusinessData.bizposY,
        playerBusinessData.bizposZ,
        playerBusinessData.bizMoney,
        playerBusinessData.lastIncomeGenerationTime
    );

    // Calculate the claimed income
    const currentTime = new Date().getTime();
    const lastIncomeGenerationTime = business.lastIncomeGenerationTime;
    const incomeGenerationInterval = business.incomeGenerationInterval;

    if (currentTime < lastIncomeGenerationTime + incomeGenerationInterval) {
        messageClient("It's not yet time to claim income from your business.", client, COLOUR_ORANGE);
        return;
    }

    const claimedIncome = business.money;
    business.money = 0;
    business.lastIncomeGenerationTime = currentTime;

    // Update the database with the new income and time
    db.query(`UPDATE biznizs SET bizMoney = 0, lastIncomeGenerationTime = '${currentTime}' WHERE bizName = '${business.name}'`);

    // Add the claimed income to the player's account
    const playerMoney = parseInt(PlayerMoney) + claimedIncome;
    db.query(`UPDATE users SET money = '${playerMoney}' WHERE name = '${playerName}'`);

    messageClient(`You've claimed $${claimedIncome} from your ${business.type}.`, client, COLOUR_GREEN);
});
*/

