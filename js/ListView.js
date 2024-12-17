//--
//-- ListView gadget
//--

var ListView = {};

// Create a listview
//#   place - where in the DOM tree to insert the listview
//#   listObject - array of objects to be included in the listview
//#   listTemplate - template for the listview
//#   callback - callback for a command being selected
//#   className - optional classname for the <table> element
ListView.create = function(place, listObject, listTemplate, callback, className) {
	var table = createTiddlyElement(place, "table", null, className || "listView twtable");

	var thead = createTiddlyElement(table, "thead");
	var i, row = createTiddlyElement(thead, "tr");
	for(i = 0; i < listTemplate.columns.length; i++) {
		var columnTemplate = listTemplate.columns[i];
		var cell = createTiddlyElement(row, "th");
		var colType = ListView.columnTypes[columnTemplate.type];
		if(colType && colType.createHeader) {
			colType.createHeader(cell, columnTemplate, i);
			if(columnTemplate.className)
				jQuery(cell).addClass(columnTemplate.className);
		}
	}

	var rc, tbody = createTiddlyElement(table, "tbody");
	for(rc = 0; rc < listObject.length; rc++) {
		var rowObject = listObject[rc];
		row = createTiddlyElement(tbody, "tr");
		for(i = 0; i < listTemplate.rowClasses.length; i++) {
			if(rowObject[listTemplate.rowClasses[i].field])
				jQuery(row).addClass(listTemplate.rowClasses[i].className);
		}
		rowObject.rowElement = row;
		rowObject.colElements = {};
		for(i = 0; i < listTemplate.columns.length; i++) {
			cell = createTiddlyElement(row, "td");
			columnTemplate = listTemplate.columns[i];
			var field = columnTemplate.field;
			colType = ListView.columnTypes[columnTemplate.type];
			if(colType && colType.createItem) {
				colType.createItem(cell, rowObject, field, columnTemplate, i, rc);
				if(columnTemplate.className)
					jQuery(cell).addClass(columnTemplate.className);
			}
			rowObject.colElements[field] = cell;
		}
	}

	if(callback && listTemplate.actions)
		createTiddlyDropDown(place, ListView.getCommandHandler(callback), listTemplate.actions);

	if(callback && listTemplate.buttons) {
		for(i = 0; i < listTemplate.buttons.length; i++) {
			var b = listTemplate.buttons[i];
			if(b && b.name != "") createTiddlyButton(place, b.caption, null,
				ListView.getCommandHandler(callback, b.name, b.allowEmptySelection));
		}
	}
	return table;
};

ListView.getCommandHandler = function(callback, name, allowEmptySelection) {
	return function(e) {
		var view = findRelated(this, "TABLE", null, "previousSibling");
		var tiddlers = ListView.getSelectedRows(view);
		if(tiddlers.length == 0 && !allowEmptySelection) {
			alert(config.messages.nothingSelected);
		} else {
			if(this.nodeName.toLowerCase() == "select") {
				callback(view, this.value, tiddlers);
				this.selectedIndex = 0;
			} else {
				callback(view, name, tiddlers);
			}
		}
	};
};

// Invoke a callback for each selector checkbox in the listview
//#   view - <table> element of listView
//#   callback(checkboxElement, rowName)
//#     where
//#       checkboxElement - DOM element of checkbox
//#       rowName - name of this row as assigned by the column template
//#   result: true if at least one selector was checked
ListView.forEachSelector = function(view, callback) {
	var checkboxes = view.getElementsByTagName("input");
	var i, hadOne = false;
	for(i = 0; i < checkboxes.length; i++) {
		var cb = checkboxes[i];
		var rowName = cb.getAttribute("rowName");
		if(cb.getAttribute("type") != "checkbox" || !rowName) continue;
		callback(cb, rowName);
		hadOne = true;
	}
	return hadOne;
};

ListView.getSelectedRows = function(view) {
	var rowNames = [];
	ListView.forEachSelector(view, function(e, rowName) {
		if(e.checked) rowNames.push(rowName);
	});
	return rowNames;
};

// describes filling cells of a column of each type, a map of typeName => { createHeader, createItem }
ListView.columnTypes = {};

ListView.columnTypes.String = {
	createHeader: function(place, columnTemplate, col) {
		createTiddlyText(place, columnTemplate.title);
	},
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v != undefined)
			createTiddlyText(place, v);
	}
};

ListView.columnTypes.WikiText = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v != undefined)
			wikify(v, place, null, null);
	}
};

ListView.columnTypes.Tiddler = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v != undefined && v.title)
			createTiddlyPopup(place, v.title, config.messages.listView.tiddlerTooltip, v);
	}
};

ListView.columnTypes.Size = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v == undefined) return;
		var i = 0, msg = config.messages.sizeTemplates;
		while(i < msg.length - 1 && v < msg[i].unit)
			i++;
		createTiddlyText(place, msg[i].template.format([Math.round(v / msg[i].unit)]));
	}
};

ListView.columnTypes.Link = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		var c = columnTemplate.text;
		if(v != undefined) createExternalLink(place, v, c || v);
	}
};

ListView.columnTypes.Date = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v != undefined)
			createTiddlyText(place, v.formatString(columnTemplate.dateFormat));
	}
};

ListView.columnTypes.StringList = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v == undefined) return;
		for(var i = 0; i < v.length; i++) {
			createTiddlyText(place, v[i]);
			createTiddlyElement(place, "br");
		}
	}
};

ListView.columnTypes.Selector = {
	createHeader: function(place, columnTemplate, col) {
		createTiddlyCheckbox(place, null, false, this.onHeaderChange);
	},
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var e = createTiddlyCheckbox(place, null, listObject[field], null);
		e.setAttribute("rowName", listObject[columnTemplate.rowName]);
	},
	onHeaderChange: function(e) {
		var state = this.checked;
		var view = findRelated(this, "TABLE");
		if(!view) return;
		ListView.forEachSelector(view, function(e, rowName) {
			e.checked = state;
		});
	}
};

ListView.columnTypes.Tags = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var tags = listObject[field];
		createTiddlyText(place, String.encodeTiddlyLinkList(tags));
	}
};

ListView.columnTypes.Boolean = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		if(listObject[field] == true)
			createTiddlyText(place, columnTemplate.trueText);
		if(listObject[field] == false)
			createTiddlyText(place, columnTemplate.falseText);
	}
};

ListView.columnTypes.TagCheckbox = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var e = createTiddlyCheckbox(place, null, listObject[field], this.onChange);
		e.setAttribute("tiddler", listObject.title);
		e.setAttribute("tag", columnTemplate.tag);
	},
	onChange: function(e) {
		var tag = this.getAttribute("tag");
		var tiddler = this.getAttribute("tiddler");
		store.setTiddlerTag(tiddler, this.checked, tag);
	}
};

ListView.columnTypes.TiddlerLink = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place, listObject, field, columnTemplate, col, row) {
		var v = listObject[field];
		if(v == undefined) return;
		var link = createTiddlyLink(place, listObject[columnTemplate.tiddlerLink], false, null);
		createTiddlyText(link, listObject[field]);
	}
};

