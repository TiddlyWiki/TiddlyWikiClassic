// ---------------------------------------------------------------------------------
// ListView gadget
// ---------------------------------------------------------------------------------

var ListView = {};

// Create a listview
//   place - where in the DOM tree to insert the listview
//   listObject - array of objects to be included in the listview
//   listTemplate - template for the listview
//   callback - callback for a command being selected
//   className - optional classname for the <table> element
ListView.create = function(place,listObject,listTemplate,callback,className)
{
	var table = createTiddlyElement(place,"table",null,className ? className : "listView");
	var thead = createTiddlyElement(table,"thead");
	var r = createTiddlyElement(thead,"tr");
	for(var t=0; t<listTemplate.columns.length; t++)
		{
		var columnTemplate = listTemplate.columns[t];
		var c = createTiddlyElement(r,"th");
		var colType = ListView.columnTypes[columnTemplate.type];
		if(colType && colType.createHeader)
			colType.createHeader(c,columnTemplate,t);
		}
	var tbody = createTiddlyElement(table,"tbody");
	for(var rc=0; rc<listObject.length; rc++)
		{
		rowObject = listObject[rc];
		r = createTiddlyElement(tbody,"tr");
		for(var c=0; c<listTemplate.rowClasses.length; c++)
			{
			if(rowObject[listTemplate.rowClasses[c].field])
				addClass(r,listTemplate.rowClasses[c].className);
			}
		rowObject.rowElement = r;
		rowObject.colElements = {};
		for(var cc=0; cc<listTemplate.columns.length; cc++)
			{
			var c = createTiddlyElement(r,"td");
			var columnTemplate = listTemplate.columns[cc];
			var field = columnTemplate.field;
			var colType = ListView.columnTypes[columnTemplate.type];
			if(colType && colType.createItem)
				colType.createItem(c,rowObject,field,columnTemplate,cc,rc);
			rowObject.colElements[field] = c;
			}
		}
	if(callback && listTemplate.actions)
		createTiddlyDropDown(place,ListView.getCommandHandler(callback),listTemplate.actions);
	if(callback && listTemplate.buttons)
		{
		for(t=0; t<listTemplate.buttons.length; t++)
			{
			var a = listTemplate.buttons[t];
			if(a && a.name != "")
				createTiddlyButton(place,a.caption,null,ListView.getCommandHandler(callback,a.name,a.allowEmptySelection));
			}
		}
	return table;
}

ListView.getCommandHandler = function(callback,name,allowEmptySelection)
{
	return function(e)
		{
		var view = findRelated(this,"TABLE",null,"previousSibling");
		var tiddlers = [];
		ListView.forEachSelector(view,function(e,rowName) {
					if(e.checked)
						tiddlers.push(rowName);
					});
		if(tiddlers.length == 0 && !allowEmptySelection)
			alert(config.messages.nothingSelected);
		else
			{
			if(this.nodeName.toLowerCase() == "select")
				{
				callback(view,this.value,tiddlers);
				this.selectedIndex = 0;
				}
			else
				callback(view,name,tiddlers);
			}
		};
}

// Invoke a callback for each selector checkbox in the listview
//   view - <table> element of listView
//   callback(checkboxElement,rowName)
//     where
//       checkboxElement - DOM element of checkbox
//       rowName - name of this row as assigned by the column template
//   result: true if at least one selector was checked
ListView.forEachSelector = function(view,callback)
{
	var checkboxes = view.getElementsByTagName("input");
	var hadOne = false;
	for(var t=0; t<checkboxes.length; t++)
		{
		var cb = checkboxes[t];
		if(cb.getAttribute("type") == "checkbox")
			{
			var rn = cb.getAttribute("rowName");
			if(rn)
				{
				callback(cb,rn);
				hadOne = true;
				}
			}
		}
	return hadOne;
}

ListView.getSelectedRows = function(view)
{
	var rowNames = [];
	ListView.forEachSelector(view,function(e,rowName) {
				if(e.checked)
					rowNames.push(rowName);
				});
	return rowNames;
}

ListView.columnTypes = {};

ListView.columnTypes.String = {
	createHeader: function(place,columnTemplate,col)
		{
			createTiddlyText(place,columnTemplate.title);
		},
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				createTiddlyText(place,v);
		}
};

ListView.columnTypes.WikiText = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				wikify(v,place,null,null);
		}
};

ListView.columnTypes.Tiddler = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined && v.title && v.text) {
				var btn = createTiddlyButton(place,v.title,config.messages.listView.tiddlerTooltip,ListView.columnTypes.Tiddler.onClick,"tiddlerPopupButton");
				btn.tiddler = v;
			}
		},
	onClick: function(e)
		{
			var popup = Popup.create(this,"div","popupTiddler");
			var tiddler = this.tiddler;
			if(tiddler.text)
				wikify(tiddler.text,popup,null,tiddler);
			else
				createTiddlyText(popup,config.messages.listView.previewUnavailable);
			Popup.show(popup,false);
			if(e) e.cancelBubble = true;
			if(e && e.stopPropagation) e.stopPropagation();
			return false;
		}
};

ListView.columnTypes.Size = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined) {
				var t = 0;
				while(t<config.messages.sizeTemplates.length-1 && v<config.messages.sizeTemplates[t].unit)
					t++;
				createTiddlyText(place,config.messages.sizeTemplates[t].template.format([Math.round(v/config.messages.sizeTemplates[t].unit)]));
			}
		}
};

ListView.columnTypes.Link = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			var c = columnTemplate.text;
			if(v != undefined)
				createTiddlyText(createExternalLink(place,v),c ? c : v);
		}
};

ListView.columnTypes.Date = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				createTiddlyText(place,v.formatString(columnTemplate.dateFormat));
		}
};

ListView.columnTypes.StringList = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				{
				for(var t=0; t<v.length; t++)
					{
					createTiddlyText(place,v[t]);
					createTiddlyElement(place,"br");
					}
				}
		}
};

ListView.columnTypes.Selector = {
	createHeader: function(place,columnTemplate,col)
		{
			createTiddlyCheckbox(place,null,false,this.onHeaderChange);
		},
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var e = createTiddlyCheckbox(place,null,listObject[field],null);
			e.setAttribute("rowName",listObject[columnTemplate.rowName]);
		},
	onHeaderChange: function(e)
		{
			var state = this.checked;
			var view = findRelated(this,"TABLE");
			if(!view)
				return;
			ListView.forEachSelector(view,function(e,rowName) {
								e.checked = state;
							});
		}
};

ListView.columnTypes.Tags = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var tags = listObject[field];
			createTiddlyText(place,String.encodeTiddlyLinkList(tags));
		}
};

ListView.columnTypes.Boolean = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			if(listObject[field] == true)
				createTiddlyText(place,columnTemplate.trueText);
			if(listObject[field] == false)
				createTiddlyText(place,columnTemplate.falseText);
		}
};

ListView.columnTypes.TagCheckbox = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var e = createTiddlyCheckbox(place,null,listObject[field],this.onChange);
			e.setAttribute("tiddler",listObject.title);
			e.setAttribute("tag",columnTemplate.tag);
		},
	onChange : function(e)
		{
			var tag = this.getAttribute("tag");
			var tiddler = this.getAttribute("tiddler");
			store.setTiddlerTag(tiddler,this.checked,tag);
		}
};

ListView.columnTypes.TiddlerLink = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				{
				var link = createTiddlyLink(place,listObject[columnTemplate.tiddlerLink],false,null);
				createTiddlyText(link,listObject[field]);
				}
		}
};
