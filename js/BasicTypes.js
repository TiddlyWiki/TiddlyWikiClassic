// ---------------------------------------------------------------------------------
// Augmented methods for the JavaScript Number(), Array(), String() and Date() objects
// ---------------------------------------------------------------------------------

// Clamp a number to a range
Number.prototype.clamp = function(min,max)
{
	var c = this;
	if(c < min)
		c = min;
	if(c > max)
		c = max;
	return c;
}

// Add indexOf function if browser does not support it
if(!Array.indexOf) {
Array.prototype.indexOf = function(item)
{
	for(var i=0; i<this.length; i++)
		if(this[i] == item)
			return i;
	return -1;
}}

// Find an entry in a given field of the members of an array
Array.prototype.findByField = function(field,value)
{
	for(var t=0; t<this.length; t++)
		if(this[t][field] == value)
			return t;
	return null;
}

// Return whether an entry exists in an array
Array.prototype.contains = function(item)
{
	return this.indexOf(item) != -1;
};

// Return whether one of a list of values exists in an array
Array.prototype.containsAny = function(items)
{
	for(var i=0; i<items.length; i++)
		if (this.indexOf(items[i]) != -1)
			return true;
	return false;
};

// Return whether all of a list of values exists in an array
Array.prototype.containsAll = function(items)
{
	for (var i = 0; i<items.length; i++)
		if (this.indexOf(items[i]) == -1)
			return false;
	return true;
};

// Push a new value into an array only if it is not already present in the array. If the optional unique parameter is false, it reverts to a normal push
Array.prototype.pushUnique = function(item,unique)
{
	if(unique != undefined && unique == false)
		this.push(item);
	else
		{
		if(this.indexOf(item) == -1)
			this.push(item);
		}
}

