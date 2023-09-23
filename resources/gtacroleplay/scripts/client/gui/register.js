// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: register.js
// DESC: Provides account registration GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let register = {
	window: null,
	logoImage: null,
	messageLabel: null,
	passwordInput: null,
	confirmPasswordInput: null,
	emailInput: null,
	registerButton: null,
};

// ===========================================================================

function initRegisterGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating register GUI ...`);
	register.window = mexui.window(game.width/2-150, game.height/2-150, 300, 300, 'Register', {
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
	register.window.titleBarIconSize = toVector2(0,0);
	register.window.titleBarHeight = 0;

	register.window.image(85, -10, 140, 140, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	register.messageLabel = register.window.text(20, 125, 260, 20, 'Create an account', {
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

	register.passwordInput = register.window.textInput(20, 150, 260, 25, '', {
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
	register.passwordInput.masked = true;
	register.passwordInput.placeholder = "Password";

	register.confirmPasswordInput = register.window.textInput(20, 180, 260, 25, '', {
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
	register.confirmPasswordInput.masked = true;
	register.confirmPasswordInput.placeholder = "Confirm password";

	register.emailInput = register.window.textInput(20, 210, 260, 25, '', {
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
	register.emailInput.placeholder = "Email";

	register.registerButton = register.window.button(20, 245, 260, 30, 'CREATE ACCOUNT', {
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
	}, checkRegistration);
	logToConsole(LOG_DEBUG, `[VRR.GUI] Created register GUI`);
}

// ===========================================================================

function registrationFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports registration failed. Reason: ${errorMessage}`);
	register.messageLabel.text = errorMessage;
	register.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	register.passwordInput.text = "";
	register.confirmPasswordInput.text = "";
	register.emailInput.text = "";
}

// ===========================================================================

function checkRegistration() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking registration with server ...`);
	sendNetworkEventToServer("vrr.checkRegistration", register.passwordInput.lines[0], register.confirmPasswordInput.lines[0], register.emailInput.lines[0]);
}

// ===========================================================================

function showRegistrationGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing registration window`);
	closeAllWindows();
	setChatWindowEnabled(false);
	mexui.setInput(true);
	register.window.shown = true;
	mexui.focusedControl = register.passwordInput;
	guiSubmitKey = checkRegistration;
	//showSmallGameMessage(`If you don't have a mouse cursor, press ${toUpperCase(getKeyNameFromId(disableGUIKey))} to disable GUI`, COLOUR_WHITE, 7500);
}

// ===========================================================================

function registrationSuccess() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports registration was successful`);
	guiSubmitKey = false;
	closeAllWindows();
}

// ===========================================================================