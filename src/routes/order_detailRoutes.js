'use strict';

const express = require('express');
const orderDetailController = require('../controllers/orderDetailsController');    
const router = express.Router();

// router.get('/order-details', orderdetailController.getAllOrderdetails);   
router.get('/order-detail/orderid/', orderDetailController.getByOrderID);  //get order details by order ID
// router.post('/order-detail/order/id/', orderdetailController.getODInOrder);
// router.post('/order-detail/manage/', orderdetailController.getODAdmin);
// router.post('/order-detail/add/', orderdetailController.addOrderdetail);
// router.put('/order-detail/', orderdetailController.updateOrderdetail);
// router.put('/order-detail/quantity/', orderdetailController.updateQuantOD);
// router.delete('/order-detail/', orderdetailController.deleteOrderdetail);


module.exports = {
    routes: router
}