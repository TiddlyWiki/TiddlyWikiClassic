// Returns true if path is a valid field name (path),
// i.e. a sequence of identifiers, separated by "."
TiddlyWiki.isValidFieldName = function(name) {
	var match = /[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/.exec(name);
	return match && (match[0] == name);
};

// Throws an exception when name is not a valid field name.
TiddlyWiki.checkFieldName = function(name) {
	if(!TiddlyWiki.isValidFieldName(name))
		throw config.messages.invalidFieldName.format([name]);
};

function StringFieldAccess(fName, readOnly) {
	this.set = readOnly ?
		function(tiddler, newValue) {
			if(newValue != tiddler[fName]) throw config.messages.fieldCannotBeChanged.format([fName]);
		} :
		function(tiddler, newValue) {
			if(newValue == tiddler[fName]) return;
			tiddler[fName] = newValue;
			return true;
		};
	this.get = function(tiddler) { return tiddler[fName] };
}

function DateFieldAccess(fName) {
	this.set = function(tiddler, newValue) {
		var d = newValue instanceof Date ? newValue : Date.convertFromYYYYMMDDHHMM(newValue);
		if(d == tiddler[fName]) return;
		tiddler[fName] = d;
		return true;
	};
	this.get = function(tiddler) { return tiddler[fName].convertToYYYYMMDDHHMM() };
}

function LinksFieldAccess(fName) {
	this.set = function(tiddler, newValue) {
		var items = (typeof newValue == "string") ? newValue.readBracketedList() : newValue;
		if(items.toString() == tiddler[fName].toString()) return;
		tiddler[fName] = items;
		return true;
	};
	this.get = function(tiddler) { return String.encodeTiddlyLinkList(tiddler[fName]) };
}

TiddlyWiki.standardFieldAccess = {
	// The set functions return true when setting the data has changed the value.
	"title":    new StringFieldAccess("title", true),
	// Handle the "tiddler" field name as the title
	"tiddler":  new StringFieldAccess("title", true),
	"text":     new StringFieldAccess("text"),
	"modifier": new StringFieldAccess("modifier"),
	"modified": new DateFieldAccess("modified"),
	"creator":  new StringFieldAccess("creator"),
	"created":  new DateFieldAccess("created"),
	"tags":     new LinksFieldAccess("tags")
};

TiddlyWiki.isStandardField = function(name) {
	return TiddlyWiki.standardFieldAccess[name] != undefined;
};

// Sets the value of the given field of the tiddler to the value.
// Setting an ExtendedField's value to null or undefined removes the field.
// Setting a namespace to undefined removes all fields of that namespace.
// The fieldName is case-insensitive.
// All values will be converted to a string value.
TiddlyWiki.prototype.setValue = function(tiddlerOrTitle, fieldName, value) {
	TiddlyWiki.checkFieldName(fieldName);
	var t = this.resolveTiddler(tiddlerOrTitle);
	if(!t) return;

	fieldName = fieldName.toLowerCase();
	var isRemove = (value === undefined) || (value === null);
	var accessor = TiddlyWiki.standardFieldAccess[fieldName];
	if(accessor) {
		// don't remove StandardFields
		if(isRemove) return;
		if(!accessor.set(t, value)) return;
	} else {
		var oldValue = t.fields[fieldName];
		if(isRemove) {
			if(oldValue !== undefined) {
				// deletes a single field
				delete t.fields[fieldName];
			} else {
				// no concrete value is defined for the fieldName
				// so we guess this is a namespace path.
				// delete all fields in a namespace
				var re = new RegExp("^" + fieldName + "\\.");
				var dirty = false;
				for(var n in t.fields) {
					if(n.match(re)) {
						delete t.fields[n];
						dirty = true;
					}
				}
				if(!dirty) return;
			}
		} else {
			// the "normal" set case. value is defined (not null/undefined)
			// For convenience convert Date -> String
			value = value instanceof Date ? value.convertToYYYYMMDDHHMMSSMMM() : String(value);
			if(oldValue == value) return;
			t.fields[fieldName] = value;
		}
	}

	// When we are here the tiddler/store really was changed.
	this.notify(t.title, true);
	if(!fieldName.match(/^temp\./))
		this.setDirty(true);
};

// Returns the value of the given field of the tiddler.
// The fieldName is case-insensitive.
// Will only return String values (or undefined).
TiddlyWiki.prototype.getValue = function(tiddlerOrTitle, fieldName) {
	var t = this.resolveTiddler(tiddlerOrTitle);
	if(!t) return undefined;

	if(fieldName.indexOf(config.textPrimitives.sectionSeparator) === 0 ||
	   fieldName.indexOf(config.textPrimitives.sliceSeparator) === 0
	) {
		var separator = fieldName.substr(0, 2);
		var partName = fieldName.substring(2);
		return store.getTiddlerText(t.title + separator + partName);
	} else {
		fieldName = fieldName.toLowerCase();
		var accessor = TiddlyWiki.standardFieldAccess[fieldName];
		if(accessor) return accessor.get(t);
	}
	return t.fields[fieldName];
};

// Calls the callback function for every field in the tiddler.
// When callback function returns a non-false value the iteration stops
// and that value is returned.
// The order of the fields is not defined.
// @param callback a function(tiddler, fieldName, value).
TiddlyWiki.prototype.forEachField = function(tiddlerOrTitle, callback, onlyExtendedFields) {
	var t = this.resolveTiddler(tiddlerOrTitle);
	if(!t) return undefined;

	var name, result;
	for(name in t.fields) {
		result = callback(t, name, t.fields[name]);
		if(result) return result;
	}

	if(onlyExtendedFields) return undefined;
	for(name in TiddlyWiki.standardFieldAccess) {
		// even though the "title" field can also be referenced through the name "tiddler"
		// we only visit this field once.
		if(name == "tiddler") continue;

		result = callback(t, name, TiddlyWiki.standardFieldAccess[name].get(t));
		if(result) return result;
	}
	return undefined;
};

