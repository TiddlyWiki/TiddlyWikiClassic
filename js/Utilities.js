// ---------------------------------------------------------------------------------
// TiddlyWiki-specific utility functions
// ---------------------------------------------------------------------------------

function createTiddlyButton(theParent,theText,theTooltip,theAction,theClass,theId,theAccessKey)
{
	var theButton = document.createElement("a");
	theButton.className = "button";
	if(theAction)
		{
		theButton.onclick = theAction;
		theButton.setAttribute("href","javascript:;");
		}
	theButton.setAttribute("title",theTooltip);
	if(theText)
		theButton.appendChild(document.createTextNode(theText));
	if(theClass)
		theButton.className = theClass;
	if(theId)
		theButton.id = theId;
	if(theParent)
		theParent.appendChild(theButton);
	if(theAccessKey)
		theButton.setAttribute("accessKey",theAccessKey);
	return(theButton);
}

function createTiddlyLink(place,title,includeText,theClass)
{
	var text = includeText ? title : null;
	var btn = createTiddlyButton(place,text,null,onClickTiddlerLink,theClass);
	btn.setAttribute("refresh","link");
	btn.setAttribute("tiddlyLink",title);
	refreshTiddlyLink(btn,title);
	return(btn);
}

function refreshTiddlyLink(e,title)
{
	var subTitle, theClass = "tiddlyLink";
	var tiddler = store.fetchTiddler(title);
	if(tiddler)
		{
		subTitle = tiddler.getSubtitle();
		theClass += " tiddlyLinkExisting";
		}
	else
		{
		subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
		theClass += " tiddlyLinkNonExisting";
		if(store.isShadowTiddler(title))
			{
			subTitle = config.messages.shadowedTiddlerToolTip.format([title]);
			theClass += " shadow";
			}
		else
			subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
		}
	e.className = theClass;
	e.title = subTitle;
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
	return(theLink);
}

// Event handler for clicking on a tiddly link
function onClickTiddlerLink(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var theLink = theTarget;
	var title = null;
	do {
		title = theLink.getAttribute("tiddlyLink");
		theLink = theLink.parentNode;
	} while(title == null && theLink != null);
	if(title)
		{
		var toggling = e.metaKey || e.ctrlKey;
		if(config.options.chkToggleLinks)
			toggling = !toggling;
		var opening;
		if(toggling && document.getElementById("tiddler" + title))
			story.closeTiddler(title,true,e.shiftKey || e.altKey);
		else
			story.displayTiddler(theTarget,title,null,true,e.shiftKey || e.altKey);
		}
	clearMessage();
	return(false);
}

// Create a button for a tag with a popup listing all the tiddlers that it tags
function createTagButton(place,tag,excludeTiddler)
{
	var theTag = createTiddlyButton(place,tag,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
	theTag.setAttribute("tag",tag);
	if(excludeTiddler)
		theTag.setAttribute("tiddler",excludeTiddler);
	return(theTag);
}

// Event handler for clicking on a tiddler tag
function onClickTag(e)
{
	if (!e) var e = window.event;
	var theTarget = resolveTarget(e);
	var popup = Popup.create(this);
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(popup && tag)
		{
		var tagged = store.getTaggedTiddlers(tag);
		var titles = [];
		var li,r;
		for(r=0;r<tagged.length;r++)
			if(tagged[r].title != title)
				titles.push(tagged[r].title);
		var lingo = config.views.wikified.tag;
		if(titles.length > 0)
			{
			var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			openAll.setAttribute("tag",tag);
			createTiddlyElement(createTiddlyElement(popup,"li"),"hr");
			for(r=0; r<titles.length; r++)
				{
				createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
				}
			}
		else
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
		createTiddlyElement(createTiddlyElement(popup,"li"),"hr");
		var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
		createTiddlyText(h,lingo.openTag.format([tag]));
		}
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return(false);
}

// Event handler for 'open all' on a tiddler popup
function onClickTagOpenAll(e)
{
	if (!e) var e = window.event;
	var tag = this.getAttribute("tag");
	var tagged = store.getTaggedTiddlers(tag);
	for(var t=tagged.length-1; t>=0; t--)
		story.displayTiddler(this,tagged[t].title,null,false,e.shiftKey || e.altKey);
	return(false);
}

function onClickError(e)
{
	if (!e) var e = window.event;
	var popup = Popup.create(this);
	var lines = this.getAttribute("errorText").split("\n");
	for(var t=0; t<lines.length; t++)
		createTiddlyElement(popup,"li",null,null,lines[t]);
	Popup.show(popup,false);
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyError(place,title,text)
{
	var btn = createTiddlyButton(place,title,null,onClickError,"errorButton");
	if (text) btn.setAttribute("errorText",text);
}

function merge(dst,src)
{
	for (p in src)
		dst[p] = src[p];
	return dst;
}


