(function() {
  function Checkout() {
    var checkout = this;
    this.deliveryDetails_ = document.querySelector('.delivery-details');
    this.deliverToBilling_ = document.querySelector('.deliver-to-billing');
    this.checkoutForm_ = document.querySelector('.checkout-form');

    this.deliverToBilling_.addEventListener('change', this.showHideDeliveryDetails_.bind(this));
    this.checkoutForm_.addEventListener('submit', function(event) {
      checkout.trigger('submit', utils.form2Obj(checkout.checkoutForm_));
      event.preventDefault();
    });
  }

  var CheckoutProto = Checkout.prototype = Object.create(EventEmitter.prototype);

  CheckoutProto.populateForm = function(formObj) {
    // hacky but works
    var field;
    var fieldName;

    for (fieldName in formObj) {
      field = document.querySelector('[name=' + fieldName + ']');

      if (field.type == 'checkbox') {
        field.checked = !!formObj[fieldName];
      }
      else {
        field.value = formObj[fieldName];
      }
    }

    this.showHideDeliveryDetails_();
  };

  CheckoutProto.showHideDeliveryDetails_ = function() {
    this.deliveryDetails_.style.display = this.deliverToBilling_.checked ? 'none' : 'block';
  };

  hugs.views.Checkout = Checkout;
})();