'use strict';

const express = require('express');
const categoryController = require('../controllers/categoryController');  
const router = express.Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/category/', categoryController.getCategoryById);
router.post('/category/', categoryController.addCategory);
router.put('/category/', categoryController.updateCategory);
router.put('/category/enable', categoryController.enableCategory);
router.put('/category/disable', categoryController.disableCategory);

// router.delete('/category/', categoryController.deleteCategory);


module.exports = {
    routes: router
}