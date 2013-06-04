(function() {
  function Basket() {
    var basket = this;
    this.el_ = document.querySelector('.basket');
    this.mobilePadding_ = document.querySelector('.basket-pad');
    this.emptyMsgEl_ = this.el_.querySelector('.empty-msg');
    this.listEl_ = this.el_.querySelector('.basket-list');
    
    this.rowsById_ = {};
  }

  var BasketProto = Basket.prototype = Object.create(EventEmitter.prototype);

  BasketProto.add = function(animate, id, text, num) {
    var basket = this;
    var row = this.getRow_(id);
    row.querySelector('.text').textContent = num + ' ' + text;

    this.emptyMsgEl_.style.display = 'none';

    utils.css(row, 'transition', '');

    if (animate) {
      utils.css(row, 'transform', 'scale(1.5)');
    }

    this.addMobilePadding_();

    if (animate) {
      utils.transition(row, {
        transform: ''
      }, 0.2, 'easeOutQuad');
    }
  };

  BasketProto.remove = function(animate, id, text, num) {
    var basket = this;
    var row = this.getRow_(id);

    function removeRow() {
      row.parentNode.removeChild(row);
      if (basket.listEl_.childNodes.length === 0) {
        basket.emptyMsgEl_.style.display = 'block';
      }
    }

    if (num) {
      row.querySelector('.text').textContent = num + ' ' + text;
      utils.css(row, 'transition', '');
      if (animate) {
        utils.css(row, 'transform', 'scale(0.8)');
        utils.transition(row, {
          transform: ''
        }, 0.2, 'easeOutQuad');
      }
    }
    else {
      delete this.rowsById_[id];

      if (animate) {
        utils.transition(row, {
          transform: 'scale(0.1)',
          opacity: '0'
        }, 0.2, 'easeOutQuad').then(function() {
          if (basket.listEl_.childNodes.length > 1) {
            row.style.height = row.offsetHeight + 'px';
            return utils.transition(row, {
              height: '0',
              marginTop: '-10px'
            }, 0.3, 'easeInOutQuad');
          }
        }).then(removeRow);
      }
      else {
        removeRow();
      }
    }
  };

  BasketProto.getRow_ = function(id) {
    var basket = this;
    var row = this.rowsById_[id];

    if (!row) {
      row = utils.elFromStr('<li><form action="remove-from-basket.html" class="remove"><span class="text"></span><button class="btn btn2 del" type="submit">X</button></form></li>');
      row.querySelector('form').addEventListener('submit', function(event) {
        basket.trigger('removeItem', id);
        event.preventDefault();
      });
      this.listEl_.appendChild(row);
      this.rowsById_[id] = row;
    }

    return row;
  };

  BasketProto.addMobilePadding_ = function() {
    if (this.mobilePadding_) {
      this.mobilePadding_.style.height = this.el_.offsetHeight + 'px';
    }
  };

  // views
  // hugs.views.Basket;
  // - add item (animate)
  // - remove item (animate)
  // Fires events when remove is pressed, controller still has to remove items


  hugs.views.Basket = Basket;
})();