var hugs = {};

hugs.storage = (function() {
  var basket = JSON.parse(localStorage.getItem('basket') || '{}');
  var checkoutDetails = JSON.parse(localStorage.getItem('checkoutDetails') || '{}');

  function saveBasket() {
    localStorage.setItem('basket', JSON.stringify(basket));
  }

  function saveCheckoutDetails() {
    localStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails));
  }

  return {
    getBasket: function() {
      return basket;
    },
    setBasketProduct: function(product, count) {
      if (count) {
        basket[product] = count;
      }
      else {
        delete basket[product];
      }
      saveBasket();
    },
    getCheckoutDetails: function() {
      return checkoutDetails;
    },
    setCheckoutDetails: function(obj) {
      checkoutDetails = obj;
      saveCheckoutDetails();
    },
    emptyBasket: function() {
      basket = {};
      saveBasket();
    },
    clearCheckoutDetails: function() {
      checkoutDetails = {};
      saveCheckoutDetails();
    }
  };
}());

hugs.enhanceListing = function(checkoutPage) {
  var $basketList = $('.basket-list');
  var $basketPad = $('.basket-pad');
  var $sideBar = $('.side-bar');
  var $checkoutForm;

  if (!checkoutPage) {
    var $checkoutBtn = $('<form action="checkout.html"><p><button class="btn checkout-side" type="submit">Checkout</button></p></form>');
  }

  var showingCheckoutButton = false;

  function getRowFor(product) {
    var $rows = $basketList.children();
    var $row;

    for (var i = 0, len = $rows.length; i < len; i++) {
      $row = $rows.eq(i);
      if ($row.data('product') == product) {
        return $row;
      }
    }

    $row = $('<li><form action="remove-from-basket.html" class="remove"><span class="text"></span><button class="btn btn2 del" type="submit">X</button></form></li>').data({
      product: product,
      count: 0
    }).appendTo($basketList);

    return $row;
  }

  function setBasketPad() {
    $basketPad.height( $sideBar.outerHeight() );
  }

  function showCheckoutButton() {
    $basketList.prev('p').hide();
    if (!checkoutPage) {
      if (document.createElement('form').requestAutocomplete && !$checkoutForm) {
        $.ajax('checkout.html').done(function(response) {
          $checkoutForm = $(response).find('.checkout-form').appendTo('body').addClass('hidden');

          // show delivery part of form
          $checkoutForm.find('.deliver-to-billing')[0].checked = false;
          $checkoutForm.find('.delivery-details').css('display', 'block');

          $checkoutForm.on('autocomplete', function(event) {
            hugs.storage.setCheckoutDetails($checkoutForm.serializeObj());
            window.location.href = 'confirm.html';
          }).on('autocompleteerror', function(event) {
            console.log(event);
          }).on('invalid', function(event) {
            hugs.storage.setCheckoutDetails($checkoutForm.serializeObj());
            window.location.href = 'checkout.html';
            event.preventDefault();
          });
          $checkoutBtn.insertAfter($basketList);
          $checkoutBtn[0].addEventListener('click', function(event) {
            $checkoutForm[0].requestAutocomplete();
            event.preventDefault();
          });
          setBasketPad();
        });
      }
      else {
        $checkoutBtn.insertAfter($basketList);
        setBasketPad();
      }

      $sideBar.css('transition', 'transform 0.5s ease-out').css('WebkitTransition', '-webkit-transform 0.5s ease-out').addClass('not-empty').one('transitionend webkitTransitionEnd', function(event) {
        if (this == event.target) $sideBar.css('transition', 'none');
      });
    }
    showingCheckoutButton = true;
  }

  function hideCheckoutButton() {
    $basketList.prev('p').show();
    if (!checkoutPage) {
      $checkoutBtn.detach();

      $sideBar.css('transition', 'transform 0.5s ease-in').css('WebkitTransition', '-webkit-transform 0.5s ease-out').removeClass('not-empty').one('transitionend webkitTransitionEnd', function(event) {
        if (this == event.target) $sideBar.css('transition', 'none');
      });
    }
    showingCheckoutButton = false;
  }

  $.each(hugs.storage.getBasket(), function(product, count) {
    var $row = getRowFor(product);
    $row.data('count', count);
    $row.find('.text').text( $row.data('count') + ' ' + $row.data('product') );

    if (!showingCheckoutButton) {
      showCheckoutButton();
    }
  });

  $('.product-list').on('submit', '.buy', function(event) {
    var product = $(this).closest('.details').find('.title').text();
    var $row = getRowFor(product);
    $row.data('count', $row.data('count') + 1);
    $row.find('.text').text( $row.data('count') + ' ' + $row.data('product') );

    hugs.storage.setBasketProduct($row.data('product'), $row.data('count'));

    if (!showingCheckoutButton) {
      showCheckoutButton();
    }

    $row.css({
      transition: '',
      transform: 'scale(1.5)'
    });

    setBasketPad();
    $row[0].offsetWidth; // hack reflow
    
    $row.css({
      transition: 'all 0.2s ease-out',
      transform: ''
    });

    event.preventDefault();
  });

  $basketList.on('submit', '.remove', function(event) {
    var $row = $(this).closest('li');
    var count = $row.data('count') - 1;

    hugs.storage.setBasketProduct($row.data('product'), $row.data('count') - 1);

    if (count) {
      $row.data('count', $row.data('count') - 1);
      $row.find('.text').text( $row.data('count') + ' ' + $row.data('product') );

      if (!checkoutPage) {
        $row.css({
          transition: '',
          transform: 'scale(0.8)'
        });

        $row[0].offsetWidth; // hack reflow
        
        $row.css({
          transition: 'all 0.2s ease-out',
          transform: ''
        });
      }
    }
    else {
      if (checkoutPage) {
        if ($row.parent().children().length === 1) {
          hideCheckoutButton();
        }
        $row.remove();
      }
      else {
        $row.addClass('').css({
          transition: '',
          position: 'absolute',
          transformOrigin: '0 0',
          width: $row.css('width'),
          zIndex: 1
        });

        $row[0].offsetWidth;

        $row.css({
          transition: 'all 0.3s ease-in',
          transform: 'translate(0, 10px) rotate(60deg)',
          opacity: 0
        });

        setTimeout(function() {
          if ($row.parent().children().length === 1) {
            hideCheckoutButton();
          }
          $row.remove();
        }, 500);
      }
    }

    event.preventDefault();
  });
};

