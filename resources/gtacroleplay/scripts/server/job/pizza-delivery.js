// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: pizza-delivery.js
// DESC: Provides pizza delivery driver job functions and usage
// TYPE: Job (JavaScript)
// ===========================================================================

let pizzaDeliveryStops = [
    false,

    [ // GTA 3 (1)
        [ // PORTLAND ISLAND (0)
            toVector3(1269, -1056.4, 14.75),
            toVector3(1088.7, -968.8, 14.91),
            toVector3(1059.1, -870.9, 14.91),
            toVector3(917.6, -815.9, 14.91),
            toVector3(851.1, -766.1, 14.91),
            toVector3(838.8, -598.7, 14.91),
            toVector3(959.3, -581.6, 14.91),
            toVector3(853.1, -485.9, 14.91),
            toVector3(838.8, -312.68, 6.8),
            toVector3(913.9, -177.4, 4.91),
            toVector3(1123.3, -67.74, 7.41),
            toVector3(1043.6, -191.63, 4.91),
            toVector3(1213.2, -281.3, 25.76),
            toVector3(1193.3, -474.3, 24.98),
            toVector3(1335.4, -499.7, 45.28),
            toVector3(1220.3, -341.4, 26.38),
            toVector3(1122.6, -475.6, 19.91),
            toVector3(1309.2, -642.4, 12.3),
            toVector3(1350.5, -845, 14.91),
            toVector3(1322.2, -1025.3, 14.76),
            toVector3(1307.5, -995.54, 14.88),
        ],

        [ // STAUNTON ISLAND (1)
            toVector3(-1.11, -388.4, 16.11),
            toVector3(-15.75, -735.3, 26.15),
            toVector3(33.63, -1029.4, 26.11),
            toVector3(-53.92, -1233.4, 26.11),
            toVector3(126.58, -1323.7, 26.11),
            toVector3(189.39, -1285.6, 26.11),
            toVector3(266.9, -1179.1, 26.11),
            toVector3(283.93, -1370.2, 26.11),
            toVector3(144.44, -1455.5, 26.11),
            toVector3(34.5, -1511.7, 26.11),
            toVector3(325.31, -1579, 26.03),
            toVector3(302.33, -1417.7, 26.11),
            toVector3(309.76, -1290, 26.11),
            toVector3(378.5, -1235.1, 26.11),
            toVector3(404, -1376.3, 26.11),
            toVector3(189.07, -1159.3, 26.11),
            toVector3(189.44, -956.9, 26.11),
            toVector3(254.18, -722.3, 26.11),
            toVector3(383.4, -704.2, 26.11),
            toVector3(429.3, -420.6, 22.04),
            toVector3(570.9, -336.4, 19.71),
            toVector3(267.46, 91.12, 15.96),
            toVector3(99.13, -31.96, 16.11),
            toVector3(243.94, -187.01, 21.31),
            toVector3(99.17, -263.44, 16.11),
            toVector3(-26.92, -283.73, 16.11),
        ],
    ],

    [ // GTA VC
        [ // WESTERN ISLAND (0)
            toVector3(-997.698, 175.8, 10.704),
            toVector3(-607.007, 659.024, 10.9994),
            toVector3(-665.23, 843.213, 11.3572),
            toVector3(-669.703, 1174.17, 10.9954),
            toVector3(19.0071, 967.446, 10.8685),
            toVector3(-441.901, 1099.23, 10.9998),
            toVector3(-1048.15, 1341.77, 8.76068),
            toVector3(-870.697, 1049.45, 11.0081),
            toVector3(-683.681, 610.935, 11.0217),
            toVector3(-1011.02, 291.984, 11.3042),
            toVector3(-1185.89, -264.69, 11.5162),
            toVector3(-1106.57, -300.12, 11.189),
            toVector3(-1012.97, -372.445, 10.8688),
            toVector3(-1018.07, -573.031, 11.0513),
            toVector3(-1184.86, -647.271, 11.565),
            toVector3(-1034.59, -908.376, 14.0954),
            toVector3(-990.653, -1074.29, 14.7919),
            toVector3(-1199.02, -946.758, 14.7914),
            toVector3(-1431.57, -780.312, 14.7926),
            toVector3(-1282.71, -785.966, 14.7917),
            toVector3(-1204.48, -939.911, 14.7917),
            toVector3(-1006.98, -1079.19, 14.7916),
            toVector3(-928.565, -1257.33, 11.9578),
            toVector3(-912.603, -1442.4, 11.8644),
            toVector3(-683.223, -1389.97, 11.0019),
            toVector3(-799.104, -1062.2, 11.0011),
            toVector3(-812.002, -672.31, 11.0046),
            toVector3(-834.03, -477.273, 11.0118),
            toVector3(-840.406, -307.896, 11.0001),
            toVector3(-829.729, -119.308, 11.0004),
            toVector3(-903.957, 33.4505, 10.6344),
            toVector3(-1002.04, -37.9656, 10.9094),
            toVector3(-1066.83, -13.3146, 11.3389),
            toVector3(-1067.5, 109.544, 11.3122),
            toVector3(-1003.59, 171.078, 10.8953),
            toVector3(-748.054, 198.243, 11.2455),
            toVector3(-850, -110.625, 11.0203),
            toVector3(-898.862, -280.373, 10.6645),
            toVector3(-1082.1, -294.416, 11.2065),
        ],
    ],


    [ // GTA SA
        [ // LOS SANTOS ISLAND (0)
            toVector3(1823.79, -1852.66, 13.5144),
            toVector3(1804.12, -1609.59, 13.4419),
            toVector3(1660.32, -1510.09, 13.4877),
            toVector3(1612.54, -1322.23, 17.4085),
            toVector3(1778.93, -1286.59, 13.5744),
            toVector3(1854.72, -1208.16, 20.9552),
            toVector3(1659.95, -1158.07, 23.8315),
            toVector3(1461.6, -1031.05, 23.7518),
            toVector3(1277.71, -1036.63, 31.6085),
            toVector3(1322.74, -1151.38, 23.7558),
            toVector3(1194.26, -1334.15, 13.4953),
            toVector3(1081.29, -1392.64, 13.7023),
            toVector3(1034.65, -1555.27, 13.4591),
            toVector3(1033.26, -1782.3, 13.6323),
            toVector3(1262.27, -1855, 13.4887),
            toVector3(1445.39, -1875.5, 13.4944),
            toVector3(1742.23, -2168.78, 13.557),
            toVector3(1943.35, -2169.25, 13.4741),
            toVector3(1963.51, -1969.6, 13.5867),
            toVector3(1824.2, -1886.48, 13.4287),
            toVector3(1824.17, -1851.5, 13.5134),
            toVector3(1853.95, -1395.48, 13.4882),
            toVector3(1659.33, -1158.59, 23.8368),
            toVector3(1375.08, -1139.12, 23.7585),
            toVector3(1186.53, -1139.9, 23.8007),
            toVector3(1021.63, -1139.48, 23.7568),
            toVector3(965.119, -1100.04, 23.7962),
            toVector3(1058.53, -1042.64, 32.03),
            toVector3(1238.74, -1041.7, 31.8307),
            toVector3(1377.08, -977.352, 32.2744),
            toVector3(1461.71, -731.011, 93.5068),
            toVector3(1248.83, -729.438, 94.7962),
            toVector3(932.221, -828.904, 94.6709),
            toVector3(717.372, -982.938, 52.8477),
            toVector3(452.042, -1182.3, 66.3269),
            toVector3(287.664, -1221.08, 75.3682),
            toVector3(225.497, -1346.85, 51.5658),
            toVector3(438.728, -1720.92, 9.92785),
            toVector3(894.789, -1788.3, 13.5674),
            toVector3(919.419, -1592.92, 13.4843),
            toVector3(939.902, -1408.49, 13.3463),
            toVector3(1207.53, -1329.3, 13.5012),
            toVector3(1324.24, -1282.88, 13.4815),
            toVector3(1296.85, -1551.41, 13.4839),
            toVector3(1294.85, -1811.15, 13.4816),
            toVector3(1649.38, -1875.42, 13.4858),
            toVector3(1819.59, -1870.9, 13.4987),
            toVector3(1823.94, -1853.88, 13.5103),
            toVector3(1823.97, -1655.31, 13.4738),
            toVector3(1854.81, -1409.54, 13.4829),
            toVector3(1869.02, -1152.77, 23.8096),
            toVector3(1975.68, -1104.29, 25.5835),
            toVector3(2077.6, -985.15, 50.0375),
            toVector3(2161.61, -1022.78, 62.5533),
            toVector3(2173.38, -1148.91, 24.9203),
            toVector3(2166.28, -1267.17, 23.9138),
            toVector3(2087.27, -1298.99, 23.9193),
            toVector3(2008.67, -1338.34, 23.9207),
            toVector3(2026.04, -1468.12, 14.867),
            toVector3(2108.83, -1684.64, 13.4771),
            toVector3(2185.67, -1745.22, 13.4681),
            toVector3(2287.18, -1734.76, 13.4821),
            toVector3(2411.06, -1793.34, 13.4746),
            toVector3(2451.02, -1934.86, 13.4209),
            toVector3(2529.97, -1750.13, 13.479),
            toVector3(2685.6, -1659.48, 11.4476),
            toVector3(2739.7, -1524.93, 29.6406),
            toVector3(2739.95, -1278.48, 57.8435),
            toVector3(2683.93, -1068.66, 69.2199),
            toVector3(2578.78, -1045.36, 69.5098),
            toVector3(2326.9, -1128.69, 27.8126),
            toVector3(2367.83, -1270.92, 23.941),
            toVector3(2324.15, -1382.25, 23.9621),
            toVector3(2137.14, -1382.12, 23.9376),
            toVector3(2010.74, -1459.87, 13.4914),
            toVector3(1824.35, -1562.74, 13.4622),
            toVector3(1818.98, -1872.52, 13.5075),
            toVector3(1823.79, -1852.66, 13.5144),
            toVector3(1804.12, -1609.59, 13.4419),
            toVector3(1660.32, -1510.09, 13.4877),
            toVector3(1612.54, -1322.23, 17.4085),
            toVector3(1778.93, -1286.59, 13.5744),
            toVector3(1854.72, -1208.16, 20.9552),
            toVector3(1659.95, -1158.07, 23.8315),
            toVector3(1461.6, -1031.05, 23.7518),
            toVector3(1277.71, -1036.63, 31.6085),
            toVector3(1322.74, -1151.38, 23.7558),
            toVector3(1194.26, -1334.15, 13.4953),
            toVector3(1081.29, -1392.64, 13.7023),
            toVector3(1034.65, -1555.27, 13.4591),
            toVector3(1033.26, -1782.3, 13.6323),
            toVector3(1262.27, -1855, 13.4887),
            toVector3(1445.39, -1875.5, 13.4944),
            toVector3(1742.23, -2168.78, 13.557),
            toVector3(1943.35, -2169.25, 13.4741),
            toVector3(1963.51, -1969.6, 13.5867),
            toVector3(1824.2, -1886.48, 13.4287),
        ],
    ],

    // GTA UG
    [

    ],

    // GTA IV
    [

    ],
];

