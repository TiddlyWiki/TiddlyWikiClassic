/*
jquery.file.load.js
jQuery plugin for loading a file
*/

(function($) {

	if(!$.file) {
		$.file = $.extend({});
	}

	$.file.extend({
		defaults : {
			fileUrl: null,
			verbose: false
		},
		load: function(args) {
			var opts = $.extend({},this.defaults,args);
			var r = mozillaLoadFile(opts.fileUrl);
			if((r == null) || (r == false))
				r = ieLoadFile(opts.fileUrl);
			if((r == null) || (r == false))
				r = javaLoadFile(opts.fileUrl);
			return r;
		}
	});

	// Private functions.
	
	function ieLoadFile(filePath) {
		// Returns null if it can't do it, false if there's an error, or a string of the content if successful
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var file = fso.OpenTextFile(filePath,1);
			var content = file.ReadAll();
			file.Close();
		} catch(ex) {
			//# alert("Exception while attempting to load\n\n" + ex.toString());
			return null;
		}
		return content;
	}

	function mozillaLoadFile(filePath) {
		// Returns null if it can't do it, false if there's an error, or a string of the content if successful
		if(window.Components) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(filePath);
				if(!file.exists())
					return null;
				var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
				inputStream.init(file,0x01,4,null);
				var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
				sInputStream.init(inputStream);
				var contents = sInputStream.read(sInputStream.available());
				sInputStream.close();
				inputStream.close();
				return contents;
			} catch(ex) {
				//# alert("Exception while attempting to load\n\n" + ex);
				return false;
			}
		}
		return null;
	}

	function javaUrlToFilename(url) {
		var f = "//localhost";
		if(url.indexOf(f) == 0)
			return url.substring(f.length);
		var i = url.indexOf(":");
		return i > 0 ? url.substring(i-1) : url;
	}

	function javaLoadFile(filePath) {
		try {
			if(document.applets["TiddlySaver"])
				return String(document.applets["TiddlySaver"].loadFile(javaUrlToFilename(filePath),"UTF-8"));
		} catch(ex) {
		}
		var content = [];
		try {
			var r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
			var line;
			while((line = r.readLine()) != null)
				content.push(new String(line));
			r.close();
		} catch(ex) {
			return null;
		}
		return content.join("\n");
	}

})(jQuery);
