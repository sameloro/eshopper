'use strict';


var mongoose = require('mongoose'),
Products = mongoose.model('Products'),
Customers = mongoose.model('Customers'),
Promotions = mongoose.model('Promotions'),
Orders = mongoose.model('Orders'),
Basket = mongoose.model('Basket'),
Admins = mongoose.model('Admins'),
session = require("express-session");
var ObjectId = mongoose.Types.ObjectId;



    ///////////////////////////////////////////
    //           Products                    //
    //////////////////////////////////////////

exports.list_all_products = function(req, res) {
    var tokkenid = req.params.tokkenid;
    Products.find({}, function(err, product) {
    if (err)
      res.send(err);
    res.json(product);
  });
};


exports.create_a_product = function(req, res) {
  var tokkenid = req.params.tokkenid;
  var new_product = new Products(req.body);
  new_product.save(function(err, product) {
    if (err)
      res.send(err);
    res.json(product);
  });
};


exports.read_a_product = function(req, res) {
  var tokkenid = req.params.tokkenid;
    Products.findById(new ObjectId(req.params.id), function(err, product) {
    if (err)
      res.send(err);
    res.json(product);
  });
};


exports.update_a_product = function(req, res) {
  var tokkenid = req.params.tokkenid;
    Products.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, product) {
    if (err)
      res.send(err);
    res.json(product);
  });
};


exports.delete_a_product = function(req, res) {
  var tokkenid = req.params.tokkenid;
    Products.remove({
    _id: req.params.id
  }, function(err, product) {
    if (err)
      res.send(err);
    res.json({ message: 'Product successfully deleted' });
  });
};


    ///////////////////////////////////////////
    //           Customers                   //
    //////////////////////////////////////////
exports.list_all_customers = function(req, res) {
    var tokkenid = req.params.tokkenid;
    console.log(tokkenid+" == "+req.tokkenid);
    Customers.find({}, function(err, customer) {
    if (err)
      res.send(err);
    res.json(customer);
  });
};


exports.create_a_customer = function(req, res) {
  var new_customer = new Customers(req.body);
  //console.log(tokkenid+" == "+req.session.tokkenid);
  new_customer.save(function(err, customer) {
    if (err)
      res.send(err);
    res.json(customer);
  });
};


exports.read_a_customer = function(req, res) {
    var tokkenid = req.params.tokkenid;
    //console.log(tokkenid+" == "+req.session.tokkenid);
    Customers.findById(req.params.id, function(err, customer) {
    if (err)
      res.send(err);
    res.json(customer);
  });
};


exports.update_a_customer = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Customers.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, customer) {
    if (err)
      res.send(err);
    res.json(customer);
  });
};


exports.delete_a_customer = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Customers.remove({
    _id: req.params.id
  }, function(err, customer) {
    if (err)
      res.send(err);
    res.json({ message: 'Customer successfully deleted' });
  });
};

exports.list_all_admins = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Admins.find({}, function(err, admin) {
    if (err)
      res.send(err);
    res.json(admin);
  });
};

    ///////////////////////////////////////////
    //           Admin                       //
    //////////////////////////////////////////

exports.create_a_admin = function(req, res) {
  var tokkenid = req.params.tokkenid;
  var new_admin = new Admins(req.body);
  new_admin.save(function(err, admin) {
    if (err)
      res.send(err);
    res.json(admin);
  });
};


exports.read_a_admin = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Admins.findById(new ObjectId(req.params.id), function(err, admin) {
    if (err)
      res.send(err);
    res.json(admin);
  });
};


exports.update_a_admin = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Admins.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, admin) {
    if (err)
      res.send(err);
    res.json(admin);
  });
};


exports.delete_a_admin = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Admins.remove({
    _id: req.params.id
  }, function(err, admin) {
    if (err)
      res.send(err);
    res.json({ message: 'Admin successfully deleted' });
  });
};

    ///////////////////////////////////////////
    //           Promotions                  //
    //////////////////////////////////////////

exports.list_all_promotions = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Promotions.find({}, function(err, promotion) {
    if (err)
      res.send(err);
    res.json(promotion);
  });
};


exports.create_a_promotion = function(req, res) {
  var tokkenid = req.params.tokkenid;
  var new_promotion = new Promotions(req.body);
  new_promotion.save(function(err, promotion) {
    if (err)
      res.send(err);
    res.json(promotion);
  });
};


exports.read_a_promotion = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Promotions.findById(new ObjectId(req.params.id), function(err, promotion) {
    if (err)
      res.send(err);
    res.json(promotion);
  });
};


exports.update_a_promotion = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Promotions.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, promotion) {
    if (err)
      res.send(err);
    res.json(promotion);
  });
};


exports.delete_a_promotion = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Promotions.remove({
    _id: req.params.id
  }, function(err, promotion) {
    if (err)
      res.send(err);
    res.json({ message: 'Promotion successfully deleted' });
  });
};

    ///////////////////////////////////////////
    //           Orders                      //
    //////////////////////////////////////////

exports.list_all_orders = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Orders.find({}, function(err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};


exports.create_a_order = function(req, res) {
  var tokkenid = req.params.tokkenid;
  var new_order = new Orders(req.body);
  new_order.save(function(err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};


exports.read_a_order = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Orders.findById(new ObjectId(req.params.id), function(err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};


exports.update_a_order = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Orders.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, order) {
    if (err)
      res.send(err);
    res.json(order);
  });
};


exports.delete_a_order = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Orders.remove({
    _id: req.params.id
  }, function(err, order) {
    if (err)
      res.send(err);
    res.json({ message: 'Order successfully deleted' });
  });
};


    ///////////////////////////////////////////
    //           Basket                      //
    //////////////////////////////////////////

exports.list_all_baskets = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Baskets.find({}, function(err, basket) {
    if (err)
      res.send(err);
    res.json(basket);
  });
};


exports.create_a_basket = function(req, res) {
  var tokkenid = req.params.tokkenid;
  var new_basket = new Baskets(req.body);
  new_basket.save(function(err, basket) {
    if (err)
      res.send(err);
    res.json(basket);
  });
};


exports.read_a_basket = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Baskets.findById(new ObjectId(req.params.id), function(err, basket) {
    if (err)
      res.send(err);
    res.json(basket);
  });
};


exports.update_a_basket = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Baskets.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, basket) {
    if (err)
      res.send(err);
    res.json(basket);
  });
};


exports.delete_a_basket = function(req, res) {
  var tokkenid = req.params.tokkenid;  
  Baskets.remove({
    _id: req.params.id
  }, function(err, basket) {
    if (err)
      res.send(err);
    res.json({ message: 'Basket successfully deleted' });
  });
};

