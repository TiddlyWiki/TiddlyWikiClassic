//--
//-- Scroller animation
//--

function Scroller(targetElement,unused)
{
	var p = [
		{style: '-tw-vertScroll', start: findScrollY(), end: ensureVisible(targetElement)}
	];
	return new Morpher(targetElement,config.animDuration,p);
}

