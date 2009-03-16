//--
//-- Deprecated Filesystem code
//-- Use the jQuery.file functions directly instead
//--

function saveFile(filePath,content)
{
	return jQuery.file.save(filePath,content);
}

function loadFile(filePath)
{
	return jQuery.file.load(filePath);
}

function copyFile(dest,source)
{
	return jQuery.file.copy(dest,source);
}