$.fn.serializeObj = function() {
  var obj = {};

  this.serializeArray().forEach(function(item) {
    obj[item.name] = item.value;
  });

  return obj;
};

hugs.enhanceCheckoutForm = function() {
  var $detailsToggle = $('.deliver-to-billing');
  var $deliveryDetails = $('.delivery-details');
  var $checkoutForm = $('.checkout-form');

  function showHideDeliveryDetails() {
    $deliveryDetails.css('display', $detailsToggle[0].checked ? 'none' : 'block');
  }

  $detailsToggle.on('change', showHideDeliveryDetails);

  $checkoutForm.on('submit', function(event) {
    hugs.storage.setCheckoutDetails($checkoutForm.serializeObj());
  });

  $.each(hugs.storage.getCheckoutDetails(), function(name, value) {
    $('[name=' + name + ']').val(value);
  });

  showHideDeliveryDetails();
};

hugs.enhanceConfirmPage = function() {
  var $basketList = $('.basket-list');
  var checkoutDetails = hugs.storage.getCheckoutDetails();

  $.each(hugs.storage.getBasket(), function(product, count) {
    $('<li/>').text(count + ' ' + product).appendTo($basketList);
  });

  if (checkoutDetails['deliver-to-billing']) {
    $('.delivery-info').text("Deliver to billing address");
  }

  $.each(checkoutDetails, function(name, value) {
    $('.from-form.' + name).text(value);
  });

  $('.place-order-form').on('submit', function(event) {
    hugs.storage.emptyBasket();
    hugs.storage.clearCheckoutDetails();
  });
};