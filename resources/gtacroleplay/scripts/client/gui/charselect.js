// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: charselect.js
// DESC: Provides character select GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let characterSelect = {
	window: null,
	skinImage: null,
	nameText: null,
	cashText: null,
	clanText: null,
	lastPlayedText: null,
	previousCharacterButton: null,
	nextCharacterButton: null,
	selectCharacterButton: null,
	newCharacterButton: null,
};

// ===========================================================================

function initCharacterSelectGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating character select GUI ...`);
	characterSelect.window = mexui.window(game.width/2-215, game.height/2-83, 430, 190, 'Select Character', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
		},
        title: {
            textSize: 0.0,
            textColour: toColour(0, 0, 0, 0),
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
        },
        icon: {
            textSize: 0.0,
            textColour: toColour(0, 0, 0, 0),
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
        }
	});
	characterSelect.window.titleBarIconSize = toVector2(0,0);
	//characterSelect.window.titleBarHeight = 0;

	characterSelect.nameText = characterSelect.window.text(5, 40, 200, 25, 'Lastname, Firstname', {
		main: {
			textSize: 14.0,
			textAlign: 0.0,
			textColour: toColour(255, 255, 255, 220),
			textFont: robotoFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		}
	});

	characterSelect.cashText = characterSelect.window.text(5, 65, 200, 25, 'Cash: $0', {
		main: {
			textSize: 9.0,
			textAlign: 0.0,
			textColour: toColour(255, 255, 255, 220),
			textFont: robotoFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		}
	});

	characterSelect.clanText = characterSelect.window.text(5, 80, 200, 25, 'Clan: None', {
		main: {
			textSize: 9.0,
			textAlign: 0.0,
			textColour: toColour(255, 255, 255, 220),
			textFont: robotoFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		}
	});

	characterSelect.lastPlayedText = characterSelect.window.text(5, 95, 200, 25, 'Last Played: Never', {
		main: {
			textSize: 9.0,
			textAlign: 0.0,
			textColour: toColour(255, 255, 255, 220),
			textFont: robotoFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		}
	});

	characterSelect.selectCharacterButton = characterSelect.window.button(85, 130, 260, 25, 'PLAY', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 12.0,
			textFont: robotoFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		}
	}, selectThisCharacter);

	characterSelect.newCharacterButton = characterSelect.window.button(5, 160, 420, 25, 'NEW CHARACTER', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 12.0,
			textFont: robotoFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		}
	}, showNewCharacter);

	characterSelect.previousCharacterButton = characterSelect.window.button(5, 130, 75, 25, '< PREV', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 10.0,
			textFont: robotoFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		}
	}, selectPreviousCharacter);

	characterSelect.nextCharacterButton = characterSelect.window.button(350, 130, 75, 25, 'NEXT >', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 10.0,
			textFont: robotoFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		}
	}, selectNextCharacter);

	characterSelect.skinImage = characterSelect.window.image(310, 32, 100, 90, "files/images/skins/none.png", {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		}
	});
	logToConsole(LOG_DEBUG, `[VRR.GUI] Created character select GUI`);
}

// ===========================================================================

function showCharacterSelectGUI(firstName, lastName, cash, clan, lastPlayed, skinId) {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing character selection window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	characterSelect.nameText.text = `${firstName} ${lastName}`;
	characterSelect.cashText.text = `Money: $${cash}`;
	characterSelect.clanText.text = `Clan: ${clan}`;
	characterSelect.lastPlayedText.text = `Last Played: ${lastPlayed}`;
	characterSelect.skinImage = characterSelect.window.image(310, 32, 100, 90, "files/images/skins/none.png");
	characterSelect.window.shown = true;
}

// ===========================================================================

function showNewCharacter() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing new character dialog window`);
	showNewCharacterGUI();
}

// ===========================================================================

function selectNextCharacter() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Requesting next character info from server for character select window`);
	sendNetworkEventToServer("vrr.nextCharacter");
}

// ===========================================================================

function selectPreviousCharacter() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Requesting previous character info from server for character select window`);
	sendNetworkEventToServer("vrr.previousCharacter");
}

// ===========================================================================

function selectThisCharacter() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Tell server the current shown character was selected in character select window`);
	sendNetworkEventToServer("vrr.selectCharacter");
}

// ===========================================================================

function switchCharacterSelectGUI(firstName, lastName, cash, clan, lastPlayed, skinId) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Updating character info with data from server`);
	setChatWindowEnabled(false);
	characterSelect.window.shown = false;
	characterSelect.nameText.text = `${firstName} ${lastName}`;
	characterSelect.cashText.text = `Money: $${cash}`;
	characterSelect.clanText.text = `Clan: ${clan}`;
	characterSelect.lastPlayedText.text = `Last Played: ${lastPlayed}`;
	characterSelect.skinImage = characterSelect.window.image(310, 32, 100, 90, "files/images/skins/none.png");
	characterSelect.window.shown = true;
	guiSubmitKey = selectThisCharacter;
	guiLeftKey = selectPreviousCharacter;
	guiRightKey = selectNextCharacter;
}

// ===========================================================================

function characterSelectSuccess() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports character selection was successful`);
	closeAllWindows();
}

// ===========================================================================