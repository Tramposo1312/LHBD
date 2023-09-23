// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale structures, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initLocaleScript() {
    logToConsole(LOG_INFO, "[VRR.Locale]: Initializing locale script ...");
    getServerData().localeStrings = loadAllLocaleStrings();
	logToConsole(LOG_INFO, "[VRR.Locale]: Locale script initialized!");
}

// ===========================================================================

function getLocaleString(client, stringName, ...args) {
    let tempString = getRawLocaleString(stringName, getPlayerLocaleName(client));
    if(tempString == "") {
        submitBugReport(client, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getPlayerLocaleName(client)}"`);
    }

    tempString = replaceColoursInMessage(tempString);

    for(let i = 1; i <= args.length; i++) {
        tempString = tempString.replace(`{${i}}`, args[i-1]);
    }

    return tempString;
}

// ===========================================================================

function getRawLocaleString(stringName, localeName) {
    return getLocaleStrings()[localeName][stringName];
}

// ===========================================================================

function getPlayerLocaleName(client) {
    if(client == null) {
        return getLocaleNameFromParams(`English`);
    }

    return "english";
    //return getPlayerData(client).accountData.locale;
}

// ===========================================================================

function loadAllLocaleStrings() {
    let tempLocaleStrings = {};

    let locales = getGlobalConfig().locales;
    for(let i in locales) {
        let localeData = locales[i];
        let localeFile = JSON.parse(loadTextFile(`locale/${localeData[1]}.json`));
        tempLocaleStrings[localeData[1]] = localeFile;
    }

    return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings() {
    return getServerData().localeStrings;
}

// ===========================================================================

function getLocaleNameFromParams(params) {
	let locales = getLocales();
	if(isNaN(params)) {
		for(let i in locales) {
			if(toLowerCase(i).indexOf(toLowerCase(params)) != -1) {
				return locales[i];
			}
		}
	}

	return false;
}

// ===========================================================================

function getLocales() {
    return getGlobalConfig().locales;
}

// ===========================================================================