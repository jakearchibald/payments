(function() {
  function Checkout() {
    var basketModel = new hugs.models.Basket();
    var checkoutDetails = new hugs.models.CheckoutDetails();

    var checkoutView = new hugs.views.Checkout();
    var basketView = new hugs.views.Basket();

    for (var productName in basketModel.get()) {
      basketView.add(false, productName, productName, basketModel.getNum(productName));
    }

    basketView.on('removeItem', function(productName) {
      basketModel.decrement(productName);
      basketView.remove(false, productName, productName, basketModel.getNum(productName));
    });

    checkoutView.populateForm(checkoutDetails.get());

    checkoutView.on('submit', function(formData) {
      checkoutDetails.set(formData);
      window.location.href = 'confirm.html';
    });
  }

  var CheckoutProto = Checkout.prototype;

  hugs.controllers.Checkout = Checkout;
})();