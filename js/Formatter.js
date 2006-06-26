// ---------------------------------------------------------------------------------
// Standard formatters
// ---------------------------------------------------------------------------------

config.formatters = [
{
	name: "table",
	match: "^\\|(?:[^\\n]*)\\|(?:[fhck]?)$",
	lookahead: "^\\|([^\\n]*)\\|([fhck]?)$",
	rowTerm: "\\|(?:[fhck]?)$\\n?",
	cellPattern: "(?:\\|([^\\n\\|]*)\\|)|(\\|[fhck]?$\\n?)",
	cellTerm: "(?:\\x20*)\\|",
	rowTypes: {"c":"caption", "h":"thead", "":"tbody", "f":"tfoot"},
	lookaheadRegExp: null,
	cellRegExp: null,
	cellTermRegExp: null,
	handler: function(w)
	{
		if(this.lookaheadRegExp==null)
			{
			this.lookaheadRegExp = new RegExp(this.lookahead,"mg");
			this.cellRegExp = new RegExp(this.cellPattern,"mg");
			this.cellTermRegExp = new RegExp("(" + this.cellTerm + ")","mg");
			}
		var table = createTiddlyElement(w.output,"table");
		var prevColumns = [];
		var currRowType = null;
		var rowContainer;
		var rowCount = 0;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch)
			{
			var nextRowType = lookaheadMatch[2];
			if(nextRowType == "k")
				{
				table.className = lookaheadMatch[1];
				w.nextMatch += lookaheadMatch[0].length+1;
				}
			else
				{
				if(nextRowType != currRowType)
					{
					rowContainer = createTiddlyElement(table,this.rowTypes[nextRowType]);
					currRowType = nextRowType;
					}
				if(currRowType == "c")
					{
					// Caption
					w.nextMatch++;
					table.insertBefore(rowContainer,table.firstChild);
					rowContainer.setAttribute("align",rowCount == 0?"top":"bottom");
					w.subWikify(rowContainer,this.rowTerm);
					}
				else
					{
					this.rowHandler(w,createTiddlyElement(rowContainer,"tr",null,(rowCount&1)?"oddRow":"evenRow"),prevColumns);
					rowCount++;
					}
				}
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
			}
	},
	rowHandler: function(w,e,prevColumns)
	{
		var col = 0;
		var currColCount = 1;
		this.cellRegExp.lastIndex = w.nextMatch;
		var cellMatch = this.cellRegExp.exec(w.source);
		while(cellMatch && cellMatch.index == w.nextMatch)
			{
			if(cellMatch[1] == "~")
				{
				// Rowspan
				var last = prevColumns[col];
				if(last)
					{
					last.rowCount++;
					last.element.setAttribute("rowspan",last.rowCount);
					last.element.valign = "center";
					}
				w.nextMatch = this.cellRegExp.lastIndex-1;
				}
			else if(cellMatch[1] == ">")
				{
				// Colspan
				currColCount++;
				w.nextMatch = this.cellRegExp.lastIndex-1;
				}
			else if(cellMatch[2])
				{
				// End of row
				w.nextMatch = this.cellRegExp.lastIndex;
				break;
				}
			else
				{
				// Cell
				w.nextMatch++;
				var styles = config.formatterHelpers.inlineCssHelper(w);
				var spaceLeft = false;
				var chr = w.source.substr(w.nextMatch,1);
				while(chr == " ")
					{
					spaceLeft = true;
					w.nextMatch++;
					chr = w.source.substr(w.nextMatch,1);
					}
				var cell;
				if(chr == "!")
					{
					cell = createTiddlyElement(e,"th");
					w.nextMatch++;
					}
				else
					cell = createTiddlyElement(e,"td");
				prevColumns[col] = {rowCount:1, element:cell};
				if(currColCount > 1)
					{
					cell.setAttribute("colspan",currColCount);
					currColCount = 1;
					}
				config.formatterHelpers.applyCssHelper(cell,styles);
				w.subWikifyTerm(cell,this.cellTermRegExp);
				if(w.matchText.substr(w.matchText.length-2,1) == " ") // spaceRight
					cell.align = spaceLeft ? "center" : "left";
				else if(spaceLeft)
					cell.align = "right";
				w.nextMatch--;
				}
			col++;
			this.cellRegExp.lastIndex = w.nextMatch;
			cellMatch = this.cellRegExp.exec(w.source);
			}
	}
},

{
	name: "rule",
	match: "^----+$\\n?",
	handler: function(w)
	{
		createTiddlyElement(w.output,"hr");
	}
},

{
	name: "heading",
	match: "^!{1,5}",
	terminator: "\\n",
	handler: function(w)
	{
		var e = createTiddlyElement(w.output,"h" + w.matchLength);
		w.subWikify(e,this.terminator);
	}
},

{
	name: "monospacedByLine",
	match: "^\\{\\{\\{\\n",
	lookahead: "^\\{\\{\\{\\n((?:^[^\\n]*\\n)+?)(^\\}\\}\\}$\\n?)",
	handler: config.formatterHelpers.monospacedByLineHelper
},

