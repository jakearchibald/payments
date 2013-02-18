var hugs = {};

hugs.enhanceListing = function() {
  var $basketList = $('.basket-list');
  var $checkoutBtn = $('<button class="btn">Checkout</button>');
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

    $row = $('<li><form action="/remove-from-basket/" class="remove"><span class="text"></span><button class="btn btn2 del" type="submit">X</button></form></li>').data({
      product: product,
      count: 0
    }).appendTo($basketList);

    return $row;
  }

  function showCheckoutButton() {
    $basketList.prev('p').hide();
    if (document.createElement('form').requestAutocomplete) {
      // TODO: download form
    }
    else {
      $checkoutBtn.insertAfter($basketList);
    }
    showingCheckoutButton = true;
  }

  function hideCheckoutButton() {
    $basketList.prev('p').show();
    $checkoutBtn.detach();
    showingCheckoutButton = false;
  }

  $('.product-list').on('submit', '.buy', function(event) {
    var product = $(this).closest('.details').find('.title').text();
    var $row = getRowFor(product);
    $row.data('count', $row.data('count') + 1);
    $row.find('.text').text( $row.data('count') + ' ' + $row.data('product') );

    if (!showingCheckoutButton) {
      showCheckoutButton();
    }

    $row.css({
      transition: '',
      transform: 'scale(1.5)'
    });

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

    if (count) {
      $row.data('count', $row.data('count') - 1);
      $row.find('.text').text( $row.data('count') + ' ' + $row.data('product') );

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
        $row.remove();
        if ($row.parent().children().length === 0) {
          hideCheckoutButton();
        }
      }, 500);

    }

    event.preventDefault();
  });
};