// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: help.js
// DESC: Provides update info, help commands, and documentation
// TYPE: Server (JavaScript)
// ===========================================================================

function initHelpScript() {
	logToConsole(LOG_INFO, `[VRR.Help]: Initializing help script ...`);
	logToConsole(LOG_INFO, `[VRR.Help]: Help script initialized successfully!`);
}

// ===========================================================================

let randomTips = [
    `{MAINCOLOUR}Look for yellow dots on your map for job locations.`,
    `{MAINCOLOUR}You can set custom key binds. Use {ALTCOLOUR}/help keys {MAINCOLOUR} for details.`,
    `{MAINCOLOUR}Use /notips if you don't want to see tips and extra information`,
    `{MAINCOLOUR}You can edit your keybinds using {ALTCOLOUR}/bindkey and /unbindkey`,
    `{MAINCOLOUR}Press ℹ️ to see your inventory, and use number keys to select an item`,
    `{MAINCOLOUR}Use /buy at a business to purchase items.`,
    `{MAINCOLOUR}Found a bug? Report it with {ALTCOLOUR}/bug`,
    `{MAINCOLOUR}Have an idea or suggestion for the server? Let the devs know using {ALTCOLOUR}/idea`,
    `{MAINCOLOUR}Want to buy a business? Use /bizbuy at one for sale`,
    `{MAINCOLOUR}Want to buy a house? Use /housebuy at one for sale`,
    `{MAINCOLOUR}Want to buy a vehicle? Visit a dealership and enter one for info on how to buy it!`,
    `{MAINCOLOUR}Switch to any of your characters with {ALTCOLOUR}/switchchar`,
    `{MAINCOLOUR}Use {ALTCOLOUR}/iplogin {MAINCOLOUR}to automatically login when connecting with the same IP`,
    `{MAINCOLOUR}Use {ALTCOLOUR}/houselights or /bizlights {MAINCOLOUR}to turn on/off the lights in your house or business`,
    `{MAINCOLOUR}Use {ALTCOLOUR}/radiostation {MAINCOLOUR}to play an internet radio station in your car, house, or business`,
    //`{MAINCOLOUR}Lower your car windows with /windows {ALTCOLOUR} to play the vehicle's internet radio station {ALTCOLOUR}(/radiostation) {MAINCOLOUR}to nearby players`,
    //`{MAINCOLOUR}Lower your car windows with /windows {ALTCOLOUR} to play the vehicle's internet radio station {ALTCOLOUR}(/radiostation) {MAINCOLOUR}to nearby players`,
    //`{MAINCOLOUR}Tax is based on your total wealth. This includes money, vehicles, businesses and more.`,
    //`{MAINCOLOUR}Don't go broke because of a hospital bill! Get insured today by visiting an insurance agency!`,
    //`{MAINCOLOUR}Don't go broke because your car was destroyed. Visit an insurance agency today!`,
    //`{MAINCOLOUR}You can find most locations by using {ALTCOLOUR}/gps`,
    //`{MAINCOLOUR}Want to advertise your business? Visit the news station and place an /ad today!`,
    //`{MAINCOLOUR}You can change your quick item display. Choices are GTAV-style pie menu or Minecraft-style hotbar`,
    //`{MAINCOLOUR}Hold [#0066FF]E {MAINCOLOUR}to hail a nearby taxi if you need a ride.`,
    //`{MAINCOLOUR}Press [#0066FF]G {MAINCOLOUR}to enter a vehicle as passenger.`,
    //`{MAINCOLOUR}Banks can provide loans. Use {ALTCOLOUR}/help loans {MAINCOLOUR} for more details.`,
    `{MAINCOLOUR}Want to make a clan? Use {ALTCOLOUR}/help clans {MAINCOLOUR} for details.`,
    `{MAINCOLOUR}Legal weapons can be purchased at any ammunation.`,
];

// ===========================================================================

