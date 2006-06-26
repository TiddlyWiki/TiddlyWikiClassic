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

// Load a tiddler from an HTML DIV. The caller should make sure to later call Tiddler.changed()
Tiddler.prototype.loadFromDiv = function(divRef,title)
{
	var text= ""; 
	var e = divRef.firstChild;
	while(e && e.nodeName == "#text")
		{
		text += Tiddler.unescapeLineBreaks(e.nodeValue);
		e = e.nextSibling;
		}
	var modifier = divRef.getAttribute("modifier");
	var modified = Date.convertFromYYYYMMDDHHMM(divRef.getAttribute("modified"));
	var c = divRef.getAttribute("created");
	var created = c ? Date.convertFromYYYYMMDDHHMM(c) : modified;
	var tags = divRef.getAttribute("tags");
	this.assign(title,text,modifier,modified,tags,created);
	return this;
}

// Format the text for storage in an HTML DIV
Tiddler.prototype.saveToDiv = function()
{
	return '<div tiddler="%0" modifier="%1" modified="%2" created="%3" tags="%4">%5</div>'.format([
			this.title.htmlEncode(),
			this.modifier.htmlEncode(),
			this.modified.convertToYYYYMMDDHHMM(),
			this.created.convertToYYYYMMDDHHMM(),
			this.getTags().htmlEncode(),
			this.escapeLineBreaks().htmlEncode()
		]);
}

// Format the text for storage in an RSS item
Tiddler.prototype.saveToRss = function(url)
{
	var s = [];
	s.push("<item>");
	s.push("<title>" + this.title.htmlEncode() + "</title>");
	s.push("<description>" + this.text.replace(regexpNewLine,"<br />").htmlEncode() + "</description>");
	for(var t=0; t<this.tags.length; t++)
		s.push("<category>" + this.tags[t] + "</category>");
	s.push("<link>" + url + "#" + encodeURIComponent(String.encodeTiddlyLink(this.title)) + "</link>");
	s.push("<pubDate>" + this.modified.toGMTString() + "</pubDate>");
	s.push("</item>");
	return(s.join("\n"));
}

// Change the text and other attributes of a tiddler
Tiddler.prototype.set = function(title,text,modifier,modified,tags,created)
{
	this.assign(title,text,modifier,modified,tags,created);
	this.changed();
	return this;
}

// Change the text and other attributes of a tiddler without triggered a tiddler.changed() call
Tiddler.prototype.assign = function(title,text,modifier,modified,tags,created)
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
	if(tags != undefined)
		this.tags = (typeof tags == "string") ? tags.readBracketedList() : tags;
	else if(this.tags == undefined)
		this.tags = [];
	return this;
}

// Get the tags for a tiddler as a string (space delimited, using [[brackets]] for tags containing spaces)
Tiddler.prototype.getTags = function()
{
	return String.encodeTiddyLinkList(this.tags);
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
	var aliasedPrettyLink = "\\[\\[([^\\[\\]\\|]+)\\|([^\\[\\]\\|]+)\\]\\]";
	var prettyLink = "\\[\\[([^\\]]+)\\]\\]";
	var wikiNameRegExp = new RegExp("(" + config.textPrimitives.wikiLink + ")|(?:" + aliasedPrettyLink + ")|(?:" + prettyLink + ")","mg");
	do {
		var formatMatch = wikiNameRegExp.exec(this.text);
		if(formatMatch)
			{
			if(formatMatch[1] && formatMatch[1] != this.title)
				{
				if(formatMatch.index > 0)
					{
					var preRegExp = new RegExp(config.textPrimitives.unWikiLink+"|"+config.textPrimitives.anyLetter,"mg");
					preRegExp.lastIndex = formatMatch.index-1;
					preMatch = preRegExp.exec(this.text);
					if(preMatch.index != formatMatch.index-1)
						this.links.pushUnique(formatMatch[1]);
					}
				else
					this.links.pushUnique(formatMatch[1]);
				}
			else if(formatMatch[2] && (store.tiddlerExists(formatMatch[3]) || store.isShadowTiddler(formatMatch[3])))
				this.links.pushUnique(formatMatch[3]);
			else if(formatMatch[4] && formatMatch[4] != this.title)
				this.links.pushUnique(formatMatch[4]);
			}
	} while(formatMatch);
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

