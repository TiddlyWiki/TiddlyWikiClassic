// ---------------------------------------------------------------------------------
// Macro definitions
// ---------------------------------------------------------------------------------

config.macros.today.handler = function(place,macroName,params)
{
	var now = new Date();
	var text;
	if(params[0])
		text = now.formatString(params[0].trim());
	else
		text = now.toLocaleString();
	createTiddlyElement(place,"span",null,null,text);
}

config.macros.version.handler = function(place)
{
	createTiddlyElement(place,"span",null,null,version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : ""));
}

config.macros.list.handler = function(place,macroName,params)
{
	var type = params[0] ? params[0] : "all";
	var theList = document.createElement("ul");
	place.appendChild(theList);
	if(this[type].prompt)
		createTiddlyElement(theList,"li",null,"listTitle",this[type].prompt);
	var results;
	if(this[type].handler)
		results = this[type].handler(params);
	for(var t = 0; t < results.length; t++)
		{
		var theListItem = document.createElement("li")
		theList.appendChild(theListItem);
		if(typeof results[t] == "string")
			createTiddlyLink(theListItem,results[t],true);
		else
			createTiddlyLink(theListItem,results[t].title,true);
		}
}

config.macros.list.all.handler = function(params)
{
	return store.reverseLookup("tags","excludeLists",false,"title");
}

config.macros.list.missing.handler = function(params)
{
	return store.getMissingLinks();
}

config.macros.list.orphans.handler = function(params)
{
	return store.getOrphans();
}

config.macros.list.shadowed.handler = function(params)
{
	return store.getShadowed();
}

config.macros.allTags.handler = function(place,macroName,params)
{
	var tags = store.getTags();
	var theDateList = createTiddlyElement(place,"ul");
	if(tags.length == 0)
		createTiddlyElement(theDateList,"li",null,"listTitle",this.noTags);
	for(var t=0; t<tags.length; t++)
		{
		var theListItem =createTiddlyElement(theDateList,"li");
		var theTag = createTiddlyButton(theListItem,tags[t][0] + " (" + tags[t][1] + ")",this.tooltip.format([tags[t][0]]),onClickTag);
		theTag.setAttribute("tag",tags[t][0]);
		}
}

config.macros.timeline.handler = function(place,macroName,params)
{
	var field = params[0] ? params[0] : "modified";
	var tiddlers = store.reverseLookup("tags","excludeLists",false,field);
	var lastDay = "";
	var last = params[1] ? tiddlers.length-Math.min(tiddlers.length,parseInt(params[1])) : 0;
	for(var t=tiddlers.length-1; t>=last; t--)
		{
		var tiddler = tiddlers[t];
		var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
		if(theDay != lastDay)
			{
			var theDateList = document.createElement("ul");
			place.appendChild(theDateList);
			createTiddlyElement(theDateList,"li",null,"listTitle",tiddler[field].formatString(this.dateFormat));
			lastDay = theDay;
			}
		var theDateListItem = createTiddlyElement(theDateList,"li",null,"listLink");
		theDateListItem.appendChild(createTiddlyLink(place,tiddler.title,true));
		}
}

config.macros.search.handler = function(place,macroName,params)
{
	var searchTimeout = null;
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	var txt = createTiddlyElement(place,"input",null,"txtOptionInput");
	if(params[0])
		txt.value = params[0];
	txt.onkeyup = this.onKeyPress;
	txt.onfocus = this.onFocus;
	txt.setAttribute("size",this.sizeTextbox);
	txt.setAttribute("accessKey",this.accessKey);
	txt.setAttribute("autocomplete","off");
	txt.setAttribute("lastSearchText","");
	if(config.browser.isSafari)
		{
		txt.setAttribute("type","search");
		txt.setAttribute("results","5");
		}
	else
		txt.setAttribute("type","text");
}

// Global because there's only ever one outstanding incremental search timer
config.macros.search.timeout = null;

