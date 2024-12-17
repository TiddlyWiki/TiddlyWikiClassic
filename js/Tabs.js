//--
//-- Tabs macro
//--

config.macros.tabs.handler = function(place, macroName, params) {
	var cookie = params[0];
	var numTabs = (params.length - 1) / 3;
	var wrapper = createTiddlyElement(null, "div", null, "tabsetWrapper " + cookie);
	var tabset = createTiddlyElement(wrapper, "div", null, "tabset");
	tabset.setAttribute("cookie", cookie);
	var validTab = false;
	for(var i = 0; i < numTabs; i++) {
		var label = params[i * 3 + 1];
		var prompt = params[i * 3 + 2];
		var content = params[i * 3 + 3];
		var tab = createTiddlyButton(tabset, label, prompt, this.onClickTab, "tab tabUnselected");
		createTiddlyElement(tab, "span", null, null, " ", { style: "font-size:0pt;line-height:0px" });
		tab.setAttribute("tab", label);
		tab.setAttribute("content", content);
		tab.title = prompt;
		if(config.options[cookie] == label)
			validTab = true;
	}
	if(!validTab)
		config.options[cookie] = params[1];
	place.appendChild(wrapper);
	this.switchTab(tabset, config.options[cookie]);
};

config.macros.tabs.onClickTab = function(e) {
	config.macros.tabs.switchTab(this.parentNode, this.getAttribute("tab"));
	return false;
};

config.macros.tabs.switchTab = function(tabset, tab) {
	var cookie = tabset.getAttribute("cookie");
	var theTab = null;
	var nodes = tabset.childNodes;
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].getAttribute && nodes[i].getAttribute("tab") == tab) {
			theTab = nodes[i];
			theTab.className = "tab tabSelected";
		} else {
			nodes[i].className = "tab tabUnselected";
		}
	}
	if(!theTab) return;

	if(tabset.nextSibling && tabset.nextSibling.className == "tabContents")
		jQuery(tabset.nextSibling).remove();
	var tabContent = createTiddlyElement(null, "div", null, "tabContents");
	tabset.parentNode.insertBefore(tabContent, tabset.nextSibling);
	var contentTitle = theTab.getAttribute("content");
	wikify(store.getTiddlerText(contentTitle), tabContent, null, store.getTiddler(contentTitle));
	if(cookie) {
		config.options[cookie] = tab;
		saveOption(cookie);
	}
};

