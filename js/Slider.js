//--
//-- Slider animation
//--

// deleteMode - "none", "all" [delete target element and it's children], [only] "children" [but not the target element]
function Slider(element,opening,unused,deleteMode,flyIn)
{
	element.style.overflow = 'hidden';
	if(opening)
		element.style.height = '0px'; // Resolves a Firefox flashing bug
	element.style.display = 'block';
	var left = findPosX(element);
	var width = element.scrollWidth;
	var height = element.scrollHeight;
	var winWidth = findWindowWidth();
	var p = [];
	var c = null;
	if(opening) {
		if(flyIn)
			p.push({style: 'marginLeft', start: winWidth-width, end: 0, template: '%0px'});
		p.push({style: 'height', start: 0, end: height, template: '%0px', atEnd: 'auto'});
		p.push({style: 'opacity', start: 0, end: 1, template: '%0'});
		p.push({style: 'filter', start: 0, end: 100, template: 'alpha(opacity:%0)'});
	} else {
		if(flyIn)
			p.push({style: 'marginLeft', start: 0, end: -left, template: '%0px', atEnd: '0px'});
		p.push({style: 'height', start: height, end: 0, template: '%0px'});
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
