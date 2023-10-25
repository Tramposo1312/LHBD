var map = {};

// initialization
map.shown		= false;
map.image		= null;
map.position	= new Vec2(0, 0);
map.size		= new Vec2(768, 768);
map.worldMin	= new Vec3(-2350, -1950, -100);
map.worldMax	= new Vec3(1550, 1950, 1000);

// initialization
map.init = function()
{
	map.image = mexui.native.loadImage('GeneralFeaturesApp/Map/vc.png');
	
	map.position.x = (gta.width		/ 2.0) - (map.size.x / 2.0);
	map.position.y = (gta.height	/ 2.0) - (map.size.y / 2.0);
};

// events
addEventHandler('onDrawnHUD', function(e)
{
	if(!map.shown)
		return;
	
	map.render();
});

addEventHandler('onMouseDown', function(e, mouse, button)
{
	if(!map.shown)
		return;
	
	if(button != 0)
		return;
	
	if(!localPlayer)
		return;
	
	if(gui.cursorPosition.x < map.position.x
	|| gui.cursorPosition.x > (map.position.x + map.size.x)
	|| gui.cursorPosition.y < map.position.y
	|| gui.cursorPosition.y > (map.position.y + map.size.y))
		return;
	
	var imageClickPos = new Vec2(0, 0);
	imageClickPos.x = gui.cursorPosition.x - map.position.x;
	imageClickPos.y = gui.cursorPosition.y - map.position.y;
	
	var imageRatio = new Vec2(0.0, 0.0);
	imageRatio.x = imageClickPos.x / map.size.x;
	imageRatio.y = imageClickPos.y / map.size.y;
	imageRatio.y = 1.0 - imageRatio.y;
	
	var worldPos = new Vec3(0.0, 0.0, 20.0);
	worldPos.x = map.worldMin.x + (imageRatio.x * (map.worldMax.x - map.worldMin.x));
	worldPos.y = map.worldMin.y + (imageRatio.y * (map.worldMax.y - map.worldMin.y));
	worldPos.z = gta.findGroundZForCoord(worldPos.x, worldPos.y);
	
	if(localPlayer.vehicle)
		localPlayer.vehicle.position = worldPos;
	else
		localPlayer.position = worldPos;
});

// shown status
map.setShown = function(status)
{
	map.shown = status;
	
	gui.showCursor(status, true);
};

// render
map.render = function()
{
	mexui.native.drawImage(map.position, map.size, map.image);
};

