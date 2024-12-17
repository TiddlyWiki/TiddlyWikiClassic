//--
//-- Saving
//--

var startSaveArea = '<div id="' + 'storeArea">'; // Split up into two so that indexOf() of this source doesn't find it
var startSaveAreaRE = /<((div)|(DIV)) ((id)|(ID))=["']?storeArea['"]?>/; // Used for IE6
var endSaveArea = '</d' + 'iv>';
var endSaveAreaCaps = '</D' + 'IV>';

// If there are unsaved changes, force the user to confirm before exitting
function confirmExit() {
	hadConfirmExit = true;
	var hasDirtyStore = store && store.isDirty && store.isDirty();
	var hasDirtyStory = story && story.areAnyDirty && story.areAnyDirty();
	if(hasDirtyStore || hasDirtyStory) return config.messages.confirmExit;
}

// Give the user a chance to save changes before exitting
function checkUnsavedChanges() {
	if(!(store && store.isDirty && store.isDirty()) || window.hadConfirmExit !== false) return;
	if(confirm(config.messages.unsavedChangesWarning)) saveChanges();
}

function updateLanguageAttribute(s) {
	if(!config.locale) return s;
	var m = /(<html(?:.*?)?)(?: xml:lang\="([a-z]+)")?(?: lang\="([a-z]+)")?>/.exec(s);
	if(!m) return s;

	var htmlTag = m[1];
	if(m[2]) htmlTag += ' xml:lang="' + config.locale + '"';
	if(m[3]) htmlTag += ' lang="' + config.locale + '"';
	htmlTag += ">";

	return s.substr(0, m.index) + htmlTag + s.substr(m.index + m[0].length);
}

function updateMarkupBlock(s, blockName, tiddlerName) {
	return tw.textUtils.replaceChunk(s,
		"<!--%0-START-->".format([blockName]),
		"<!--%0-END-->".format([blockName]),
		"\n" + store.getRecursiveTiddlerText(tiddlerName, "") + "\n");
}

function updateOriginal(original, posDiv, localPath) {
	if(!posDiv) posDiv = locateStoreArea(original);
	if(!posDiv) {
		alert(config.messages.invalidFileError.format([localPath]));
		return null;
	}
	var revised = original.substr(0, posDiv[0] + startSaveArea.length) + "\n" +
		store.allTiddlersAsHtml() + "\n" +
		original.substr(posDiv[1]);
	var newSiteTitle = getPageTitle().htmlEncode();
	revised = tw.textUtils.replaceChunk(revised, "<title" + ">", "</title" + ">", " " + newSiteTitle + " ");
	revised = updateLanguageAttribute(revised);
	revised = updateMarkupBlock(revised, "PRE-HEAD", "MarkupPreHead");
	revised = updateMarkupBlock(revised, "POST-HEAD", "MarkupPostHead");
	revised = updateMarkupBlock(revised, "PRE-BODY", "MarkupPreBody");
	revised = updateMarkupBlock(revised, "POST-SCRIPT", "MarkupPostBody");
	return revised;
}

function locateStoreArea(original) {
	// Locate the storeArea divs
	if(!original) return null;
	var posOpeningDiv = original.search(startSaveAreaRE);
	var limitClosingDiv = original.indexOf("<" + "!--POST-STOREAREA--" + ">");
	if(limitClosingDiv == -1)
		limitClosingDiv = original.indexOf("<" + "!--POST-BODY-START--" + ">");
	var start = limitClosingDiv == -1 ? original.length : limitClosingDiv;
	var posClosingDiv = original.lastIndexOf(endSaveArea, start);
	if(posClosingDiv == -1)
		posClosingDiv = original.lastIndexOf(endSaveAreaCaps, start);
	return (posOpeningDiv != -1 && posClosingDiv != -1) ? [posOpeningDiv, posClosingDiv] : null;
}

function autoSaveChanges(onlyIfDirty, tiddlers) {
	if(config.options.chkAutoSave)
		saveChanges(onlyIfDirty, tiddlers);
}

// get the full HTML of the original file
function loadOriginal(localPath, callback) {
	if(!callback) return loadFile(localPath) || window.originalHTML || recreateOriginal();

	tw.io.loadFile(localPath, function(result, details) {
		if(typeof result == 'string') {
			callback(result, details);
		} else {
			var original = window.originalHTML || recreateOriginal();
			callback(original);
		}
	});
}

