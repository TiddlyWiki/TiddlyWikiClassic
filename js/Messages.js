//--
//-- Message area
//--

function getMessageDiv()
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		return null;
	if(!msgArea.hasChildNodes()) {
		var btn = createTiddlyButton(createTiddlyElement(msgArea,"div",null,"messageArea__toolbar messageToolbar"),
			config.messages.messageClose.text,
			config.messages.messageClose.tooltip,
			clearMessage,
			"button messageToolbar__button");
		if(!config.options.chkDontUseSvgIcons) {
			btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" class="messageToolbar__icon">'+
			'	<rect width="1" height="13.1" x="4.5" y="-1.6" transform="rotate(-45 5 5)"/>'+
			'	<rect width="1" height="13.1" x="4.5" y="-1.6" transform="rotate(+45 5 5)"/>'+
			'</svg>';
			btn.classList.add('messageToolbar__button_withIcon');
		}
	}
	msgArea.style.display = "block";
	return createTiddlyElement(msgArea,"div",null,"messageArea__text");
}

function displayMessage(text,linkText)
{
	var e = getMessageDiv();
	if(!e) {
		alert(text);
		return;
	}
	if(linkText) {
		var link = createTiddlyElement(e,"a",null,null,text);
		link.href = linkText;
		link.target = "_blank";
	} else {
		e.appendChild(document.createTextNode(text));
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