function helpCommand(command, params, client) {
	if(areParamsEmpty(params)) {
        showMainHelpMessage(client);
        return false;
    }

    let splitParams = params.split(" ");

    switch(toLowerCase(getParam(params, " ", 1))) {
        case "account":
            showAccountHelpMessage(client);
            break;

        case "vehicle":
        case "veh":
        case "vehs":
        case "vehicles":
        case "car":
        case "cars":
            showVehicleHelpMessage(client);
            break;

        case "dealership":
            showVehicleDealershipHelpMessage(client);
            break;

        case "business":
            showBusinessHelpMessage(client);
            break;

        case "job":
            showJobHelpMessage(client);
            break;

        case "chat":
            showChatHelpMessage(client);
            break;

        case "rules":
            showRulesHelpMessage(client);
            break;

        case "website":
            showWebsiteHelpMessage(client);
            break;

        case "discord":
            showDiscordHelpMessage(client);
            break;

        case "anim":
        case "anims":
        case "animation":
        case "animations":
            showAnimationHelpMessage(client);
            break;

        case "ammunation":
        case "ammu":
        case "gun":
        case "guns":
            showAmmunationHelpMessage(client);
            break;

        case "skin":
        case "skins":
        case "clothes":
            showClothesHelpMessage(client);
            break;

        case "key":
        case "keys":
        case "keybinds":
        case "bindkey":
        case "bindkeys":
            showBindKeysHelpMessage(client);
            break;

        case "command":
        case "cmd":
            showCommandHelpMessage(client, getParam(params, " ", 2));
            break;

        case "clan":
        case "clans":
        case "group":
        case "groups":
        case "faction":
        case "factions":
        case "family":
        case "families":
            showClanHelpMessage(client);
            break;

        case "radio":
        case "radiostations":
        case "music":
            showRadioHelpMessage(client);
            break;

        case "economy":
        case "wealth":
        case "tax":
        case "taxes":
        case "payday":
            showWealthAndTaxHelpMessage(client);
            break;

        default:
            showMainHelpMessage(client);
            break;
    }
}

// == Account Help =============================
// == Vehicle Help =============================
// == Vehicle Dealerships ======================
// == Job Help =================================
// == Chat Help ================================
// == Server Rules =============================
// == Website ==================================
// == Discord ==================================
// == Animations ===============================
// == Pay And Spray ============================
// == Ammunation ===============================
// == Vehicle Tuneup ===========================
// == Bindable Keys ============================
// == Clothes ==================================
// == Business =================================
// == Clan Help ================================
// == Command Info =============================
// == Player Vehicles ==========================
// == Player Businesses ========================
// == Clans ====================================
// == Admins ===================================
// == Badge ====================================
// == Accents ==================================
// == Player Info ==============================
// == Wealth and Tax ===========================

// ===========================================================================

function showMainHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use /help <category> for commands and info. Example: {ALTCOLOUR}/help vehicle`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Help Categories: [#A9A9A9]account, command, vehicle, job, chat, rules, website, anim`);
    messagePlayerNormal(client, `{clanOrange}• [#A9A9A9]ammunation, skins, mechanic, dealership, discord, colours, keys`);
}

// ===========================================================================

function showAccountHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAccountHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Do not share your password with anybody else.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use {ALTCOLOUR}/changepass{MAINCOLOUR} to change your password.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Some settings you can use: {ALTCOLOUR}/gui, /logo, /iplogin, /autolastchar, /2fa, /loginalert`);
}

// ===========================================================================

function showVehicleHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Visit dealerships to buy new vehicles (Use {ALTCOLOUR}/help dealership {MAINCOLOUR}for more info.)`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Some commands: {ALTCOLOUR}/lock, /engine, /lights, /trunk, /rentveh, /buyveh, /rentprice, /buyprice`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Your personal vehicles will save wherever you or somebody else leaves them!`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Visit a mechanic garage to repair, colour, and tune up your car! {ALTCOLOUR}/help mechanic {MAINCOLOUR} for info`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Don't forget to register and insure your vehicle! Use {ALTCOLOUR}/gps {MAINCOLOUR}to find a DMV for this.`);
}

// ===========================================================================

function showVehicleDealershipHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleDealershipHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Visit a vehicle dealer to buy new vehicles. Use {ALTCOLOUR}/gps {MAINCOLOUR}to find one.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}At the dealer, simply enter a car you want to buy, and the price will be shown to you`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}If you want to buy the vehicle and have enough money, use {ALTCOLOUR}/buyveh {MAINCOLOUR}and you will be given keys`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}A new car for sale will appear when you drive away from the dealer.`);
}

// ===========================================================================

function showJobHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Visit job locations get a job and earn money. Look for yellow spots on the map`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}At a job location, use {ALTCOLOUR}/takejob {MAINCOLOUR}to get the job. Use {ALTCOLOUR}/quitjob {MAINCOLOUR}to quit your job`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use {ALTCOLOUR}/startwork {MAINCOLOUR}to begin working. You can also get a job {ALTCOLOUR}/uniform and {ALTCOLOUR}/equipment`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Most job vehicles are locked. Use {ALTCOLOUR}/lock {MAINCOLOUR}near one to enter it.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}When entering a job vehicle, information on how to do the job will be shown to you.`);
}

// ===========================================================================

function showChatHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderChatHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}There are two main types of chat: out-of-character (OOC) and in-character (IC)`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Mixing these two types is not proper roleplay. See {ALTCOLOUR}/rules {MAINCOLOUR}for info.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Some chat commands: {ALTCOLOUR}/dm /whisper /talk /shout /me.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Some have shorter names available ({ALTCOLOUR}/t {MAINCOLOUR}for talk, {ALTCOLOUR}/s {MAINCOLOUR}for shout, etc)`);
}

// ===========================================================================

function showRulesHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderServerRulesList")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Unrealistic actions (powergaming) are not allowed. You aren't superman.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}No terrorist or terrorism roleplay is allowed.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Always follow instructions given by moderators and admins.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Do not mix the chats (metagaming). You can't use info in IC that was received OOC`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Keep English in main chats. If you aren't good at English, use {ALTCOLOUR}/help language`);
}

// ===========================================================================

function showWebsiteHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderWebsiteInfo")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}${server.getRule("Website")}`);
}

// ===========================================================================

function showDiscordHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderDiscordInfo")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}${server.getRule("Website")}`);
}

// ===========================================================================

function showAnimationHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAnimationHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Animations allow you to enhance roleplay with visual actions`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use {ALTCOLOUR}/an {MAINCOLOUR}or {ALTCOLOUR}/anim {MAINCOLOUR}with a name to use an animation.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}To see a list of animations, use {ALTCOLOUR}/animlist`);
}

// ===========================================================================

function showAmmunationHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAmmunationHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Visit an ammunation to buy weapons. Use {ALTCOLOUR}/gps {MAINCOLOUR}to find one.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Buying a weapon requires a weapon license.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Weapon licenses are managed by the police department. Apply there to get one.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Weapons can also be purchased illegally from weapon dealers and clans.`);
}

// ===========================================================================

function showClothesHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderSkinHelp")));
    //messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}To change your skin, use {ALTCOLOUR}/gps {MAINCOLOUR}to find a clothing store`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}At a clothing store, use {ALTCOLOUR}/buy {MAINCOLOUR} to purchase clothes`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}When you have a clothing item, equip and use it like any other item to show the skin selection (check {ALTCOLOUR}/help items {MAINCOLOUR}to learn how to use items)`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Some skins are restricted to jobs, clans, or for other reasons.`);
}

// ===========================================================================

function showBindKeysHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBindableKeysHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}You can set your own keys binds. Use {ALTCOLOUR}/keybinds {MAINCOLOUR}to see your binded keys.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use {ALTCOLOUR}/bindkey {MAINCOLOUR}to add a new keybind and /unbindkey to remove one.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Default keys are: [#0066FF]K {MAINCOLOUR}for vehicle engine, [#0066FF]L {MAINCOLOUR}for lights, and [#0066FF]J {MAINCOLOUR}for lock/unlock`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}[#0066FF]I {MAINCOLOUR}to see your items and [#0066FF]1-9 {MAINCOLOUR}to equip an item or [#0066FF]0 (zero) {MAINCOLOUR}to equip none.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}[#0066FF]U {MAINCOLOUR}to use or [#0066FF]O {MAINCOLOUR}to drop your current item, and [#0066FF]P {MAINCOLOUR}to pickup an item from the ground.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Your keybinds will automatically be usable on all ${getServerName()} servers`);
}

