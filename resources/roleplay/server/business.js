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

    generateIncome(income) {
        this.money += income;
    }


}


function retrieveBusinessesFromDatabase() {
    const businesses = [];
  
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

        const business = new Business(name, type, owner, employees, xPos, yPos, zPos, items, money);

        businesses.push(business);
        console.log(`${business}`);
    }
}
return businesses;
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

  