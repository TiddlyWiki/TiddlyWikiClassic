//--
//-- Deprecated utility functions
//-- Use the jQuery functions directly instead
//--

// Remove a node and all it's children
function removeNode(e)
{
	jQuery(e).remove();
}

// Return the content of an element as plain text with no formatting
function getPlainText(e)
{
	return jQuery(e).text();
}

