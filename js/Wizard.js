//--
//-- Wizard support
//--

function Wizard(place) {
	if(place) {
		this.formElem = findRelated(place, "wizard", "className");
		this.bodyElem = findRelated(this.formElem.firstChild, "wizardBody", "className", "nextSibling");
		this.footElem = findRelated(this.formElem.firstChild, "wizardFooter", "className", "nextSibling");
	} else {
		this.formElem = null;
		this.bodyElem = null;
		this.footElem = null;
	}
}

Wizard.prototype.setValue = function(name, value) {
	jQuery(this.formElem).data(name, value);
};

Wizard.prototype.getValue = function(name) {
	return this.formElem ? jQuery(this.formElem).data(name) : null;
};

Wizard.prototype.createWizard = function(place, title) {
	this.formElem = createTiddlyElement(place, "form", null, "wizard");
	createTiddlyElement(this.formElem, "h1", null, "wizard__title", title);
	this.bodyElem = createTiddlyElement(this.formElem, "div", null, "wizardBody");
	this.footElem = createTiddlyElement(this.formElem, "div", null, "wizardFooter");
	return this.formElem;
};

Wizard.prototype.clear = function() {
	jQuery(this.bodyElem).empty();
};

Wizard.prototype.setButtons = function(buttonInfo, status) {
	jQuery(this.footElem).empty();
	for(var i = 0; i < buttonInfo.length; i++) {
		createTiddlyButton(this.footElem, buttonInfo[i].caption, buttonInfo[i].tooltip, buttonInfo[i].onClick);
		insertSpacer(this.footElem);
	}
	if(typeof status == "string") {
		createTiddlyElement(this.footElem, "span", null, "status").innerHTML = status;
	}
};

//# in fact updates content; wrapper looks unnecessary (may be removed presumably)
Wizard.prototype.addStep = function(stepTitle, htmlString) {
	jQuery(this.bodyElem).empty();
	var wrapper = createTiddlyElement(this.bodyElem, "div");
	createTiddlyElement(wrapper, "h2", null, "wizard__subtitle", stepTitle);
	var step = createTiddlyElement(wrapper, "div", null, "wizardStep");
	step.innerHTML = htmlString;
	applyHtmlMacros(step, tiddler);
};

Wizard.prototype.getElement = function(name) {
	return this.formElem.elements[name];
};

