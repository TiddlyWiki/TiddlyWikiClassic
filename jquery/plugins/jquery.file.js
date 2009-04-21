/*
jquery.file.js

jQuery plugin for loading a file and saving data to a file

Copyright (c) UnaMesa Association 2009

Dual licensed under the MIT and GPL licenses:
  http://www.opensource.org/licenses/mit-license.php
  http://www.gnu.org/licenses/gpl.html
*/

(function($) {
	if(!$.file) {
		$.file = {};
	}

	$.extend($.file,{
		currentDriver: null,
		driverList: ["activeX", "mozilla", "tiddlySaver", "javaLiveConnect"],
		
		getDriver: function() {
			if(this.currentDriver === null) {
				for(var t=0; t<this.driverList.length; t++) {
					if(this.currentDriver === null && drivers[this.driverList[t]].isAvailable && drivers[this.driverList[t]].isAvailable())
						this.currentDriver = drivers[this.driverList[t]];
				}
			}
			return this.currentDriver;
		},
		load: function(filePath) {
			return this.getDriver().loadFile(filePath);
		},
		save: function(filePath,content) {
			return this.getDriver().saveFile(filePath,content);
		},
		copy: function(dest,source) {
			if(this.getDriver().copyFile)
				return this.currentDriver.copyFile(dest,source);
			else
				return false;
		}
	});

	// Private implementations for each browser
	
	var drivers = {};
	
	drivers.activeX = {
		name: "activeX",
		isAvailable: function() {
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
			} catch(ex) {
				return false;
			}
			return true;
		},
		loadFile: function(filePath) {
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
		},
		createPath: function(path) {
			//# Remove the filename, if present. Use trailing slash (i.e. "foo\bar\") if no filename.
			var pos = path.lastIndexOf("\\");
			if(pos!=-1)
				path = path.substring(0,pos+1);
			//# Walk up the path until we find a folder that exists
			var scan = [path];
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
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
			} catch(ex) {
			}
			return false;
		},
		copyFile: function(dest,source) {
			drivers.activeX.createPath(dest);
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				fso.GetFile(source).Copy(dest);
			} catch(ex) {
				return false;
			}
			return true;
		},
		saveFile: function(filePath,content) {
			// Returns null if it can't do it, false if there's an error, true if it saved OK
			drivers.activeX.createPath(filePath);
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var file = fso.OpenTextFile(filePath,2,-1,0);
				file.Write(content);
				file.Close();
			} catch (ex) {
				return null;
			}
			return true;
		}
	};

	drivers.mozilla = {
		name: "mozilla",
		isAvailable: function() {
			return !!window.Components;
		},
		loadFile: function(filePath) {
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
					var buffer = {};
					var result = [];
					while(converter.readString(-1,buffer) != 0) {
						result.push(buffer.value);
					}
					converter.close();
					inputStream.close();
					return result.join("");
				} catch(ex) {
					//# alert("Exception while attempting to load\n\n" + ex);
					return false;
				}
			}
			return null;
		},
		saveFile: function(filePath,content) {
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
	};
	
	$(function() {
		drivers.tiddlySaver.loadApplet();
	});

	drivers.tiddlySaver = {
		name: "tiddlySaver",
		loadApplet: function() {
			if(!document.applets["TiddlySaver"] && !$.browser.mozilla && !$.browser.msie) {
				$(document.body).append("<applet style='position:absolute;left:-1px' name='TiddlySaver' code='TiddlySaver.class' archive='TiddlySaver.jar' width='1'height='1'></applet>");
			}
		},
		isAvailable: function() {
			return !!document.applets["TiddlySaver"];
		},
		loadFile: function(filePath) {
			var r;
			try {
				if(document.applets["TiddlySaver"]) {
					r = document.applets["TiddlySaver"].loadFile(javaUrlToFilename(filePath),"UTF-8");
					return (r === undefined || r === null) ? null : String(r);
				}
			} catch(ex) {
			}
			return null;
		},
		saveFile: function(filePath,content) {
			try {
				if(document.applets["TiddlySaver"])
					return document.applets["TiddlySaver"].saveFile(javaUrlToFilename(filePath),"UTF-8",content);
			} catch(ex) {
			}
			return null;
		}
	}

	drivers.javaLiveConnect = {
		name: "javaLiveConnect",
		isAvailable: function() {
			return !!window.java && !!window.java.io && !!window.java.io.FileReader;
		},
		loadFile: function(filePath) {
			var r;
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
			return content.join("\n") + "\n";
		},
		saveFile: function(filePath,content) {
			try {
				var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
				s.print(content);
				s.close();
			} catch(ex) {
				return null;
			}
			return true;
		}
	}

	function javaUrlToFilename(url) {
		var f = "//localhost";
		if(url.indexOf(f) == 0)
			return url.substring(f.length);
		var i = url.indexOf(":");
		return i > 0 ? url.substring(i-1) : url;
	}

})(jQuery);
