// ---------------------------------------------------------------------------------
// Tiddler() object
// ---------------------------------------------------------------------------------

function Tiddler()
{
	this.title = null;
	this.text = null;
	this.modifier = null;
	this.modified = new Date();
	this.created = new Date();
	this.links = [];
	this.tags = [];
	return this;
}

// Format the text for storage in an RSS item
Tiddler.prototype.saveToRss = function(url)
{
	var s = [];
	s.push("<item>");
	s.push("<title>" + this.title.htmlEncode() + "</title>");
	s.push("<description>" + this.text.replace(/\n/mg,"<br />").htmlEncode() + "</description>");
	for(var t=0; t<this.tags.length; t++)
		s.push("<category>" + this.tags[t] + "</category>");
	s.push("<link>" + url + "#" + encodeURIComponent(String.encodeTiddlyLink(this.title)) + "</link>");
	s.push("<pubDate>" + this.modified.toGMTString() + "</pubDate>");
	s.push("</item>");
	return(s.join("\n"));
}

// Change the text and other attributes of a tiddler
Tiddler.prototype.set = function(title,text,modifier,modified,tags,created,fields)
{
	this.assign(title,text,modifier,modified,tags,created,fields);
	this.changed();
	return this;
}

// Change the text and other attributes of a tiddler without triggered a tiddler.changed() call
Tiddler.prototype.assign = function(title,text,modifier,modified,tags,created,fields)
{
	if(title != undefined)
		this.title = title;
	if(text != undefined)
		this.text = text;
	if(modifier != undefined)
		this.modifier = modifier;
	if(modified != undefined)
		this.modified = modified;
	if(created != undefined)
		this.created = created;
	if(fields != undefined)
		this.fields = fields;
	if(tags != undefined)
		this.tags = (typeof tags == "string") ? tags.readBracketedList() : tags;
	else if(this.tags == undefined)
		this.tags = [];
	return this;
}

// Get the tags for a tiddler as a string (space delimited, using [[brackets]] for tags containing spaces)
Tiddler.prototype.getTags = function()
{
	return String.encodeTiddlyLinkList(this.tags);
}

// Test if a tiddler carries a tag
Tiddler.prototype.isTagged = function(tag)
{
	return this.tags.find(tag) != null;
}

// Static method to convert "\n" to newlines, "\s" to "\"
Tiddler.unescapeLineBreaks = function(text)
{
	return text ? text.unescapeLineBreaks() : "";
}

// Convert newlines to "\n", "\" to "\s"
Tiddler.prototype.escapeLineBreaks = function()
{
	return this.text.escapeLineBreaks();
}

// Updates the secondary information (like links[] array) after a change to a tiddler
Tiddler.prototype.changed = function()
{
	this.links = [];
	var tiddlerLinkRegExp = this.hasWikiLinks() ? config.textPrimitives.tiddlerAnyLinkRegExp : config.textPrimitives.tiddlerForcedLinkRegExp;
	var formatMatch = tiddlerLinkRegExp.exec(this.text);
	while(formatMatch)
		{
		if(formatMatch[1] && (store.tiddlerExists(formatMatch[2]) || store.isShadowTiddler(formatMatch[2]))) // titledBrackettedLink
			this.links.pushUnique(formatMatch[2]);
		else if(formatMatch[3] && formatMatch[3] != this.title) // brackettedLink
			this.links.pushUnique(formatMatch[3]);
		// Do not add link if match urlPattern (formatMatch[4])
		else if(formatMatch[5] && formatMatch[5] != this.title) // wikiWordLink
			{
			if(formatMatch.index > 0)
				{
				var preRegExp = new RegExp(config.textPrimitives.unWikiLink+"|"+config.textPrimitives.anyLetter,"mg");
				preRegExp.lastIndex = formatMatch.index-1;
				preMatch = preRegExp.exec(this.text);
				if(preMatch.index != formatMatch.index-1)
					this.links.pushUnique(formatMatch[5]);
				}
			else
				this.links.pushUnique(formatMatch[5]);
			}
		formatMatch = tiddlerLinkRegExp.exec(this.text);
		}
	return;
}

Tiddler.prototype.getSubtitle = function()
{
	var theModifier = this.modifier;
	if(!theModifier)
		theModifier = config.messages.subtitleUnknown;
	var theModified = this.modified;
	if(theModified)
		theModified = theModified.toLocaleString();
	else
		theModified = config.messages.subtitleUnknown;
	return(config.messages.tiddlerLinkTooltip.format([this.title,theModifier,theModified]));
}

Tiddler.prototype.isReadOnly = function()
{
	return readOnly;
}

Tiddler.prototype.hasWikiLinks = function()
{
	return !this.isTagged("systemConfig") && !this.isTagged("excludeMissing");
}

Tiddler.prototype.getFingerprint = function()
{
	return "0x" + Crypto.hexSha1Str(this.text);
}

