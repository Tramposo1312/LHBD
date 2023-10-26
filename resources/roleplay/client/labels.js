"use strict";


let labelFont = null;
let labelDistance = 30.0;
let labelWidth = 70;
let labelColour = [255, 255, 255];


// ----------------------------------------------------------------------------


addEventHandler("OnResourceReady", function (event, resource) {
    if (resource == thisResource) {
        labelFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
    }
})

// ----------------------------------------------------------------------------

function createColour(alpha, red, green, blue) {
	return alpha << 24 | red << 16 | green << 8 | blue;
}

// ----------------------------------------------------------------------------

function getDistance(pos1, pos2) {
	let dx = pos1[0] - pos2[0];
	let dy = pos1[1] - pos2[1];
	let dz = pos1[2] - pos2[2];
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// ----------------------------------------------------------------------------

function drawLabel(x, y, text, distance, colour) {
    if (labelFont == null) {
        return false;
    }

    let width = labelWidth;

    y -= 5;

    if(labelFont != null) {
        let size = labelFont.measure(text, game.width, 0.0, 0.0, labelFont.size, false, false);
        labelFont.render(text, [x - size[0] / 2,y - size[1] / 2, game.width, labelFont.size, colour, false, false, false, true]);
    }
}

function updateLabels(location) {
    if (localPlayer != null) {
        let playerPos = localPlayer.position;

        locationPos.y += 2;

        let screenPos = getScreenFromWorldPosition(locationPos);
        if(screenPos[2] >= 0.0) {
            let distance = getDistance(playerPos, location);
            if(distance < labelDistance) {
                drawLabel(screenPos.x, screenPos.y, "LABEL", distance, COLOUR_WHITE);
            }
        }
    }
}
let salieryDoor = [-1774.6744384765625, -5.628890037536621, 3.844797372817993];

addEventHandler("OnDrawnHUD", function (event) {
    updateLabels(salieryDoor);
    let debug = updateLabels(salieryDoor);
    if(debug) {
        message("Working!")
    } else {
        message("Not working")
    }

});
