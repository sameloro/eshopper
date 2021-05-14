'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/todoListController');
    ///////////////////////////////////////////
    //           Products Routes             //
    //////////////////////////////////////////
    app.route('/:tokkenid/products')
        .get(todoList.list_all_products)
        .post(todoList.create_a_product);


    app.route('/:tokkenid/products/:id')
        .get(todoList.read_a_product)
        .put(todoList.update_a_product)
        .delete(todoList.delete_a_product);

    ///////////////////////////////////////////
    //           Customers Routes            //
    //////////////////////////////////////////
    app.route('/:tokkenid/customers')
    .get(todoList.list_all_customers)
    .post(todoList.create_a_customer);


    app.route('/:tokkenid/customers/:id')
    .get(todoList.read_a_customer)
    .put(todoList.update_a_customer)
    .delete(todoList.delete_a_customer);

    ///////////////////////////////////////////
    //           Admin Routes              //
    //////////////////////////////////////////
    app.route('/:tokkenid/:tokkenid/admins')
    .get(todoList.list_all_admins)
    .post(todoList.create_a_admin);


    app.route('/:tokkenid/admins/:id')
    .get(todoList.read_a_admin)
    .put(todoList.update_a_admin)
    .delete(todoList.delete_a_admin);

    ///////////////////////////////////////////
    //           Promotions Routes           //
    //////////////////////////////////////////
    app.route('/:tokkenid/promotions')
    .get(todoList.list_all_promotions)
    .post(todoList.create_a_promotion);


    app.route('/:tokkenid/promotions/:id')
    .get(todoList.read_a_promotion)
    .put(todoList.update_a_promotion)
    .delete(todoList.delete_a_promotion);

    ///////////////////////////////////////////
    //           Orders Routes              //
    //////////////////////////////////////////
    app.route('/:tokkenid/orders')
    .get(todoList.list_all_orders)
    .post(todoList.create_a_order);


    app.route('/:tokkenid/orders/:id')
    .get(todoList.read_a_order)
    .put(todoList.update_a_order)
    .delete(todoList.delete_a_order);
};
