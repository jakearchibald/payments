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

    $row = $('<li><form action="/remove-from-basket/" class="remove"><span class="text"></span><button class="btn" type="submit">X</button></form></li>').data({
      product: product,
      count: 0
    }).appendTo($basketList);

    return $row;
  }

  function showCheckoutButton() {
    if (document.createElement('form').requestAutocomplete) {
      // TODO: download form
    }
    else {
      $checkoutBtn.insertAfter($basketList);
    }
    showingCheckoutButton = true;
  }

  $('.product-list').on('submit', '.buy', function(event) {
    $basketList.prev('p').hide();
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
    $row[0].offsetWidth;
    $row.css({
      transition: 'all 0.2s ease-out',
      transform: ''
    });

    event.preventDefault();
  });

  $basketList.on('submit', '.remove', function() {
    
  });
};