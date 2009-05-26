//--
//-- Deprecated DOM utilities
//--

// @Deprecated: Use jQuery.stylesheet instead
function setStylesheet(s,id,doc)
{
	jQuery.twStylesheet(s,{ id: id, doc: doc });
}

// @Deprecated: Use jQuery.stylesheet.remove instead
function removeStyleSheet(id)
{
	jQuery.twStylesheet.remove({ id: id });
}
