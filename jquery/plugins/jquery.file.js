/*
jquery.file.js

jQuery plugin for loading a file and saving data to a file

Copyright (c) UnaMesa Association 2009

Dual licensed under the MIT and GPL licenses:
  http://www.opensource.org/licenses/mit-license.php
  http://www.gnu.org/licenses/gpl.html
*/

(function($) {

	$(function() {
		if(!document.applets["TiddlySaver"] && !$.browser.mozilla && !$.browser.msie) {
			$(document.body).append("<applet style='position:absolute;left:-1px' name='TiddlySaver' code='TiddlySaver.class' archive='TiddlySaver.jar' width='1'height='1'></applet>");
		}
	});
	if(!$.file) {
		$.file = {};
	}

	$.extend($.file,{
		load: function(filePath) {
			var r = mozillaLoadFile(filePath);
			if((r == null) || (r == false))
				r = ieLoadFile(filePath);
			if((r == null) || (r == false))
				r = javaLoadFile(filePath);
			return r;
		},
		save: function(filePath,content) {
			var r = mozillaSaveFile(filePath,content);
			if(!r)
				r = ieSaveFile(filePath,content);
			if(!r)
				r = javaSaveFile(filePath,content);
			return r;
		},
		copy: function(dest,source) {
			return $.browser.msie ? ieCopyFile(dest,source) : false;
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
				var converter = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
				converter.init(inputStream, "UTF-8", 0, 0);
				var contents = {};
				converter.readString(-1,contents);
				converter.close();
				inputStream.close();
				return contents.value;
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
		var r;
		try {
			if(document.applets["TiddlySaver"]) {
				r = document.applets["TiddlySaver"].loadFile(javaUrlToFilename(filePath),"UTF-8");
				return (r === undefined || r === null) ? null : String(r);
			}
		} catch(ex) {
		}
		var content = [];
		try {
			r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
			var line;
			while((line = r.readLine()) != null)
				content.push(new String(line));
			r.close();
		} catch(ex) {
			return null;
		}
		return content.join("\n");
	}

	function ieCreatePath(path) {
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
		} catch(ex) {
			return null;
		}

		//# Remove the filename, if present. Use trailing slash (i.e. "foo\bar\") if no filename.
		var pos = path.lastIndexOf("\\");
		if(pos!=-1)
			path = path.substring(0,pos+1);

		//# Walk up the path until we find a folder that exists
		var scan = [path];
		var parent = fso.GetParentFolderName(path);
		while(parent && !fso.FolderExists(parent)) {
			scan.push(parent);
			parent = fso.GetParentFolderName(parent);
		}

		//# Walk back down the path, creating folders
		for(i=scan.length-1;i>=0;i--) {
			if(!fso.FolderExists(scan[i])) {
				fso.CreateFolder(scan[i]);
			}
		}
		return true;
	}

	function ieCopyFile(dest,source) {
		ieCreatePath(dest);
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			fso.GetFile(source).Copy(dest);
		} catch(ex) {
			return false;
		}
		return true;
	}

	function ieSaveFile(filePath,content) {
		// Returns null if it can't do it, false if there's an error, true if it saved OK
		ieCreatePath(filePath);
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
		} catch(ex) {
			//# alert("Exception while attempting to save\n\n" + ex.toString());
			return null;
		}
		var file = fso.OpenTextFile(filePath,2,-1,0);
		file.Write(content);
		file.Close();
		return true;
	}

	function mozillaSaveFile(filePath,content) {
		// Returns null if it can't do it, false if there's an error, true if it saved OK
		if(window.Components) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(filePath);
				if(!file.exists())
					file.create(0,0664);
				var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				out.init(file,0x22,4,null);
				var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
				converter.init(out, "UTF-8", 0, 0);
				converter.writeString(content);
				converter.close();
				out.close();
				return true;
			} catch(ex) {
				alert("Exception while attempting to save\n\n" + ex);
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

	function javaSaveFile(filePath,content) {
		try {
			if(document.applets["TiddlySaver"])
				return document.applets["TiddlySaver"].saveFile(javaUrlToFilename(filePath),"UTF-8",content);
		} catch(ex) {
		}
		try {
			var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
			s.print(content);
			s.close();
		} catch(ex) {
			return null;
		}
		return true;
	}

})(jQuery);
