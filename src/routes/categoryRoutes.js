'use strict';

const express = require('express');
const categoryController = require('../controllers/categoryController');  
const router = express.Router();

router.get('/categories', categoryController.getAllCategories); // get all categories
router.get('/category/', categoryController.getCategoryById); // get category by it's ID
router.post('/category/', categoryController.addCategory); // add category
router.put('/category/', categoryController.updateCategory); // update category
router.put('/category/enable', categoryController.enableCategory); // enable category
router.put('/category/disable', categoryController.disableCategory);    // disable category

// router.delete('/category/', categoryController.deleteCategory);


module.exports = {
    routes: router
}