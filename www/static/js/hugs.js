var hugs = {};

hugs.enhanceCheckout = function() {
  var $checkoutLink = $('.hugs-checkout');

  if (!document.createElement('form').requestAutocomplete) {
    $checkoutLink.css('display', 'block');
    console.log('No autocomplete support');
    return;
  }
};