// ---------------------------------------------------------------------------------
// Message area
// ---------------------------------------------------------------------------------

function displayMessage(text,linkText)
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		{
		alert(text);
		return;
		}
	if(!msgArea.hasChildNodes())
		createTiddlyButton(createTiddlyElement(msgArea,"div",null,"messageToolbar"),config.messages.messageClose.text,config.messages.messageClose.tooltip,clearMessage);
	var msg;
	if(linkText)
		{
		msg = createTiddlyElement(msgArea,"div");
		var link = createTiddlyElement(msg,"a",null,null,text);
		link.href = linkText;
		link.target = "_blank";
		}
	else
		msg = createTiddlyElement(msgArea,"div",null,null,text);
	msgArea.style.display = "block";
}

function clearMessage()
{
	var msgArea = document.getElementById("messageArea");
	if(msgArea)
		{
		removeChildren(msgArea);
		msgArea.style.display = "none";
		}
	return false;
}

