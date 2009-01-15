/*
jquery.tw.js
addition of tw 'namespace'
*/

(function($) {
	if(!$.tw) {
		$.tw = function(selector,context){return new jQuery.fn.init(selector,context);};
		//#$.tw = function(){return this;};
		$.tw.fn = $.tw.prototype;
		$.tw.fn.init = $.fn.init;
		$.tw.fn.init.prototype = $.fn;
		$.tw.extend = $.tw.fn.extend = $.extend;
	}
})(jQuery);
