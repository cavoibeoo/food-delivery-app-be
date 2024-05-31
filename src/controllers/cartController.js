'use strict';

const userData = require('../data/cart');

const getCartById = async (req, res, next) => {

    try {
        const id = req.cookies.user_id;
        if (!id) res.status(404).send(`User not found`);

        let cart = await userData.getCartById(id);
        // cart = cart.filter(cartItem => cartItem != {})
        res.send(cart);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const addProduct = async (req, res, next) => {
 
    try {
        const id = req.cookies.user_id;
        if (!id) return res.status(404).send(`User not found`);
        
        const product = await userData.addProduct(id, req.body);
        res.send(product);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const removeProduct = async (req, res, next) => {
    try {
        const id = req.cookies.user_id;
        if (!id) res.status(404).send(`User not found`);
        
        const product = await userData.removeProduct(id, req.body);
        res.send(product);
    }catch(error) {
        res.status(400).send(error.message);
    }
}


// Input example: {product_ids: [1, 2, 3]}
const validateCartItem = async (req, res, next) => {
    try {
        const id = req.cookies.user_id;
        if (!id) return res.status(404).send(`User not found`);
        
        const product = await userData.validateCartItem(id, req.body.product_ids);
        res.send(product);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getCartById,
    addProduct,
    removeProduct,
    validateCartItem
}