config.macros.search.doSearch = function(txt)
{
	if(txt.value.length > 0)
		{
		story.search(txt.value,config.options.chkCaseSensitiveSearch,config.options.chkRegExpSearch);
		txt.setAttribute("lastSearchText",txt.value);
		}
}

config.macros.search.onClick = function(e)
{
	config.macros.search.doSearch(this.nextSibling);
	return false;
}

config.macros.search.onKeyPress = function(e)
{
	if(!e) var e = window.event;
	switch(e.keyCode)
		{
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
			config.macros.search.doSearch(this);
			break;
		case 27: // Escape
			this.value = "";
			clearMessage();
			break;
		}
	if(this.value.length > 2)
		{
		if(this.value != this.getAttribute("lastSearchText"))
			{
			if(config.macros.search.timeout)
				clearTimeout(config.macros.search.timeout);
			var txt = this;
			config.macros.search.timeout = setTimeout(function() {config.macros.search.doSearch(txt);},500);
			}
		}
	else
		{
		if(config.macros.search.timeout)
			clearTimeout(config.macros.search.timeout);
		}
}

config.macros.search.onFocus = function(e)
{
	this.select();
}

config.macros.tiddler.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("name",null,true,false,true);
	var names = params[0]["name"];
	var tiddlerName = names[0];
	var className = names[1] ? names[1] : null;
	var args = params[0]["with"];
	var wrapper = createTiddlyElement(place,"span",null,className);
	if(!args)
		{
		wrapper.setAttribute("refresh","content");
		wrapper.setAttribute("tiddler",tiddlerName);
		}
	var text = store.getTiddlerText(tiddlerName);
	if(text)
		{
		var stack = config.macros.tiddler.tiddlerStack;
		if(stack.indexOf(tiddlerName) !== -1)
			return;
		stack.push(tiddlerName);
		try
			{
			var n = args ? Math.min(args.length,9) : 0;
			for(var i=0; i<n; i++) 
				{
				var placeholderRE = new RegExp("\\$" + (i + 1),"mg");
				text = text.replace(placeholderRE,args[i]);
				}
			config.macros.tiddler.renderText(wrapper,text,tiddlerName,params);
			}
		finally
			{
			stack.pop();
			}
		}
}

config.macros.tiddler.renderText = function(place,text,tiddlerName,params) 
{
	wikify(text,place,null,store.getTiddler(tiddlerName));
}

config.macros.tiddler.tiddlerStack = [];

config.macros.tag.handler = function(place,macroName,params)
{
	createTagButton(place,params[0]);
}

config.macros.tags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var theList = createTiddlyElement(place,"ul");
	var title = getParam(params,"anon","");
	if(title && store.tiddlerExists(title))
		tiddler = store.getTiddler(title);
	var sep = getParam(params,"sep"," ");
	var lingo = config.views.wikified.tag;
	var prompt = tiddler.tags.length == 0 ? lingo.labelNoTags : lingo.labelTags;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([tiddler.title]));
	for(var t=0; t<tiddler.tags.length; t++)
		{
		createTagButton(createTiddlyElement(theList,"li"),tiddler.tags[t],tiddler.title);
		if(t<tiddler.tags.length-1)
			createTiddlyText(theList,sep);
		}
}

config.macros.tagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var theList = createTiddlyElement(place,"ul");
	var title = getParam(params,"anon","");
	if(title == "" && tiddler instanceof Tiddler)
		title = tiddler.title;
	var sep = getParam(params,"sep"," ");
	theList.setAttribute("title",this.tooltip.format([title]));
	var tagged = store.getTaggedTiddlers(title);
	var prompt = tagged.length == 0 ? this.labelNotTag : this.label;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([title,tagged.length]));
	for(var t=0; t<tagged.length; t++)
		{
		createTiddlyLink(createTiddlyElement(theList,"li"),tagged[t].title,true);
		if(t<tagged.length-1)
			createTiddlyText(theList,sep);
		}
}

