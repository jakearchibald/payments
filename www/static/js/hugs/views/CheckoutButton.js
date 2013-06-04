(function() {
  function CheckoutButton() {
    var checkoutButton = this;
    this.checkoutBtnForm_ = document.querySelector('.checkout-btn-form');
    this.supportsRac_ = !!this.checkoutBtnForm_.requestAutocomplete;

    this.checkoutFormReady_ = null;
    this.formEl_ = null;

    if (this.supportsRac_) {
      this.checkoutFormReady_ = utils.get('checkout.html').then(function(req) {
        checkoutButton.formEl_ = utils.elFromStr('<div>' + req.responseText + '</div>').querySelector('.checkout-form');
        checkoutButton.formEl_.classList.add('hidden');
        // show delivery part of form
        checkoutButton.formEl_.querySelector('.deliver-to-billing').checked = false;
        checkoutButton.formEl_.querySelector('.delivery-details').style.display = 'block';
        document.body.appendChild(checkoutButton.formEl_);

        checkoutButton.checkoutBtnForm_.querySelector('button').addEventListener('click', function(event) {
          checkoutButton.formEl_.requestAutocomplete();
          event.preventDefault();
        });

        checkoutButton.formEl_.addEventListener('autocomplete', function() {
          checkoutButton.trigger('autocompleteSuccess', utils.form2Obj(checkoutButton.formEl_));
        });

        checkoutButton.formEl_.addEventListener('autocompleteerror', function(event) {
          if (event.reason != 'cancel') {
            checkoutButton.trigger('autocompleteFail', utils.form2Obj(checkoutButton.formEl_));
          }
        });
      });

    }
    else {
      this.checkoutFormReady_ = Q.resolve();
    }
  }

  var CheckoutButtonProto = CheckoutButton.prototype = Object.create(EventEmitter.prototype);

  CheckoutButtonProto.show = function() {
    var checkoutButton = this;
    this.checkoutFormReady_.then(function() {
      checkoutButton.checkoutBtnForm_.style.display = 'block';
    });
  };

  CheckoutButtonProto.hide = function() {
    var checkoutButton = this;
    this.checkoutFormReady_.then(function() {
      checkoutButton.checkoutBtnForm_.style.display = 'none';
    });
  };


  hugs.views.CheckoutButton = CheckoutButton;
})();