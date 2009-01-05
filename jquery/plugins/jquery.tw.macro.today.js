/*
jquery.tw.macro.today
*/
(function($) {
//if(!$.tw)
//	$.tw = $.fn.extend({});
	$.fn.extend({
		tw_macro_today: function(args) {
			var now = new Date();
			var format = args.params[1]||args.params.format;
			var text = format ? now.formatString(format.trim()) : now.toLocaleString();
			this.append("<span>"+text+"</span>");
		}
	});
})(jQuery);