config.macros.closeAll.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
}

config.macros.closeAll.onClick = function(e)
{
	story.closeAllTiddlers();
	return false;
}

config.macros.permaview.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
}

config.macros.permaview.onClick = function(e)
{
	story.permaView();
	return false;
}

config.macros.saveChanges.handler = function(place)
{
	if(!readOnly)
		createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
}

config.macros.saveChanges.onClick = function(e)
{
	saveChanges();
	return false;
}

config.macros.slider.onClickSlider = function(e)
{
	if(!e) var e = window.event;
	var n = this.nextSibling;
	var cookie = n.getAttribute("cookie");
	var isOpen = n.style.display != "none";
	if(anim && config.options.chkAnimate)
		anim.startAnimating(new Slider(n,!isOpen,e.shiftKey || e.altKey,"none"));
	else
		n.style.display = isOpen ? "none" : "block";
	config.options[cookie] = !isOpen;
	saveOptionCookie(cookie);
	return false;
}

config.macros.slider.createSlider = function(place,cookie,title,tooltip)
{
	var cookie = cookie ? cookie : "";
	var btn = createTiddlyButton(place,title,tooltip,this.onClickSlider);
	var panel = createTiddlyElement(null,"div",null,"sliderPanel");
	panel.setAttribute("cookie",cookie);
	panel.style.display = config.options[cookie] ? "block" : "none";
	place.appendChild(panel);
	return panel;
}

config.macros.slider.handler = function(place,macroName,params)
{
	var panel = this.createSlider(place,params[0],params[2],params[3]);
	var text = store.getTiddlerText(params[1]);
	panel.setAttribute("refresh", "content");
	panel.setAttribute("tiddler", params[1]);
	if(text)
		wikify(text,panel,null,store.getTiddler(params[1]));
}

config.macros.option.onChangeOption = function(e)
{
	var opt = this.getAttribute("option");
	var elementType,valueField;
	if(opt)
		{
		switch(opt.substr(0,3))
			{
			case "txt":
				elementType = "input";
				valueField = "value";
				break;
			case "chk":
				elementType = "input";
				valueField = "checked";
				break;
			}
		config.options[opt] = this[valueField];
		saveOptionCookie(opt);
		var nodes = document.getElementsByTagName(elementType);
		for(var t=0; t<nodes.length; t++)
			{
			var optNode = nodes[t].getAttribute("option");
			if(opt == optNode)
				nodes[t][valueField] = this[valueField];
			}
		}
	return(true);
}

config.macros.option.handler = function(place,macroName,params)
{
	var opt = params[0];
	if(config.options[opt] == undefined)
		return;
	var c;
	switch(opt.substr(0,3))
		{
		case "txt":
			c = document.createElement("input");
			c.onkeyup = this.onChangeOption;
			c.setAttribute("option",opt);
			c.className = "txtOptionInput";
			place.appendChild(c);
			c.value = config.options[opt];
			break;
		case "chk":
			c = document.createElement("input");
			c.setAttribute("type","checkbox");
			c.onclick = this.onChangeOption;
			c.setAttribute("option",opt);
			c.className = "chkOptionInput";
			place.appendChild(c);
			c.checked = config.options[opt];
			break;
		}
}



config.macros.newTiddler.createNewTiddlerButton = function(place,title,params,label,prompt,accessKey,newFocus,isJournal)
{
	var tags = [];
	for(var t=1; t<params.length; t++)
		if((params[t].name == "anon" && t != 1) || (params[t].name == "tag"))
			tags.push(params[t].value);
	label = getParam(params,"label",label);
	prompt = getParam(params,"prompt",prompt);
	accessKey = getParam(params,"accessKey",accessKey);
	newFocus = getParam(params,"focus",newFocus);
	var btn = createTiddlyButton(place,label,prompt,this.onClickNewTiddler,null,null,accessKey);
	btn.setAttribute("newTitle",title);
	btn.setAttribute("isJournal",isJournal);
	btn.setAttribute("params",tags.join("|"));
	btn.setAttribute("newFocus",newFocus);
	btn.setAttribute("newTemplate",getParam(params,"template",DEFAULT_EDIT_TEMPLATE));
	var text = getParam(params,"text");
	if(text !== undefined) 
		btn.setAttribute("newText",text);
	return btn;
}

