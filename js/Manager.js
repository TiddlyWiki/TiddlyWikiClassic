// ---------------------------------------------------------------------------------
// Manager UI for groups of tiddlers
// ---------------------------------------------------------------------------------

config.macros.plugins.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	listWrapper.setAttribute("refresh","macro");
	listWrapper.setAttribute("macroName","plugins");
	listWrapper.setAttribute("params",paramString);
	this.refresh(listWrapper,paramString);
}

config.macros.plugins.refresh = function(listWrapper,params)
{
	var wizard = new Wizard(listWrapper);
	var selectedRows = [];
	ListView.forEachSelector(listWrapper,function(e,rowName) {
			if(e.checked)
				selectedRows.push(e.getAttribute("rowName"));
		});
	removeChildren(listWrapper);
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
		{
		createTiddlyElement(listWrapper,"em",null,null,this.noPluginText);
		wizard.setButtons([]);
		}
	else
		{
		var listView = ListView.create(listWrapper,plugins,this.listViewTemplate,this.onSelectCommand);
		wizard.setValue("listView",listView);
		wizard.setButtons([
				{caption: config.macros.plugins.removeLabel, tooltip: config.macros.plugins.removePrompt, onClick:  config.macros.plugins.doRemoveTag},
				{caption: config.macros.plugins.deleteLabel, tooltip: config.macros.plugins.deletePrompt, onClick:  config.macros.plugins.doDelete}
			]);
		}
}

config.macros.plugins.doRemoveTag = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0)
		alert(config.messages.nothingSelected);
	else
		for(var t=0; t<rowNames.length; t++)
			store.setTiddlerTag(rowNames[t],false,"systemConfig");
}

config.macros.plugins.doDelete = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0)
		alert(config.messages.nothingSelected);
	else
		{
		if(confirm(config.macros.plugins.confirmDeleteText.format([rowNames.join(", ")])))
			{
			for(t=0; t<rowNames.length; t++)
				{
				store.removeTiddler(rowNames[t]);
				story.closeTiddler(rowNames[t],true,false);
				}
			}
		}
}
