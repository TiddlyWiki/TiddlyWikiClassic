//--
//-- NewTiddler and NewJournal macros
//--

config.macros.newTiddler.createNewTiddlerButton = function(
	place, title, params, label, prompt, accessKey, newFocus, isJournal
) {
	label = getParam(params, "label", label);
	prompt = getParam(params, "prompt", prompt);
	accessKey = getParam(params, "accessKey", accessKey);
	var customFields = getParam(params, "fields", "");
	if(!customFields && !store.isShadowTiddler(title))
		customFields = String.encodeHashMap(config.defaultCustomFields);
	var tags = [];
	for(var i = 1; i < params.length; i++) {
		if((params[i].name == "anon" && i != 1) || (params[i].name == "tag"))
			tags.push(params[i].value);
	}
	var text = getParam(params, "text");

	var btn = createTiddlyButton(place, label, prompt, this.onClickNewTiddler, null, null, accessKey, {
		newTitle: title,
		isJournal: isJournal ? "true" : "false",
		newFocus: getParam(params, "focus", newFocus),
		newTemplate: getParam(params, "template", DEFAULT_EDIT_TEMPLATE)
	});
	if(tags.length > 0)
		btn.setAttribute("params", tags.join("|"));
	if(customFields !== "")
		btn.setAttribute("customFields", customFields);
	if(text !== undefined)
		btn.setAttribute("newText", text);
	return btn;
};

config.macros.newTiddler.onClickNewTiddler = function() {
	var title = this.getAttribute("newTitle");
	if(this.getAttribute("isJournal") == "true") {
		title = new Date().formatString(title.trim());
	}
	var params = this.getAttribute("params");
	var tags = params ? params.split("|") : [];
	var focus = this.getAttribute("newFocus");
	var template = this.getAttribute("newTemplate");
	var customFields = this.getAttribute("customFields");
	if(!customFields && !store.isShadowTiddler(title))
		customFields = String.encodeHashMap(config.defaultCustomFields);

	story.displayTiddler(this, title, template, false, null, null); // #161
	var tiddlerElem = story.getTiddler(title);
	if(customFields)
		story.addCustomFields(tiddlerElem, customFields);
	var text = this.getAttribute("newText");
	if(typeof text == "string" && story.getTiddlerField(title, "text"))
		story.getTiddlerField(title, "text").value = text.format([title]);
	for(var i = 0; i < tags.length; i++)
		story.setTiddlerTag(title, tags[i], +1);
	story.focusTiddler(title, focus);
	return false;
};

config.macros.newTiddler.handler = function(place, macroName, params, wikifier, paramString) {
	if(readOnly) return;
	params = paramString.parseParams("anon", null, true, false, false);
	var title = params[1] && params[1].name == "anon" ? params[1].value : this.title;
	title = getParam(params, "title", title);
	this.createNewTiddlerButton(place, title, params, this.label, this.prompt, this.accessKey, "title", false);
};

config.macros.newJournal.handler = function(place, macroName, params, wikifier, paramString) {
	if(readOnly) return;
	params = paramString.parseParams("anon", null, true, false, false);
	var title = params[1] && params[1].name == "anon" ? params[1].value : config.macros.timeline.dateFormat;
	title = getParam(params, "title", title);
	config.macros.newTiddler.createNewTiddlerButton(place, title,
		params, this.label, this.prompt, this.accessKey, "text", true);
};

