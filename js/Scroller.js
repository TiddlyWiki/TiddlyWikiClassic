//--
//-- Scroller animation
//--

function Scroller(targetElement,slowly)
{
	this.targetElement = targetElement;
	this.startScroll = findScrollY();
	this.targetScroll = ensureVisible(targetElement);
	this.progress = 0;
	this.step = slowly ? config.animSlow : config.animFast;
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

