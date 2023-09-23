// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: inventory.js
// DESC: Provides inventory dialog box GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let inventoryGUI = [
	{
		window: null,
	},
	{
		window: null,
	},
];

// ===========================================================================

function initInventoryGUI() {

}

// ===========================================================================

function closeAllInventoryGUI() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Closing all inventory GUI`);
	for (let i in inventoryGUI) {
		inventoryGUI[i].window.shown = false;
	}
	mexui.setInput(false);
}

// ===========================================================================

function showInventoryGUI(inventoryIndex, items) {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing inventory window. Index: ${inventoryIndex}`);
	inventoryGUI[inventoryIndex].window.shown = true;
	mexui.setInput(true);
}

// ===========================================================================