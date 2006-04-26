// ---------------------------------------------------------------------------------
// Wikifier
// ---------------------------------------------------------------------------------

function wikify(source,output,highlightRegExp,tiddler)
{
	if(source && source != "")
		{
		var wikifier = new Wikifier(source,formatter,highlightRegExp,tiddler);
		wikifier.subWikify(output,null);
		}
}

// Wikify a named tiddler to plain text
function wikifyPlain(title)
{
	if(store.tiddlerExists(title) || store.isShadowTiddler(title))
		{
		var wikifier = new Wikifier(store.getTiddlerText(title),formatter,null,store.getTiddler(title));
		return wikifier.wikifyPlain();
		}
	else
		return "";
}

// Highlight plain text into an element
function highlightify(source,output,highlightRegExp)
{
	if(source && source != "")
		{
		var wikifier = new Wikifier(source,formatter,highlightRegExp,null);
		wikifier.outputText(output,0,source.length);
		}
}

// Construct a wikifier object
// source - source string that's going to be wikified
// formatter - Formatter() object containing the list of formatters to be used
// highlightRegExp - regular expression of the text string to highlight
// tiddler - reference to the tiddler that's taken to be the container for this wikification
function Wikifier(source,formatter,highlightRegExp,tiddler)
{
	this.source = source;
	this.output = null;
	this.formatter = formatter;
	this.nextMatch = 0;
	this.highlightRegExp = highlightRegExp;
	this.highlightMatch = null;	
	if(highlightRegExp)
		{
		highlightRegExp.lastIndex = 0;
		this.highlightMatch = highlightRegExp.exec(source);
		}
	this.tiddler = tiddler;
}

Wikifier.prototype.wikifyPlain = function()
{
	var e = createTiddlyElement(document.body,"div");
	e.style.display = "none";
	this.subWikify(e,null);
	var text = getPlainText(e);
	e.parentNode.removeChild(e);
	return text;
}

Wikifier.prototype.subWikify = function(output,terminator)
{
	// Temporarily replace the output pointer
	var oldOutput = this.output;
	this.output = output;
	// Prepare the terminator RegExp
	var terminatorRegExp = terminator ? new RegExp("(" + terminator + ")","mg") : null;
	do {
		// Prepare the RegExp match positions
		this.formatter.formatterRegExp.lastIndex = this.nextMatch;
		if(terminatorRegExp)
			terminatorRegExp.lastIndex = this.nextMatch;
		// Get the first matches
		var formatterMatch = this.formatter.formatterRegExp.exec(this.source);
		var terminatorMatch = terminatorRegExp ? terminatorRegExp.exec(this.source) : null;
		// Check for a terminator match
		if(terminatorMatch && (!formatterMatch || terminatorMatch.index <= formatterMatch.index))
			{
			// Output any text before the match
			if(terminatorMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,terminatorMatch.index);
			// Set the match parameters
			this.matchStart = terminatorMatch.index;
			this.matchLength = terminatorMatch[1].length;
			this.matchText = terminatorMatch[1];
			this.nextMatch = terminatorMatch.index + terminatorMatch[1].length;
			// Restore the output pointer and exit
			this.output = oldOutput;
			return;		
			}
		// Check for a formatter match
		else if(formatterMatch)
			{
			// Output any text before the match
			if(formatterMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,formatterMatch.index);
			// Set the match parameters
			this.matchStart = formatterMatch.index;
			this.matchLength = formatterMatch[0].length;
			this.matchText = formatterMatch[0];
			this.nextMatch = this.formatter.formatterRegExp.lastIndex;
			// Figure out which formatter matched
			var matchingFormatter = -1;
			for(var t=1; t<formatterMatch.length; t++)
				if(formatterMatch[t])
					matchingFormatter = t-1;
			// Call the formatter
			if(matchingFormatter != -1)
				this.formatter.formatters[matchingFormatter].handler(this);
			}
	} while(terminatorMatch || formatterMatch);
	// Output any text after the last match
	if(this.nextMatch < this.source.length)
		{
		this.outputText(this.output,this.nextMatch,this.source.length);
		this.nextMatch = this.source.length;
		}
	// Restore the output pointer
	this.output = oldOutput;
}

Wikifier.prototype.outputText = function(place,startPos,endPos)
{
	// Check for highlights
	while(this.highlightMatch && (this.highlightRegExp.lastIndex > startPos) && (this.highlightMatch.index < endPos) && (startPos < endPos))
		{
		// Deal with any plain text before the highlight
		if(this.highlightMatch.index > startPos)
			{
			createTiddlyText(place,this.source.substring(startPos,this.highlightMatch.index));
			startPos = this.highlightMatch.index;
			}
		// Deal with the highlight
		var highlightEnd = Math.min(this.highlightRegExp.lastIndex,endPos);
		var theHighlight = createTiddlyElement(place,"span",null,"highlight",this.source.substring(startPos,highlightEnd));
		startPos = highlightEnd;
		// Nudge along to the next highlight if we're done with this one
		if(startPos >= this.highlightRegExp.lastIndex)
			this.highlightMatch = this.highlightRegExp.exec(this.source);
		}
	// Do the unhighlighted text left over
	if(startPos < endPos)
		{
		createTiddlyText(place,this.source.substring(startPos,endPos));
		}
}

