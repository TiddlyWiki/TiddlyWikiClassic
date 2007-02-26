//--
//-- Zoomer animation
//--

function Zoomer(text,startElement,targetElement,slowly)
{
	var e = createTiddlyElement(document.body,"div",null,"zoomer",text);
	var winWidth = findWindowWidth();
	var winHeight = findWindowHeight();
	var p = [
		{style: 'left', start: findPosX(startElement), end: findPosX(targetElement), template: '%0px'},
		{style: 'top', start: findPosY(startElement), end: findPosY(targetElement), template: '%0px'},
		{style: 'width', start: Math.min(startElement.offsetWidth,winWidth), end: Math.min(targetElement.offsetWidth,winWidth), template: '%0px', atEnd: 'auto'},
		{style: 'height', start: Math.min(startElement.offsetHeight,winHeight), end: Math.min(targetElement.offsetHeight,winHeight), template: '%0px', atEnd: 'auto'},
	];
	var c = function(element,properties) {element.parentNode.removeChild(element);};
	return new Morpher(e,config.animDuration,p,c);
}
