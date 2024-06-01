'use strict';

const express = require('express'); 
const userController = require('../controllers/cartController');   
const categoryController = require('../controllers/categoryController');   

const router = express.Router();

router.get('/cart/', userController.getCartById); // Call the Controller get the user cart
router.post('/cart/add/', userController.addProduct); // Call Controller add the product
router.post('/cart/validate/', userController.validateCartItem); // Call Controller validate the product in cart
router.delete('/cart/remove/', userController.removeProduct); // Call Controller remove the product from cart
// router.get('/category/', categoryController.getCategory);

module.exports = {
    routes: router
}