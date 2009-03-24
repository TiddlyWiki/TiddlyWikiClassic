//--
//-- HTTP request code
//--

//# Perform an http request using the jQuery ajax function
function ajaxReq(args)
{
	if(window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1)
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	return jQuery.ajax(args);
}


