//--
//-- Deprecated DOM utilities
//--

// @Deprecated: Use jQuery.stylesheet instead
function setStylesheet(s,id,doc)
{
	jQuery.stylesheet(s,{ id: id, doc: doc });
}

// @Deprecated: Use jQuery.stylesheet.remove instead
function removeStyleSheet(id)
{
	jQuery.stylesheet.remove({ id: id });
}
