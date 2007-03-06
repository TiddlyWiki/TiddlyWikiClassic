//--
//-- Morpher animation
//--

// Animate a set of properties of an element
//   element - the element to be moved
//   duration - duration of animation
//   properties - an array of objects describing each property that is to be modified:
//       style - name of the style being animated
//       start - starting value to animate from
//       end - ending value to animation from
//       atEnd - final value (taking priority over the end value) (eg, for switching style.display)
//       format - "scalar" for numeric quantities, "color" for #RRGGBB format colours
//       template - template for formatString() for setting the property (eg "%0em", or "#%0")
//       callback - function to call when the animation has completed as callback(element,properties);
function Morpher(element,duration,properties,callback)
{
	this.element = element;
	this.duration = duration;
	this.properties = properties;
	this.startTime = new Date();
	this.endTime = Number(this.startTime) + duration;
	this.callback = callback;
	this.tick();
	return this;
}

Morpher.prototype.stop = function()
{
	for(var t=0; t<this.properties.length; t++) {
		var p = this.properties[t];
		if(p.atEnd !== undefined) {
			this.element.style[p.style] = p.atEnd;
		}
	}
	if(this.callback)
		this.callback(this.element,this.properties);
}

Morpher.prototype.tick = function()
{
	var currTime = Number(new Date());
	progress = Animator.slowInSlowOut(Math.min(1,(currTime-this.startTime)/this.duration));
	for(var t=0; t<this.properties.length; t++) {
		var p = this.properties[t];
		if(p.start !== undefined && p.end !== undefined) {
			var template = p.template ? p.template : "%0";
			switch(p.format) {
				case undefined:
				case "scalar":
					var v = p.start + (p.end-p.start) * progress;
					this.element.style[p.style] = template.format([v]);
					break;
				case "color":
					break;
			}
		}
	}
	if(currTime >= this.endTime) {
		this.stop();
		return false;
	}
	return true;
}

