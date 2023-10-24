//LOGIN GUI

const registrationWindow = MexUI.window(100, 100, 300, 200, 'Registration');

const usernameInput = registrationWindow.textInput(30, 50, 200, 20, 'Username');
const passwordInput = registrationWindow.textInput(30, 80, 200, 20, 'Password');
passwordInput.isPassword = true; 

const registrationButton = registrationWindow.button(30, 120, 100, 30, 'Register', {
  main: {
    backgroundColour: MexUI.toColour(0, 128, 0, 255),
    textColour: MexUI.toColour(255, 255, 255, 255),
    hover: {
      backgroundColour: MexUI.toColour(0, 255, 0, 255),
    },
  },
});

registrationWindow.show();
