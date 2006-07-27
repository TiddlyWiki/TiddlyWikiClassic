// ---------------------------------------------------------------------------------
// Remote HTTP requests
// ---------------------------------------------------------------------------------

// Load a file over http
//   url - the source url
//   callback - function to call when there's a response
//   params - parameter object that gets passed to the callback for storing it's state
// Return value is the underlying XMLHttpRequest object, or 'null' if there was an error
// Callback function is called like this:
//   callback(status,params,responseText,xhr)
//     status - true if OK, false if error
//     params - the parameter object provided to loadRemoteFile()
//     responseText - the text of the file
//     xhr - the underlying XMLHttpRequest object
function loadRemoteFile(url,callback,params)
{
	// Get an xhr object
	var x;
	try
		{
		x = new XMLHttpRequest(); // Modern
		}
	catch(e)
		{
		try
			{
			x = new ActiveXObject("Msxml2.XMLHTTP"); // IE 6
			}
		catch (e)
			{
			return null;
			}
		}
	// Install callback
	x.onreadystatechange = function()
		{
		if (x.readyState == 4)
			{
			if ((x.status == 0 || x.status == 200) && callback)
				{
				callback(true,params,x.responseText,url,x);
			}
			else
				callback(false,params,null,url,x);
			}
		}
	// Send request
	if(window.netscape && window.netscape.security)
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	try
		{
		url = url + (url.indexOf("?") < 0 ? "?" : "&") + "nocache=" + Math.random();
		x.open("GET",url,true);
		if (x.overrideMimeType)
			x.overrideMimeType("text/html");
		x.send(null);
		}
	catch (e)
		{
		alert("Error in send " + e);
		return null;
		}
	return x;
}
