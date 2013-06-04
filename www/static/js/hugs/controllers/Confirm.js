(function() {
  function Confirm() {
    var basketModel = new hugs.models.Basket();
    var checkoutDetails = new hugs.models.CheckoutDetails();

    var confirmView = new hugs.views.Confirm();

    for (var productName in basketModel.get()) {
      confirmView.addItem(productName, basketModel.getNum(productName));
    }

    confirmView.populateSummary(checkoutDetails.get());

    confirmView.on('placeOrder', function() {
      basketModel.clear();
      checkoutDetails.clear();
      window.location.href = 'place-order.html';
    });
  }

  var ConfirmProto = Confirm.prototype;

  hugs.controllers.Confirm = Confirm;
})();