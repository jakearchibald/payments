var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/www/static'));

app.all('/', function(req, res){
  res.sendfile('www/index.html');
});

app.all('/index.html', function(req, res){
  res.sendfile('www/index.html');
});

app.all('/checkout.html', function(req, res){
  res.sendfile('www/checkout.html');
});

app.all('/confirm.html', function(req, res){
  res.sendfile('www/confirm.html');
});

app.all('/place-order.html', function(req, res){
  res.sendfile('www/place-order.html');
});

app.listen(3000);

exports = app;