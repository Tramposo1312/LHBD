"use strict";

// ===========================================================================

let logoImagePath = "mafiac-logo.png";
let logoImage = null;
let logoPos = new Vec2(game.width - 132, game.height - 132);
let logoSize = new Vec2(160, 128);
let logoEnabled = true;
let bizPosition = [-1774.30, -5.56, 4.35]
let logoDistance = 10.0;
let labelFonty = null;



// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	logoImage = loadLogoImage();
	/* labelText = lucas.createDefaultFont(12.0, "Roboto", "Light");
	let size = labelFonty.measure(text, game.width, 0.0, 0.0, labelFonty.size, false, false);
	let colour = COLOUR_WHITE;
	labelFonty.render(text, [x - size[0] / 2, y - size[1] / 2], game.width, 0.0, 0.0, labelFonty.size, colour, false, false, false, true);
	*/
});

// ===========================================================================
let listWidth = game.width / 3;


addEventHandler("OnDrawnHUD", function () {
	let screenPosition = getScreenFromWorldPosition(bizPosition);

	if (screenPosition[2] >= 0.0) {
		let logoVec = new Vec2(screenPosition.x, screenPosition.y);
		if (logoImage != null && logoEnabled == true) {
			/* let playersText = `MAFIOSOS LIST`;
			labelFonty.measure(playersText, listWidth, 0.0, 1.0, 10, false, false);
			titleFont.render(playersText, [logoVec.x + 2, logoVec + 2], 0, 0.5, 0.0, labelFonty.size, COLOUR_AQUA, false, false, false, true);
*/


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