// reconstruct original HTML file content from current document memory
function recreateOriginal() {
	// construct doctype
	var content = "<!DOCTYPE ";
	var t = document.doctype;
	if (!t)
		content += "html";
	else {
		content += t.name;
		if(t.publicId)
			content += ' PUBLIC "' + t.publicId + '"';
		else if(t.systemId)
			content += ' SYSTEM "' + t.systemId + '"';
	}
	content += ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"';
	content += '>\n';

	// append current document content
	content += document.documentElement.outerHTML;

	// clear 'savetest' marker
	content = content.replace(/<div id="saveTest">savetest<\/div>/, '<div id="saveTest"></div>');
	//# clear <applet> following </script>
	content = content.replace(/script><applet [^\>]*><\/applet>/g, 'script>');
	// newline before head tag
	content = content.replace(/><head>/, '>\n<head>');
	// newlines before/after end of body/html tags
	content = content.replace(/\n\n<\/body><\/html>$/, '</' + 'body>\n</' + 'html>\n'); // #170
	// meta tag terminators
	content = content.replace(/(<(meta) [^\>]*[^\/])>/g, '$1 />');
	// decode LT/GT entities in noscript
	content = content.replace(/<noscript>[^\<]*<\/noscript>/,
		function(m) { return m.replace(/&lt;/g, '<').replace(/&gt;/g, '>') });
	// encode copyright symbols (UTF-8 to HTML entity)
	content = content.replace(/<div id="copyright">[^\<]*<\/div>/,
		function(m) { return m.replace(/\xA9/g, '&copy;') });

	return content;
}

// reconstruct the local path to TW itself
tw.io.getOriginalLocalPath = function() {
	return getLocalPath(document.location.toString());
};

// Save tiddlywiki (but not backup or anything else)
tw.io.knownSaveMainFailures = {
	failedToLoadOriginal: 1,
	invalidFile: 2
};

// Save this tiddlywiki with the pending changes
tw.io.saveMainAndReport = function(callback) {
	var localPath = tw.io.getOriginalLocalPath();
	var onLoadOriginal = function(original) {
		var msg = config.messages;
		if(original == null) {
			alert(msg.cantSaveError);
			if(store.tiddlerExists(msg.saveInstructions))
				story.displayTiddler(null, msg.saveInstructions);

			return callback(false, {
				reason: tw.io.knownSaveMainFailures.failedToLoadOriginal
			});
		}

		var posDiv = locateStoreArea(original);
		if(!posDiv) {
			alert(msg.invalidFileError.format([localPath]));

			return callback(false, {
				reason: tw.io.knownSaveMainFailures.invalidFile
			});
		}

		config.saveByDownload = false;
		config.saveByManualDownload = false;
		// chkPreventAsyncSaving is checked inside saveMain
		saveMain(localPath, original, posDiv, callback);
	};

	if(!config.options.chkPreventAsyncSaving) {
		loadOriginal(localPath, onLoadOriginal);
	} else {
		// useful when loadOriginal is overwritten without support of callback
		// or when an extension relies saveChanges being a sync function
		var original = loadOriginal(localPath);
		onLoadOriginal(original);
	}
};

function saveChanges(onlyIfDirty, tiddlers) {
	if(onlyIfDirty && !store.isDirty()) return;

	clearMessage();
	var t0 = new Date();
	var msg = config.messages;
	if(!window.allowSave()) {
		alert(msg.notFileUrlError);
		if(store.tiddlerExists(msg.saveInstructions))
			story.displayTiddler(null, msg.saveInstructions);
		return;
	}

	tw.io.saveMainAndReport(function postSave(savedOrPending, details) {
		var co = config.options;
		if (!config.saveByDownload && !config.saveByManualDownload && details && details.original) {
			var localPath = tw.io.getOriginalLocalPath();
			if(co.chkSaveBackups) saveBackup(localPath, details.original);
			if(co.chkSaveEmptyTemplate) saveEmpty(localPath, details.original);
			if(co.chkGenerateAnRssFeed) saveRss(localPath);
		}

		if(co.chkDisplayInstrumentation)
			displayMessage("saveChanges " + (new Date() - t0) + " ms");
	});
}

function saveMain(localPath, original, posDiv, callback) {
	var reportStatusAndHandle = function(successOrPending, localPath, revised) {
		if(successOrPending) {
			//# TODO: if possible, separate the success and pending cases
			tw.io.onSaveMainSuccess(config.saveByDownload ?
				getDataURI(revised) : "file://" + localPath, revised, original);
		} else {
			tw.io.onSaveMainFail();
		}
	};
	try {
		var revised = updateOriginal(original, posDiv, localPath);

		if(!callback || config.options.chkPreventAsyncSaving) {
			var savedOrPending = tw.io.saveFile(localPath, revised);
			reportStatusAndHandle(savedOrPending, localPath, revised);
			if(callback) callback(savedOrPending, {
				original: original
			});
		} else tw.io.saveFile(localPath, revised, function(success, details) {
			reportStatusAndHandle(success, localPath, revised);
			details.original = original;
			callback(success, details);
		});
	} catch (ex) {
		tw.io.onSaveMainFail(ex);
		if(callback) callback(false, { original: original });
	}
}

