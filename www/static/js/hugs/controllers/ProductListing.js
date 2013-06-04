(function() {
  function ProductListing() {
    var basketModel = new hugs.models.Basket();
    var checkoutDetails = new hugs.models.CheckoutDetails();

    var basketView = new hugs.views.Basket();
    var checkoutButtonView = new hugs.views.CheckoutButton();
    var mobileFixedBasket = new hugs.views.MobileFixedBasket();

    for (var productName in basketModel.get()) {
      basketView.add(false, productName, productName, basketModel.getNum(productName));
      checkoutButtonView.show();
      mobileFixedBasket.show(false);
    }

    // events for add to basket buttons
    Array.prototype.forEach.call(document.querySelectorAll('.buy'), function(form) {
      form.addEventListener('submit', function(event) {
        // bit hacky, but nevermind
        var productName = form.parentNode.querySelector('.title').textContent;
        basketModel.increment(productName);
        basketView.add(true, productName, productName, basketModel.getNum(productName));
        checkoutButtonView.show();
        mobileFixedBasket.show(true);
        event.preventDefault();
      });
    });

    basketView.on('removeItem', function(productName) {
      basketModel.decrement(productName);
      basketView.remove(true, productName, productName, basketModel.getNum(productName));
      if (basketModel.isEmpty()) {
        checkoutButtonView.hide();
        mobileFixedBasket.hide(true);
      }
    });

    checkoutButtonView.on('autocompleteSuccess', function(formData) {
      checkoutDetails.set(formData);
      window.location.href = 'confirm.html';
    });

    checkoutButtonView.on('autocompleteFail', function(formData) {
      checkoutDetails.set(formData);
      window.location.href = 'checkout.html';
    });
  }

  var ProductListingProto = ProductListing.prototype;

  hugs.controllers.ProductListing = ProductListing;
})();