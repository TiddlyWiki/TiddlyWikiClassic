//--
//-- Manager UI for groups of tiddlers
//--

config.macros.plugins.handler = function(place, macroName, params, wikifier, paramString) {
	var wizard = new Wizard();
	wizard.createWizard(place, this.wizardTitle);
	wizard.addStep(this.step1Title, this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper, markList);
	listWrapper.setAttribute("refresh", "macro");
	listWrapper.setAttribute("macroName", "plugins");
	listWrapper.setAttribute("params", paramString);
	this.refresh(listWrapper, paramString);
};

config.macros.plugins.refresh = function(listWrapper, paramString) {
	var wizard = new Wizard(listWrapper);
	var selectedRows = [];
	ListView.forEachSelector(listWrapper, function(e, rowName) {
		if(e.checked) selectedRows.push(e.getAttribute("rowName"));
	});
	jQuery(listWrapper).empty();

	var plugins = installedPlugins.slice(0);
	// not all plugins are installed, gather info about those, too
	var i, tiddler, p;
	var configTiddlers = store.getTaggedTiddlers("systemConfig");
	for(i = 0; i < configTiddlers.length; i++) {
		tiddler = configTiddlers[i];
		if(plugins.findByField("title", tiddler.title) != null) continue;

		p = getPluginInfo(tiddler);
		p.executed = false;
		p.log.splice(0, 0, this.skippedText);
		plugins.push(p);
	}

	for(i = 0; i < plugins.length; i++) {
		p = plugins[i];
		p.size = p.tiddler.text ? p.tiddler.text.length : 0;
		p.forced = p.tiddler.isTagged("systemConfigForce");
		p.disabled = p.tiddler.isTagged("systemConfigDisable");
		p.Selected = selectedRows.indexOf(plugins[i].title) != -1;
	}

	if(plugins.length == 0) {
		createTiddlyElement(listWrapper, "em", null, null, this.noPluginText);
		wizard.setButtons([]);
	} else {
		var template = readOnly ? this.listViewTemplateReadOnly : this.listViewTemplate;
		var listView = ListView.create(listWrapper, plugins, template, this.onSelectCommand);
		wizard.setValue("listView", listView);
		if(!readOnly) {
			var me = config.macros.plugins;
			wizard.setButtons([
				{ caption: me.removeLabel, tooltip: me.removePrompt, onClick: me.doRemoveTag },
				{ caption: me.deleteLabel, tooltip: me.deletePrompt, onClick: me.doDelete }
			]);
		}
	}
};

config.macros.plugins.doRemoveTag = function(e) {
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0) {
		alert(config.messages.nothingSelected);
	} else {
		for(var i = 0; i < rowNames.length; i++) {
			store.setTiddlerTag(rowNames[i], false, "systemConfig");
		}
		autoSaveChanges();
	}
};

config.macros.plugins.doDelete = function(e) {
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0) {
		alert(config.messages.nothingSelected);
	} else {
		if(confirm(config.macros.plugins.confirmDeleteText.format([rowNames.join(", ")]))) {
			for(var i = 0; i < rowNames.length; i++) {
				store.removeTiddler(rowNames[i]);
				story.closeTiddler(rowNames[i], true);
			}
		}
		autoSaveChanges();
	}
};

