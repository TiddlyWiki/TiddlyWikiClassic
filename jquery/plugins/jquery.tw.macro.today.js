/*
jquery.tw.macro.today.js
jQuery TiddlyWiki <<today>> macro
*/
(function($) {
	$.tw.fn.extend({
		today: function(args) {
	//#$.fn.extend({
		//#tw_macro_today: function(args) {
			var now = new Date();
			var format = args.format||args[1];
			var text = format ? now.formatString(format.trim()) : now.toLocaleString();
			this.append("<span>"+text+"</span>");
			return this;
		}
	});
})(jQuery);