config.macros.newTiddler.onClickNewTiddler = function()
{
	var title = this.getAttribute("newTitle");
	if(this.getAttribute("isJournal"))
		{
		var now = new Date();
		title = now.formatString(title.trim());
		}
	var params = this.getAttribute("params").split("|");
	var focus = this.getAttribute("newFocus");
	var template = this.getAttribute("newTemplate");
	story.displayTiddler(null,title,template);
	var text = this.getAttribute("newText");
	if(typeof text == "string")
		story.getTiddlerField(title,"text").value = text.format([title]);
	for(var t=0;t<params.length;t++)
		story.setTiddlerTag(title,params[t],+1);
	story.focusTiddler(title,focus);
	return false;
}

config.macros.newTiddler.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!readOnly)
		{
		params = paramString.parseParams("anon",null,true,false,false);
		var title = params[1] && params[1].name == "anon" ? params[1].value : this.title;
		title = getParam(params,"title",title);
		this.createNewTiddlerButton(place,title,params,this.label,this.prompt,this.accessKey,"title",false);
		}
}

config.macros.newJournal.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!readOnly)
		{
		params = paramString.parseParams("anon",null,true,false,false);
		var title = params[1] && params[1].name == "anon" ? params[1].value : "";
		title = getParam(params,"title",title);
		config.macros.newTiddler.createNewTiddlerButton(place,title,params,this.label,this.prompt,this.accessKey,"text",true);
		}
}

config.macros.sparkline.handler = function(place,macroName,params)
{
	var data = [];
	var min = 0;
	var max = 0;
	for(var t=0; t<params.length; t++)
		{
		var v = parseInt(params[t]);
		if(v < min)
			min = v;
		if(v > max)
			max = v;
		data.push(v);
		}
	if(data.length < 1)
		return;
	var box = createTiddlyElement(place,"span",null,"sparkline",String.fromCharCode(160));
	box.title = data.join(",");
	var w = box.offsetWidth;
	var h = box.offsetHeight;
	box.style.paddingRight = (data.length * 2 - w) + "px";
	box.style.position = "relative";
	for(var d=0; d<data.length; d++)
		{
		var tick = document.createElement("img");
		tick.border = 0;
		tick.className = "sparktick";
		tick.style.position = "absolute";
		tick.src = "data:image/gif,GIF89a%01%00%01%00%91%FF%00%FF%FF%FF%00%00%00%C0%C0%C0%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%01%00%01%00%40%02%02T%01%00%3B";
		tick.style.left = d*2 + "px";
		tick.style.width = "2px";
		var v = Math.floor(((data[d] - min)/(max-min)) * h);
		tick.style.top = (h-v) + "px";
		tick.style.height = v + "px";
		box.appendChild(tick);
		}
}

config.macros.tabs.handler = function(place,macroName,params)
{
	var cookie = params[0];
	var numTabs = (params.length-1)/3;
	var wrapper = createTiddlyElement(null,"div",null,cookie);
	var tabset = createTiddlyElement(wrapper,"div",null,"tabset");
	tabset.setAttribute("cookie",cookie);
	var validTab = false;
	for(var t=0; t<numTabs; t++)
		{
		var label = params[t*3+1];
		var prompt = params[t*3+2];
		var content = params[t*3+3];
		var tab = createTiddlyButton(tabset,label,prompt,this.onClickTab,"tab tabUnselected");
		tab.setAttribute("tab",label);
		tab.setAttribute("content",content);
		tab.title = prompt;
		if(config.options[cookie] == label)
			validTab = true;
		}
	if(!validTab)
		config.options[cookie] = params[1];
	place.appendChild(wrapper);
	this.switchTab(tabset,config.options[cookie]);
}

