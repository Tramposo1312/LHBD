// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: changepass.js
// DESC: Provides change password GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let passwordChange = {
	window: null,
	logoImage: null,
	messageLabel: null,
	passwordInput: null,
	confirmPasswordInput: null,
	submitButton: null,
};

// ===========================================================================

function initChangePasswordGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating password change GUI ...`);
	passwordChange.window = mexui.window(game.width/2-130, game.height/2-125, 300, 250, 'Change Password', {
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
	passwordChange.window.titleBarIconSize = toVector2(0,0);
	passwordChange.window.titleBarHeight = 0;

	passwordChange.window.image(85, -10, 140, 140, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	passwordChange.messageLabel = passwordChange.window.text(20, 75, 260, 20, 'Enter a new password', {
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

	passwordChange.passwordInput = passwordChange.window.textInput(20, 130, 260, 25, '', {
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
	passwordChange.passwordInput.masked = true;
	passwordChange.passwordInput.placeholder = "Password";

	passwordChange.confirmPasswordInput = passwordChange.window.textInput(20, 160, 260, 25, '', {
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
	passwordChange.confirmPasswordInput.masked = true;
	passwordChange.confirmPasswordInput.placeholder = "Confirm password";

	passwordChange.submitButton = passwordChange.window.button(20, 195, 260, 30, 'CHANGE PASSWORD', {
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
	}, checkChangePassword);
	logToConsole(LOG_DEBUG, `[VRR.GUI] Created change password GUI`);
}

// ===========================================================================

function passwordChangeFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports change password failed. Reason: ${errorMessage}`);
	passwordChange.messageLabel.text = errorMessage;
	passwordChange.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	passwordChange.passwordInput.text = "";
	passwordChange.confirmPasswordInput.text = "";
	passwordChange.verificationCodeInput.text = "";
}

// ===========================================================================

function checkChangePassword() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking password change with server ...`);
	sendNetworkEventToServer("vrr.checkChangePassword", passwordChange.passwordInput.lines[0], passwordChange.confirmPasswordInput.lines[0]);
}

// ===========================================================================

function showChangePasswordGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing change password window`);
	closeAllWindows();
	setChatWindowEnabled(false);
	mexui.setInput(true);
	passwordChange.window.shown = true;
	mexui.focusedControl = passwordChange.passwordInput;
	guiSubmitKey = checkChangePassword;
}

// ===========================================================================

function passwordChangeSuccess() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports password change was successful`);
	guiSubmitKey = false;
	closeAllWindows();
}

// ===========================================================================