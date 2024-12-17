//--
//-- HTTP request code
//--

// Perform an http request using the jQuery ajax function
// fallback to privileged file I/O or HTML5 FileReader
function ajaxReq(args) {
	if (args.file || args.url.startsWith("file"))  // LOCAL FILE
		return localAjax(args);
	return jQuery.ajax(args);
}

// perform local I/O and FAKE a minimal XHR response object
function localAjax(args) {
	var success = function(data) {
		args.success(data, "success", { responseText: data });
	};
	var failure = function(who) {
		args.error({ message: who + ": cannot read local file" }, "error", 0);
	};

	if (args.file) try { // HTML5 FileReader (Chrome, FF20+, Safari, etc.)
		var reader = new FileReader();
		reader.onload = function(e)  { success(e.target.result) };
		reader.onerror = function(e) { failure("FileReader") };
		reader.readAsText(args.file);
		return true;
	} catch (ex) { ; }

	// local file I/O (IE, FF with security.fileuri.strict_origin_policy:false, etc.)
	try {
		var data = loadFile(getLocalPath(args.url));
		if (data) success(data);
		else failure("loadFile");
		return true;
	} catch (ex) { ; }

	return true;
}

// Perform an http request
//   type - GET/POST/PUT/DELETE
//   url - the source url
//   data - optional data for POST and PUT
//   contentType - optionalContent type for the data (defaults to application/x-www-form-urlencoded)
//   username - optional username for basic authentication
//   password - optional password for basic authentication
//   callback - function to call when there is a response
//   params - parameter object that gets passed to the callback for storing it's state
//   headers - optional hashmap of additional headers
//   allowCache - unless true, adds a "nocache=" parameter to the URL
// Return value is the underlying XMLHttpRequest object, or a string if there was an error
// Callback function is called like this:
//   callback(status, params, responseText, url, xhr)
//     status - true if OK, false if error
//     params - the parameter object provided to loadRemoteFile()
//     responseText - the text of the file
//     url - requested URL
//     xhr - the underlying XMLHttpRequest object
function httpReq(type, url, callback, params, headers, data, contentType, username, password, allowCache) {
	var httpSuccess = function(xhr) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return (!xhr.status && location.protocol === "file:") ||
				(xhr.status >= 200 && xhr.status < 300) ||
				xhr.status === 304 || xhr.status === 1223;
		} catch(e) {}
		return false;
	};

	var options = {
		type: type,
		url: url,
		processData: false,
		data: data,
		cache: !!allowCache,
		beforeSend: function(xhr) {
			for(var i in headers)
				xhr.setRequestHeader(i, headers[i]);
		}
	};

	if(callback) {
		options.complete = function(xhr, textStatus) {
			if(httpSuccess(xhr))
				callback(true, params, xhr.responseText, url, xhr);
			else
				callback(false, params, null, url, xhr);
		};
	}
	if(contentType)
		options.contentType = contentType;
	if(username)
		options.username = username;
	if(password)
		options.password = password;
	try {
		if(window.Components && window.netscape && window.netscape.security
		   && document.location.protocol.indexOf("http") == -1)
			window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	} catch (ex) {
		//# showException(ex); // SUPPRESS MESSAGE DISPLAY
	}
	return jQuery.ajax(options);
}