//# savedHtml, original are passed for additional hackability
//# in fact, this is "on save main success or pending"
tw.io.onSaveMainSuccess = function(urlSaved, savedHtml, original) {
	if (!config.saveByManualDownload) {
		displayMessage(
			// set by HTML5DownloadSaveFile()
			config.saveByDownload ?
				config.messages.mainDownload :
				config.messages.mainSaved,
			urlSaved);
	}

	store.setDirty(false);
};

tw.io.onSaveMainFail = function(catchedExeption) {
	alert(config.messages.mainFailed);
	if(catchedExeption) showException(catchedExeption);
};

function saveBackup(localPath, original) {
	var backupPath = getBackupPath(localPath);
	var backupSuccess = copyFile(backupPath, localPath) || saveFile(backupPath, original);
	if(backupSuccess)
		displayMessage(config.messages.backupSaved, "file://" + backupPath);
	else
		alert(config.messages.backupFailed);
}

function saveEmpty(localPath, original, posDiv) {
	posDiv = posDiv || locateStoreArea(original);
	if(!posDiv) {
		alert(config.messages.emptyFailed);
		return;
	}

	var emptyPath, slashPosition;
	if((slashPosition = localPath.lastIndexOf("/")) != -1)
		emptyPath = localPath.substr(0, slashPosition) + "/";
	else if((slashPosition = localPath.lastIndexOf("\\")) != -1)
		emptyPath = localPath.substr(0, slashPosition) + "\\";
	else
		emptyPath = localPath + ".";
	emptyPath += "empty.html";

	var empty = original.substr(0, posDiv[0] + startSaveArea.length) + original.substr(posDiv[1]);
	var emptySave = saveFile(emptyPath, empty);
	if(emptySave)
		displayMessage(config.messages.emptySaved, "file://" + emptyPath);
	else
		alert(config.messages.emptyFailed);
}

// Translate URL to local path [Preemption]
window.getLocalPath = window.getLocalPath || function(origPath) {
	var originalPath = convertUriToUTF8(origPath, config.options.txtFileSystemCharSet);
	// Remove any location or query part of the URL
	var argPos = originalPath.indexOf("?");
	if(argPos != -1)
		originalPath = originalPath.substr(0, argPos);
	var hashPos = originalPath.indexOf("#");
	if(hashPos != -1)
		originalPath = originalPath.substr(0, hashPos);
	// Convert file://localhost/ to file:///
	if(originalPath.indexOf("file://localhost/") == 0)
		originalPath = "file://" + originalPath.substr(16);
	// Convert to a native file format
	// "file:///x:/path/path/path..." - pc local file --> "x:\path\path\path..."
	// "file://///server/share/path/path/path..." - FireFox pc network file --> "\\server\share\path\path\path..."
	// "file:///path/path/path..." - mac/unix local file --> "/path/path/path..."
	// "file://server/share/path/path/path..." - pc network file --> "\\server\share\path\path\path..."
	var localPath;
	if(originalPath.charAt(9) == ":") // pc local file
		localPath = unescape(originalPath.substr(8)).replace(new RegExp("/", "g"), "\\");
	else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
		localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/", "g"), "\\");
	else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(7));
	else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(5));
	else // pc network file
		localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/", "g"), "\\");
	return localPath;
};

function getBackupPath(localPath, filenameSuffix, extension) {
	var slash = "\\";
	var dirPathPos = localPath.lastIndexOf("\\");
	if(dirPathPos == -1) {
		dirPathPos = localPath.lastIndexOf("/");
		slash = "/";
	}
	var backupFolder = config.options.txtBackupFolder || ".";
	var backupPath = localPath.substring(0, dirPathPos) + slash + backupFolder + localPath.substring(dirPathPos);
	backupPath = backupPath.substring(0, backupPath.lastIndexOf(".")) + ".";
	if(filenameSuffix) {
		var illegalFilenameCharacterOrSpaceRE = /[\\\/\*\?\":<> ]/g;
		backupPath += filenameSuffix.replace(illegalFilenameCharacterOrSpaceRE, "_") + ".";
	}
	backupPath += (new Date()).convertToYYYYMMDDHHMMSSMMM() + "." + (extension || "html");
	return backupPath;
}

