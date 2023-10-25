var runCode = {};

runCode.window				= null;
runCode.textArea			= null;

setImmediate(function()
{
	runCode.init();
});

runCode.init = function()
{
	runCode.window = mexui.window(400, 100, 800, 600);
	runCode.window.shown = false;
	
	runCode.textArea = runCode.window.textArea(10, 50, 750, 550);
	runCode.textArea.multiLine = true;
	
	
	
	bindKey(SDLK_F4, KEYSTATE_DOWN, function(e)
	{
		var show = !runCode.window.shown;
		runCode.window.shown = show;
		mexui.setInput(show);
	});
};