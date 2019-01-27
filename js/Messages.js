//--
//-- Message area
//--

function getMessageDiv()
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		return null;
	if(!msgArea.hasChildNodes())
		createTiddlyButton(createTiddlyElement(msgArea,"div",null,"messageArea__toolbar messageToolbar"),
			config.messages.messageClose.text,
			config.messages.messageClose.tooltip,
			clearMessage,
			"button messageToolbar__button");
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

