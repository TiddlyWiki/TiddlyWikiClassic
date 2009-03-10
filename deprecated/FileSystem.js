//--
//-- Deprecated Filesystem code
//-- Use the jQuery.file functions directly instead
//--

function saveFile(fileUrl,content)
{
	return jQuery.file.save({fileUrl:fileUrl,content:content});
}

function loadFile(fileUrl)
{
	return jQuery.file.load({fileUrl:fileUrl});
}

function copyFile(dest,source)
{
	return jQuery.file.copy(dest,source);
}

