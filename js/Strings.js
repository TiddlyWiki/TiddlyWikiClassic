//--
//-- Augmented methods for the JavaScript String() object
//--

// todo: create functions substituting String augmenting methods, use in the core; deprecate all String augmenting methods

// Trim whitespace from both ends of a string
String.prototype.trim = function()
{
	return this.replace(/^\s*|\s*$/g, "");
};

// Convert a string from a CSS style property name to a JavaScript style name ("background-color" -> "backgroundColor")
String.prototype.unDash = function()
{
	var i, words = this.split("-");
	for(i = 1; i < words.length; i++)
		words[i] = words[i].substring(0, 1).toUpperCase() + words[i].substring(1);
	return words.join("");
};

// Substitute substrings from an array into a format string that includes '%1'-type specifiers
String.prototype.format = function(s)
{
	var substrings = s && s.constructor == Array ? s : arguments;
	var subRegExp = /(?:%(\d+))/mg;
	var currPos = 0;
	var match, r = [];
	while(match = subRegExp.exec(this)) {
		if(!match[1]) continue;
		if(match.index > currPos)
			r.push(this.substring(currPos, match.index));
		r.push(substrings[parseInt(match[1], 10)]);
		currPos = subRegExp.lastIndex;
	}
	if(currPos < this.length)
		r.push(this.substring(currPos, this.length));
	return r.join("");
};

// Escape any special RegExp characters with that character preceded by a backslash
String.prototype.escapeRegExp = function()
{
	return this.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, '\\$&'); // #157
};

// Convert "\" to "\s", newlines to "\n" (and remove carriage returns)
String.prototype.escapeLineBreaks = function()
{
	return this.replace(/\\/mg, "\\s").replace(/\n/mg, "\\n").replace(/\r/mg, "");
};

// Convert "\n" to newlines, "\b" to " ", "\s" to "\" (and remove carriage returns)
String.prototype.unescapeLineBreaks = function()
{
	return this.replace(/\\n/mg, "\n").replace(/\\b/mg, " ").replace(/\\s/mg, "\\").replace(/\r/mg, "");
};

