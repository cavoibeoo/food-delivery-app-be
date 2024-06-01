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
router.get('/product', productController.getAllProducts);  //For users
router.get('/products', productController.getAllProductsAdmin);  //For users

router.get('/product/bestseller/', productController.getBestSeller);
router.post('/product/recent', productController.getRecentById)
router.post('/product/id/', productController.getProductById);
router.post('/product/cat/', productController.getProductByCat);
router.post('/product/add/', upload.single("thumbnail"), productController.addProduct);
router.post('/product/search/', productController.searchProduct);
router.put('/product/update/',upload.single("thumbnail"), productController.updateProduct);
// router.put('/product/size/', productController.updateSizeProduct);
router.put('/product/disable/', productController.deleteProduct); //use for admin disable product
router.put('/product/enable/', productController.enableProduct);

module.exports = {
    routes: router
}