//--
//-- Deprecated HTTP request code
//-- Use the jQuery ajax functions directly instead
//--

//# Load a file over http
//#   url - the source url
//#   callback - function to call when there is a response
//#   params - parameter object that gets passed to the callback for storing it's state
//# Return value is the underlying XMLHttpRequest object, or a string if there was an error
//# Callback function is called like this:
//#   callback(status,params,responseText,xhr)
//#     status - true if OK, false if error
//#     params - the parameter object provided to loadRemoteFile()
//#     responseText - the text of the file
//#     xhr - the underlying XMLHttpRequest object
function loadRemoteFile(url,callback,params)
{
	return httpReq("GET",url,callback,params);
}

function doHttp(type,url,data,contentType,username,password,callback,params,headers,allowCache)
{
	return httpReq(type,url,callback,params,headers,data,contentType,username,password,allowCache);
}

//# Perform an http request
//#   type - GET/POST/PUT/DELETE
//#   url - the source url
//#   data - optional data for POST and PUT
//#   contentType - optionalContent type for the data (defaults to application/x-www-form-urlencoded)
//#   username - optional username for basic authentication
//#   password - optional password for basic authentication
//#   callback - function to call when there is a response
//#   params - parameter object that gets passed to the callback for storing it's state
//#   headers - optional hashmap of additional headers
//#   allowCache - unless true, adds a "nocache=" parameter to the URL
//# Return value is the underlying XMLHttpRequest object, or a string if there was an error
//# Callback function is called like this:
//#   callback(status,params,responseText,url,xhr)
//#     status - true if OK, false if error
//#     params - the parameter object provided to loadRemoteFile()
//#     responseText - the text of the file
//#     url - requested URL
//#     xhr - the underlying XMLHttpRequest object
function httpReq(type,url,callback,params,headers,data,contentType,username,password,allowCache)
{
	var options = {
		type:type,
		url:url,
		processData:false,
		data:data,
		cache:!!allowCache,
		beforeSend: function(xhr) {
			for(var i in headers)
				xhr.setRequestHeader(i,headers[i]);
			xhr.setRequestHeader("X-Requested-With", "TiddlyWiki " + formatVersion());
		}
	};

	if(callback) {
		options.complete = function(xhr,textStatus) {
			if(jQuery.httpSuccess(xhr))
				callback(true,params,xhr.responseText,url,xhr);
			else
				callback(false,params,null,url,xhr);
		};
	}
	if(contentType)
		options.contentType = contentType;
	if(username)
		options.username = username;
	if(password)
		options.password = password;
	if(window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1)
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	jQuery.ajax(options);
}

