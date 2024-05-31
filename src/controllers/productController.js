    'use strict';

const productData = require('../data/product');
const userData = require('../data/user')

const getAllProducts = async (req, res, next) => {
    try {
        const productList = await productData.getProduct();
        res.send(productList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getAllProductsAdmin = async (req, res, next) => {
    try {
        const productList = await productData.getProductAdmin();
        res.send(productList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getProductById = async (req, res, next) => {
    try {
        const data = req.body;
        const product = await productData.getById(data);

        let recent
        if (req.cookies.user_id){
            recent = await userData.addRecentProduct(req.cookies.user_id, data.product_id )
        }

        //console.log(product, data);
        // res.send({"product" : product, "recent" : recent});
        res.send( product);

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getRecentById = async (req, res, next) => {
    try {
        const data = req.body;
        const product = await productData.getById(data);
        //console.log(product, data);
        // res.send({"product" : product, "recent" : recent});
        res.send( product);

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getProductByCat = async (req, res, next) => {
    try {
        const data = req.body;
        const product = await productData.getByCat(data);
        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addProduct = async (req, res, next) => {
    try {
        const data = req.body;

        if (!req.file) {
          return res.status(400).json({ message: 'Food image is missing!' });
        }       

        const insert = await productData.createProduct(data, req.file);
    
        // Send the response
        const combineRes = {
            status: 200,
            message: "Added successfully",
            insert: insert
        }
        res.send(combineRes);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const searchProduct = async (req, res, next) => {
    try {
        const title = req.body.title;
        const search = await productData.searchProduct(title);
        res.send(search);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const data = req.body;
        const updated = await productData.updateProduct(data, req.file);

        const combineRes = {
            status: 200,
            message: "Updated successfully",
            updated: updated
        }
        res.send(combineRes);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getBestSeller = async (req, res, next) => {
    try {
        const data = req.body;
        const bestSeller = await productData.getBestSeller();

        res.send(bestSeller);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// const updateSizeProduct = async (req, res, next) => {
//     try {
//         const data = req.body;
//         const updated = await productData.updateSizeProduct(data);
//         res.send(updated);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.body.product_id;
        // console.log(id);
        const deleted = await productData.deleteProduct(id);
        res.send(deleted);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const enableProduct = async (req, res, next) =>{
    try {
        const id = req.body.product_id;
        const enable = await productData.enableProduct(id);
        res.send(enable);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    getRecentById,
    getProductByCat,
    searchProduct,
    addProduct, 
    updateProduct, 
    // updateSizeProduct,
    deleteProduct,
    enableProduct,
    getBestSeller,
    getAllProductsAdmin
}