// ===========================================================================

function showBusinessHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessHelp")));
    messagePlayerHelpContent(client, getLocaleString(client, "BusinessHelp")[0]);
    messagePlayerHelpContent(client, getLocaleString(client, "BusinessHelp")[1]);
    messagePlayerHelpContent(client, getLocaleString(client, "BusinessHelp")[2], `{ALTCOLOUR}/bizorder, /bizlock, /bizlights, /radiostation, /bizitemprice, /bizbuyprice, /bizfee, /biztill, /bizwithdraw, /bizdeposit`);
    messagePlayerHelpContent(client, getLocaleString(client, "BusinessHelp")[3]);
}

// ===========================================================================

function showClanHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanHelp")));
    messagePlayerHelpContent(client, getLocaleString(client, "ClanHelp")[0]);
    messagePlayerHelpContent(client, getLocaleString(client, "ClanHelp")[1]);
    messagePlayerHelpContent(client, getLocaleString(client, "ClanHelp")[2], `{ALTCOLOUR}/clan, /clanmotd, /clanname, /clanowner, /clanhouse, /clanbiz, /claninvite, /clanuninvite, /clansetrank`);
    messagePlayerHelpContent(client, getLocaleString(client, "ClanHelp")[3], `{ALTCOLOUR}/clanranks, /clanflags, /clanaddrank, /clandelrank, /clanaddrankflag, /clandelrankflag, /clanaddmemberflag, /clandelmemberflag`);
}

// ===========================================================================

function showRadioHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderRadioHelp")));
    messagePlayerHelpContent(client, getLocaleString(client, "RadioHelp")[0], `{ALTCOLOUR}/radiostation {MAINCOLOUR}`);
    messagePlayerHelpContent(client, getLocaleString(client, "RadioHelp")[1], `{ALTCOLOUR}/radiostations {MAINCOLOUR}`);
    messagePlayerHelpContent(client, getLocaleString(client, "RadioHelp")[2], `{ALTCOLOUR}/radiovolume {MAINCOLOUR}`);
}

// ===========================================================================

function showWealthAndTaxHelpMessage(client) {
    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderWealthandTaxHelp")));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Your taxes on payday are ${100*getGlobalConfig().economy.incomeTaxRate}% of your calculated wealth.`);
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Your calculated wealth is a total sum based on how many vehicles, houses, and businesses you have.`);
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Each vehicle is {ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle}, {MAINCOLOUR}each house is {ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerHouse}, {MAINCOLOUR}and each business is {ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness}`);
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use {ALTCOLOUR}/wealth {MAINCOLOUR}to see your current wealth, and {ALTCOLOUR}/tax {MAINCOLOUR}to see how much you'll pay in tax each payday`);
}

// ===========================================================================

function showCommandHelpMessage(client, commandName) {
    if(!commandName) {
        messagePlayerSyntax(client, `${getCommandSyntaxText("help")}command <command name>`);
        return false;
    }

    commandName = toLowerCase(commandName);
    commandName = commandName.trim();

    if(commandName.slice(0, 1) == "/") {
        commandName = commandName.slice(1);
    }

    let command = getCommandData(commandName);
    let aliases = getCommandAliasesNames(command);

    messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderCommandInfo", commandName)));
    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Description: ${command.description}`);

    if(aliases.length > 0) {
        messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Aliases: ${aliases.join(", ")}`);
    } else {
        messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Aliases: (None)`);
    }

    //messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Usable on Discord: ${getYesNoFromBool(command.allowOnDiscord)}`);

    //if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
    //    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Usable on Discord: ${getYesNoFromBool(command.allowOnDiscord)}`);
    //}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function helpGetCarCommand(command, params, client) {
	messagePlayerAlert(client, `You can buy a car by visiting a vehicle dealership. Use {ALTCOLOUR}/help vehicle {MAINCOLOUR}for more info.`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function helpGetSkinCommand(command, params, client) {
	messagePlayerAlert(client, `You can change your skin by visiting a clothes store. Use {ALTCOLOUR}/help skin {MAINCOLOUR}for more info.`);
}

// ===========================================================================