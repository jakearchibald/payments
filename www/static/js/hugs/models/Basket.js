(function() {
  function Basket() {
    hugs.models.Storage.call(this, 'basket');
  }

  var BasketProto = Basket.prototype = Object.create(hugs.models.Storage.prototype);

  BasketProto.increment = function(product) {
    if (this.obj_[product]) {
      this.obj_[product]++;
    }
    else {
      this.obj_[product] = 1;
    }
    debugger;
    ga('send', 'event', 'basket', 'add', '', Math.random() * 50);
    this.save_();
  };

  BasketProto.decrement = function(product) {
    if (this.obj_[product] == 1) {
      delete this.obj_[product];
    }
    else {
      this.obj_[product]--;
    }
    ga('send', 'event', 'basket', 'remove', '', Math.random() * 50);
    this.save_();
  };

  BasketProto.getNum = function(product) {
    return this.obj_[product] || 0;
  };

  BasketProto.isEmpty = function(product) {
    return !Object.keys(this.obj_).length;
  };

  hugs.models.Basket = Basket;
})();