// Convert & to "&amp;", < to "&lt;", > to "&gt;" and " to "&quot;"
String.prototype.htmlEncode = function()
{
	return this.replace(/&/mg, "&amp;").replace(/</mg, "&lt;").replace(/>/mg, "&gt;").replace(/\"/mg, "&quot;");
};

// Convert "&amp;" to &, "&lt;" to <, "&gt;" to > and "&quot;" to "
String.prototype.htmlDecode = function()
{
	return this.replace(/&lt;/mg, "<").replace(/&gt;/mg, ">").replace(/&quot;/mg, "\"").replace(/&amp;/mg, "&");
};

// Parse a space-separated string of name:value parameters
//# where:
//#   - the name or the value can be optional (in which case separate defaults are used instead)
//#     - in case of ambiguity, a lone word is taken to be a value
//#     - if 'cascadeDefaults' is set to true, then the defaults are modified by updated by each specified name or value
//#     - name prefixes are not allowed if the 'noNames' parameter is true
//#   - if both the name and value are present they must be separated by a colon
//#   - the name and the value may both be quoted with single- or double-quotes, double-square brackets
//#   - names or values quoted with {{double-curly braces}} are evaluated as a JavaScript expression
//#     - as long as the 'allowEval' parameter is true
// The result is an array of objects:
//   result[0] = object with a member for each parameter name, value of that member being an array of values
//   result[1..n] = one object for each parameter, with 'name' and 'value' members
String.prototype.parseParams = function(defaultName, defaultValue, allowEval, noNames, cascadeDefaults)
{
	var parseToken = function(match, p) {
		var n;
		if(match[p]) // Double quoted
			n = match[p].replace(/\\"/g, '"');
		else if(match[p + 1]) // Single quoted
			n = match[p + 1].replace(/\\'/g, "'");
		else if(match[p + 2]) // Double-square-bracket quoted
			n = match[p + 2];
		else if(match[p + 3]) // Double-brace quoted
			try {
				n = match[p + 3];
				if(allowEval && config.evaluateMacroParameters != "none") {
					if(config.evaluateMacroParameters == "restricted") {
						if(window.restrictedEval) {
							n = window.restrictedEval(n);
						}
					} else {
						n = window.eval(n);
					}
				}
			} catch(ex) {
				throw "Unable to evaluate {{" + match[p + 3] + "}}: " + exceptionText(ex);
			}
		else if(match[p + 4]) // Unquoted
			n = match[p + 4];
		else if(match[p + 5]) // empty quote
			n = "";
		return n;
	};
	var r = [{}];
	var dblQuote = "(?:\"((?:(?:\\\\\")|[^\"])+)\")";
	var sngQuote = "(?:'((?:(?:\\\\\')|[^'])+)')";
	var dblSquare = "(?:\\[\\[((?:\\s|\\S)*?)\\]\\])";
	var dblBrace = "(?:\\{\\{((?:\\s|\\S)*?)\\}\\})";
	var unQuoted = noNames ? "([^\"'\\s]\\S*)" : "([^\"':\\s][^\\s:]*)";
	var emptyQuote = "((?:\"\")|(?:''))";
	var skipSpace = "(?:\\s*)";
	var token = "(?:" + dblQuote + "|" + sngQuote + "|" + dblSquare + "|" + dblBrace + "|" + unQuoted + "|" + emptyQuote + ")";
	var re = noNames ? new RegExp(token, "mg") : new RegExp(skipSpace + token + skipSpace + "(?:(\\:)" + skipSpace + token + ")?", "mg");
	var match;
	while(match = re.exec(this)) {
		var n = parseToken(match, 1);
		if(noNames) {
			r.push({ name: "", value: n });
		} else {
			var v = parseToken(match, 8);
			if(v == null && defaultName) {
				v = n;
				n = defaultName;
			} else if(v == null && defaultValue) {
				v = defaultValue;
			}
			r.push({ name: n, value: v });
			if(cascadeDefaults) {
				defaultName = n;
				defaultValue = v;
			}
		}
	}
	// Summarise parameters into first element
	for(var i = 1; i < r.length; i++) {
		if(r[0][r[i].name])
			r[0][r[i].name].push(r[i].value);
		else
			r[0][r[i].name] = [r[i].value];
	}
	return r;
};

// Process a string list of macro parameters into an array. Parameters can be quoted with "", '',
// [[]], {{ }} or left unquoted (and therefore space-separated). Double-braces {{}} results in
// an *evaluated* parameter: e.g. {{config.options.txtUserName}} results in the current user's name.
String.prototype.readMacroParams = function(notAllowEval)
{
	var p = this.parseParams("list", null, !notAllowEval, true);
	var i, n = [];
	for(i = 1; i < p.length; i++)
		n.push(p[i].value);
	return n;
};

// Process a string list of unique tiddler names into an array. Tiddler names that have spaces in them must be [[bracketed]]
String.prototype.readBracketedList = function(unique)
{
	var p = this.parseParams("list", null, false, true);
	var i, n = [];
	for(i = 1; i < p.length; i++) {
		if(p[i].value)
			n.pushUnique(p[i].value, unique);
	}
	return n;
};

// Returns array with start and end index of chunk between given start and end marker, or undefined.
String.prototype.getChunkRange = function(start,end)
{
	var s = this.indexOf(start);
	if(s != -1) {
		s += start.length;
		var e = this.indexOf(end,s);
		if(e != -1)
			return [s,e];
	}
};

// Replace a chunk of a string given start and end markers
String.prototype.replaceChunk = function(start,end,sub)
{
	var r = this.getChunkRange(start,end);
	return r ? this.substring(0,r[0]) + sub + this.substring(r[1]) : this;
};

// Returns a chunk of a string between start and end markers, or undefined
String.prototype.getChunk = function(start,end)
{
	var r = this.getChunkRange(start,end);
	if(r)
		return this.substring(r[0],r[1]);
};


// Static method to bracket a string with double square brackets if it contains a space
String.encodeTiddlyLink = function(title)
{
	return title.indexOf(" ") == -1 ? title : "[[" + title + "]]";
};

// Static method to encodeTiddlyLink for every item in an array and join them with spaces
String.encodeTiddlyLinkList = function(list)
{
	if(!list) return "";
	var i,results = [];
	for(i=0; i<list.length; i++)
		results.push(String.encodeTiddlyLink(list[i]));
	return results.join(" ");
};

// Convert a string as a sequence of name:"value" pairs into a hashmap
String.prototype.decodeHashMap = function()
{
	var fields = this.parseParams("anon", "", false);
	var i, hashmap = {};
	for(i = 1; i < fields.length; i++)
		hashmap[fields[i].name] = fields[i].value;
	return hashmap;
};

// Static method to encode a hashmap into a name:"value"... string
String.encodeHashMap = function(hashmap)
{
	var name, r = [];
	for(name in hashmap)
		r.push(name + ':"' + hashmap[name] + '"');
	return r.join(" ");
};

// Static method to left-pad a string with 0s to a certain width
String.zeroPad = function(n, width)
{
	var s = n.toString();
	if(s.length >= width) return s;
	return "000000000000000000000000000".substring(0, width - s.length) + s;
};

String.prototype.startsWith = function(prefix)
{
	return !prefix || this.substring(0, prefix.length) == prefix;
};

// Returns the first value of the given named parameter.
//#
//# @param params
//#         as returned by parseParams or null/undefined
//# @return [may be null/undefined]
//#
function getParam(params, name, defaultValue)
{
	if(!params) return defaultValue;
	var p = params[0][name];
	return p ? p[0] : defaultValue;
}

// Returns the first value of the given boolean named parameter.
//#
//# @param params
//#         as returned by parseParams or null/undefined
//#
function getFlag(params, name, defaultValue)
{
	return !!getParam(params, name, defaultValue);
}

