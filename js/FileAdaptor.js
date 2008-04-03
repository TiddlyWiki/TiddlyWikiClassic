//--
//-- Server adaptor for talking to static TiddlyWiki files
//--

function FileAdaptor()
{
	this.host = null;
	this.store = null;
	return this;
}

FileAdaptor.serverType = 'file';
FileAdaptor.serverLabel = 'TiddlyWiki';

FileAdaptor.prototype.setContext = function(context,userParams,callback)
{
	if(!context) context = {};
	context.userParams = userParams;
	if(callback) context.callback = callback;
	context.adaptor = this;
	if(!context.host)
		context.host = this.host;
	context.host = FileAdaptor.fullHostName(context.host);
	if(!context.workspace)
		context.workspace = this.workspace;
	return context;
};

FileAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	return host;
};

FileAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

// Open the specified host
//#   host - url of host (eg, "http://www.tiddlywiki.com/" or "www.tiddlywiki.com")
//#   context is itself passed on as a parameter to the callback function
//#   userParams - user settable object object that is passed on unchanged to the callback function
//#   callback - optional function to be called on completion
//# Return value is true if the request was successfully issued, false if this connector doesn't support openHost(),
//#   or an error description string if there was a problem
//# The callback parameters are callback(context)
//#   context.status - true if OK, string if error
//#   context.adaptor - reference to this adaptor object
//#   userParams - parameters as originally passed into the openHost function
FileAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = host;
	context = this.setContext(context,userParams,callback);
	context.status = true;
	if(callback)
		window.setTimeout(function() {context.callback(context,userParams);},10);
	return true;
};

FileAdaptor.loadTiddlyWikiCallback = function(status,context,responseText,url,xhr)
{
	context.status = status;
	if(!status) {
		context.statusText = "Error reading file: " + xhr.statusText;
	} else {
		//# Load the content into a TiddlyWiki() object
		context.adaptor.store = new TiddlyWiki();
		if(!context.adaptor.store.importTiddlyWiki(responseText))
			context.statusText = config.messages.invalidFileError.format([url]);
	}
	context.complete(context,context.userParams);
};

// Get the list of workspaces on a given server
//#   context - passed on as a parameter to the callback function
//#   userParams - user settable object object that is passed on unchanged to the callback function
//#   callback - function to be called on completion
//# Return value is true if the request was successfully issued, false if this connector doesn't support getWorkspaceList(),
//#   or an error description string if there was a problem
//# The callback parameters are callback(context,userParams)
//#   context.status - true if OK, false if error
//#   context.statusText - error message if there was an error
//#   context.adaptor - reference to this adaptor object
//#   userParams - parameters as originally passed into the getWorkspaceList function
FileAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.workspaces = [{title:"(default)"}];
	context.status = true;
	if(callback)
		window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

// Open the specified workspace
//#   workspace - name of workspace to open
//#   context - passed on as a parameter to the callback function
//#   userParams - user settable object object that is passed on unchanged to the callback function
//#   callback - function to be called on completion
//# Return value is true if the request was successfully issued
//#   or an error description string if there was a problem
//# The callback parameters are callback(context,userParams)
//#   context.status - true if OK, false if error
//#   context.statusText - error message if there was an error
//#   context.adaptor - reference to this adaptor object
//#   userParams - parameters as originally passed into the openWorkspace function
FileAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	context.status = true;
	if(callback)
		window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

// Gets the list of tiddlers within a given workspace
//#   context - passed on as a parameter to the callback function
//#   userParams - user settable object object that is passed on unchanged to the callback function
//#   callback - function to be called on completion
//#   filter - filter expression
//# Return value is true if the request was successfully issued,
//#   or an error description string if there was a problem
//# The callback parameters are callback(context,userParams)
//#   context.status - true if OK, false if error
//#   context.statusText - error message if there was an error
//#   context.adaptor - reference to this adaptor object
//#   context.tiddlers - array of tiddler objects
//#   userParams - parameters as originally passed into the getTiddlerList function
FileAdaptor.prototype.getTiddlerList = function(context,userParams,callback,filter)
{
	context = this.setContext(context,userParams,callback);
	if(!context.filter)
		context.filter = filter;
	context.complete = FileAdaptor.getTiddlerListComplete;
	if(this.store) {
		var ret = context.complete(context,context.userParams);
	} else {
		ret = loadRemoteFile(context.host,FileAdaptor.loadTiddlyWikiCallback,context);
		if(typeof ret != "string")
			ret = true;
	}
	return ret;
};

FileAdaptor.getTiddlerListComplete = function(context,userParams)
{
	if(context.filter) {
		context.tiddlers = context.adaptor.store.filterTiddlers(context.filter);
	} else {
		context.tiddlers = [];
		context.adaptor.store.forEachTiddler(function(title,tiddler) {context.tiddlers.push(tiddler);});
	}
	for(var i=0; i<context.tiddlers.length; i++) {
		context.tiddlers[i].fields['server.type'] = FileAdaptor.serverType;
		context.tiddlers[i].fields['server.host'] = FileAdaptor.minHostName(context.host);
		context.tiddlers[i].fields['server.page.revision'] = context.tiddlers[i].modified.convertToYYYYMMDDHHMM();
	}
	context.status = true;
	if(context.callback) {
		window.setTimeout(function() {context.callback(context,userParams);},10);
	}
	return true;
};

FileAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	info.uri = tiddler.fields['server.host'] + "#" + tiddler.title;
	return info;
};

// Retrieve a tiddler from a given workspace on a given server
//#   title - title of the tiddler to get
//#   context - passed on as a parameter to the callback function
//#   userParams - user settable object object that is passed on unchanged to the callback function
//#   callback - function to be called on completion
//# Return value is true if the request was successfully issued,
//#   or an error description string if there was a problem
//# The callback parameters are callback(context,userParams)
//#   context.status - true if OK, false if error
//#   context.statusText - error message if there was an error
//#   context.adaptor - reference to this adaptor object
//#   context.tiddler - the retrieved tiddler, or null if it cannot be found
//#   userParams - parameters as originally passed into the getTiddler function
FileAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	context.complete = FileAdaptor.getTiddlerComplete;
	return context.adaptor.store ? 
		context.complete(context,context.userParams) :
		loadRemoteFile(context.host,FileAdaptor.loadTiddlyWikiCallback,context);
};

FileAdaptor.getTiddlerComplete = function(context,userParams)
{
	var t = context.adaptor.store.fetchTiddler(context.title);
	t.fields['server.type'] = FileAdaptor.serverType;
	t.fields['server.host'] = FileAdaptor.minHostName(context.host);
	t.fields['server.page.revision'] = t.modified.convertToYYYYMMDDHHMM();
	context.tiddler = t;
	context.status = true;
	if(context.allowSynchronous) {
		context.isSynchronous = true;
		context.callback(context,userParams);
	} else {
		window.setTimeout(function() {context.callback(context,userParams);},10);
	}
	return true;
};

FileAdaptor.prototype.close = function()
{
	delete this.store;
	this.store = null;
};

config.adaptors[FileAdaptor.serverType] = FileAdaptor;

config.defaultAdaptor = FileAdaptor.serverType;
