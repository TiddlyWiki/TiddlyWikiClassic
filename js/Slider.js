//--
//-- Slider animation
//--

// deleteMode - "none", "all" [delete target element and it's children], [only] "children" [but not the target element]
function Slider(element, opening, unused, deleteMode) {
	element.style.overflow = 'hidden';
	// Workaround a Firefox flashing bug
	if(opening) element.style.height = '0px';
	element.style.display = 'block';
	var height = element.scrollHeight;
	var props = [];
	var callback = null;
	if(opening) {
		props.push({ style: 'height', start: 0, end: height, template: '%0px', atEnd: 'auto' });
		props.push({ style: 'opacity', start: 0, end: 1, template: '%0' });
		props.push({ style: 'filter', start: 0, end: 100, template: 'alpha(opacity:%0)' });
	} else {
		props.push({ style: 'height', start: height, end: 0, template: '%0px' });
		props.push({ style: 'display', atEnd: 'none' });
		props.push({ style: 'opacity', start: 1, end: 0, template: '%0' });
		props.push({ style: 'filter', start: 100, end: 0, template: 'alpha(opacity:%0)' });
		switch(deleteMode) {
			case "all":
				callback = function(element, properties) { jQuery(element).remove() };
				break;
			case "children":
				callback = function(element, properties) { jQuery(element).empty() };
				break;
		}
	}
	return new Morpher(element, config.animDuration, props, callback);
}

