"use strict";


addNetworkHandler("armour", function(client, ped, armour) {
	triggerNetworkEvent("armour", null, ped, armour);
});

// ----------------------------------------------------------------------------