'use strict';

const express = require('express');
const orderController = require('../controllers/orderController');    
const router = express.Router();

router.get('/orders', orderController.getAllOrders);   // get all orders
router.get('/order/id/', orderController.getOrderByUserId); // get order by user id
router.post('/order/info/', orderController.getOrderInfo) // get order by order id for admin 
router.post('/order/add/', orderController.createOrder); // create order
router.put('/order/update/', orderController.updateOrder); // update order status
router.put('/order/cancel/', orderController.cancelOrder); // cancel order


module.exports = {
    routes: router
}