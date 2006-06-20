// ---------------------------------------------------------------------------------
// Formatter helpers
// ---------------------------------------------------------------------------------

function Formatter(formatters)
{
	this.formatters = [];
	var pattern = [];
	for(var n=0; n<formatters.length; n++)
		{
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
		}
	this.formatterRegExp = new RegExp(pattern.join("|"),"mg");
}

config.formatterHelpers = {

	charFormatHelper: function(w)
	{
		var e = w.output.appendChild(document.createElement(this.element));
		w.subWikify(e,this.terminator);
	},

	inlineCssHelper: function(w)
	{
		var styles = [];
		config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch)
			{
			var s,v;
			if(lookaheadMatch[1])
				{
				s = lookaheadMatch[1].unDash();
				v = lookaheadMatch[2];
				}
			else
				{
				s = lookaheadMatch[3].unDash();
				v = lookaheadMatch[4];
				}
			if (s=="bgcolor")
				s = "backgroundColor";
			styles.push({style: s, value: v});
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
			}
		return styles;
	},

	applyCssHelper: function(e,styles)
	{
		for(var t=0; t< styles.length; t++)
			{
			try
				{
				e.style[styles[t].style] = styles[t].value;
				}
			catch (ex)
				{
				}
			}
	},

	monospacedByLineHelper: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var text = lookaheadMatch[1];
			if(config.browser.isIE)
				text = text.replace(/\n/g,"\r");
			var e = createTiddlyElement(w.output,"pre",null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	},

	isExternalLink: function(link)
	{
		return !(store.tiddlerExists(link) || store.isShadowTiddler(link));
	}

};

