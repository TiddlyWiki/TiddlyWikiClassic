//--
//-- TiddlyWiki-specific utility functions
//--

function createTiddlyButton(theParent,theText,theTooltip,theAction,theClass,theId,theAccessKey)
{
	var theButton = document.createElement("a");
	if(theAction) {
		theButton.onclick = theAction;
		theButton.setAttribute("href","javascript:;");
	}
	if(theTooltip)
		theButton.setAttribute("title",theTooltip);
	if(theText)
		theButton.appendChild(document.createTextNode(theText));
	if(theClass)
		theButton.className = theClass;
	else
		theButton.className = "button";
	if(theId)
		theButton.id = theId;
	if(theParent)
		theParent.appendChild(theButton);
	if(theAccessKey)
		theButton.setAttribute("accessKey",theAccessKey);
	return theButton;
}

//# Create a link to a particular tiddler
//#   place - element where the link should be created
//#   title - title of target tiddler
//#   includeText - flag for whether to include the title as the text of the link
//#   theClass - custom CSS class for the link
//#   linkedFromTiddler - tiddler from which to inherit extended fields
//#   noToggle - flag to force the link to open the target, even if chkToggleLinks is on
function createTiddlyLink(place,title,includeText,theClass,isStatic,linkedFromTiddler,noToggle)
{
	var text = includeText ? title : null;
	var i = getTiddlyLinkInfo(title,theClass);
	var btn = isStatic ? createExternalLink(place,store.getTiddlerText("SiteUrl",null) + "#" + title) : createTiddlyButton(place,text,i.subTitle,onClickTiddlerLink,i.classes);
	btn.setAttribute("refresh","link");
	btn.setAttribute("tiddlyLink",title);
	if(noToggle)
		btn.setAttribute("noToggle","true");
	if(linkedFromTiddler) {
		var fields = linkedFromTiddler.getInheritedFields();
		btn.setAttribute("tiddlyFields",fields);
	}
	return btn;
}

function refreshTiddlyLink(e,title)
{
	var i = getTiddlyLinkInfo(title,e.className);
	e.className = i.classes;
	e.title = i.subTitle;
}

function getTiddlyLinkInfo(title,currClasses)
{
	var classes = currClasses ? currClasses.split(" ") : [];
	classes.pushUnique("tiddlyLink");
	var tiddler = store.fetchTiddler(title);
	var subTitle;
	if(tiddler) {
		subTitle = tiddler.getSubtitle();
		classes.pushUnique("tiddlyLinkExisting");
		classes.remove("tiddlyLinkNonExisting");
		classes.remove("shadow");
	} else {
		classes.remove("tiddlyLinkExisting");
		classes.pushUnique("tiddlyLinkNonExisting");
		if(store.isShadowTiddler(title)) {
			subTitle = config.messages.shadowedTiddlerToolTip.format([title]);
			classes.pushUnique("shadow");
		} else {
			subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
			classes.remove("shadow");
		}
	}
	if(config.annotations[title])
		subTitle = config.annotations[title];
	return {classes: classes.join(" "),subTitle: subTitle};
}

function createExternalLink(place,url)
{
	var theLink = document.createElement("a");
	theLink.className = "externalLink";
	theLink.href = url;
	theLink.title = config.messages.externalLinkTooltip.format([url]);
	if(config.options.chkOpenInNewWindow)
		theLink.target = "_blank";
	place.appendChild(theLink);
	return theLink;
}

// Event handler for clicking on a tiddly link
function onClickTiddlerLink(e)
{
	if(!e) e = window.event;
	var theTarget = resolveTarget(e);
	var theLink = theTarget;
	var title = null;
	var fields = null;
	var noToggle = null;
	do {
		title = theLink.getAttribute("tiddlyLink");
		fields = theLink.getAttribute("tiddlyFields");
		noToggle = theLink.getAttribute("noToggle");
		theLink = theLink.parentNode;
	} while(title == null && theLink != null);
	if(!fields && !store.isShadowTiddler(title))
		fields = String.encodeHashMap(config.defaultCustomFields);
	if(title) {
		var toggling = e.metaKey || e.ctrlKey;
		if(config.options.chkToggleLinks)
			toggling = !toggling;
		if(noToggle)
			toggling = false;
		story.displayTiddler(theTarget,title,null,true,null,fields,toggling);
	}
	clearMessage();
	return false;
}

