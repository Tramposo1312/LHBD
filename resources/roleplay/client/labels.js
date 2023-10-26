"use strict";

// Configuration
let labelFont = null;
let labelDistance = 10; 

// Define label properties
let labeledObjects = [
    {
        position: [-1980.949, -4.982666, 23.199167],
        labelText: "Label 1",
        labelColor: COLOUR_WHITE,
    },
    {
        position: [-1774.30, -5.56, 4.35],
        labelText: "Label 2",
        labelColor: COLOUR_WHITE,
    },
    // Add more labeled objects here
];

addEventHandler("OnResourceReady", function (event, resource) {
    if (resource == thisResource) {
        labelFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
    }
});

function createColour(alpha, red, green, blue) {
    return alpha << 24 | red << 16 | green << 8 | blue;
}

function drawLabel(x, y, text, color) {
    if (labelFont != null) {
        labelFont.render(text, [x, y], game.width, 0.0, 0.0, labelFont.size, color, false, false, false, true);
    }
}

function getDistance(pos1, pos2) {
    let dx = pos1[0] - pos2[0];
    let dy = pos1[1] - pos2[1];
    let dz = pos1[2] - pos2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function updateLabels() {
    if (localPlayer != null) {
        let playerPos = localPlayer.position;
        
        for (let i in labeledObjects) {
            let objectPos = labeledObjects[i].position;
            let distance = getDistance(playerPos, objectPos);

            if (distance < labelDistance) {
                let screenPos = getScreenFromWorldPosition(objectPos);
                let labelColor = labeledObjects[i].labelColor;
                drawLabel(screenPos.x, screenPos.y, labeledObjects[i].labelText, labelColor);
            }
        }
    }
}

addEventHandler("OnDrawnHUD", function (event) {
    updateLabels();
});
