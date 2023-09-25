"use strict";

// ===========================================================================

let logoImagePath = (typeof gta != "undefined") ? "gtac-logo.png" : "mafiac-logo.png";
let logoImage = null;
let logoPos = new Vec2(game.width - 132, game.height - 132);
let logoSize = new Vec2(128, 128);
let logoEnabled = true;
let labelPos = new Vec3(-1845.20, -4.16, -22.74);
let apartmentDoor = [-1845.20, -4.16, -22.74];

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	logoImage = loadLogoImage();
});

// ===========================================================================
addEventHandler("OnDrawnHUD", function () {
	
	graphics.drawRectangle("FUCKING FOOL", logoPos, logoSize);
	
});
addEventHandler("OnDrawnHUD", function () {
	if (logoImage != null && logoEnabled == true) {
		graphics.drawRectangle(logoImage, labelPos, logoSize);
	}
});

// ===========================================================================

function loadLogoImage() {
	let logoStream = openFile(logoImagePath);
	let tempLogoImage = null;
	if (logoStream != null) {
		tempLogoImage = graphics.loadPNG(logoStream);
		logoStream.close();
	}

	return tempLogoImage;
}
// ===========================================================================