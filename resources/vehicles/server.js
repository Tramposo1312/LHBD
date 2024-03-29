"use strict";


// ----------------------------------------------------------------------------

addEventHandler("OnResourceStart", function(event, resource){
	if(resource == thisResource) {
		for(let i in defaultVehicles) {
			if(serverGame == defaultVehicles[i].game) {
				tempVehicle.position = new Vec3(defaultVehicles[i].x, defaultVehicles[i].y, defaultVehicles[i].z);
				tempVehicle.heading = degToRad(defaultVehicles[i].angle);	
				let tempVehicle = createVehicle(`${defaultVehicles[i].model}.i3d`, tempVehicle.position, tempVehicle.heading);				
				addToWorld(tempVehicle);					
			}
		}
	}
});

// Need this because there's some duplicates and I'm too lazy to remove them.
function isVehicleAlreadySpawned(vehData){
	if(spawnedVehicles.length > 0){
		for(let i in spawnedVehicles){
			// x, y, and game should be enough to pinpoint specific vehicle data from the array.
			if(spawnedVehicles[i].position.x == vehData.x && spawnedVehicles[i].position.y == vehData.y && spawnedVehicles[i].game == vehData.game){
				return true;
			}
		}
	}
	
	return false;
}

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ----------------------------------------------------------------------------

