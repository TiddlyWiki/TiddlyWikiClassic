// ---------------------------------------------------------------------------------
// Manager UI for groups of tiddlers
// ---------------------------------------------------------------------------------

config.macros.plugins.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var wizard = createTiddlyElement(place,"div",null,"importTiddler wizard");
	createTiddlyElement(wizard,"h1",null,null,this.wizardTitle);
	createTiddlyElement(wizard,"h2",null,"step1",this.step1);
	var step = createTiddlyElement(wizard,"div",null,"wizardStep");
	var e = createTiddlyElement(step,"div");
	e.setAttribute("refresh","macro");
	e.setAttribute("macroName","plugins");
	e.setAttribute("params",paramString);
	this.refresh(e,paramString);
}

config.macros.plugins.refresh = function(place,params)
{
	var selectedRows = [];
	ListView.forEachSelector(place,function(e,rowName) {
			if(e.checked)
				selectedRows.push(e.getAttribute("rowName"));
		});
	removeChildren(place);
	params = params.parseParams("anon");
	var plugins = installedPlugins.slice(0);
	var t,tiddler,p;
	var configTiddlers = store.getTaggedTiddlers("systemConfig");
	for(t=0; t<configTiddlers.length; t++)
		{
		tiddler = configTiddlers[t];
		if(plugins.findByField("title",tiddler.title) == null)
			{
			p = getPluginInfo(tiddler);
			p.executed = false;
			p.log.splice(0,0,this.skippedText);
			plugins.push(p);
			}
		}
	for(t=0; t<plugins.length; t++)
		{
		var p = plugins[t];
		p.forced = p.tiddler.isTagged("systemConfigForce");
		p.disabled = p.tiddler.isTagged("systemConfigDisable");
		p.Selected = selectedRows.indexOf(plugins[t].title) != -1;
		}
	if(plugins.length == 0)
		createTiddlyElement(place,"em",null,null,this.noPluginText);
	else
		ListView.create(place,plugins,this.listViewTemplate,this.onSelectCommand);
}

config.macros.plugins.onSelectCommand = function(command,rowNames)
{
	var t;
	switch(command)
		{
		case "remove":
			for(t=0; t<rowNames.length; t++)
				store.setTiddlerTag(rowNames[t],false,"systemConfig");
			break;
		case "delete":
			if(rowNames.length > 0 && confirm(config.macros.plugins.confirmDeleteText.format([rowNames.join(", ")])))
				{
				for(t=0; t<rowNames.length; t++)
					{
					store.removeTiddler(rowNames[t]);
					story.closeTiddler(rowNames[t],true,false);
					}
				}
			break;
		}
	if(config.options.chkAutoSave)
		saveChanges(true);
}

