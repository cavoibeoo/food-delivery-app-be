'use strict';

const express = require('express');
const orderController = require('../controllers/orderController');    
const router = express.Router();

router.get('/orders', orderController.getAllOrders);   
router.get('/order/id/', orderController.getOrderByUserId);
router.post('/order/info/', orderController.getOrderInfo)
router.post('/order/add/', orderController.createOrder);
router.put('/order/update/', orderController.updateOrder);
router.put('/order/cancel/', orderController.cancelOrder);


module.exports = {
    routes: router
}