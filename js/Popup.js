//--
//-- Popup menu
//--

var Popup = {
	stack: [] // Array of objects with members root: and popup:
	};

Popup.create = function(root,elem,theClass)
{
	Popup.remove();
	var popup = createTiddlyElement(document.body,elem ? elem : "ol","popup",theClass ? theClass : "popup");
	Popup.stack.push({root: root, popup: popup});
	return popup;
};

Popup.onDocumentClick = function(e)
{
	if (!e) var e = window.event;
	var target = resolveTarget(e);
	if(e.eventPhase == undefined)
		Popup.remove();
	else if(e.eventPhase == Event.BUBBLING_PHASE || e.eventPhase == Event.AT_TARGET)
		Popup.remove();
	return true;
};

Popup.show = function(unused1,unused2)
{
	var curr = Popup.stack[Popup.stack.length-1];
	var rootLeft = findPosX(curr.root);
	var rootTop = findPosY(curr.root);
	var rootHeight = curr.root.offsetHeight;
	var popupLeft = rootLeft;
	var popupTop = rootTop + rootHeight;
	var winWidth = findWindowWidth();
	if(curr.popup.offsetWidth > winWidth*0.75)
		curr.popup.style.width = winWidth*0.75 + "px";
	var popupWidth = curr.popup.offsetWidth;
	if(popupLeft + popupWidth > winWidth)
		popupLeft = winWidth - popupWidth;
	curr.popup.style.left = popupLeft + "px";
	curr.popup.style.top = popupTop + "px";
	curr.popup.style.display = "block";
	addClass(curr.root,"highlight");
	if(config.options.chkAnimate && anim && typeof Scroller == "function")
		anim.startAnimating(new Scroller(curr.popup));
	else
		window.scrollTo(0,ensureVisible(curr.popup));
};

Popup.remove = function()
{
	if(Popup.stack.length > 0) {
		Popup.removeFrom(0);
	}
};

Popup.removeFrom = function(from)
{
	for(var t=Popup.stack.length-1; t>=from; t--) {
		var p = Popup.stack[t];
		removeClass(p.root,"highlight");
		removeNode(p.popup);
	}
	Popup.stack = Popup.stack.slice(0,from);
};