config.macros.tabs.onClickTab = function(e)
{
	config.macros.tabs.switchTab(this.parentNode,this.getAttribute("tab"));
	return false;
}

config.macros.tabs.switchTab = function(tabset,tab)
{
	var cookie = tabset.getAttribute("cookie");
	var theTab = null
	var nodes = tabset.childNodes;
	for(var t=0; t<nodes.length; t++)
		if(nodes[t].getAttribute && nodes[t].getAttribute("tab") == tab)
			{
			theTab = nodes[t];
			theTab.className = "tab tabSelected";
			}
		else
			nodes[t].className = "tab tabUnselected"
	if(theTab)
		{
		if(tabset.nextSibling && tabset.nextSibling.className == "tabContents")
			tabset.parentNode.removeChild(tabset.nextSibling);
		var tabContent = createTiddlyElement(null,"div",null,"tabContents");
		tabset.parentNode.insertBefore(tabContent,tabset.nextSibling);
		var contentTitle = theTab.getAttribute("content");
		wikify(store.getTiddlerText(contentTitle),tabContent,null,store.getTiddler(contentTitle));
		if(cookie)
			{
			config.options[cookie] = tab;
			saveOptionCookie(cookie);
			}
		}
}

// <<gradient [[tiddler name]] vert|horiz rgb rgb rgb rgb... >>
config.macros.gradient.handler = function(place,macroName,params,wikifier)
{
	var terminator = ">>";
	var panel;
	if(wikifier)
		panel = createTiddlyElement(place,"div",null,"gradient");
	else
		panel = place;
	panel.style.position = "relative";
	panel.style.overflow = "hidden";
	panel.style.zIndex = "0";
	var t;
	if(wikifier)
		{
		var styles = config.formatterHelpers.inlineCssHelper(wikifier);
		config.formatterHelpers.applyCssHelper(panel,styles);
		}
	var colours = [];
	for(t=1; t<params.length; t++)
		{
		var c = new RGB(params[t]);
		if(c)
			colours.push(c);
		}
	drawGradient(panel,params[0] != "vert",colours);
	if(wikifier)
		wikifier.subWikify(panel,terminator);
	if(document.all)
		{
		panel.style.height = "100%";
		panel.style.width = "100%";
		}
}

config.macros.message.handler = function(place,macroName,params)
{
	if(params[0])
		{
		var m = config;
		var p = params[0].split(".");
		for(var t=0; t<p.length; t++)
			{
			if(p[t] in m)
				m = m[p[t]];
			else
				break;
			}
		createTiddlyText(place,m.toString().format(params.splice(1)));
		}
}

config.macros.view.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if((tiddler instanceof Tiddler) && params[0])
		{
		var value = store.getValue(tiddler,params[0]);
		if(value != undefined)
			switch(params[1])
				{
				case undefined:
					highlightify(value,place,highlightHack);
					break;
				case "link":
					createTiddlyLink(place,value,true);
					break;
				case "wikified":
					wikify(value,place,highlightHack,tiddler);
					break;
				case "date":
					value = Date.convertFromYYYYMMDDHHMM(value);
					if(params[2])
						createTiddlyText(place,value.formatString(params[2]));
					else
						createTiddlyText(place,value);
					break;
				}
		}
}

