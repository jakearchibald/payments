(function() {
  function CheckoutDetails() {
    hugs.models.Storage.call(this, 'checkoutDetails');
  }

  CheckoutDetails.prototype = Object.create(hugs.models.Storage.prototype);

  hugs.models.CheckoutDetails = CheckoutDetails;
})();