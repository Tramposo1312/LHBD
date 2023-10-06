"use strict";

// ===========================================================================

let logoImagePath = "mafiac-logo.png";
let logoImage = null;
let logoPos = new Vec2(game.width - 132, game.height - 132);
let logoSize = new Vec2(128, 128);
let logoEnabled = true;



// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	logoImage = loadLogoImage();
});

// ===========================================================================

addEventHandler("OnDrawnHUD", function () {
	if (logoImage != null && logoEnabled == true) {
		graphics.drawRectangle(logoImage, logoPos, logoSize);
	}
});

// ===========================================================================

function loadLogoImage() {
	let logoStream = openFile(logoImagePath);
	let tempLogoImage = null;
	if (logoStream != null) {
		tempLogoImage = graphics.loadPNG(logoStream);
		console.log('[TRAMPOSO] Debugging LOGO IMAGE PATH')
		logoStream.close();
	}

	return tempLogoImage;
}
// ===========================================================================