//--
//-- Tiddler toolbar
//--

// Create a toolbar command button
//#  place - parent DOM element
//#  command - reference to config.commands[] member -or- name of member
//#  tiddler - reference to tiddler that toolbar applies to
//#  className - the class to give the button
config.macros.toolbar.createCommand = function(place, commandName, tiddler, className) {
	if(!(tiddler instanceof Tiddler)) return;
	if(typeof commandName != "string") {
		for(var name in config.commands) {
			if(config.commands[name] == commandName)
				commandName = name;
		}
	}
	if(typeof commandName != "string") return;
	var command = config.commands[commandName];
	if(command.isEnabled ? !command.isEnabled(tiddler) : !this.isCommandEnabled(command, tiddler))
		return;

	var text = command.getText ? command.getText(tiddler) : this.getCommandText(command, tiddler);
	var tooltip = command.getTooltip ? command.getTooltip(tiddler) : this.getCommandTooltip(command, tiddler);
	var cmd = command.type == "popup" ? this.onClickPopup : this.onClickCommand;
	var btn = createTiddlyButton(place, text, tooltip, cmd, "button command_" + commandName, null, null, {
		commandName: commandName,
		tiddler: tiddler.title
	});
	if(className) jQuery(btn).addClass(className);
	if(commandName === 'permalink') {
		jQuery(btn).attr('href', config.commands.permalink.getUrl(tiddler.title));
	}
};

config.macros.toolbar.isCommandEnabled = function(command, tiddler) {
	var title = tiddler.title;
	var shadow = store.isShadowTiddler(title) && !store.tiddlerExists(title);
	if(shadow && command.hideShadow) return false;
	var ro = tiddler.isReadOnly();
	return !ro || (ro && !command.hideReadOnly);
};

config.macros.toolbar.getCommandText = function(command, tiddler) {
	return (tiddler.isReadOnly() && command.readOnlyText) || command.text;
};

config.macros.toolbar.getCommandTooltip = function(command, tiddler) {
	return (tiddler.isReadOnly() && command.readOnlyTooltip) || command.tooltip;
};

config.macros.toolbar.onClickCommand = function(ev) {
	var e = ev || window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	var command = config.commands[this.getAttribute("commandName")];
	return command.handler(e, this, this.getAttribute("tiddler"));
};

config.macros.toolbar.onClickPopup = function(ev) {
	var e = ev || window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	var popup = Popup.create(this);
	var title = this.getAttribute("tiddler");
	popup.setAttribute("tiddler", title);
	var command = config.commands[this.getAttribute("commandName")];
	command.handlePopup(popup, title);
	Popup.show();
	return false;
};

// Invoke the first command encountered from a given place that is tagged with a specified class
config.macros.toolbar.invokeCommand = function(place, className, event) {
	var children = place.getElementsByTagName("a");
	for(var i = 0; i < children.length; i++) {
		var c = children[i];
		if(jQuery(c).hasClass(className) && c.getAttribute && c.getAttribute("commandName")) {
			if(c.onclick instanceof Function)
				c.onclick.call(c, event);
			break;
		}
	}
};

config.macros.toolbar.onClickMore = function(ev) {
	var e = this.nextSibling;
	e.style.display = "inline";
	this.style.display = "none";
	return false;
};

config.macros.toolbar.onClickLess = function(ev) {
	var e = this.parentNode;
	var m = e.previousSibling;
	e.style.display = "none";
	m.style.display = "inline";
	return false;
};

config.macros.toolbar.handler = function(place, macroName, params, wikifier, paramString, tiddler) {
	for(var i = 0; i < params.length; i++) {
		var commandName = params[i];
		switch(commandName) {
			case "!":
				createTiddlyText(place, this.separator);
				break;
			case "*":
				createTiddlyElement(place, "br");
				break;
			case "<":
				createTiddlyButton(place, this.lessLabel, this.lessPrompt,
					config.macros.toolbar.onClickLess, "button lessCommand");
				break;
			case ">":
				createTiddlyButton(place, this.moreLabel, this.morePrompt,
					config.macros.toolbar.onClickMore, "button moreCommand");
				//# hidden container for more commands, put next commands there
				place = createTiddlyElement(place, "span", null, "moreCommand");
				place.style.display = "none";
				break;
			default:
				var className = "";
				switch(commandName.substring(0, 1)) {
					case "+":
						className = "defaultCommand";
						commandName = commandName.substring(1);
						break;
					case "-":
						className = "cancelCommand";
						commandName = commandName.substring(1);
						break;
				}
				if(config.commands[commandName]) {
					this.createCommand(place, commandName, tiddler, className);
				} else {
					this.customCommand(place, commandName, wikifier, tiddler);
				}
				break;
		}
	}
};

// Overrideable function to extend toolbar handler
config.macros.toolbar.customCommand = function(place, command, wikifier, tiddler) {
};

