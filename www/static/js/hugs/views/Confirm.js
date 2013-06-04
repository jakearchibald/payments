(function() {
  function Confirm() {
    var confirm = this;
    this.itemList_ = document.querySelector('.basket-list');

    document.querySelector('.place-order-form').addEventListener('submit', function(event) {
      confirm.trigger('placeOrder');
      event.preventDefault();
    });
  }

  var ConfirmProto = Confirm.prototype = Object.create(EventEmitter.prototype);

  ConfirmProto.addItem = function(product, num) {
    var li = document.createElement('li');
    li.textContent = num + ' ' + product;
    this.itemList_.appendChild(li);
  };

  ConfirmProto.populateSummary = function(formData) {
    // This can only be called once per page
    // It's a hack, I don't care.
    if (formData['deliver-to-billing']) {
      document.querySelector('.delivery-info').textContent = "Deliver to billing address";
    }

    var summaryEl;

    for (var fieldName in formData) {
      summaryEl = document.querySelector('.from-form.' + fieldName);

      if (summaryEl) {
        summaryEl.textContent = formData[fieldName];
      }
    }
  };

  hugs.views.Confirm = Confirm;
})();