//--
//-- Scroller animation
//--

function Scroller(targetElement,unused)
{
	this.targetElement = targetElement;
	this.startScroll = findScrollY();
	this.targetScroll = ensureVisible(targetElement);
	this.progress = 0;
	this.step = 0.12;
	return this;
}

Scroller.prototype.tick = function()
{
	this.progress += this.step;
	if(this.progress > 1) {
		window.scrollTo(0,this.targetScroll);
		return false;
	} else {
		var f = Animator.slowInSlowOut(this.progress);
		window.scrollTo(0,this.startScroll + (this.targetScroll-this.startScroll) * f);
		return true;
	}
};

