//--
//-- Deprecated Dom code
//-- Use the equivalent jQuery functions directly instead
//--

function removeClass(e,className)
{
	jQuery(e).removeClass(className);
}

function hasClass(e,className)
{
	return jQuery(e).hasClass(className);
}

// Remove all children of a node
function removeChildren(e)
{
	jQuery(e).empty();
}

function createTiddlyText(parent,text)
{
	return jQuery(parent).append(text);
}

// Return the content of an element as plain text with no formatting
function getPlainText(e)
{
	return jQuery(e).text();
}

// Remove a node and all it's children
function removeNode(e)
{
	jQuery(e).remove();
}
