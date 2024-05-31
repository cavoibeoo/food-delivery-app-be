'use strict';

const express = require('express'); 
const userController = require('../controllers/cartController');   
const categoryController = require('../controllers/categoryController');   

const router = express.Router();

router.get('/cart/', userController.getCartById);
router.post('/cart/add/', userController.addProduct);
router.post('/cart/validate/', userController.validateCartItem);
router.delete('/cart/remove/', userController.removeProduct);
// router.get('/category/', categoryController.getCategory);

module.exports = {
    routes: router
}