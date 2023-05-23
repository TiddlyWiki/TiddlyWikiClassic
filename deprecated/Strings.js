//--
//-- Deprecated String functions
//--

// @Deprecated: no direct replacement, since not used in core code
String.prototype.toJSONString = function()
{
	// Convert a string to it's JSON representation by encoding control characters, double quotes and backslash. See json.org
	var m = {
		'\b': '\\b',
		'\f': '\\f',
		'\n': '\\n',
		'\r': '\\r',
		'\t': '\\t',
		'"':  '\\"',
		'\\': '\\\\'
	};
	var replaceFn = function(a, b) {
		var c = m[b];
		if(c)
			return c;
		c = b.charCodeAt();
		return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
	};
	if(/["\\\x00-\x1f]/.test(this))
		return '"' + this.replace(/([\x00-\x1f\\"])/g, replaceFn) + '"';
	return '"' + this + '"';
};

// @Deprecated: no direct replacement, since not used in core code
String.prototype.right = function(n)
{
	return n < this.length ? this.slice(this.length - n) : this;
};

// @Deprecated: no direct replacement, since not used in core code (see unDash in inlineCssHelper)
// Convert a string from a CSS style property name to a JavaScript style name ("background-color" -> "backgroundColor")
String.prototype.unDash = function()
{
	var i, words = this.split("-");
	for(i = 1; i < words.length; i++)
		words[i] = words[i].substring(0, 1).toUpperCase() + words[i].substring(1);
	return words.join("");
};

// @Deprecated: use tw.textUtils.getChunkRange instead
String.prototype.getChunkRange = function(startMarker, endMarker)
{
	return tw.textUtils.getChunkRange(this, startMarker, endMarker);
};

// @Deprecated: no direct replacement, since not used in core code
// Get a chunk of a string between startMarker and endMarker, or undefined
String.prototype.getChunk = function(startMarker, endMarker)
{
	var r = tw.textUtils.getChunkRange(this, startMarker, endMarker);
	if(r) return this.substring(r[0], r[1]);
};

// @Deprecated: use tw.textUtils.replaceChunk instead
String.prototype.replaceChunk = function(startMarker, endMarker, newValue)
{
	return tw.textUtils.replaceChunk(this, startMarker, endMarker, newValue);
};