config.macros.edit.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var field = params[0];
	if((tiddler instanceof Tiddler) && field)
		{
		story.setDirty(tiddler.title,true);
		if(field != "text")
			{
				var e = createTiddlyElement(null,"input");
				if(tiddler.isReadOnly())
					e.setAttribute("readOnly","readOnly");
				e.setAttribute("edit",field);
				e.setAttribute("type","text");
				var v = store.getValue(tiddler,field);
				if(!v) 
					v = "";
				e.value = v;
				e.setAttribute("size","40");
				e.setAttribute("autocomplete","off");
				place.appendChild(e);
			}
		else
			{
				var wrapper1 = createTiddlyElement(null,"fieldset",null,"fieldsetFix");
				var wrapper2 = createTiddlyElement(wrapper1,"div");
				var e = createTiddlyElement(wrapper2,"textarea");
				if(tiddler.isReadOnly())
					e.setAttribute("readOnly","readOnly");
				var v = store.getValue(tiddler,field);
				if(!v) 
					v = "";
				e.value = v;
				var rows = 10;
				var lines = v.match(/\n/mg);
				var maxLines = Math.max(parseInt(config.options.txtMaxEditRows),5);
				if(lines != null && lines.length > rows)
					rows = lines.length + 5;
				rows = Math.min(rows,maxLines);
				e.setAttribute("rows",rows);
				e.setAttribute("edit",field);
				place.appendChild(wrapper1);
			}
		}
}

config.macros.tagChooser.onClick = function(e)
{
	if(!e) var e = window.event;
	var lingo = config.views.editor.tagChooser;
	var popup = Popup.create(this);
	var tags = store.getTags();
	if(tags.length == 0)
		createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
	for(var t=0; t<tags.length; t++)
		{
		var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.tagChooser.onTagClick);
		theTag.setAttribute("tag",tags[t][0]);
		theTag.setAttribute("tiddler", this.getAttribute("tiddler"));
		}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return(false);
}

config.macros.tagChooser.onTagClick = function(e)
{
	if(!e) var e = window.event;
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(!readOnly)
		story.setTiddlerTag(title,tag,0);
	return(false);
}

config.macros.tagChooser.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(tiddler instanceof Tiddler)
		{
		var title = tiddler.title;
		var lingo = config.views.editor.tagChooser;
		var btn = createTiddlyButton(place,lingo.text,lingo.tooltip,this.onClick);
		btn.setAttribute("tiddler", title);
		}
}

// Create a toolbar command button
// place - parent DOM element
// command - reference to config.commands[] member -or- name of member
// tiddler - reference to tiddler that toolbar applies to
// theClass - the class to give the button
config.macros.toolbar.createCommand = function(place,commandName,tiddler,theClass)
{
	if(typeof commandName != "string")
		{
		var c = null;
		for(var t in config.commands)
			if(config.commands[t] == commandName)
				c = t;
		commandName = c;
		}
	if((tiddler instanceof Tiddler) && (typeof commandName == "string"))
		{
		var title = tiddler.title;
		var command = config.commands[commandName];
		var ro = tiddler.isReadOnly();
		var shadow = store.isShadowTiddler(title) && !store.tiddlerExists(title);
		var text = ro && command.readOnlyText ? command.readOnlyText : command.text;
		var tooltip = ro && command.readOnlyTooltip ? command.readOnlyTooltip : command.tooltip;
		if((!ro || (ro && !command.hideReadOnly)) && !(shadow && command.hideShadow))

			{
			var btn = createTiddlyButton(null,text,tooltip,this.onClickCommand);
			btn.setAttribute("commandName", commandName);
			btn.setAttribute("tiddler", title);
			if(theClass)
				addClass(btn,theClass);
			place.appendChild(btn);
			}
		}
}

config.macros.toolbar.onClickCommand = function(e)
{
	if(!e) var e = window.event;
	var command = config.commands[this.getAttribute("commandName")];
	return command.handler(e,this,this.getAttribute("tiddler"));
}

