"use strict";

// Create a new dialog element
const dialogElement = GUIPage.addElement('div');
dialogElement.className = 'GUIElement';

// Create the dialog window
const dialogWindow = GUIPage.addElement('div');
dialogWindow.className = 'GUIWindow';

// Create the title bar
const titleBar = GUIPage.addElement('div');
titleBar.className = 'title-bar';
dialogWindow.appendChild(titleBar);

// Create the title element
const titleElement = GUIPage.addElement('span');
titleElement.className = 'title';
titleElement.textContent = 'Dialog Title';
titleBar.appendChild(titleElement);

// Create the close button
const closeButton = GUIPage.addElement('span');
closeButton.className = 'close-button';
closeButton.textContent = '×';
closeButton.onclick = closeDialog;
titleBar.appendChild(closeButton);

// Create the content
const content = GUIPage.addElement('div');
content.className = 'content';
content.innerHTML = '<p>This is a simple dialog box content.</p>';
dialogWindow.appendChild(content);

// Append the dialog window to the dialog element
dialogElement.appendChild(dialogWindow);

// Append the dialog element to the body
game.body.appendChild(dialogElement);

// Function to open the dialog
function openDialog() {
    dialogElement.style.display = 'block';
}

// Function to close the dialog
function closeDialog() {
    dialogElement.style.display = 'none';
}

// Initial state: dialog is hidden
dialogElement.style.display = 'none';

addCommandHandler("dialog", (command, params, client) => {
    openDialog()
});