{
	name: "monospacedByLineForCSS",
	match: "^/\\*[\\{]{3}\\*/\\n",
	lookahead: "/\\*[\\{]{3}\\*/\\n*((?:^[^\\n]*\\n)+?)(\\n*^/\\*[\\}]{3}\\*/$\\n?)", 
	handler: config.formatterHelpers.monospacedByLineHelper
},

{
	name: "monospacedByLineForPlugin",
	match: "^//\\{\\{\\{\\n",
	lookahead: "^//\\{\\{\\{\\n\\n*((?:^[^\\n]*\\n)+?)(\\n*^//\\}\\}\\}$\\n?)",
	handler: config.formatterHelpers.monospacedByLineHelper
},

{
	name: "monospacedByLineForTemplate",
	match: "^<!--[\\{]{3}-->\\n",
	lookahead: "<!--[\\{]{3}-->\\n*((?:^[^\\n]*\\n)+?)(\\n*^<!--[\\}]{3}-->$\\n?)", 
	handler: config.formatterHelpers.monospacedByLineHelper
},

{
	name: "wikifyCommentForPlugin", 
	match: "^/\\*\\*\\*\\n",
	terminator: "^\\*\\*\\*/\\n",
	handler: function(w)
	{
		w.subWikify(w.output,this.terminator);
	}
},

{
	name: "wikifyCommentForTemplate", 
	match: "^<!---\\n",
	terminator: "^--->\\n",
	handler: function(w) 
	{
		w.subWikify(w.output,this.terminator);
	}
},

{
	name: "quoteByBlock",
	match: "^<<<\\n",
	terminator: "^<<<(\\n|$)",
	handler: function(w)
	{
		var e = createTiddlyElement(w.output,"blockquote");
		w.subWikify(e,this.terminator);
	}
},

{
	name: "quoteByLine",
	match: "^>+",
	terminator: "\\n",
	element: "blockquote",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.match,"mg");
		var placeStack = [w.output];
		var currLevel = 0;
		var newLevel = w.matchLength;
		var t;
		do {
			if(newLevel > currLevel)
				{
				for(t=currLevel; t<newLevel; t++)
					placeStack.push(createTiddlyElement(placeStack[placeStack.length-1],this.element));
				}
			else if(newLevel < currLevel)
				{
				for(t=currLevel; t>newLevel; t--)
					placeStack.pop();
				}
			currLevel = newLevel;
			w.subWikify(placeStack[placeStack.length-1],this.terminator);
			createTiddlyElement(placeStack[placeStack.length-1],"br");
			lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched)
				{
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
				}
		} while(matched);
	}
},

{
	name: "list",
	match: "^(?:(?:(?:\\*)|(?:#)|(?:;)|(?::))+)",
	lookahead: "^(?:(?:(\\*)|(#)|(;)|(:))+)",
	terminator: "\\n",
	handler: function(w)
	{
		var placeStack = [w.output];
		var currLevel = 0, currType = null;
		var listLevel, listType, itemType;
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		w.nextMatch = w.matchStart;
		lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch)
			{
			if(lookaheadMatch[1])
				{
				listType = "ul";
				itemType = "li";
				}
			else if(lookaheadMatch[2])
				{
				listType = "ol";
				itemType = "li";
				}
			else if(lookaheadMatch[3])
				{
				listType = "dl";
				itemType = "dt";
				}
			else if(lookaheadMatch[4])
				{
				listType = "dl";
				itemType = "dd";
				}
			listLevel = lookaheadMatch[0].length;
			w.nextMatch += lookaheadMatch[0].length;
			if(listLevel > currLevel)
				{
				for(var t=currLevel; t<listLevel; t++)
					placeStack.push(createTiddlyElement(placeStack[placeStack.length-1],listType));
				}
			else if(listLevel < currLevel)
				{
				for(var t=currLevel; t>listLevel; t--)
					placeStack.pop();
				}
			else if(listLevel == currLevel && listType != currType)
				{
				placeStack.pop();
				placeStack.push(createTiddlyElement(placeStack[placeStack.length-1],listType));
				}
			currLevel = listLevel;
			currType = listType;
			var e = createTiddlyElement(placeStack[placeStack.length-1],itemType);
			w.subWikify(e,this.terminator);
			lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: "unWikiLink",
	match: config.textPrimitives.unWikiLink+config.textPrimitives.wikiLink,
	handler: function(w)
	{
		w.outputText(w.output,w.matchStart+1,w.nextMatch);
	}
},

{
	name: "wikiLink",
	match: config.textPrimitives.wikiLink,
	handler: function(w)
	{
		if(w.matchStart > 0)
			{
			var preRegExp = new RegExp(config.textPrimitives.anyLetter,"mg");
			preRegExp.lastIndex = w.matchStart-1;
			var preMatch = preRegExp.exec(w.source);
			if(preMatch.index == w.matchStart-1)
				{
				w.outputText(w.output,w.matchStart,w.nextMatch);
				return;
				}
			}
		if(w.linkWikiWords == true || store.isShadowTiddler(w.matchText))
			{
			var link = createTiddlyLink(w.output,w.matchText,false);
			w.outputText(link,w.matchStart,w.nextMatch);
			}
		else
			{
			w.outputText(w.output,w.matchStart,w.nextMatch);
			}
	}
},

{
	name: "prettyLink",
	match: "\\[\\[",
	lookahead: "\\[\\[([^\\|\\]]*?)(?:(\\]\\])|(\\|(.*?)\\]\\]))",
	terminator: "\\|",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e;
			var text = lookaheadMatch[1];
			if (lookaheadMatch[2]) // Simple bracketted link
				{
				e = createTiddlyLink(w.output,text,false);
				}
			else if(lookaheadMatch[3]) // Pretty bracketted link
				{
				var link = lookaheadMatch[4];
				e = config.formatterHelpers.isExternalLink(link) ? createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false);
				}
			createTiddlyText(e,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "urlLink",
	match: config.textPrimitives.urlPattern,
	handler: function(w)
	{
		var e = createExternalLink(w.output,w.matchText);
		w.outputText(e,w.matchStart,w.nextMatch);
	}
},

{
	name: "image",
	match: "\\[[<>]?[Ii][Mm][Gg]\\[",
	lookahead: "\\[(<?)(>?)[Ii][Mm][Gg]\\[(?:([^\\|\\]]+)\\|)?([^\\[\\]\\|]+)\\](?:\\[([^\\]]*)\\])?\\]",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) // Simple bracketted link
			{
			var e = w.output;
			if(lookaheadMatch[5])
				{
				var link = lookaheadMatch[5];
				e = config.formatterHelpers.isExternalLink(link) ? createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false);
				addClass(e,"imageLink");
				}
			var img = createTiddlyElement(e,"img");
			if(lookaheadMatch[1])
				img.align = "left";
			else if(lookaheadMatch[2])
				img.align = "right";
			if(lookaheadMatch[3])
				img.title = lookaheadMatch[3];
			img.src = lookaheadMatch[4];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "macro",
	match: "<<",
	lookahead: "<<([^>\\s]+)(?:\\s*)((?:[^>]|(?:>(?!>)))*)>>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1])
			{		
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			invokeMacro(w.output,lookaheadMatch[1],lookaheadMatch[2],w,w.tiddler);
			}
	}
},

