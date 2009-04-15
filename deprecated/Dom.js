//--
//-- Deprecated Dom code
//-- Use the equivalent jQuery functions directly instead
//--

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