// ===========================================================================

function getRandomPizzaDeliveryStop(island) {
    if(pizzaDeliveryStops[getServerGame()][island].length == 1) {
        return 0;
    }
    return getRandom(0, pizzaDeliveryStops[getServerGame()][island].length-1);
}

// ===========================================================================

function showCurrentPizzaDeliveryStop(client) {
    sendJobDeliveryPointToPlayer(client, getPizzaDeliveryStopPosition(getPlayerIsland(client), getPlayerData(client).jobRoute), getColourByName("deliveryPurple"))
}

// ===========================================================================

function playerArrivedAtPizzaDeliveryDestination(client) {
    respawnVehicle(getPlayerData(client).jobDeliveryVehicle);
    let payout = applyServerInflationMultiplier(getPizzaDeliveryPay(getPlayerData(client).jobDeliveryStart, getPlayerData(client).jobDeliveryStop));
    getPlayerData(client).payDayAmount += payout;
    messagePlayerNormal(client, `You delivered the pizza! Return to the pizza restaurant if you want to deliver another pizza.`, getColourByName("yellow"));
    messagePlayerNormal(client, `You earned $${payout}. Your total paycheck of {ALTCOLOUR}${getPlayerData(client).payDayAmount} will be received in {ALTCOLOUR}${getTimeDisplayUntilPlayerPayDay(client)}`);
    getPlayerData(client).jobDeliveryVehicle = false;
    getPlayerData(client).jobDeliveryStart = 0;
    getPlayerData(client).jobDeliveryStop = 0;
}

// ===========================================================================

function getPizzaDeliveryPay(startPoint, stopPoint) {
    return Math.floor(getDistance(startPoint, stopPoint));
}

// ===========================================================================