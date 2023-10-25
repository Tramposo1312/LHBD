var dataViewer = {};

dataViewer.window				= null;
dataViewer.search				= null;
dataViewer.searchResults		= null;
dataViewer.tree					= null;
dataViewer.treeTitle			= null;
dataViewer.code					= null;
dataViewer.searchResultValues	= [];

dataViewer.getTypeName = function(value)
{
	if(value === undefined)
		return 'undefined';
	else if(value === null)
		return 'null';
	
	var jsTypeName = typeof value;
	if(jsTypeName === 'boolean')
		return 'bool';
	else if(jsTypeName === 'number')
		return 'number';
	else if(jsTypeName === 'string')
		return 'string';
	else if(Array.isArray(value))
		return 'array';
	else if({}.toString.call(value) === '[object Function]')
		return 'function';
	else if(jsTypeName === 'object')
		return 'object';
	else
		return 'unknown';
};

dataViewer.getValueLiteral = function(value)
{
	if(value === undefined)
		return 'undefined';
	else if(value === null)
		return 'null';
	
	var jsTypeName = typeof value;
	if(jsTypeName === 'boolean')
		return value ? 'true' : 'false';
	else if(jsTypeName === 'number')
		return value + '';
	else if(jsTypeName === 'string')
		return "'"+value.replace("'", "\\'")+"'";
	else if(Array.isArray(value))
		return '[...]';
	else if({}.toString.call(value) === '[object Function]')
		return 'function(){}';
	else if(jsTypeName === 'object')
	{
		var className = dataViewer.getObjectClassName(value);
		return (className ? className+' ' : '') + '{...}';
	}
	else
		return 'unknown';
};

dataViewer.getObjectClassName = function(value)
{
	var text = value.toString();
	var index1 = text.indexOf('object ');
	if(index1 == -1)
		return false;
	var index2 = text.indexOf(']', index1 + 1);
	if(index2 == -1)
		return false;
	var className = text.substr(index1 + 7, index2 - (index1 + 7));
	if(className.length < 1)
		return false;
	return className;
};

dataViewer.findKeys = function(text)
{
	text = text.toLowerCase();
	var checkAll = text == '*';
	var keys = [];
	for(var k in global)
	{
		if(checkAll || k.indexOf(text) != -1)
		{
			keys.push([global, k]);
		}
	}
	return keys;
};

dataViewer.addValueToTree = function(treeOrRow, value, level)
{
	if(level > 4)
		return;
	
	while(value)
	{
		for(var k in value)
		{
			if(value.hasOwnProperty(k))
			{
				var row = treeOrRow.row(k+': '+dataViewer.getValueLiteral(value[k]));
				row.open = false;
				
				var typeName = dataViewer.getTypeName(value[k]);
				if(typeName == 'object' || typeName == 'array')
					dataViewer.addValueToTree(row, value[k], level + 1);
			}
		}
		
		var row = treeOrRow.row('__proto__: '+dataViewer.getValueLiteral(value.__proto__));
		row.open = false;
		treeOrRow = row;
		
		value = value.__proto__;
	}
};

dataViewer.setTreeValue = function(value)
{
	dataViewer.tree.removeAllEntries();
	dataViewer.addValueToTree(dataViewer.tree, value, 1);
};

dataViewer.init = function()
{
	bindKey(SDLK_F3, KEYSTATE_DOWN, function(e)
	{
		var show = !dataViewer.window.shown;
		dataViewer.window.shown = show;
		mexui.setInput(show);
	});
	
	dataViewer.window = mexui.window(500, 200, 550, 500, 'Data Viewer - JavaScript');
	
	dataViewer.search = dataViewer.window.textInput(20, 50, 200, 25, '', {}, dataViewer.onSearch);
	dataViewer.searchResults = dataViewer.window.list(20, 85, 200, 200, {}, dataViewer.onChooseValue);
	
	dataViewer.treeTitle = dataViewer.window.text(240, 50, 200, 25, '(no entry chosen)', {main:{textColour: toColour(255, 128, 0, 255)}});
	dataViewer.tree = dataViewer.window.tree(240, 85, 250, 300);
	
	dataViewer.code = dataViewer.window.textInput(20, 420, 300, 25, '', {}, dataViewer.onCode);
	
	dataViewer.search.placeholder = 'Search Client Global';
	dataViewer.searchResults.row('(no entries)');
	dataViewer.code.placeholder = 'Run Client Code';
	
	dataViewer.window.shown = false;
	//mexui.setInput(true);
};

dataViewer.onSearch = function()
{
	var text = dataViewer.search.lines[0];
	
	dataViewer.searchResultValues = dataViewer.findKeys(text);
	
	if(text == '' || dataViewer.searchResultValues.length == 0)
	{
		dataViewer.searchResults.removeAllEntries();
		dataViewer.searchResults.row('(no entries)');
		return;
	}
	
	dataViewer.searchResults.removeAllEntries();
	
	for(var i in dataViewer.searchResultValues)
	{
		dataViewer.searchResults.row(dataViewer.searchResultValues[i][1]);
	}
};

dataViewer.onChooseValue = function()
{
	var row = dataViewer.searchResults.activeRow;
	if(!row)
		return;
	
	var object = dataViewer.searchResultValues[row.getEntryIndex()][0];
	var key = row.text;
	
	dataViewer.treeTitle.text = key;
	dataViewer.setTreeValue(object[key]);
};

dataViewer.onCode = function()
{
	var text = dataViewer.code.lines[0];
	
	if(text == '')
		return;
	
	var result;
	try
	{
		result = eval(text);
	}
	catch(error)
	{
		return;
	}
	
	dataViewer.treeTitle.text = text.length > 60 ? text.substr(0, 60)+'...' : text;
	dataViewer.setTreeValue(result);
};

dataViewer.init();

