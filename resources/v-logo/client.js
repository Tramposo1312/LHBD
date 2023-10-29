"use strict";

// ===========================================================================

let logoImagePath = "mafiac-logo.png";
let logoImage = null;
let logoPos = new Vec2(game.width - 132, game.height - 132);
let logoSize = new Vec2(160, 128);
let logoEnabled = true;
let bizPosition = [-1774.30, -5.56, 4.35]
let labelDistance = 10.0;
let labelFonty = null;



// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	logoImage = loadLogoImage();
	labelFonty = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
});

// ===========================================================================
let listWidth = game.width / 3;


addEventHandler("OnDrawnHUD", function () {
	let screenPosition = getScreenFromWorldPosition(bizPosition);
	// if(localPlayer != null) {
	// 	let PlayerPos = localPlayer.position;
	// 	let streamLabelDistance = getDistance(screenPosition, PlayerPos);
		if (screenPosition[2] >= 0.0) {
			// if(streamLabelDistance <= labelDistance) {
				let logoVec = new Vec2(screenPosition.x, screenPosition.y);
				if (logoImage != null && logoEnabled == true) {
					graphics.drawRectangle(logoImage, logoVec, logoSize);
				}
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

