//--
//-- Message area
//--

function getMessageDiv()
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		return null;
	if(!msgArea.hasChildNodes()) {
		var toolbar = createTiddlyElement(msgArea, "div", null, "messageArea__toolbar messageToolbar");
		var btn = createTiddlyButton(toolbar, '', config.messages.messageClose.tooltip, clearMessage,
			"button messageToolbar__button");

		btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" class="messageToolbar__icon">' +
		'	<rect width="1" height="13.1" x="4.5" y="-1.6" transform="rotate(-45 5 5)"/>' +
		'	<rect width="1" height="13.1" x="4.5" y="-1.6" transform="rotate(+45 5 5)"/>' +
		'</svg>';
		// inline SVG is unsupported in old FireFox
		if(window.HTMLUnknownElement && btn.firstChild instanceof window.HTMLUnknownElement) {
			btn.innerHTML = config.messages.messageClose.text;
		} else {
			btn.classList.add('messageToolbar__button_withIcon');
		}
	}
	msgArea.style.display = "block";
	return createTiddlyElement(msgArea, "div", null, "messageArea__text");
}

function displayMessage(text, link)
{
	var e = getMessageDiv();
	if(!e) {
		alert(text);
		return;
	}
	if(!link) {
		e.appendChild(document.createTextNode(text));
	} else {
		createTiddlyElement(e, "a", null, null, text, { href: link, target: "_blank" });
	}
}

function clearMessage()
{
	var msgArea = document.getElementById("messageArea");
	if(msgArea) {
		jQuery(msgArea).empty();
		msgArea.style.display = "none";
	}
	return false;
}

