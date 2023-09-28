// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: newchar.js
// DESC: Provides new character creation GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let newCharacter = {
	window: null,
	firstNameInput: null,
	lastNameInput: null,
	skinDropDown: null,
	spawnAreaDropDown: null,
	createButton: null,
    mainLogoImage: null,
};

// ===========================================================================

function initNewCharacterGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating new character GUI ...`);
    newCharacter.window = mexui.window(game.width/2-130, game.height/2-100, 300, 200, 'Character Name', {
        main: {
            backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
            transitionTime: 500,
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
    newCharacter.window.titleBarIconSize = toVector2(0,0);
    //newCharacter.window.titleBarHeight = 0;

    newCharacter.mainLogoImage = newCharacter.window.image(115, 10, 65, 65, mainLogoPath, {
        focused: {
            borderColour: toColour(0, 0, 0, 0),
        },
    });

    newCharacter.messageLabel = newCharacter.window.text(20, 75, 260, 20, 'Name your character', {
        main: {
            textSize: 10.0,
            textAlign: 0.5,
            textColour: toColour(200, 200, 200, 255),
            textFont: robotoFont,
        },
        focused: {
            borderColour: toColour(0, 0, 0, 0),
        },
    });

    newCharacter.firstNameInput = newCharacter.window.textInput(20, 100, 260, 25, '', {
        main: {
            backgroundColour: toColour(0, 0, 0, 120),
            textColour: toColour(200, 200, 200, 255),
            textSize: 10.0,
            textFont: robotoFont,
        },
        caret: {
            lineColour: toColour(255, 255, 255, 255),
        },
        placeholder: {
            backgroundColour: toColour(0, 0, 0, 120),
            textColour: toColour(200, 200, 200, 200),
            textSize: 10.0,
            textFont: robotoFont,
        }
    });
    newCharacter.firstNameInput.placeholder = "First Name";

    newCharacter.lastNameInput = newCharacter.window.textInput(20, 130, 260, 25, '', {
        main: {
            backgroundColour: toColour(0, 0, 0, 120),
            textColour: toColour(200, 200, 200, 255),
            textSize: 10.0,
            textFont: robotoFont,
        },
        caret: {
            lineColour: toColour(255, 255, 255, 255),
        },
        placeholder: {
            backgroundColour: toColour(0, 0, 0, 120),
            textColour: toColour(150, 150, 150, 200),
            textSize: 10.0,
            textFont: robotoFont,
        }
    });
    newCharacter.lastNameInput.placeholder = "Last Name";

    newCharacter.createCharacterButton = newCharacter.window.button(20, 160, 260, 25, 'CREATE CHARACTER', {
        main: {
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
            textColour: toColour(255, 255, 255, 255),
            textSize: 12.0,
            textFont: robotoFont,
            textAlign: 0.5,
        },
        focused: {
            borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
        },
    }, checkNewCharacter);
    logToConsole(LOG_DEBUG, `[VRR.GUI] Created new character GUI`);
}

// ===========================================================================

function newCharacterFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports new character creation failed. Reason: ${errorMessage}`);
	newCharacter.messageLabel.text = errorMessage;
	newCharacter.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	newCharacter.firstNameInput.text = "";
	newCharacter.lastNameInput.text = "";

	if(!newCharacter.window.shown) {
		closeAllWindows();
		setChatWindowEnabled(false);
		mexui.setInput(true);
		setHUDEnabled(false);
		newCharacter.window.shown = true;
	}
}

// ===========================================================================

function checkNewCharacter() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking new character with server ...`);
	let skinId = false;

	if(newCharacter.firstNameInput.lines[0].length < 2) {
		return false;
	}

	if(newCharacter.lastNameInput.lines[0].length < 2) {
		return false;
	}

	sendNetworkEventToServer("vrr.checkNewCharacter",
		newCharacter.firstNameInput.lines[0],
		newCharacter.lastNameInput.lines[0],
	);
}

// ===========================================================================

function showNewCharacterGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing new character window`);
	closeAllWindows();
	setChatWindowEnabled(false);
	mexui.setInput(true);
	newCharacter.window.shown = true;
    mexui.focusedInput = newCharacter.firstNameInput;
    guiSubmitButton = checkNewCharacter;
}

// ===========================================================================