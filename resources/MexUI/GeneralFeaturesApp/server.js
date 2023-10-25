addEventHandler('onPlayerJoined', function(e, client)
{
	
});

addNetworkHandler('spawnVehicleFromGui', function(client, vehicleModelId)
{
	vehicleModelId = parseInt(vehicleModelId + '');
	
	if(!client.player)
		return;
	if(vehicleModelId < 130)
		return;
	if(vehicleModelId > 236)
		return;
	
	gta.createVehicle(vehicleModelId, client.player.position.addPolar(1.5, client.player.heading));
});