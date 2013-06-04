(function() {
  function MobileFixedBasket() {
    this.el_ = document.querySelector('.side-bar');
    this.mobilePadding_ = document.querySelector('.basket-pad');
    this.visible_ = false;
  }

  var MobileFixedBasketProto = MobileFixedBasket.prototype;

  MobileFixedBasketProto.show = function(animate) {
    this.addMobilePadding_();
    if (this.visible_) { return; }

    if (animate) {
      utils.transition(this.el_, {
        transform: 'translate3d(0,0,0)'
      }, 0.5, 'easeOutQuad');
    }
    else {
      utils.css(this.el_, 'transform', 'translate3d(0,0,0)');
    }

    this.visible_ = true;
  };

  MobileFixedBasketProto.hide = function(animate) {
    if (!this.visible_) { return; }

    if (animate) {
      utils.transition(this.el_, {
        transform: ''
      }, 0.5, 'easeInQuad');
    }
    else {
      utils.css(this.el_, 'transform', '');
    }

    this.visible_ = false;
  };

  MobileFixedBasketProto.addMobilePadding_ = function() {
    this.mobilePadding_.style.height = this.el_.offsetHeight + 'px';
  };

  hugs.views.MobileFixedBasket = MobileFixedBasket;
})();