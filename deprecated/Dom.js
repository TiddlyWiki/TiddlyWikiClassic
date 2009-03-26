//--
//-- Deprecated Dom code
//-- Use the equivalent jQuery functions directly instead
//--
function hasClass(e,className) {
	return jQuery(e).hasClass(className);
}

// Remove all children of a node
function removeChildren(e) {
	jQuery(e).empty();
}

function createTiddlyText(parent,text) {
	return jQuery(parent).append(text);
}

// Resolve the target object of an event
function resolveTarget(e) {
	return jQuery(e.target)[0];
}