// Invoke the first command encountered from a given place that is tagged with a specified class
config.macros.toolbar.invokeCommand = function(place,theClass,event)
{
	var children = place.getElementsByTagName("a")
	for(var t=0; t<children.length; t++)
		{
		var c = children[t];
		if(hasClass(c,theClass) && c.getAttribute && c.getAttribute("commandName"))
			{
			if(c.onclick instanceof Function)
				c.onclick.call(c,event);
			break;
			}
		}
}

config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	for(var t=0; t<params.length; t++)
		{
		var c = params[t];
		var theClass = "";
		switch(c.substr(0,1))
			{
			case "+":
				theClass = "defaultCommand";
				c = c.substr(1);
				break;
			case "-":
				theClass = "cancelCommand";
				c = c.substr(1);
				break;
			}
		if(c in config.commands)
			this.createCommand(place,c,tiddler,theClass);
		}
}

config.macros.plugins.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var e = createTiddlyElement(place,"div");
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

config.macros.refreshDisplay.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
}

config.macros.refreshDisplay.onClick = function(e)
{
	refreshAll();
	return false;
}

config.macros.importTiddlers.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(readOnly)
		{
		createTiddlyElement(place,"div",null,"marked",this.readOnlyWarning);
		return;
		}
	var importer = createTiddlyElement(null,"div",null,"importTiddler wizard");
	createTiddlyElement(importer,"h1",null,null,this.wizardTitle);
	createTiddlyElement(importer,"h2",null,"step1",this.step1);
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	createTiddlyText(step,this.step1prompt);
	var input = createTiddlyElement(null,"input",null,"txtOptionInput");
	input.type = "text";
	input.size = 50;
	step.appendChild(input);
	importer.inputBox = input;
	createTiddlyElement(step,"br");
	createTiddlyText(step,this.step1promptFile);
	var fileInput = createTiddlyElement(null,"input",null,"txtOptionInput");
	fileInput.type = "file";
	fileInput.size = 50;
	fileInput.onchange = this.onBrowseChange;
	fileInput.onkeyup = this.onBrowseChange;
	step.appendChild(fileInput);
	createTiddlyElement(step,"br");
	createTiddlyText(step,this.step1promptFeeds);
	var feeds = this.getFeeds([{caption: this.step1feedPrompt, name: ""}]);
	createTiddlyDropDown(step,this.onFeedChange,feeds);
	createTiddlyElement(step,"br");
	createTiddlyButton(step,this.fetchLabel,this.fetchPrompt,this.onFetch,null,null,null);
        place.appendChild(importer);
}

config.macros.importTiddlers.getFeeds = function(feeds)
{
	var tagged = store.getTaggedTiddlers("contentPublisher","title");
	for(var t=0; t<tagged.length; t++)
		feeds.push({caption: tagged[t].title, name: store.getTiddlerSlice(tagged[t].title,"URL")});
	return feeds;
}

config.macros.importTiddlers.onFeedChange = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	importer.inputBox.value = this.value;
	this.selectedIndex = 0;
}

config.macros.importTiddlers.onBrowseChange = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	importer.inputBox.value = "file://" + this.value;
}

config.macros.importTiddlers.onFetch = function(e)
{
	var importer = findRelated(this,"importTiddler","className","parentNode");
	var url = importer.inputBox.value;
	var cutoff = findRelated(importer.firstChild,"step2","className","nextSibling");
	while(cutoff)
		{
		var temp = cutoff.nextSibling;
		cutoff.parentNode.removeChild(cutoff);
		cutoff = temp;
		}
	createTiddlyElement(importer,"h2",null,"step2",config.macros.importTiddlers.step2);
	var step = createTiddlyElement(importer,"div",null,"wizardStep",config.macros.importTiddlers.step2Text.format([url]));
	loadRemoteFile(url,config.macros.importTiddlers.onLoad,importer);
}

