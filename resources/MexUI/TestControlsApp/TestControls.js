var testControls = {};

testControls.window				= null;
testControls.textArea			= null;

setImmediate(function()
{
	testControls.init();
});

testControls.init = function()
{
	testControls.window = mexui.window(400, 100, 800, 800);
	testControls.window.shown = false;
	
	testControls.number		= testControls.window.number(10, 50, 150, 25);
	testControls.integer	= testControls.window.integer(10, 90, 150, 25);
	
	testControls.year		= testControls.window.year(10, 130, 150, 25);
	testControls.month		= testControls.window.month(10, 170, 150, 25);
	testControls.week		= testControls.window.week(10, 210, 150, 25);
	testControls.day		= testControls.window.day(10, 250, 150, 25);
	
	testControls.hour		= testControls.window.hour(10, 290, 150, 25);
	testControls.minute		= testControls.window.minute(10, 330, 150, 25);
	testControls.second		= testControls.window.second(10, 370, 150, 25);
	
	testControls.rangedNumber		= testControls.window.rangedNumber(10, 410, 150, 25, 0.0, 1.0);
	testControls.rangedInteger		= testControls.window.rangedInteger(10, 450, 150, 25, 100, 200);
	
	testControls.date		= testControls.window.date(10, 490, 150, 25);
	testControls.time		= testControls.window.time(10, 570, 150, 25);
	
	testControls.weekDay	= testControls.window.weekDay(10, 650, 150, 25);
	
	testControls.positiveInteger	= testControls.window.positiveInteger(10, 690, 150, 25);
	testControls.positiveNumber		= testControls.window.positiveNumber(10, 730, 150, 25);
	
	
	
	bindKey(SDLK_F6, KEYSTATE_DOWN, function(e)
	{
		var show = !testControls.window.shown;
		testControls.window.shown = show;
		mexui.setInput(show);
	});
};