// Create a button for a tag with a popup listing all the tiddlers that it tags
function createTagButton(place,tag,excludeTiddler)
{
	var theTag = createTiddlyButton(place,tag,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
	theTag.setAttribute("tag",tag);
	if(excludeTiddler)
		theTag.setAttribute("tiddler",excludeTiddler);
	return theTag;
}

// Event handler for clicking on a tiddler tag
function onClickTag(e)
{
	if(!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var popup = Popup.create(this);
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(popup && tag) {
		var tagged = store.getTaggedTiddlers(tag);
		var titles = [];
		var li,r;
		for(r=0;r<tagged.length;r++) {
			if(tagged[r].title != title)
				titles.push(tagged[r].title);
		}
		var lingo = config.views.wikified.tag;
		if(titles.length > 0) {
			var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			openAll.setAttribute("tag",tag);
			createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
			for(r=0; r<titles.length; r++) {
				createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
			}
		} else {
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
		}
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
		createTiddlyText(h,lingo.openTag.format([tag]));
	}
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
}

// Event handler for 'open all' on a tiddler popup
function onClickTagOpenAll(e)
{
	if(!e) var e = window.event;
	var tag = this.getAttribute("tag");
	var tagged = store.getTaggedTiddlers(tag);
	var titles = [];
	for(var t=0; t<tagged.length; t++)
		titles.push(tagged[t].title);
	story.displayTiddlers(this,titles);
	return false;
}

function onClickError(e)
{
	if(!e) var e = window.event;
	var popup = Popup.create(this);
	var lines = this.getAttribute("errorText").split("\n");
	for(var t=0; t<lines.length; t++)
		createTiddlyElement(popup,"li",null,null,lines[t]);
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyDropDown(place,onchange,options,defaultValue)
{
	var sel = createTiddlyElement(place,"select");
	sel.onchange = onchange;
	for(var t=0; t<options.length; t++) {
		var e = createTiddlyElement(sel,"option",null,null,options[t].caption);
		e.value = options[t].name;
		if(options[t].name == defaultValue)
			e.selected = true;
	}
	return sel;
}

function createTiddlyPopup(place,caption,tooltip,tiddler)
{
	if(tiddler.text) {
		var c = caption + glyph("downArrow");
		var btn = createTiddlyButton(place,c,tooltip,onClickTiddlyPopup,"tiddlerPopupButton");
		btn.tiddler = tiddler;
	} else {
		createTiddlyText(place,caption);
	}
}

function onClickTiddlyPopup(e)
{
	var tiddler = this.tiddler;
	if(tiddler.text) {
		var popup = Popup.create(this,"div","popupTiddler");
		wikify(tiddler.text,popup,null,tiddler);
		Popup.show();
	}
	if(e) e.cancelBubble = true;
	if(e && e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyError(place,title,text)
{
	var btn = createTiddlyButton(place,title,null,onClickError,"errorButton");
	if(text) btn.setAttribute("errorText",text);
}

function merge(dst,src,preserveExisting)
{
	for(p in src) {
		if(!preserveExisting || dst[p] === undefined)
			dst[p] = src[p];
	}
	return dst;
}

// Returns a string containing the description of an exception, optionally prepended by a message
function exceptionText(e,message)
{
	var s = e.description ? e.description : e.toString();
	return message ? "%0:\n%1".format([message,s]) : s;
}

// Displays an alert of an exception description with optional message
function showException(e,message)
{
	alert(exceptionText(e,message));
}

function alertAndThrow(m)
{
	alert(m);
	throw(m);
}

function glyph(name)
{
	var g = config.glyphs;
	var b = g.currBrowser;
	if(b == null) {
		b = 0;
		while(!g.browsers[b]() && b < g.browsers.length-1)
			b++;
		g.currBrowser = b;
	}
	if(!g.codes[name])
		return "";
	return g.codes[name][b];
}
