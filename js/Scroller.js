//--
//-- Scroller animation
//--

function Scroller(targetElement) {
	return new Morpher(targetElement, config.animDuration, [{
		style: '-tw-vertScroll', start: findScrollY(), end: ensureVisible(targetElement)
	}]);
}

