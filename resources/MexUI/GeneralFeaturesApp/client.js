var generalFeatures = {};
var z;

generalFeatures.headingInput			= null;

generalFeatures.init = function()
{
	map.init();
	
	
	
	// window
	var styles1 =
	{
		main:
		{
			hover:
			{
				backgroundColour: toColour(200, 0, 0, 200),
				transitionTime: 500
			}
		}
	};
	var window = mexui.window(550, 250, 340, 420, 'General Features (F2)', styles1);
	window.setShown(false);
	window.center();
	
	// text
	var styles = {
		main:
		{
			textColour: toColour(255, 240, 0, 255),
			
			hover:
			{
				textColour: toColour(255, 0, 0, 255),
				transitionTime: 500
			}
		}
	};
	
	z = window.text(10, 40, 100, 25, 'Position:', styles);
	window.text(10, 70, 100, 25, 'Heading:', styles);
	//window.text(10, 100, 100, 25, 'Scale:', styles);
	
	//window.text(10, 150, 100, 25, 'Skin:', styles);
	window.text(10, 120, 100, 25, 'Weapon:', styles);
	
	window.text(10, 150, 100, 25, 'Vehicle:', styles);
	
	// map button
	var buttonStyles = {
		main:
		{
			backgroundColour:			toColour(255, 255, 255, 190),
			textAlign:					0.5,
			
			hover:
			{
				backgroundColour:			toColour(255, 255, 255, 165),
				textAlign:					0.5
			}
		}
	};
	
	window.button(120, 40, 50, 25, 'Map', buttonStyles, function()
	{
		setImmediate(function()
		{
			window.setShown(false);
			map.setShown(true);
		});
	});
	
	// heading text input
	var setHeading = function()
	{
		if(!localPlayer)
			return;
		
		var text = this.lines[0];
		if(text == '')
			return;
		
		var rot = parseFloat(text);
		if(isNaN(rot))
			return;
		
		localPlayer.heading = mexui.util.rad(rot);
	};
	
	styles = {
		main:
		{
			textColour:			toColour(0, 0, 0, 255),
			backgroundColour:	toColour(255, 255, 255, 255),
			
			hover:
			{
				backgroundColour:	toColour(230, 0, 0, 255),
				transitionTime:		400
			}
		}
	};
	
	generalFeatures.headingInput = window.textInput(120, 70, 200, 25, '0.0', styles, setHeading);
	
	/*
	// scale text inputs
	window.textInput(120, 100, 60, 25, '1.0', styles, function()
	{
		if(!localPlayer)
			return;
		
		var scaleComponent = parseFloat(this.lines[0]);
		if(isNaN(scaleComponent))
			return;
		
		localPlayer.matrix.setScale(new Vec3(scaleComponent, 1.0, 1.0));
	});
	window.textInput(190, 100, 60, 25, '1.0', styles);
	window.textInput(260, 100, 60, 25, '1.0', styles);
	*/
	
	/*
	// skins drop down
	var skins = window.dropDown(120, 160, 210, 25, 'Choose Skin', {}, function()
	{
		var skinId = this.selectedEntryIndex;
		if((skinId >= 0 && skinId <= 10) || skinId >= 106)
		{
			message('Skin IDs 0-10 or 106+ are currently unavailable.');
			return;
		}
		
		localPlayer.modelIndex = skinId;
	});
	*/
	
	// weapons drop down
	var weapons = window.dropDown(120, 120, 210, 25, 'Choose Weapon', {}, function()
	{
		var weaponId = this.selectedEntryIndex;
		if(weaponId == 34)
			weaponId = 36;
		
		var ammo;
		if(weaponId < 12)
			ammo = 1;
		else
			ammo = 32000;
		
		localPlayer.giveWeapon(weaponId, ammo, true);
	});
	
	// vehicles drop down
	var vehicles = window.dropDown(120, 150, 210, 25, 'Choose Vehicle', {}, function()
	{
		var vehicleModelId = this.selectedEntryIndex + 130;
		triggerNetworkEvent('spawnVehicleFromGui', vehicleModelId);
	});
	
	/*
	// skins
	for(var i=0; i<172; i++)
	{
		skins.item('Skin '+i);
	}
	*/
	
	// weapons
	weapons.item('0 - FISTS');
	weapons.item('1 - BRASS KNUCKLES');
	weapons.item('2 - SCREWDRIVER');
	weapons.item('3 - GOLFCLUB');
	weapons.item('4 - NITESTICK');
	weapons.item('5 - KNIFE');
	weapons.item('6 - BASEBALL BAT');
	weapons.item('7 - HAMMER');
	weapons.item('8 - MEAT CLEAVER');
	weapons.item('9 - MACHETE');
	weapons.item('10 - KATANA');
	weapons.item('11 - CHAINSAW');
	weapons.item('12 - GRENADES');
	weapons.item('13 - REMOTE GRENADES');
	weapons.item('14 - TEARGAS');
	weapons.item('15 - MOLOTOV COCKTAILS');
	weapons.item('16 - MISSILE');
	weapons.item('17 - COLT .45');
	weapons.item('18 - PYTHON');
	weapons.item('19 - SHOTGUN');
	weapons.item('20 - SPAZ SHOTGUN');
	weapons.item('21 - STUBBY SHOTGUN');
	weapons.item('22 - TEC 9');
	weapons.item('23 - UZI');
	weapons.item('24 - INGRAM');
	weapons.item('25 - MP5');
	weapons.item('26 - M4');
	weapons.item('27 - RUGER');
	weapons.item('28 - SNIPER RIFLE');
	weapons.item('29 - LASER SNIPER');
	weapons.item('30 - ROCKET LAUNCHER');
	weapons.item('31 - FLAME THROWER');
	weapons.item('32 - M60');
	weapons.item('33 - MINIGUN');
	weapons.item('36 - CAMERA');
	
	// vehicles
	vehicles.item('130 - LANDSTALKER');
	vehicles.item('131 - IDAHO');
	vehicles.item('132 - STINGER');
	vehicles.item('133 - LINERUNNER ');
	vehicles.item('134 - PERENNIAL ');
	vehicles.item('135 - SENTINEL');
	vehicles.item('136 - RIO');
	vehicles.item('137 - FIRETRUCK ');
	vehicles.item('138 - TRASHMASTER');
	vehicles.item('139 - STRETCH');
	vehicles.item('140 - MANANA');
	vehicles.item('141 - INFERNUS');
	vehicles.item('142 - VOODOO');
	vehicles.item('143 - PONY');
	vehicles.item('144 - MULE');
	vehicles.item('145 - CHEETAH');
	vehicles.item('146 - AMBULANCE');
	vehicles.item('147 - FBI WASHINGTON ');
	vehicles.item('148 - MOONBEAM ');
	vehicles.item('149 - ESPERANTO ');
	vehicles.item('150 - TAXI ');
	vehicles.item('151 - WASHINGTON ');
	vehicles.item('152 - BOBCAT ');
	vehicles.item('153 - MR.WHOOPEE ');
	vehicles.item('154 - BF-INJECTION ');
	vehicles.item('155 - HUNTER ');
	vehicles.item('156 - POLICE ');
	vehicles.item('157 - ENFORCER ');
	vehicles.item('158 - SECURICAR ');
	vehicles.item('159 - BANSHEE ');
	vehicles.item('160 - PREDATOR ');
	vehicles.item('161 - BUS ');
	vehicles.item('162 - RHINO ');
	vehicles.item('163 - BARRACKS OL ');
	vehicles.item('164 - CUBAN HERMES ');
	vehicles.item('165 - HELICOPTER ');
	vehicles.item('166 - ANGEL ');
	vehicles.item('167 - COACH ');
	vehicles.item('168 - CABBIE ');
	vehicles.item('169 - STALLION ');
	vehicles.item('170 - RUMPO ');
	vehicles.item('171 - RCBANDIT ');
	vehicles.item('172 - ROMERO\'S HEARSE ');
	vehicles.item('173 - PACKER ');
	vehicles.item('174 - SENTINEL XS ');
	vehicles.item('175 - ADMIRAL ');
	vehicles.item('176 - SQUALO ');
	vehicles.item('177 - SEA SPARROW ');
	vehicles.item('178 - PIZZA BOY ');
	vehicles.item('179 - GANG BURRITO ');
	vehicles.item('180 - AIRTRAIN ');
	vehicles.item('181 - DEADDODO ');
	vehicles.item('182 - SPEEDER ');
	vehicles.item('183 - REEFER ');
	vehicles.item('184 - TROPIC ');
	vehicles.item('185 - FLATBED ');
	vehicles.item('186 - YANKEE ');
	vehicles.item('187 - CADDY ');
	vehicles.item('188 - ZEBRA CAB ');
	vehicles.item('189 - TOP FUN ');
	vehicles.item('190 - SKIMMER ');
	vehicles.item('191 - PCJ-600 ');
	vehicles.item('192 - FAGGIO ');
	vehicles.item('193 - FREEWAY ');
	vehicles.item('194 - RCBARON ');
	vehicles.item('195 - RCRAIDER ');
	vehicles.item('196 - GLENDALE ');
	vehicles.item('197 - OCEANIC ');
	vehicles.item('198 - SANCHEZ ');
	vehicles.item('199 - SPARROW ');
	vehicles.item('200 - PATRIOT ');
	vehicles.item('201 - LOVE FIST ');
	vehicles.item('202 - COAST GUARD ');
	vehicles.item('203 - DINGHY ');
	vehicles.item('204 - HERMES ');
	vehicles.item('205 - SABRE ');
	vehicles.item('206 - SABRE TURBO ');
	vehicles.item('207 - PHOENIX ');
	vehicles.item('208 - WALTON ');
	vehicles.item('209 - REGINA ');
	vehicles.item('210 - COMET ');
	vehicles.item('211 - DELUXO ');
	vehicles.item('212 - BURRITO ');
	vehicles.item('213 - SPAND EXPRESS ');
	vehicles.item('214 - MARQUIS ');
	vehicles.item('215 - BAGGAGE HANDLER ');
	vehicles.item('216 - KAUFMAN CAB ');
	vehicles.item('217 - MAVERICK ');
	vehicles.item('218 - VCN MAVERICK ');
	vehicles.item('219 - RANCHER ');
	vehicles.item('220 - FBI RANCHER ');
	vehicles.item('221 - VIRGO ');
	vehicles.item('222 - GREENWOOD ');
	vehicles.item('223 - CUBAN JETMAX ');
	vehicles.item('224 - HOTRING RACER#1 ');
	vehicles.item('225 - SANDKING ');
	vehicles.item('226 - BLISTA COMPACT ');
	vehicles.item('227 - POLICE MAVERICK ');
	vehicles.item('228 - BOXVILLE ');
	vehicles.item('229 - BENSON ');
	vehicles.item('230 - MESA GRANDE ');
	vehicles.item('231 - RC GOBLIN ');
	vehicles.item('232 - HOTRING RACER#2 ');
	vehicles.item('233 - HOTRING RACER#3 ');
	vehicles.item('234 - BLOODRING BANGER#1 ');
	vehicles.item('235 - BLOODRING BANGER#2 ');
	vehicles.item('236 - VCPD CHEETAH');
	
	// heal button
	window.button(120, 200, 100, 25, 'Heal', buttonStyles, function()
	{
		if(!localPlayer)
			return;
		
		localPlayer.health = 100.0;
	});
	
	// fix button
	window.button(230, 200, 100, 25, 'Fix', buttonStyles, function()
	{
		if(!localPlayer || !localPlayer.vehicle)
			return;
		
		localPlayer.vehicle.fix();
	});
	
	// key bind to show/hide window
	bindKey(SDLK_F2, KEYSTATE_DOWN, function(e)
	{
		if(!localPlayer)
			return;
		
		if(map.shown)
		{
			map.setShown(false);
			window.setShown(true);
			mexui.setInput(true);
			return;
		}
		
		var show = !window.isShown();
		mexui.setInput(show);
		window.setShown(show);
		
		if(show)
		{
			window.center();
			generalFeatures.headingInput.lines[0] = mexui.util.round(mexui.util.deg(localPlayer.heading), 2) + '';
		}
	});
};

generalFeatures.init();

