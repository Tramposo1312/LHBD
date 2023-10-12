
// ===========================================================================
// FILE: house.js
// DESC: Provides house functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

class HouseData {
	constructor(houseId, entrancePosition, blipModel, pickupModel, hasInterior) {
		this.index = -1;
		this.houseId = houseId;
		this.entrancePosition = entrancePosition;
		this.blipModel = blipModel;
		this.pickupModel = pickupModel;
		this.hasInterior = hasInterior;
		this.blipId = -1;
	}
}

// ===========================================================================

function receiveHouseFromServer(houseId, entrancePosition, blipModel, pickupModel, hasInterior) {
	console.log(`[TRMPOSO.House] Received house ${houseId} (${name}) from server`);

}

// ===========================================================================

/**
 * @param {number} houseId - The ID of the house (initially provided by server)
 * @return {HouseData} The house's data (class instance)
 */
 function getHouseData(houseId) {
	let houses = getServerData().houses;
	for(let i in houses) {
		if(houses[i].houseId == houseId) {
			return houses[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllHouseDataIndexes() {
	for(let i in getServerData().houses) {
		getServerData().houses[i].index = i;
	}
}

// ===========================================================================