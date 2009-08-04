//--
//-- Deprecated Filesystem code
//-- Use the jQuery.file functions directly instead
//--

function saveFile(filePath,content)
{
	return jQuery.twFile.save(filePath,content);
}

function loadFile(filePath)
{
	return jQuery.twFile.load(filePath);
}

function copyFile(dest,source)
{
	return jQuery.twFile.copy(dest,source);
}

