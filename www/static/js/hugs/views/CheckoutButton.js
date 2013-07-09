(function() {
  function CheckoutButton(useRac) {
    var checkoutButton = this;
    this.checkoutBtnForm_ = document.querySelector('.checkout-btn-form');

    this.checkoutFormReady_ = null;
    this.formEl_ = null;

    if (useRac) {
      this.checkoutFormReady_ = utils.get('checkout.html').then(function(req) {
        checkoutButton.formEl_ = utils.elFromStr('<div>' + req.responseText + '</div>').querySelector('.checkout-form');
        checkoutButton.formEl_.style.display = 'none';

        // request autocomplete will provide delivery details, even if they're the same as billing
        checkoutButton.formEl_.querySelector('.deliver-to-billing').checked = false;
        document.body.appendChild(checkoutButton.formEl_);

        checkoutButton.checkoutBtnForm_.querySelector('button').addEventListener('click', function(event) {
          ga('send', 'event', 'rac', 'rac-called');
          checkoutButton.formEl_.requestAutocomplete();
          event.preventDefault();
        });

        checkoutButton.formEl_.addEventListener('autocomplete', function() {
          ga('send', 'event', 'rac', 'rac-success');
          checkoutButton.trigger('autocompleteSuccess', utils.form2Obj(checkoutButton.formEl_));
        });

        checkoutButton.formEl_.addEventListener('autocompleteerror', function(event) {
          ga('send', 'event', 'rac', 'rac-error-' + event.reason, 'error');
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