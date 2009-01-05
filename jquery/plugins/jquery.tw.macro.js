/*
jquery.tw.macro
macro parameter expansion
*/
(function($) {
	$.fn.extend({
		tw_expandMacroParams: function(args) {
			// expand the macro parameters into a name:value hash
			// unnamed parameters are given a numeric name, starting at 1
			var opts = {};
			var t = $.trim(args);
			var unnamed = 1;
			var s = 0;
			var i = findNakedSpace(t,s);
			var val;
			var param = i==-1 ? t.substr(s) : t.substring(s,i);
			while(true) {
				var ci = param.indexOf(':');
				if(ci==-1) {
					// parameter is unnamed
					val = $.trim(param);
					if(val.charAt(0)=='"' && val.charAt(val.length-1)=='"') {
						val = val.substr(1,val.length-2);
					}
					opts[unnamed++] = val;
				} else {
					var name = param.substr(0,ci);
					val = param.substr(ci+1);
					val = $.trim(val);
					if(val.charAt(0)=='"' && val.charAt(val.length-1)=='"') {
						val = val.substr(1,val.length-2);
					}
					opts[name] = val; 
				}
				if(i==-1)
					break;
				s = i+1;
				i = findNakedSpace(t,s);
				param = i==-1 ? t.substr(s) : t.substring(s,i);
			}
			return opts;
		}
	});

	// Private functions.
	function findNakedSpace(text,start) {
		// find the next space not surrounded by quotes
		var d = text.indexOf(' ',start);
		if(d==-1)
			return -1;
		var qs = text.indexOf('"',start);
		if(qs==-1 || qs > d)
			return d;
		var qe = text.indexOf('"',qs+1);
		if(qe==-1)
			return d;
		return findNakedSpace(text,qe+1);
	}

})(jQuery);
