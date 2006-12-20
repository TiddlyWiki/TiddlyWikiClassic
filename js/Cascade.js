//--
//-- Cascade animation
//--

function Cascade(text,startElement,targetElement,slowly)
{
	var winWidth = findWindowWidth();
	var winHeight = findWindowHeight();
	this.elements = [];
	this.startElement = startElement;
	this.startLeft = findPosX(this.startElement);
	this.startTop = findPosY(this.startElement);
	this.startWidth = Math.min(this.startElement.offsetWidth,winWidth);
	this.startHeight = Math.min(this.startElement.offsetHeight,winHeight);
	this.targetElement = targetElement;
	targetElement.style.position = "relative";
	targetElement.style.zIndex = 2;
	this.targetLeft = findPosX(this.targetElement);
	this.targetTop = findPosY(this.targetElement);
	this.targetWidth = Math.min(this.targetElement.offsetWidth,winWidth);
	this.targetHeight = Math.min(this.targetElement.offsetHeight,winHeight);
	this.progress = -1;
	this.steps = slowly ? config.cascadeSlow : config.cascadeFast;
	this.text = text;
	this.tick();
	return this;
}

Cascade.prototype.tick = function()
{
	this.progress++;
	if(this.progress >= this.steps) {
		while(this.elements.length > 0)
			this.removeTail();
		this.targetElement.style.position = "static";
		this.targetElement.style.zIndex = "";
		return false;
	} else {
		if(this.elements.length > 0 && this.progress > config.cascadeDepth)
			this.removeTail();
		if(this.progress < (this.steps - config.cascadeDepth)) {
			var f = Animator.slowInSlowOut(this.progress/(this.steps - config.cascadeDepth - 1));
			var e = createTiddlyElement(document.body,"div",null,"cascade",this.text);
			e.style.zIndex = 1;
			e.style.left = this.startLeft + (this.targetLeft-this.startLeft) * f + "px";
			e.style.top = this.startTop + (this.targetTop-this.startTop) * f + "px";
			e.style.width = this.startWidth + (this.targetWidth-this.startWidth) * f + "px";
			e.style.height = this.startHeight + (this.targetHeight-this.startHeight) * f + "px";
			e.style.display = "block";
			this.elements.push(e);
		}
		return true;
	}
};

Cascade.prototype.removeTail = function()
{
	var e = this.elements[0];
	e.parentNode.removeChild(e);
	this.elements.shift();
};

