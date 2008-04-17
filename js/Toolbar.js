//--
//-- Tiddler toolbar
//--

// Create a toolbar command button
//#  place - parent DOM element
//#  command - reference to config.commands[] member -or- name of member
//#  tiddler - reference to tiddler that toolbar applies to
//#  className - the class to give the button
config.macros.toolbar.createCommand = function(place,commandName,tiddler,className)
{
	if(typeof commandName != "string") {
		var c = null;
		for(var t in config.commands) {
			if(config.commands[t] == commandName)
				c = t;
		}
		commandName = c;
	}
	if((tiddler instanceof Tiddler) && (typeof commandName == "string")) {
		var command = config.commands[commandName];
		if(command.isEnabled ? command.isEnabled(tiddler) : this.isCommandEnabled(command,tiddler)) {
			var text = command.getText ? command.getText(tiddler) : this.getCommandText(command,tiddler);
			var tooltip = command.getTooltip ? command.getTooltip(tiddler) : this.getCommandTooltip(command,tiddler);
			var cmd;
			switch(command.type) {
				case "popup":
					cmd = this.onClickPopup;
					break;
				case "command":
				default:
					cmd = this.onClickCommand;
					break;
			}
			var btn = createTiddlyButton(null,text,tooltip,cmd);
			btn.setAttribute("commandName",commandName);
			btn.setAttribute("tiddler",tiddler.title);
			if(className)
				addClass(btn,className);
			place.appendChild(btn);
		}
	}
};

config.macros.toolbar.isCommandEnabled = function(command,tiddler)
{
	var title = tiddler.title;
	var ro = tiddler.isReadOnly();
	var shadow = store.isShadowTiddler(title) && !store.tiddlerExists(title);
	return (!ro || (ro && !command.hideReadOnly)) && !(shadow && command.hideShadow);
};

config.macros.toolbar.getCommandText = function(command,tiddler)
{
	return tiddler.isReadOnly() && command.readOnlyText ? command.readOnlyText : command.text;
};

config.macros.toolbar.getCommandTooltip = function(command,tiddler)
{
	return tiddler.isReadOnly() && command.readOnlyTooltip ? command.readOnlyTooltip : command.tooltip;
};

config.macros.toolbar.onClickCommand = function(ev)
{
	var e = ev ? ev : window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	var command = config.commands[this.getAttribute("commandName")];
	return command.handler(e,this,this.getAttribute("tiddler"));
};

config.macros.toolbar.onClickPopup = function(ev)
{
	var e = ev ? ev : window.event;
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	var popup = Popup.create(this);
	var command = config.commands[this.getAttribute("commandName")];
	var title = this.getAttribute("tiddler");
	var tiddler = store.fetchTiddler(title);
	popup.setAttribute("tiddler",title);
	command.handlePopup(popup,title);
	Popup.show();
	return false;
};

// Invoke the first command encountered from a given place that is tagged with a specified class
config.macros.toolbar.invokeCommand = function(place,className,event)
{
	var children = place.getElementsByTagName("a");
	for(var t=0; t<children.length; t++) {
		var c = children[t];
		if(hasClass(c,className) && c.getAttribute && c.getAttribute("commandName")) {
			if(c.onclick instanceof Function)
				c.onclick.call(c,event);
			break;
		}
	}
};

config.macros.toolbar.onClickMore = function(ev)
{
	var e = this.nextSibling;
	e.style.display = "inline";
	removeNode(this);
	return false;
};

config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	for(var t=0; t<params.length; t++) {
		var c = params[t];
		switch(c) {
			case '>':
				var btn = createTiddlyButton(place,this.moreLabel,this.morePrompt,config.macros.toolbar.onClickMore);
				addClass(btn,"moreCommand");
				var e = createTiddlyElement(place,"span",null,"moreCommand");
				e.style.display = "none";
				place = e;
				break;
			default:
				var className = "";
				switch(c.substr(0,1)) {
					case "+":
						className = "defaultCommand";
						c = c.substr(1);
						break;
					case "-":
						className = "cancelCommand";
						c = c.substr(1);
						break;
				}
				if(c in config.commands)
					this.createCommand(place,c,tiddler,className);
				break;
		}
	}
};

