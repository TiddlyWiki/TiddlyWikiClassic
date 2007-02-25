//--
//-- Slider animation
//--

// deleteMode - "none", "all" [delete target element and it's children], [only] "children" [but not the target element]
function Slider(element,opening,slowly,deleteMode)
{
	element.style.display = 'block';
	element.style.overflow = 'hidden';
	element.style.height = 'auto';
	var p = [];
	var c = null;
	if(opening) {
		p.push({style: 'height', start: 0, end: element.offsetHeight, template: '%0px', atEnd: 'auto'});
		p.push({style: 'display', atEnd: 'auto'});
		p.push({style: 'opacity', start: 0, end: 1, template: '%0'});
		p.push({style: 'filter', start: 0, end: 100, template: 'alpha(opacity:%0)'});
	} else {
		p.push({style: 'height', start: element.offsetHeight, end: 0, template: '%0px'});
		p.push({style: 'display', atEnd: 'none'});
		p.push({style: 'opacity', start: 1, end: 0, template: '%0'});
		p.push({style: 'filter', start: 100, end: 0, template: 'alpha(opacity:%0)'});
		switch(deleteMode) {
			case "all":
				c = function(element,properties) {element.parentNode.removeChild(element);};
				break;
			case "children":
				c = function(element,properties) {removeChildren(element);};
				break;
		}
	}
	return new Morpher(element,config.animDuration,p,c);
}
