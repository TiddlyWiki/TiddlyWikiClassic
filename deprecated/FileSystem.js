//--
//-- Deprecated Filesystem code
//-- Use the jQuery.file functions directly instead
//--

function saveFile(filePath,content)
{
	return jq.file.save(filePath,content);
}

function loadFile(filePath)
{
	return jq.file.load(filePath);
}

function copyFile(dest,source)
{
	return jq.file.copy(dest,source);
}

