"use strict";

// Event handler for when a player joins
addEventHandler("OnPlayerJoined", (player) => {

    // Check if the player is already registered
    if (isRegistered(client.name)) {
        // Prompt the player to log in
        messageClient("Welcome back! Please log in with /login <password>.", client, COLOUR_BLUE);
    } else {
        // Player is not registered, prompt them to register
        messageClient("Welcome! Please register with /register <username> <password>.", client, COLOUR_BLUE);
    }
});

// Command handler for player registration
addCommandHandler("register", (command, params, client) => {
    if (params.length < 2) {
        messageClient("Usage: /register <username> <password>", client, COLOUR_SILVER);
        return;
    }

    let username = params[0];
    let password = params[1];

    if (isRegistered(username)) {
        messageClient("This username is already registered. Please choose a different one.", client, COLOUR_RED);
    } else {
        registerPlayer(username, password);
        messageClient("Registration successful! You can now log in with /login <password>.", client, COLOUR_GREEN);

    }
});

// Command handler for player login
addCommandHandler("login", (command, params, client) => {
    if (params.length < 1) {
        messageClient("USAGE: /login <password>", client, COLOUR_SILVER);
        return;
    }

    let username = client.name;
    let password = params[0];

    if (isPasswordCorrect(username, password)) {
        messageClient("Login successful! You are now logged in.", client, COLOUR_GREEN);
        // Spawn the player or perform other actions as needed
    } else {
        messageClient("Login failed. Please check your password.", client, COLOUR_RED);
    }
});

function isRegistered(username, callback) {
    // Query the database to check if the user exists
    let query = "SELECT * FROM users WHERE Name = ?";

    db.query(query, [username], (result) => {
        if (result.numRows > 0) {
            // User is registered
            callback(true);
        } else {
            // User is not registered
            callback(false);
        }
    });
}
function registerPlayer(username, password, callback) {
    // First, check if the user is already registered
    isRegistered(username, (alreadyRegistered) => {
        if (alreadyRegistered) {
            // User is already registered
            callback("This username is already registered. Please choose a different one.");
        } else {
            // Insert the new user into the database
            let query = "INSERT INTO users (Name, Password) VALUES (?, ?)";

            db.query(query, [username, password], (result) => {
                if (result.affectedRows === 1) {
                    // Registration successful
                    callback("Registration successful! You can now log in.");
                } else {
                    // Registration failed
                    callback("Registration failed. Please try again.");
                }
            });
        }
    });
}

function isPasswordCorrect(username, password, callback) {
    // Query the database to retrieve the stored password for the given username
    let query = "SELECT Password FROM users WHERE Name = ?";

    db.query(query, [username], (result) => {
        if (result.numRows > 0) {
            // User found in the database
            let storedPassword = result.fetchRow()[0];
            if (storedPassword === password) {
                // Passwords match, login successful
                callback(true);
            } else {
                // Passwords do not match
                callback(false);
            }
        } else {
            // User not found in the database
            callback(false);
        }
    });
}


