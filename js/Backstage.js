//--
//-- Backstage
//--
// Backstage tasks
config.tasks.save.action = saveChanges;

var backstage = {
	area: null,
	toolbar: null,
	button: null,
	showButton: null,
	hideButton: null,
	cloak: null,
	panel: null,
	panelBody: null,
	panelFooter: null,
	currTabName: null,
	currTabElem: null,
	content: null,

	init: function() {
		var cmb = config.messages.backstage;
		this.area = document.getElementById("backstageArea");
		this.toolbar = jQuery("#backstageToolbar").empty()[0];
		this.button = jQuery("#backstageButton").empty()[0];
		this.button.style.display = "block";
		var text = cmb.open.text + " " + glyph("bentArrowLeft");
		this.showButton = createTiddlyButton(this.button, text, cmb.open.tooltip,
			function(e) { backstage.show(); return false }, null, "backstageShow");
		text = glyph("bentArrowRight") + " " + cmb.close.text;
		this.hideButton = createTiddlyButton(this.button, text, cmb.close.tooltip,
			function(e) { backstage.hide(); return false }, null, "backstageHide");
		this.cloak = document.getElementById("backstageCloak");
		this.panel = document.getElementById("backstagePanel");
		this.panelFooter = createTiddlyElement(this.panel, "div", null, "backstagePanelFooter");
		this.panelBody = createTiddlyElement(this.panel, "div", null, "backstagePanelBody");
		this.cloak.onmousedown = function(e) { backstage.switchTab(null) };
		createTiddlyText(this.toolbar, cmb.prompt);
		for(var i = 0; i < config.backstageTasks.length; i++) {
			var taskName = config.backstageTasks[i];
			var task = config.tasks[taskName];
			var handler = task.action ? this.onClickCommand : this.onClickTab;
			var text = task.text + (task.action ? "" : glyph("downTriangle"));
			var btn = createTiddlyButton(this.toolbar, text, task.tooltip, handler, "backstageTab");
			jQuery(btn).addClass(task.action ? "backstageAction" : "backstageTask");
			btn.setAttribute("task", taskName);
		}
		this.content = document.getElementById("contentWrapper");
		if(config.options.chkBackstage)
			this.show();
		else
			this.hide();
	},

	isVisible: function() {
		return this.area ? this.area.style.display == "block" : false;
	},

	show: function() {
		this.area.style.display = "block";
		if(anim && config.options.chkAnimate) {
			backstage.toolbar.style.left = findWindowWidth() + "px";
			anim.startAnimating(new Morpher(backstage.toolbar, config.animDuration, [
				{ style: "left", start: findWindowWidth(), end: 0, template: "%0px" }
			]));
		} else {
			backstage.area.style.left = "0px";
		}
		jQuery(this.showButton).hide();
		jQuery(this.hideButton).show();
		config.options.chkBackstage = true;
		saveOption("chkBackstage");
		jQuery(this.content).addClass("backstageVisible");
	},

	hide: function() {
		if(this.currTabElem) {
			// close current tab, not backstage
			this.switchTab(null);
			return;
		}

		backstage.toolbar.style.left = "0px";
		var hide = function() { backstage.area.style.display = "none" };
		if(anim && config.options.chkAnimate) {
			anim.startAnimating(new Morpher(backstage.toolbar, config.animDuration, [
				{ style: "left", start: 0, end: findWindowWidth(), template: "%0px" }
			], hide));
		} else {
			hide();
		}
		this.showButton.style.display = "block";
		this.hideButton.style.display = "none";
		config.options.chkBackstage = false;
		saveOption("chkBackstage");
		jQuery(this.content).removeClass("backstageVisible");
	},

	onClickCommand: function(e) {
		var task = config.tasks[this.getAttribute("task")];
		if(task.action) {
			backstage.switchTab(null);
			task.action();
		}
		return false;
	},

	onClickTab: function(e) {
		backstage.switchTab(this.getAttribute("task"));
		return false;
	},

	// Switch to a given tab, or none if null is passed
	switchTab: function(tabName) {
		var tabElem = null;
		var e = this.toolbar.firstChild;
		while(e) {
			if(e.getAttribute && e.getAttribute("task") == tabName)
				tabElem = e;
			e = e.nextSibling;
		}
		if(tabName == this.currTabName) {
			this.hidePanel();
			return;
		}
		if(this.currTabElem) {
			jQuery(this.currTabElem).removeClass("backstageSelTab");
		}
		if(tabElem && tabName) {
			this.preparePanel();
			jQuery(tabElem).addClass("backstageSelTab");
			var task = config.tasks[tabName];
			wikify(task.content, this.panelBody, null, null);
			this.showPanel();
		} else if(this.currTabElem) {
			this.hidePanel();
		}
		this.currTabName = tabName;
		this.currTabElem = tabElem;
	},

	isPanelVisible: function() {
		return backstage.panel ? backstage.panel.style.display == "block" : false;
	},

	preparePanel: function() {
		backstage.cloak.style.height = findDocHeight() + "px";
		backstage.cloak.style.display = "block";
		jQuery(backstage.panelBody).empty();
		return backstage.panelBody;
	},

	showPanel: function() {
		backstage.panel.style.display = "block";
		if(anim && config.options.chkAnimate) {
			backstage.panel.style.top = (-backstage.panel.offsetHeight) + "px";
			anim.startAnimating(new Morpher(backstage.panel, config.animDuration, [
				{ style: "top", start: -backstage.panel.offsetHeight, end: 0, template: "%0px" }
			]), new Scroller(backstage.panel, false));
		} else {
			backstage.panel.style.top = "0px";
		}
		return backstage.panelBody;
	},

	hidePanel: function() {
		if(backstage.currTabElem)
			jQuery(backstage.currTabElem).removeClass("backstageSelTab");
		backstage.currTabElem = null;
		backstage.currTabName = null;
		if(anim && config.options.chkAnimate) {
			var callback = function() { backstage.cloak.style.display = "none" };
			anim.startAnimating(new Morpher(backstage.panel, config.animDuration, [
				{ style: "top", start: 0, end: -(backstage.panel.offsetHeight), template: "%0px" },
				{ style: "display", atEnd: "none" }
			], callback));
		} else {
			jQuery([backstage.panel, backstage.cloak]).hide();
		}
	}
};

config.macros.backstage = {};

config.macros.backstage.handler = function(place, macroName, params) {
	var backstageTask = config.tasks[params[0]];
	if(!backstageTask) return;
	createTiddlyButton(place, backstageTask.text, backstageTask.tooltip, function(e) {
		backstage.switchTab(params[0]);
		return false;
	});
};

