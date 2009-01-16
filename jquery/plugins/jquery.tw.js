/*
jquery.tw.js
addition of tw 'namespace'
*/
(function($) {
	if(!$.tw) {
		$.tw = function(selector,context){return new $.tw.fn.init(selector,context);};
		$.tw.fn = $.tw.prototype = function(){return $.tw.fn;};
		$.tw.fn.init = function(selector,context){return $.tw.fn;};
		$.tw.extend = $.tw.fn.extend = $.extend;
	}
})(jQuery);
