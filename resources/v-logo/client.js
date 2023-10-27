"use strict";

// ===========================================================================

let logoImagePath = "mafiac-logo.png";
let logoImage = null;
let logoPos = new Vec2(game.width - 132, game.height - 132);
let logoSize = new Vec2(128, 128);
let logoEnabled = true;
let bizPosition = [-1774.30, -5.56, 4.35]
let logoDistance = 10.0;



// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	logoImage = loadLogoImage();
});

// ===========================================================================


addEventHandler("OnDrawnHUD", function () {
	let screenPosition = getScreenFromWorldPosition(bizPosition);

	if (screenPosition[2] >= 0.0) {
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