{
	name: "html",
	match: "<[Hh][Tt][Mm][Ll]>",
	lookahead: "<[Hh][Tt][Mm][Ll]>((?:.|\\n)*?)</[Hh][Tt][Mm][Ll]>",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = createTiddlyElement(w.output,"span");
			e.innerHTML = lookaheadMatch[1];
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "commentByBlock",
	match: "/%",
	lookahead: "/%((?:.|\\n)*?)%/",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
	}
},

{
	name: "boldByChar",
	match: "''",
	terminator: "''",
	element: "strong",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "strikeByChar",
	match: "==",
	terminator: "==",
	element: "strike",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "underlineByChar",
	match: "__",
	terminator: "__",
	element: "u",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "italicByChar",
	match: "//",
	terminator: "//",
	element: "em",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "subscriptByChar",
	match: "~~",
	terminator: "~~",
	element: "sub",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "superscriptByChar",
	match: "\\^\\^",
	terminator: "\\^\\^",
	element: "sup",
	handler: config.formatterHelpers.charFormatHelper
},

{
	name: "monospacedByChar",
	match: "\\{\\{\\{",
	lookahead: "\\{\\{\\{((?:.|\\n)*?)\\}\\}\\}",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source)
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var e = createTiddlyElement(w.output,"code",null,null,lookaheadMatch[1]);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	}
},

{
	name: "styleByChar",
	match: "@@",
	terminator: "@@",
	lookahead: "(?:([^\\(@]+)\\(([^\\)]+)(?:\\):))|(?:([^:@]+):([^;]+);)",
	handler:  function(w)
	{
		var e = createTiddlyElement(w.output,"span");
		var styles = config.formatterHelpers.inlineCssHelper(w);
		if(styles.length == 0)
			e.className = "marked";
		else
			config.formatterHelpers.applyCssHelper(e,styles);
		w.subWikify(e,this.terminator);
	}
},

{
	name: "lineBreak",
	match: "\\n",
	handler: function(w)
	{
		createTiddlyElement(w.output,"br");
	}
},

{
	name: "htmlEntitiesEncoding",
	match: "&#?[a-zA-Z0-9]{2,8};",
	handler: function(w)
		{
		var e = createTiddlyElement(w.output,"span");
		e.innerHTML = w.matchText ;
		}
},

{
	name: "customClasses",
	match: "\\{\\{",
	terminator: "\\}\\}\\}",
	lookahead: "\\{\\{[\\s]*([\\w]+[\\s\\w]*)[\\s]*\\{(\\n{0,1})",
	handler: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"g");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch)
			{
			var isByLine = lookaheadMatch[2] == "\n";
			var p = createTiddlyElement(w.output,isByLine ? "div" : "span",null,lookaheadMatch[1]);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			w.subWikify(p,this.terminator);
			}
	}
}

];

