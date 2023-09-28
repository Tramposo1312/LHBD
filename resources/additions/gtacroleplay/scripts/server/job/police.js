// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: police.js
// DESC: Provides police officer job functions and usage
// TYPE: Job (JavaScript)
// ===========================================================================

let patrolRoutes = [
    false,

    [ // GTA 3 (1)
        [ // PORTLAND (0)

        ],

        [ // STAUNTON ISLAND (1)
            { // SECTOR 1 (0)
                name: "Staunton Island Sector 1",
                island: 0,
                payout: 175,
                type: VRR_PATROLTYPE_VEHICLE,
                positions: [
                    toVector3(404.5, -1209.73, 25.8024),
                    toVector3(334.831, -1388.93, 25.8005),
                    toVector3(143.949, -1433.8, 25.802),
                    toVector3(144.79, -1592.07, 25.8019),
                    toVector3(49.9422, -1566.3, 25.8021),
                    toVector3(48.9107, -1324.22, 25.8026),
                    toVector3(50.0236, -1101.78, 25.8023),
                    toVector3(131.694, -1111.31, 25.7952),
                    toVector3(189.424, -1063.86, 25.7998),
                    toVector3(272.875, -1044.04, 25.8019),
                    toVector3(355.409, -847.512, 25.1725),
                    toVector3(521.08, -399.068, 20.9302),
                    toVector3(403.586, -471.898, 25.8008),
                    toVector3(403.915, -608.12, 25.7963),
                    toVector3(324.298, -687.727, 25.7945),
                    toVector3(230.278, -738.004, 25.8017),
                    toVector3(145.977, -907.481, 25.8045),
                    toVector3(81.1892, -924.272, 25.8088),
                    toVector3(35.0571, -1023.52, 25.7989),
                    toVector3(40.047, -1224.51, 25.801),
                    toVector3(105.924, -1313.85, 25.7972),
                    toVector3(149.367, -1377.78, 25.8016),
                    toVector3(271.09, -1399.14, 25.8019),
                    toVector3(303.644, -1079.71, 25.8029),
                    toVector3(342.905, -873.693, 22.5513),
                    toVector3(542.573, -466.857, 23.3019),
                    toVector3(516.223, -398.79, 20.9548),
                    toVector3(404.847, -480.079, 25.7463),
                    toVector3(404.132, -908.893, 25.7912),
                    toVector3(403.389, -1098.75, 25.8034),
                ],
            }
        ],

        [ // SHORESIDE VALE (2)

        ]
    ],

    [ // GTA VC (2)
        [ // EAST (1)

        ],

        [ // WEST (2)

        ]
    ],
];

// ===========================================================================

function policeTazerCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function policeCuffCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function policeArrestCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function policeSearchCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function policeDragCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function policeDetainCommand(command, params, client) {
    if(!canPlayerUseJobs(client)) {
        messagePlayerError(client, "You are not allowed to use jobs.");
        return false;
    }

    if(!canPlayerUsePoliceJob(client)) {
        messagePlayerError(client, "You are not allowed to use the police job.");
        return false;
    }

    if(!isPlayerWorking(client)) {
        messagePlayerError(client, "You are not working! Use /startwork first.");
        return false;
    }

    if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
        messagePlayerError(client, "You don't have a police job.");
        return false;
    }

    return true;
}

// ===========================================================================

function playerArivedAtPolicePatrolPoint(client) {
    if(isLastStopOnPolicePatrolRoute(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute, getPlayerData(client).jobRouteStop)) {
        messagePlayerNormal(client, `You finished the ${getPatrolRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).name} patrol route! You earned $${getBusRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).payout*getServerData().inflationMultiplier}`, getColourByName("yellow"));
        messagePlayerNormal(client, `You can either continue driving the patrol route again, or use /stoproute to end your patrol.`, getColourByName("yellow"));
        givePlayerCash(client, getPolicePatrolRouteData(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute).payout*getServerData().inflationMultiplier);
        updatePlayerCash(client);
		getPlayerData(client).jobRouteVehicle = false;
		getPlayerData(client).jobRoute = 0;
		getPlayerData(client).jobRouteStop = 0;
        getPlayerData(client).jobRouteIsland = 0;
        getPlayerData(client).jobRouteState = VRR_JOBROUTE_INPROGRESS;
        return false;
    }

    showGameMessage(client, "Proceed to the next point on your patrol route", getColourByName("policeBlue"), 2000);
    getPlayerData(client).jobRouteStop = getNextStopOnPolicePatrolRoute(getPlayerData(client).jobRouteIsland, getPlayerData(client).jobRoute, getPlayerData(client).jobRouteStop);
    showCurrentPolicePatrolPoint(client);
}

// ===========================================================================