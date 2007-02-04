//--
//-- Slider animation
//--

// deleteMode - "none", "all" [delete target element and it's children], [only] "children" [but not the target element]
function Slider(element,opening,slowly,deleteMode)
{
	this.element = element;
	element.style.display = "block";
	this.deleteMode = deleteMode;
	this.element.style.height = "auto";
	this.realHeight = element.offsetHeight;
	this.opening = opening;
	this.step = slowly ? config.animSlow : config.animFast;
	if(opening) {
		this.progress = 0;
		element.style.height = "0px";
		element.style.display = "block";
	} else {
		this.progress = 1;
		this.step = -this.step;
	}
	element.style.overflow = "hidden";
	return this;
}

Slider.prototype.stop = function()
{
	if(this.opening) {
		this.element.style.height = "auto";
		this.element.style.opacity = 1;
		this.element.style.filter = "alpha(opacity:100)";
	} else {
		switch(this.deleteMode) {
			case "none":
				this.element.style.display = "none";
				this.element.style.opacity = 1;
				this.element.style.filter = "alpha(opacity:100)";
				break;
			case "all":
				this.element.parentNode.removeChild(this.element);
				break;
			case "children":
				removeChildren(this.element);
				break;
		}
	}
};

Slider.prototype.tick = function()
{
	this.progress += this.step;
	if(this.progress < 0 || this.progress > 1) {
		this.stop();
		return false;
	} else {
		var f = Animator.slowInSlowOut(this.progress);
		var h = this.realHeight * f;
		this.element.style.height = h + "px";
		this.element.style.opacity = f;
		this.element.style.filter = "alpha(opacity:" + f * 100 +")";
		return true;
	}
};

