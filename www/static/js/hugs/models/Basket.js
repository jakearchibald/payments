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
    ga('send', 'event', 'rac', 'basket-add');
    this.save_();
  };

  BasketProto.decrement = function(product) {
    if (this.obj_[product] == 1) {
      delete this.obj_[product];
    }
    else {
      this.obj_[product]--;
    }
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