config.macros.importTiddlers.onLoad = function(status,params,responseText,url,xhr)
{
	if(!status)
		{
		displayMessage(this.fetchError);
		return;
		}
	var importer = params;
	// Check that the tiddler we're in hasn't been closed - doesn't work on IE
//	var p = importer;
//	while(p.parentNode)
//		p = p.parentNode;
//	if(!(p instanceof HTMLDocument))
//		return;
	// Crack out the content - (should be refactored)
	var posOpeningDiv = responseText.indexOf(startSaveArea);
	var limitClosingDiv = responseText.indexOf("<!--POST-BODY-START--"+">");
	var posClosingDiv = responseText.lastIndexOf(endSaveArea,limitClosingDiv == -1 ? responseText.length : limitClosingDiv);
	if((posOpeningDiv == -1) || (posClosingDiv == -1))
		{
		alert(config.messages.invalidFileError.format([url]));
		return;
		}
	var content = "<html><body>" + responseText.substring(posOpeningDiv,posClosingDiv + endSaveArea.length) + "</body></html>";
	// Create the iframe
	var iframe = document.createElement("iframe");
	iframe.style.display = "none";
	importer.insertBefore(iframe,importer.firstChild);
	var doc = iframe.document;
	if(iframe.contentDocument)
		doc = iframe.contentDocument; // For NS6
	else if(iframe.contentWindow)
		doc = iframe.contentWindow.document; // For IE5.5 and IE6
	// Put the content in the iframe
	doc.open();
	doc.writeln(content);
	doc.close();
	// Load the content into a TiddlyWiki() object
	var storeArea = doc.getElementById("storeArea");
	var importStore = new TiddlyWiki();
	importStore.loadFromDiv(storeArea,"store");
	// Get rid of the iframe
	iframe.parentNode.removeChild(iframe);
	// Extract data for the listview
	var tiddlers = [];
	importStore.forEachTiddler(function(title,tiddler)
		{
		var t = {};
		t.title = title;
		t.modified = tiddler.modified;
		t.modifier = tiddler.modifier;
		t.text = tiddler.text.substr(0,50);
		t.tags = tiddler.tags;
		tiddlers.push(t);
		});
	// Display the listview
	createTiddlyElement(importer,"h2",null,"step3",config.macros.importTiddlers.step3);
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	ListView.create(step,tiddlers,config.macros.importTiddlers.listViewTemplate,config.macros.importTiddlers.onSelectCommand);
	// Save the importer
	importer.store = importStore;
}

config.macros.importTiddlers.onSelectCommand = function(listView,command,rowNames)
{
	var importer = findRelated(listView,"importTiddler","className","parentNode");
	switch(command)
		{
		case "import":
			config.macros.importTiddlers.doImport(importer,rowNames);
			break;
		}
	if(config.options.chkAutoSave)
		saveChanges(true);
}

config.macros.importTiddlers.doImport = function(importer,rowNames)
{
	var theStore = importer.store;
	var overwrite = new Array();
	var t;
	for(t=0; t<rowNames.length; t++)
		{
		if(store.tiddlerExists(rowNames[t]))
			overwrite.push(rowNames[t]);
	}
	if(overwrite.length > 0)
		if(!confirm(this.confirmOverwriteText.format([overwrite.join(", ")])))
			return;
	for(t=0; t<rowNames.length; t++)
		{
		var inbound = theStore.fetchTiddler(rowNames[t]);
		store.saveTiddler(inbound.title, inbound.title, inbound.text, inbound.modifier, inbound.modified, inbound.tags);
		store.fetchTiddler(inbound.title).created = inbound.created;
		store.notify(rowNames[t],false);
		}
	store.notifyAll();
	store.setDirty(true);
	createTiddlyElement(importer,"h2",null,"step4",this.step4.format([rowNames.length]));
	var step = createTiddlyElement(importer,"div",null,"wizardStep");
	for(t=0; t<rowNames.length; t++)
		{
		createTiddlyLink(step,rowNames[t],true);
		createTiddlyElement(step,"br");
		}
	createTiddlyElement(importer,"h2",null,"step5",this.step5);
}
