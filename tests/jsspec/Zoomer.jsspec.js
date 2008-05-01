describe('Zoomer()', {

	before_each: function() {
		zoomer_elem = document.body.appendChild(document.createElement("div"));
		zoomer_text = "hi!";
	},

	'it should return a Morpher object': function() {
		var actual = new Zoomer(zoomer_text,zoomer_elem,zoomer_elem);
		value_of(actual instanceof Morpher).should_be(true);
	},
	
	'it should create a div with the class of "zoomer" as child of the body': function() {
		var before = document.body.childNodes.length;
		var z = new Zoomer(zoomer_text,zoomer_elem,zoomer_elem);
		var after = document.body.childNodes.length;
		var actual = after - before;
		value_of(actual).should_be(1);
		actual = document.body.childNodes[document.body.childNodes.length-1].nodeName;
		value_of(actual).should_be("DIV");
	},
	
	after_each: function() {
		delete zoomer_elem;
		delete zoomer_text;
	}

});

function Zoomer(text,startElement,targetElement,unused)
{
	var e = createTiddlyElement(document.body,"div",null,"zoomer");
	createTiddlyElement(e,"div",null,null,text);
	var winWidth = findWindowWidth();
	var winHeight = findWindowHeight();
	var p = [
		{style: 'left', start: findPosX(startElement), end: findPosX(targetElement), template: '%0px'},
		{style: 'top', start: findPosY(startElement), end: findPosY(targetElement), template: '%0px'},
		{style: 'width', start: Math.min(startElement.scrollWidth,winWidth), end: Math.min(targetElement.scrollWidth,winWidth), template: '%0px', atEnd: 'auto'},
		{style: 'height', start: Math.min(startElement.scrollHeight,winHeight), end: Math.min(targetElement.scrollHeight,winHeight), template: '%0px', atEnd: 'auto'},
		{style: 'fontSize', start: 8, end: 24, template: '%0pt'}
	];
	var c = function(element,properties) {removeNode(element);};
	return new Morpher(e,config.animDuration,p,c);
}