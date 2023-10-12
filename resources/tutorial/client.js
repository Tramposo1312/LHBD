let motorest  = [-7.22, 2.4, 20.15];
let littleitaly = [38.48, -0.07, -29.46];
let camPos = [-2007.88, 3.8, -5.12];
let saliery = [-1774.30, -5.56, 7.62];
let bartest = [-387.11, 15.47, -515];
let kingbed = [-545.79, 15.38, -436.02];
let vila = [106.33, -5.11, 171.22];

addNetworkEvent("OnTutorial", function() {
	game.SetCameraLookAt(saliery, motorest, true);
})