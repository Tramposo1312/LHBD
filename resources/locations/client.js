"use strict";



let locationLabelWidth = 70;
let locationLabelFont = null;
let labelDistance = 5.0; // Adjust this distance as needed
let labelColour = [255, 255, 255];


addEventHandler("OnResourceReady", function (event, resource) {
	if (resource == thisResource) {	
		locationLabelFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");	
	}
});

function drawLabel(x, y, text, alpha, colour) {
	if (locationLabelFont == null) {
		return false;
	}

	alpha *= 0.75;
	let width = locationLabelWidth;
	
    
	// Starts at bottom and works it's way up
	// -------------------------------------------
	// Health Bar

 

	y -= 20;

	// Nametag
	if (locationLabelFont != null) {
		let size = locationLabelFont.measure(text, game.width, 0.0, 0.0, locationLabelFont.size, false, false);
		let colourT = createColour(Math.floor(255.0 * alpha), 255, 255, 255);
		locationLabelFont.render(text, [x - size[0] / 2, y - size[1] / 2], game.width, 0.0, 0.0, locationLabelFont.size, colour, false, false, false, true);
	}
}


function getDistance(pos1, pos2) {
	let dx = pos1[0] - pos2[0];
	let dy = pos1[1] - pos2[1];
	let dz = pos1[2] - pos2[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}


function updateLocationLabel() {
	if (localPlayer != null) {
		let playerPos = localPlayer.position;
        let apartmentDoor = [-1845.20, -4.16, -22.74];
       
        apartmentDoor[1] += 2;

		let screenPos = getScreenFromWorldPosition(apartmentDoor);
		if (screenPos[2] >= 0.0) {
			
			let distance = getDistance(playerPos, apartmentDoor);
			if (distance < labelDistance) {
					drawLabel(screenPos.x, screenPos.y, "Apartment OPEN", 1.0 - distance / labelDistance, colour);
				}
			}
		}
	}

    addEventHandler("OnDrawnHUD", function (event) {             
        updateLocationLabel()
    });

