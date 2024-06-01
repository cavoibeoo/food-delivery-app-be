'use strict';

const express = require('express');
const productController = require('../controllers/productController');  
const router = express.Router();
const multer = require('multer')
const path = require('path');

//file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public', 'dataset',))
    },
    filename: function(req, file, cb) {
        cb(null, req.body.title +".jpg")
    }
})

const upload = multer({storage: storage})

//link to the routes of each type
router.get('/product', productController.getAllProducts);  //For users to get all products
router.get('/products', productController.getAllProductsAdmin);  //For admin to get all products
router.get('/product/bestseller/', productController.getBestSeller); //get the bestseller product
router.post('/product/recent', productController.getRecentById) // get recent accessed product of user
router.post('/product/id/', productController.getProductById); //get product by it's id
router.post('/product/cat/', productController.getProductByCat); //get product by category
router.post('/product/add/', upload.single("thumbnail"), productController.addProduct); //for admin to add a new product
router.post('/product/search/', productController.searchProduct); // search product
router.put('/product/update/',upload.single("thumbnail"), productController.updateProduct); // for admin to update a product
// router.put('/product/size/', productController.updateSizeProduct);
router.put('/product/disable/', productController.deleteProduct); //use for admin disable product
router.put('/product/enable/', productController.enableProduct);//use for admin enable product

module.exports = {
    routes: router
}