let defaultVehicles = [
	{
		model: 126,
		x: -1554.397461,
		y: -935.005371,
		z: 11.664828,
		angle: 88.380096,
		col1: -1,
		col2: -1,
		game: 1
	},
	{
		model: 191,
		x: 338.6310,
		y: -237.6571,
		z: 29.1708,
		angle: 98.9897,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 321.2141,
		y: -223.5259,
		z: 35.4006,
		angle: 239.5351,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 323.4258,
		y: -278.1154,
		z: 35.4035,
		angle: 5.3742,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: -542.1738,
		y: 792.2469,
		z: 97.0344,
		angle: 336.3952,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: -1186.4758,
		y: 76.4269,
		z: 10.6504,
		angle: 52.8653,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 101.3112,
		y: -1472.5735,
		z: 9.9521,
		angle: 275.9432,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 100.1139,
		y: -1474.9865,
		z: 9.9556,
		angle: 243.1996,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 97.7001,
		y: -1475.9623,
		z: 9.9563,
		angle: 173.3619,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 132,
		x: 91.2412,
		y: 242.9259,
		z: 21.4487,
		angle: 127.1787,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 216,
		x: -1009.4338,
		y: 186.8296,
		z: 11.3937,
		angle: 351.5172,
		col1: 6,
		col2: 76,
		game: 2
	},
	{
		model: 216,
		x: -994.8803,
		y: 193.2692,
		z: 11.4204,
		angle: 76.9205,
		col1: 6,
		col2: 76,
		game: 2
	},
	{
		model: 130,
		x: -598.1232,
		y: 622.5588,
		z: 11.7840,
		angle: 91.9153,
		col1: 18,
		col2: 74,
		game: 2
	},
	{
		model: 223,
		x: -631.2451,
		y: -1456.9464,
		z: 5.8690,
		angle: 335.9804,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -624.0446,
		y: -1459.0283,
		z: 5.8552,
		angle: 314.2722,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -618.1960,
		y: -1462.3164,
		z: 5.9297,
		angle: 303.1112,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -611.0363,
		y: -1464.7899,
		z: 5.9410,
		angle: 317.4910,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 166,
		x: -616.4828,
		y: 651.4387,
		z: 10.5640,
		angle: 348.6626,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 166,
		x: -611.2023,
		y: 651.9318,
		z: 10.5676,
		angle: 333.8794,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 166,
		x: -605.1564,
		y: 652.4683,
		z: 10.5843,
		angle: 339.8292,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 166,
		x: -587.9245,
		y: 654.5039,
		z: 10.6044,
		angle: 336.7441,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 166,
		x: -582.4528,
		y: 655.5148,
		z: 10.5830,
		angle: 327.5977,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 193,
		x: -577.7695,
		y: 650.5206,
		z: 10.5597,
		angle: 12.5459,
		col1: 84,
		col2: 84,
		game: 2
	},
	{
		model: 193,
		x: -596.3391,
		y: 675.9069,
		z: 10.7617,
		angle: 142.2299,
		col1: 7,
		col2: 7,
		game: 2
	},
	{
		model: 156,
		x: -665.3930,
		y: 805.4311,
		z: 11.0370,
		angle: 179.7041,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: -665.3428,
		y: 783.4216,
		z: 11.0371,
		angle: 180.0831,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: -650.4547,
		y: 754.2264,
		z: 11.2033,
		angle: 266.7828,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: -639.0520,
		y: 753.5862,
		z: 11.2032,
		angle: 266.7841,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: -600.3902,
		y: 807.4341,
		z: 11.2114,
		angle: 263.8463,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 227,
		x: -614.1934,
		y: 803.9073,
		z: 29.6660,
		angle: 1.2667,
		col1: 46,
		col2: 1,
		game: 2
	},
	{
		model: 210,
		x: -784.7332,
		y: 672.1744,
		z: 10.8495,
		angle: 89.7786,
		col1: 12,
		col2: 12,
		game: 2
	},
	{
		model: 135,
		x: -768.0613,
		y: 665.6818,
		z: 10.9137,
		angle: 91.5195,
		col1: 2,
		col2: 0,
		game: 2
	},
	{
		model: 210,
		x: -774.2057,
		y: 995.6342,
		z: 10.8461,
		angle: 271.1632,
		col1: 12,
		col2: 12,
		game: 2
	},
	{
		model: 159,
		x: -752.8378,
		y: 1003.8906,
		z: 10.8649,
		angle: 359.9301,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 174,
		x: -780.7037,
		y: 1026.5653,
		z: 10.9394,
		angle: 88.3382,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 130,
		x: -650.2558,
		y: 920.8828,
		z: 11.1857,
		angle: 91.0021,
		col1: 18,
		col2: 74,
		game: 2
	},
	{
		model: 137,
		x: -694.1721,
		y: 926.0735,
		z: 11.1955,
		angle: 268.8809,
		col1: 3,
		col2: 1,
		game: 2
	},
	{
		model: 137,
		x: -751.7783,
		y: 927.2592,
		z: 11.2812,
		angle: 56.6550,
		col1: 3,
		col2: 1,
		game: 2
	},
	{
		model: 145,
		x: -774.4608,
		y: 977.6279,
		z: 10.8241,
		angle: 180.5240,
		col1: 36,
		col2: 36,
		game: 2
	},
	{
		model: 192,
		x: -803.5596,
		y: 959.3724,
		z: 10.6343,
		angle: 271.9642,
		col1: 68,
		col2: 78,
		game: 2
	},
	{
		model: 192,
		x: -715.9547,
		y: 1065.1605,
		z: 10.5446,
		angle: 242.0198,
		col1: 68,
		col2: 78,
		game: 2
	},
	{
		model: 191,
		x: -496.2343,
		y: 1208.0430,
		z: 7.0726,
		angle: 151.6175,
		col1: 22,
		col2: 22,
		game: 2
	},
	{
		model: 191,
		x: -521.5993,
		y: 838.3251,
		z: 11.1270,
		angle: 326.8671,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 132,
		x: -392.5302,
		y: 894.8767,
		z: 10.6133,
		angle: 339.7856,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 132,
		x: -528.6176,
		y: 1203.7877,
		z: 7.2948,
		angle: 330.5338,
		col1: 10,
		col2: 10,
		game: 2
	},
	{
		model: 191,
		x: -447.5215,
		y: 1203.1743,
		z: 9.2052,
		angle: 270.8528,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 174,
		x: -448.7614,
		y: 1185.0378,
		z: 9.5395,
		angle: 93.0431,
		col1: 41,
		col2: 0,
		game: 2
	},
	{
		model: 149,
		x: -594.9833,
		y: 1346.0950,
		z: 11.5229,
		angle: 114.8051,
		col1: 47,
		col2: 76,
		game: 2
	},
	{
		model: 191,
		x: -822.9012,
		y: 1310.8057,
		z: 11.1059,
		angle: 159.9270,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 234,
		x: -1476.8434,
		y: 1047.7759,
		z: 264.1451,
		angle: 217.4100,
		col1: -1,
		col2: -1,
		game: 2
	},
	{
		model: 234,
		x: -1347.2435,
		y: 1055.6526,
		z: 264.0510,
		angle: 156.2663,
		col1: -1,
		col2: -1,
		game: 2
	},
	{
		model: 234,
		x: -1279.8364,
		y: 993.2283,
		z: 262.8954,
		angle: 90.2378,
		col1: -1,
		col2: -1,
		game: 2
	},
	{
		model: 234,
		x: -1351.7225,
		y: 934.1428,
		z: 262.0353,
		angle: 14.6320,
		col1: -1,
		col2: -1,
		game: 2
	},
	{
		model: 234,
		x: -1515.2861,
		y: 983.0940,
		z: 263.1325,
		angle: 282.8845,
		col1: -1,
		col2: -1,
		game: 2
	},
	{
		model: 198,
		x: -1346.5970,
		y: 1448.2627,
		z: 299.1477,
		angle: 321.8539,
		col1: 46,
		col2: 46,
		game: 2
	},
	{
		model: 198,
		x: -1311.7345,
		y: 1446.4861,
		z: 298.8468,
		angle: 49.8741,
		col1: 46,
		col2: 46,
		game: 2
	},
	{
		model: 198,
		x: -1323.5178,
		y: 1439.1461,
		z: 298.8476,
		angle: 9.8079,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 198,
		x: -1296.2511,
		y: 1458.1401,
		z: 298.8468,
		angle: 77.2460,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 198,
		x: -1417.2706,
		y: 1531.3175,
		z: 299.5493,
		angle: 265.1401,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 198,
		x: -1421.0701,
		y: 1488.8687,
		z: 302.1499,
		angle: 73.6359,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 217,
		x: -1127.0664,
		y: 1511.9712,
		z: 11.9682,
		angle: 357.7274,
		col1: 1,
		col2: 42,
		game: 2
	},
	{
		model: 173,
		x: -985.4117,
		y: 1344.1613,
		z: 11.7257,
		angle: 47.3206,
		col1: 93,
		col2: 77,
		game: 2
	},
	{
		model: 201,
		x: -918.6592,
		y: 1130.1572,
		z: 10.9791,
		angle: 129.1441,
		col1: 13,
		col2: 13,
		game: 2
	},
	{
		model: 146,
		x: -782.4065,
		y: 1116.9678,
		z: 10.0661,
		angle: 0.3381,
		col1: 1,
		col2: 3,
		game: 2
	},
	{
		model: 146,
		x: -771.0571,
		y: 1154.9764,
		z: 12.6235,
		angle: 180.7035,
		col1: 1,
		col2: 3,
		game: 2
	},
	{
		model: 132,
		x: -756.0136,
		y: 1074.7358,
		z: 9.2508,
		angle: 91.9495,
		col1: 35,
		col2: 35,
		game: 2
	},
	{
		model: 191,
		x: 96.4878,
		y: 1090.1553,
		z: 16.0475,
		angle: 211.5273,
		col1: 48,
		col2: 48,
		game: 2
	},
	{
		model: 179,
		x: 48.7824,
		y: 1100.7084,
		z: 17.2732,
		angle: 182.7325,
		col1: 16,
		col2: 74,
		game: 2
	},
	{
		model: 179,
		x: -4.4181,
		y: 1147.7140,
		z: 19.4285,
		angle: 205.1626,
		col1: 16,
		col2: 74,
		game: 2
	},
	{
		model: 179,
		x: 18.5310,
		y: 1140.2460,
		z: 19.6552,
		angle: 124.7352,
		col1: 16,
		col2: 74,
		game: 2
	},
	{
		model: 179,
		x: -25.4681,
		y: 1100.8353,
		z: 15.0815,
		angle: 281.7052,
		col1: 16,
		col2: 74,
		game: 2
	},
	{
		model: 190,
		x: -142.0661,
		y: 1022.3298,
		z: 7.5074,
		angle: 8.5241,
		col1: 1,
		col2: 90,
		game: 2
	},
	{
		model: 205,
		x: 50.4374,
		y: 1174.9293,
		z: 20.6586,
		angle: 173.0398,
		col1: 41,
		col2: 29,
		game: 2
	},
	{
		model: 205,
		x: 334.1074,
		y: 1201.4971,
		z: 17.1962,
		angle: 268.0051,
		col1: 33,
		col2: 0,
		game: 2
	},
	{
		model: 204,
		x: 395.3799,
		y: 989.4377,
		z: 12.1038,
		angle: 245.0027,
		col1: 17,
		col2: 17,
		game: 2
	},
	{
		model: 132,
		x: 287.0439,
		y: 1037.1035,
		z: 13.2244,
		angle: 11.1845,
		col1: 33,
		col2: 33,
		game: 2
	},
	{
		model: 230,
		x: 208.6151,
		y: 1229.4574,
		z: 17.4755,
		angle: 295.1513,
		col1: 48,
		col2: 65,
		game: 2
	},
	{
		model: 230,
		x: -1106.8494,
		y: 292.9714,
		z: 12.3273,
		angle: 271.9934,
		col1: 48,
		col2: 65,
		game: 2
	},
	{
		model: 216,
		x: -1002.6074,
		y: 206.0241,
		z: 11.4072,
		angle: 174.9314,
		col1: 6,
		col2: 76,
		game: 2
	},
	{
		model: 138,
		x: -1261.3719,
		y: 115.7242,
		z: 12.0178,
		angle: 172.4562,
		col1: 1,
		col2: 75,
		game: 2
	},
	{
		model: 205,
		x: -1107.2173,
		y: -198.0835,
		z: 11.1751,
		angle: 90.1365,
		col1: 9,
		col2: 39,
		game: 2
	},
	{
		model: 158,
		x: -920.4551,
		y: -306.0597,
		z: 13.5878,
		angle: 264.1842,
		col1: 4,
		col2: 75,
		game: 2
	},
	{
		model: 206,
		x: -951.9403,
		y: -378.0401,
		z: 10.9365,
		angle: 276.5116,
		col1: 61,
		col2: 39,
		game: 2
	},
	{
		model: 206,
		x: -891.4566,
		y: -700.5800,
		z: 10.9547,
		angle: 37.6183,
		col1: 61,
		col2: 39,
		game: 2
	},
	{
		model: 236,
		x: -863.2736,
		y: -666.1580,
		z: 11.0304,
		angle: 186.4959,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 236,
		x: -855.5962,
		y: -666.0559,
		z: 10.9932,
		angle: 183.2121,
		col1: 7,
		col2: 7,
		game: 2
	},
	{
		model: 236,
		x: -851.5004,
		y: -665.6548,
		z: 10.9740,
		angle: 185.7453,
		col1: 76,
		col2: 76,
		game: 2
	},
	{
		model: 236,
		x: -845.2188,
		y: -675.1938,
		z: 10.9438,
		angle: 97.3510,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 236,
		x: -844.9042,
		y: -679.4929,
		z: 10.9420,
		angle: 98.8294,
		col1: 52,
		col2: 52,
		game: 2
	},
	{
		model: 175,
		x: -846.8568,
		y: -909.4408,
		z: 10.9547,
		angle: 319.2956,
		col1: 42,
		col2: 42,
		game: 2
	},
	{
		model: 141,
		x: -973.8217,
		y: -831.9473,
		z: 6.4925,
		angle: 91.7754,
		col1: 11,
		col2: 11,
		game: 2
	},
	{
		model: 132,
		x: -1017.5047,
		y: -861.6166,
		z: 12.8358,
		angle: 213.0164,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 191,
		x: -1015.7603,
		y: -859.2327,
		z: 17.4827,
		angle: 191.6682,
		col1: 22,
		col2: 22,
		game: 2
	},
	{
		model: 191,
		x: -1019.6179,
		y: -858.1592,
		z: 17.4810,
		angle: 184.1755,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 175,
		x: -979.8837,
		y: -1169.0863,
		z: 14.7222,
		angle: 92.2340,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 144,
		x: -1008.8375,
		y: -1407.3828,
		z: 11.8616,
		angle: 252.0942,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 191,
		x: -697.8029,
		y: -1522.6481,
		z: 12.1532,
		angle: 68.8400,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 226,
		x: -731.2047,
		y: -1503.1404,
		z: 11.2021,
		angle: 265.5437,
		col1: 12,
		col2: 1,
		game: 2
	},
	{
		model: 226,
		x: -720.9149,
		y: -1553.4470,
		z: 12.2698,
		angle: 338.7068,
		col1: 12,
		col2: 1,
		game: 2
	},
	{
		model: 226,
		x: -696.1869,
		y: -1502.0701,
		z: 11.7049,
		angle: 357.9846,
		col1: 12,
		col2: 1,
		game: 2
	},
	{
		model: 217,
		x: -686.5530,
		y: -1567.7709,
		z: 12.5295,
		angle: 247.8371,
		col1: 1,
		col2: 57,
		game: 2
	},
	{
		model: 223,
		x: -588.4979,
		y: -1511.8752,
		z: 5.8423,
		angle: 252.7852,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -583.6869,
		y: -1502.5627,
		z: 5.7980,
		angle: 240.5196,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 136,
		x: -389.6123,
		y: -1726.2853,
		z: 6.7915,
		angle: 3.0873,
		col1: 1,
		col2: 1,
		game: 2
	},
	{
		model: 136,
		x: -397.6457,
		y: -1342.7911,
		z: 6.6525,
		angle: 354.6517,
		col1: 1,
		col2: 1,
		game: 2
	},
	{
		model: 223,
		x: -374.6611,
		y: -659.9583,
		z: 5.6830,
		angle: 91.7661,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 214,
		x: -650.9855,
		y: -263.8465,
		z: 6.7326,
		angle: 306.9479,
		col1: 50,
		col2: 32,
		game: 2
	},
	{
		model: 136,
		x: -512.7714,
		y: -226.5067,
		z: 6.7797,
		angle: 356.7461,
		col1: 1,
		col2: 1,
		game: 2
	},
	{
		model: 136,
		x: -535.4413,
		y: -227.1720,
		z: 6.6767,
		angle: 337.7500,
		col1: 1,
		col2: 1,
		game: 2
	},
	{
		model: 190,
		x: -372.2652,
		y: -216.4774,
		z: 7.3608,
		angle: 295.0877,
		col1: 1,
		col2: 35,
		game: 2
	},
	{
		model: 190,
		x: 604.7895,
		y: -1706.5129,
		z: 7.5829,
		angle: 332.8387,
		col1: 1,
		col2: 60,
		game: 2
	},
	{
		model: 190,
		x: 583.6797,
		y: -1760.7828,
		z: 7.2956,
		angle: 313.2621,
		col1: 1,
		col2: 46,
		game: 2
	},
	{
		model: 190,
		x: 603.4528,
		y: -1774.8110,
		z: 7.4699,
		angle: 205.4766,
		col1: 1,
		col2: 14,
		game: 2
	},
	{
		model: 190,
		x: -1259.0291,
		y: -1414.6964,
		z: 7.4179,
		angle: 60.5551,
		col1: 1,
		col2: 50,
		game: 2
	},
	{
		model: 160,
		x: -1199.0627,
		y: -1382.2418,
		z: 5.6341,
		angle: 152.5868,
		col1: 46,
		col2: 1,
		game: 2
	},
	{
		model: 160,
		x: -1213.4904,
		y: -1382.6627,
		z: 5.5850,
		angle: 151.3750,
		col1: 46,
		col2: 1,
		game: 2
	},
	{
		model: 132,
		x: -651.9755,
		y: -513.1553,
		z: 10.1559,
		angle: 111.1670,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 132,
		x: -355.9834,
		y: -530.7414,
		z: 12.5118,
		angle: 1.3028,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 132,
		x: -362.5143,
		y: -528.3513,
		z: 12.5124,
		angle: 2.4941,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 174,
		x: -393.3240,
		y: -523.2957,
		z: 12.6169,
		angle: 356.3634,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 174,
		x: -398.3515,
		y: -520.8174,
		z: 12.6268,
		angle: 359.5150,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 174,
		x: -406.8978,
		y: -520.3749,
		z: 12.6289,
		angle: 3.5854,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 217,
		x: -391.8160,
		y: -573.8380,
		z: 40.0296,
		angle: 270.2119,
		col1: 61,
		col2: 0,
		game: 2
	},
	{
		model: 156,
		x: 369.4720,
		y: -523.6241,
		z: 12.1027,
		angle: 319.9711,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: 352.9126,
		y: -509.6271,
		z: 12.0988,
		angle: 320.7192,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 198,
		x: 167.0211,
		y: -1504.3243,
		z: 10.6981,
		angle: 195.1150,
		col1: 46,
		col2: 46,
		game: 2
	},
	{
		model: 198,
		x: 161.7691,
		y: -1505.6873,
		z: 10.6334,
		angle: 260.1471,
		col1: 53,
		col2: 53,
		game: 2
	},
	{
		model: 198,
		x: 150.8547,
		y: -1525.2775,
		z: 10.5850,
		angle: 209.5386,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 217,
		x: -71.3746,
		y: -1606.8180,
		z: 12.1979,
		angle: 268.9019,
		col1: 1,
		col2: 42,
		game: 2
	},
	{
		model: 191,
		x: -242.6452,
		y: -1347.8843,
		z: 7.6379,
		angle: 287.6805,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 193,
		x: -254.7485,
		y: -1231.7388,
		z: 7.6065,
		angle: 82.8703,
		col1: 84,
		col2: 84,
		game: 2
	},
	{
		model: 210,
		x: -150.9673,
		y: -1427.3008,
		z: 3.7353,
		angle: 287.1888,
		col1: 12,
		col2: 12,
		game: 2
	},
	{
		model: 193,
		x: -159.8616,
		y: -1352.5422,
		z: 9.9567,
		angle: 88.3373,
		col1: 84,
		col2: 84,
		game: 2
	},
	{
		model: 209,
		x: -107.2975,
		y: -1204.9932,
		z: 10.2545,
		angle: 314.1096,
		col1: 15,
		col2: 32,
		game: 2
	},
	{
		model: 167,
		x: -5.2635,
		y: -1231.6711,
		z: 10.5564,
		angle: 3.0305,
		col1: 75,
		col2: 79,
		game: 2
	},
	{
		model: 132,
		x: 139.5816,
		y: -1104.4471,
		z: 10.1935,
		angle: 87.3026,
		col1: 10,
		col2: 10,
		game: 2
	},
	{
		model: 191,
		x: 125.3515,
		y: -1104.8690,
		z: 9.9718,
		angle: 178.6016,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 209,
		x: 55.1483,
		y: -1077.7474,
		z: 10.2544,
		angle: 179.0974,
		col1: 15,
		col2: 32,
		game: 2
	},
	{
		model: 191,
		x: -53.6150,
		y: -998.6633,
		z: 9.9737,
		angle: 92.8012,
		col1: 48,
		col2: 48,
		game: 2
	},
	{
		model: 198,
		x: -38.4061,
		y: -1015.3550,
		z: 10.0968,
		angle: 359.9808,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 205,
		x: -9.5104,
		y: -992.9700,
		z: 10.1978,
		angle: 354.5850,
		col1: 17,
		col2: 1,
		game: 2
	},
	{
		model: 230,
		x: 37.5689,
		y: -1003.9778,
		z: 10.5291,
		angle: 271.4819,
		col1: 48,
		col2: 65,
		game: 2
	},
	{
		model: 191,
		x: -7.6970,
		y: -951.4760,
		z: 21.2936,
		angle: 2.1346,
		col1: 51,
		col2: 51,
		game: 2
	},
	{
		model: 193,
		x: -8.3562,
		y: -927.7123,
		z: 21.2671,
		angle: 181.7117,
		col1: 7,
		col2: 7,
		game: 2
	},
	{
		model: 146,
		x: -118.7073,
		y: -922.1487,
		z: 10.6754,
		angle: 102.6320,
		col1: 1,
		col2: 3,
		game: 2
	},
	{
		model: 146,
		x: -117.4189,
		y: -931.8056,
		z: 10.6752,
		angle: 98.3519,
		col1: 1,
		col2: 3,
		game: 2
	},
	{
		model: 205,
		x: 273.2764,
		y: -873.0959,
		z: 9.9347,
		angle: 62.8151,
		col1: 21,
		col2: 1,
		game: 2
	},
	{
		model: 132,
		x: 532.1689,
		y: -156.9969,
		z: 13.3790,
		angle: 97.7350,
		col1: 33,
		col2: 33,
		game: 2
	},
	{
		model: 145,
		x: 475.0922,
		y: -42.7295,
		z: 9.8901,
		angle: 357.9021,
		col1: 36,
		col2: 36,
		game: 2
	},
	{
		model: 191,
		x: 455.0826,
		y: -3.7197,
		z: 10.4825,
		angle: 81.7555,
		col1: 13,
		col2: 13,
		game: 2
	},
	{
		model: 174,
		x: 525.0902,
		y: 192.1835,
		z: 14.3481,
		angle: 179.2360,
		col1: 11,
		col2: 0,
		game: 2
	},
	{
		model: 174,
		x: 297.6835,
		y: 460.3541,
		z: 9.9776,
		angle: 249.5900,
		col1: 41,
		col2: 0,
		game: 2
	},
	{
		model: 136,
		x: 329.6919,
		y: 578.8196,
		z: 6.6500,
		angle: 0.0177,
		col1: 1,
		col2: 1,
		game: 2
	},
	{
		model: 132,
		x: 437.4555,
		y: 539.0988,
		z: 11.3912,
		angle: 347.3801,
		col1: 8,
		col2: 8,
		game: 2
	},
	{
		model: 146,
		x: 456.3506,
		y: 718.7170,
		z: 11.6164,
		angle: 266.7214,
		col1: 1,
		col2: 3,
		game: 2
	},
	{
		model: 156,
		x: 494.0573,
		y: 503.6129,
		z: 11.2556,
		angle: 182.5625,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: 520.5809,
		y: 502.5757,
		z: 10.8520,
		angle: 176.7665,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 156,
		x: 490.3658,
		y: 521.4353,
		z: 11.3487,
		angle: 89.2153,
		col1: 0,
		col2: 1,
		game: 2
	},
	{
		model: 132,
		x: 144.5919,
		y: -1148.9771,
		z: 17.5309,
		angle: 179.2223,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 159,
		x: 144.2603,
		y: -1230.6996,
		z: 24.3226,
		angle: 0.7343,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 205,
		x: 128.0492,
		y: -1177.0865,
		z: 31.0443,
		angle: 2.2424,
		col1: 33,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 110.0135,
		y: -1148.5236,
		z: 30.8348,
		angle: 359.9130,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 191,
		x: 128.8416,
		y: -1216.1100,
		z: 30.8201,
		angle: 359.1587,
		col1: 48,
		col2: 48,
		game: 2
	},
	{
		model: 191,
		x: -1151.8125,
		y: -945.6403,
		z: 14.3883,
		angle: 272.7182,
		col1: 38,
		col2: 38,
		game: 2
	},
	{
		model: 205,
		x: -1132.1305,
		y: -926.5008,
		z: 14.6029,
		angle: 270.2141,
		col1: 37,
		col2: 0,
		game: 2
	},
	{
		model: 132,
		x: -1142.1732,
		y: -977.6573,
		z: 14.6181,
		angle: 91.6233,
		col1: 10,
		col2: 10,
		game: 2
	},
	{
		model: 193,
		x: -1142.2985,
		y: -1027.4420,
		z: 14.3610,
		angle: 85.6886,
		col1: 84,
		col2: 84,
		game: 2
	},
	{
		model: 145,
		x: -1152.0118,
		y: -1014.8665,
		z: 14.6410,
		angle: 269.6242,
		col1: 36,
		col2: 36,
		game: 2
	},
	{
		model: 218,
		x: -1369.5146,
		y: -1255.6322,
		z: 18.1927,
		angle: 36.6048,
		col1: 1,
		col2: 2,
		game: 2
	},
	{
		model: 145,
		x: -1681.8029,
		y: -645.2209,
		z: 14.6583,
		angle: 359.9387,
		col1: 52,
		col2: 52,
		game: 2
	},
	{
		model: 191,
		x: -1627.2859,
		y: -623.5496,
		z: 14.4104,
		angle: 171.6752,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 191,
		x: -1579.2931,
		y: -613.0315,
		z: 14.3933,
		angle: 359.9059,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 200,
		x: -1747.2423,
		y: -269.6884,
		z: 15.1117,
		angle: 267.0928,
		col1: 43,
		col2: 0,
		game: 2
	},
	{
		model: 200,
		x: -1746.7600,
		y: -225.4840,
		z: 15.1116,
		angle: 267.6391,
		col1: 43,
		col2: 0,
		game: 2
	},
	{
		model: 163,
		x: -1745.6432,
		y: -212.0730,
		z: 15.2650,
		angle: 269.7901,
		col1: 43,
		col2: 0,
		game: 2
	},
	{
		model: 163,
		x: -1704.9772,
		y: -215.9604,
		z: 15.2650,
		angle: 179.8797,
		col1: 43,
		col2: 0,
		game: 2
	},
	{
		model: 155,
		x: -1661.2036,
		y: -225.9702,
		z: 14.8505,
		angle: 83.3181,
		col1: 40,
		col2: 44,
		game: 2
	},
	{
		model: 153,
		x: -874.2407,
		y: -565.3093,
		z: 11.1761,
		angle: 186.5672,
		col1: 1,
		col2: 56,
		game: 2
	},
	{
		model: 147,
		x: -758.9777,
		y: 821.3871,
		z: 10.9881,
		angle: 180.4261,
		col1: 71,
		col2: 73,
		game: 2
	},
	{
		model: 147,
		x: -800.3445,
		y: 820.1251,
		z: 10.9879,
		angle: 358.3366,
		col1: 71,
		col2: 73,
		game: 2
	},
	{
		model: 220,
		x: -829.3396,
		y: 836.5057,
		z: 11.1657,
		angle: 269.2282,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 191,
		x: -1012.0309,
		y: -859.2324,
		z: 17.4762,
		angle: 182.3877,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 191,
		x: 94.3235,
		y: -1475.3534,
		z: 9.9540,
		angle: 124.7976,
		col1: 0,
		col2: 0,
		game: 2
	},
	{
		model: 130,
		x: -598.6165,
		y: 618.5028,
		z: 11.7826,
		angle: 91.7853,
		col1: 18,
		col2: 74,
		game: 2
	},
	{
		model: 223,
		x: -605.8749,
		y: -1466.1476,
		z: 5.9455,
		angle: 313.0891,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -600.9694,
		y: -1468.3768,
		z: 5.9371,
		angle: 317.1415,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -592.5016,
		y: -1471.7833,
		z: 5.9794,
		angle: 328.8429,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -584.8162,
		y: -1473.9656,
		z: 5.9793,
		angle: 317.0912,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -582.1281,
		y: -1478.2181,
		z: 5.8616,
		angle: 300.1511,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 223,
		x: -585.1076,
		y: -1490.0439,
		z: 5.8000,
		angle: 287.7980,
		col1: 36,
		col2: 13,
		game: 2
	},
	{
		model: 166,
		x: -591.1216,
		y: 654.3730,
		z: 10.5643,
		angle: 336.9552,
		col1: 14,
		col2: 75,
		game: 2
	},
	{
		model: 191,
		x: -525.3995,
		y: 839.8240,
		z: 11.1236,
		angle: 328.7421,
		col1: 38,
		col2: 38,
		game: 2
	},
	{
		model: 191,
		x: -1116.4395,
		y: 1265.5247,
		z: 8.2544,
		angle: 53.1248,
		col1: 48,
		col2: 48,
		game: 2
	},
	{
		model: 179,
		x: -25.5849,
		y: 1120.4008,
		z: 15.4932,
		angle: 194.3053,
		col1: 16,
		col2: 74,
		game: 2
	},
	{
		model: 205,
		x: 21.0393,
		y: 1007.0276,
		z: 10.6893,
		angle: 347.2635,
		col1: 21,
		col2: 1,
		game: 2
	},
	{
		model: 144,
		x: -1057.2069,
		y: -278.5889,
		z: 11.3860,
		angle: 272.6758,
		col1: 67,
		col2: 67,
		game: 2
	},
	{
		model: 144,
		x: -869.4409,
		y: -119.3127,
		z: 11.1574,
		angle: 243.6880,
		col1: 69,
		col2: 69,
		game: 2
	},
	{
		model: 144,
		x: -963.9122,
		y: -373.6888,
		z: 11.3396,
		angle: 180.9045,
		col1: 91,
		col2: 91,
		game: 2
	},
	{
		model: 226,
		x: -712.8604,
		y: -1553.9656,
		z: 12.2736,
		angle: 352.6542,
		col1: 12,
		col2: 1,
		game: 2
	},
	{
		model: 197,
		x: 490.6163,
		y: -465.6109,
		z: 10.6015,
		angle: 356.1119,
		col1: 58,
		col2: 8,
		game: 2
	},
	{
		model: 197,
		x: 358.8789,
		y: -813.7148,
		z: 10.6016,
		angle: 157.1385,
		col1: 60,
		col2: 1,
		game: 2
	},
	{
		model: 197,
		x: 297.8174,
		y: -1056.8947,
		z: 10.6017,
		angle: 353.8745,
		col1: 68,
		col2: 8,
		game: 2
	},
	{
		model: 197,
		x: 257.2870,
		y: -1189.7031,
		z: 10.6013,
		angle: 162.0617,
		col1: 2,
		col2: 1,
		game: 2
	},
	{
		model: 197,
		x: 218.5081,
		y: -1389.0483,
		z: 10.6014,
		angle: 166.3660,
		col1: 13,
		col2: 8,
		game: 2
	},
	{
		model: 197,
		x: 219.0253,
		y: -1445.1526,
		z: 10.6010,
		angle: 341.3580,
		col1: 22,
		col2: 1,
		game: 2
	},
	{
		model: 197,
		x: 5.8889,
		y: -1015.4189,
		z: 10.1626,
		angle: 359.8840,
		col1: 36,
		col2: 8,
		game: 2
	},
	{
		model: 197,
		x: 14.8831,
		y: -951.4145,
		z: 21.4730,
		angle: 359.3130,
		col1: 36,
		col2: 8,
		game: 2
	},
	{
		model: 191,
		x: 153.0231,
		y: -1209.5938,
		z: 30.8359,
		angle: 165.0627,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 191,
		x: -1669.1388,
		y: -634.0207,
		z: 14.4104,
		angle: 359.5978,
		col1: 38,
		col2: 38,
		game: 2
	},
	{
		model: 200,
		x: -1746.7196,
		y: -240.2867,
		z: 15.1116,
		angle: 272.7332,
		col1: 43,
		col2: 0,
		game: 2
	},
	{
		model: 147,
		x: -770.6566,
		y: 821.0764,
		z: 10.9881,
		angle: 0.1415,
		col1: 71,
		col2: 73,
		game: 2
	},
	{
		model: 147,
		x: -776.7801,
		y: 820.0367,
		z: 10.9877,
		angle: 359.1611,
		col1: 71,
		col2: 73,
		game: 2
	},
	{
		model: 147,
		x: -788.3284,
		y: 820.8813,
		z: 10.9872,
		angle: 180.4359,
		col1: 71,
		col2: 73,
		game: 2
	},
	{
		model: 220,
		x: -829.8462,
		y: 830.3045,
		z: 11.1665,
		angle: 271.9634,
		col1: 6,
		col2: 6,
		game: 2
	},
	{
		model: 193,
		x: -800.0605,
		y: 528.5693,
		z: 10.4214,
		angle: 111.8338,
		col1: 84,
		col2: 84,
		game: 2
	},
	{
		model: 191,
		x: -800.1152,
		y: 523.4738,
		z: 10.4470,
		angle: 108.7389,
		col1: 22,
		col2: 22,
		game: 2
	},
	{
		model: 230,
		x: -824.5656,
		y: 504.4783,
		z: 10.9990,
		angle: 270.0162,
		col1: 48,
		col2: 65,
		game: 2
	},
	{
		model: 207,
		x: -851.2013,
		y: 552.4039,
		z: 10.7816,
		angle: 1.1120,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 207,
		x: -869.1910,
		y: 579.8416,
		z: 10.7821,
		angle: 359.7266,
		col1: 2,
		col2: 2,
		game: 2
	},
	{
		model: 145,
		x: -833.8428,
		y: 565.5539,
		z: 10.7017,
		angle: 178.9620,
		col1: 3,
		col2: 3,
		game: 2
	},
	{
		model: 144,
		x: -840.0448,
		y: 553.3810,
		z: 10.9954,
		angle: 359.6424,
		col1: 67,
		col2: 67,
		game: 2
	},
	{
		model: 187,
		x: 97.7394,
		y: 294.6339,
		z: 19.0689,
		angle: 347.0227,
		col1: 2,
		col2: 1,
		game: 2
	},
	{
		model: 187,
		x: 102.0775,
		y: 294.8427,
		z: 19.2165,
		angle: 348.7923,
		col1: 5,
		col2: 1,
		game: 2
	},
	{
		model: 187,
		x: 106.5904,
		y: 295.8557,
		z: 19.3699,
		angle: 339.3151,
		col1: 18,
		col2: 1,
		game: 2
	},
];