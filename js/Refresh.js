// ---------------------------------------------------------------------------------
// Refresh mechanism
// ---------------------------------------------------------------------------------

config.refreshers = {
	link: function(e,changeList)
		{
		var title = e.getAttribute("tiddlyLink");
		refreshTiddlyLink(e,title);
		},

	content: function(e,changeList)
		{
		var title = e.getAttribute("tiddler");
		var force = e.getAttribute("force");
		if(force != null || changeList == null || changeList.find(title) != null)
			{
			removeChildren(e);
			wikify(store.getTiddlerText(title,title),e);
			}
		}
};

function refreshElements(root,changeList)
{
	var nodes = root.childNodes;
	for(var c=0; c<nodes.length; c++)
		{
		var e = nodes[c],type;
		if(e.getAttribute)
			type = e.getAttribute("refresh");
		else
			type = null;
		var refresher = config.refreshers[type];
		if(refresher == undefined)
			{
			if(e.hasChildNodes())
				refreshElements(e,changeList);
			}
		else
			refresher(e,changeList);
		}
}

function applyHtmlMacros(root,tiddler)
{
	var e = root.firstChild;
	while(e)
		{
		var nextChild = e.nextSibling;
		if(e.getAttribute)
			{
			var macro = e.getAttribute("macro");
			if(macro)
				{
				var params = "";
				var p = macro.indexOf(" ");
				if(p != -1)
					{
					params = macro.substr(p+1);
					macro = macro.substr(0,p);
					}
				invokeMacro(e,macro,params,null,tiddler);
				}
			}
		if(e.hasChildNodes())
			applyHtmlMacros(e,tiddler);
		e = nextChild;
		}
}

function refreshPageTemplate(title)
{
	applyPageTemplate(title);
}

function applyPageTemplate(title)
{
	var stash = createTiddlyElement(document.body,"div");
	stash.style.display = "none";
	var display = document.getElementById("tiddlerDisplay");
	var nodes,t;
	if(display)
		{
		nodes = display.childNodes;
		for(t=nodes.length-1; t>=0; t--)
			stash.appendChild(nodes[t]);
		}
	var wrapper = document.getElementById("contentWrapper");
	if(!title)
		title = "PageTemplate";
	var html = store.getRecursiveTiddlerText(title,null,10);
	wrapper.innerHTML = html;
	applyHtmlMacros(wrapper);
	refreshElements(wrapper);
	display = document.getElementById("tiddlerDisplay");
	removeChildren(display);
	if(!display)
		display = createTiddlyElement(wrapper,"div","tiddlerDisplay");
	nodes = stash.childNodes;
	for(t=nodes.length-1; t>=0; t--)
		display.appendChild(nodes[t]);
	stash.parentNode.removeChild(stash);
}

function refreshEverything()
{
	refreshPageTemplate();
	refreshDisplay();
	refreshStyles("StyleSheet");
	refreshStyles("StyleSheetColors");
	refreshStyles("StyleSheetLayout");
	refreshStyles("StyleSheetPrint");
}

function refreshDisplay(hint)
{
	var e = document.getElementById("contentWrapper");
	refreshElements(e,hint == null ? null : [hint]);
}

function refreshPageTitle()
{
	document.title = wikifyPlain("SiteTitle") + " - " + wikifyPlain("SiteSubtitle");
}

function refreshStyles(title)
{
	setStylesheet(title == null ? "" : store.getRecursiveTiddlerText(title,"",10),title);
}

