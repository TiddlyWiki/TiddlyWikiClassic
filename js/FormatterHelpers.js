//--
//-- Formatter helpers
//--

function Formatter(formatters) {
	this.formatters = [];
	var pattern = [];
	for(var n = 0; n < formatters.length; n++) {
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
	}
	this.formatterRegExp = new RegExp(pattern.join("|"), "mg");
}

config.formatterHelpers = {

	createElementAndWikify: function(w) {
		w.subWikifyTerm(createTiddlyElement(w.output, this.element), this.termRegExp);
	},

	inlineCssHelper: function(w) {
		// Convert CSS property name to a JavaScript style name ("background-color" -> "backgroundColor")
		var unDash = function(name) {
			return name
				.split("-")
				.map(function(word, i) {
					return i == 0 ? word :
						word.charAt(0).toUpperCase() + word.slice(1);
				})
				.join("");
		};
		var styles = [];
		config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			var s, v;
			if(lookaheadMatch[1]) {
				s = unDash(lookaheadMatch[1]);
				v = lookaheadMatch[2];
			} else {
				s = unDash(lookaheadMatch[3]);
				v = lookaheadMatch[4];
			}
			if(s == "bgcolor") s = "backgroundColor";
			if(s == "float") s = "cssFloat";
			styles.push({ style: s, value: v });
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		}
		return styles;
	},

	applyCssHelper: function(e, styles) {
		for(var i = 0; i < styles.length; i++) {
			try {
				e.style[styles[i].style] = styles[i].value;
			} catch (ex) {}
		}
	},

	enclosedTextHelper: function(w) {
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var text = lookaheadMatch[1];
			if(config.browser.isIE && (config.browser.ieVersion[1] < 10))
				text = text.replace(/\n/g, "\r");
			createTiddlyElement(w.output, this.element, null, null, text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
		}
	},

	isExternalLink: function(link) {
		if(store.tiddlerExists(link) || store.isShadowTiddler(link)) {
			return false;
		}
		var urlRegExp = new RegExp(config.textPrimitives.urlPattern, "mg");
		if(urlRegExp.exec(link)) {
			return true;
		}
		//# May give false positives (a link to not-yet-existing tiddler with one of these chars in title)
		if(link.indexOf(".") != -1 ||
		   link.indexOf("\\") != -1 ||
		   link.indexOf("/") != -1 ||
		   link.indexOf("#") != -1
		) {
			return true;
		}
		//# Unexisting tiddler without . / \ or # in title
		return false;
	}
};

