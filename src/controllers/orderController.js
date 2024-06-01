'use strict';
const moment = require('moment-timezone');
const orderData = require('../data/order');
const cartData = require('../data/cart');
const productData = require('../data/product');
const orderDetailsData = require('../data/order_details');

// const order_detailData = require('../data/order_details');

// get all order
const getAllOrders = async (req, res, next) => {
    try {

        const orderList = await orderData.getOrder();
        // console.log(new Date())
        res.send(orderList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get order by user id
//get by user id/ use for fetch all orders that user ordered
const getOrderByUserId = async (req, res, next) => {
    try {
        if (!req.cookies.user_id) {
            return res.send({
                status: 'Error',
                message: 'User is not logged in'
            });
        } else {
            const order = await orderData.getByUserId(req.cookies.user_id);
            res.send(order);
        }
        //console.log(order, data);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get order information
const getOrderInfo = async (req, res, next) => {
    try {
        const order_id = req.body.order_id
        const order = await orderData.getOrderInfo(order_id);
        //console.log(order, data);
        res.send(order);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Create order
// Created status is 0: cancel, 1: pending, 2: shipping, 3 completed
// //add by user, when user checkout
const createOrder = async (req, res, next) =>{
    try {

        if (!req.cookies.user_id) {
            return res.send({
                status: 'Error',
                message: 'User is not logged in'
            });
        } 

        const productIdsData = req.body.product_ids // product_ids: [1,2,3]

        //Check if product is in cart and is still in stock
        const cartItem = await cartData.validateCartItem(req.cookies.user_id, productIdsData)

        if (cartItem.status != 'error') {
            //Create order
            const order = await orderData.createOrder(req.cookies.user_id, req.body);

            //Remove product from cart
            const removeProductFromCart = await cartData.removeMultipleProducts(req.cookies.user_id, productIdsData)
            
            //Add order details
            const orderDetails = await orderDetailsData.addOrderDetails(order.order_data.order_id, cartItem.products)
            
            //minus the stock of product
            const updateProductQuantity = await productData.updateMultipleProductQuantity(cartItem.products)   

            // send response
            const sendMsg = {
                created : order , 
                remove_from_cart: removeProductFromCart,
                order_details : orderDetails,
                updateProductQuantity : updateProductQuantity
            }
            
            return res.status(200).send(sendMsg);
        }
        else {
            return res.status(400).send(cartItem);
        }

        // res.send("Doan cem");
    }catch(error){
        res.status(400).send(error.message);
    }
}

// Req for update
// {
//     "order_id" : "1",
//     "note" : "Khong hanh",
//     "receiver": "Vy le",
//     "receiver_phone": "02101010",
//     "delivery_address" : "Thu Duc",
//     "payment_method" : "Bank",
//     "status" : "shipping",
//     "order_date" : "May 24, 2024"
// }

//Update order status
const updateOrder = async (req, res, next) => {
    try {
        const data = req.body;

        const orderStatus = await orderData.getOrderStatus(req.body.order_id)

        //Cannot cancel if the product is deliverd to ship
        //Cannot change status if the order is canceled
        if (orderStatus >1 && req.body.status == 0 ){
            return res.send({
                status: "error",    
                message: 'Cancellation is not possible, the order has been handed over to the shipping unit'
            });
        } else if ( orderStatus == 0 && req.body.status >1){
            return res.send({
                status: "error",
                message: 'Unable to change status, the order has been canceled'
            });
        }

        //Update order
        const updated = await orderData.updateOrder(data);

        // Update product stock
        let updatedQuantity = "0 updated"
        const orderDetails = await orderDetailsData.getByOrderID(req.body.order_id)
        if (updated.order_data.status == 3 && orderStatus != updated.order_data.status){
            //increase sold
            updatedQuantity = await productData.updateMultipleProductSold(orderDetails)

        }else if (updated.order_data.status == 0 && orderStatus != updated.order_data.status){
            //increase stock
            for (let i=0; i< orderDetails.length; i++) {
                orderDetails[i].quantity = 0 - orderDetails[i].quantity
            }    
            updatedQuantity = await productData.updateMultipleProductQuantity(orderDetails)
        }
        res.status(200).send({updated: updated, updatedStock: updatedQuantity});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// For user to cancel ordere
const cancelOrder = async (req, res, next) => {

    try {
        const data = req.body;

        //Check login
        if (!req.cookies.user_id) {
            return res.send({
                status: 'Error',
                message: 'User is not logged in'
            });
        }

        const orderInfo = await orderData.getOrderInfo(req.body.order_id)

        //Check owned
        if (orderInfo.user_id != req.cookies.user_id){
            return res.send({
                status: 'Error',
                message: 'Order is not belonged to this user'
            });
        }

        // Check cancel possible
        if (orderInfo.status > 1){
            return res.send({
                status: "error",    
                message: 'Cancellation is not possible, the order has been handled over to the shipping unit'
            });
        } else if  (orderInfo.status == 0){
            return res.send({
                status: "error",
                message: 'Cancellation is not possible, the order has been cancelled'
            });
        }

        const updated = await orderData.cancelOrder(data);
        let updatedQuantity
        
        const orderDetails = await orderDetailsData.getByOrderID(req.body.order_id)

         if (updated.order_data.status == 0){
            //increase stock
            for (let i=0; i< orderDetails.length; i++) {
                orderDetails[i].quantity = 0 - orderDetails[i].quantity
            }    
            updatedQuantity = await productData.updateMultipleProductQuantity(orderDetails)
        }
        res.status(200).send({updated: updated, updatedStock: updatedQuantity});
    } catch (error) {
        res.status(400).send(error.message);
    }

}


// const deleteOrder = async (req, res, next) => {
//     try {
//         const id = req.body.id;
//         const status = await orderData.getOrderStatus(id);
//         if(status > 2 && status <= 4){
//             return res.send({
//                 status: 'Error',
//                 message: 'Cancellation is not possible, the order has been handed over to the shipping unit'
//             })
//         } else if(status === 0){
//             return res.send({
//                 status: 'Error',
//                 message: 'Can not cancel the order that be canceled'
//             })
//         } else if(status <= 2){
//             const deleted = await orderData.deleteOrder(id);
//             const getOrderQuantList = await order_detailData.getOrderQuantInOrder(id);
//             const returnQuant = await Promise.all(
//                 getOrderQuantList.map(async (item) => {
//                     return orderData.returnProQuant(item.product_id, item.orderQuant);
//                 })
//             );
//             const combinedResponse = {
//                 deleteRes: deleted,
//                 returnQuantRes: returnQuant
//             }
//             res.send(combinedResponse);
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

module.exports = {
    getAllOrders,
    getOrderByUserId,
    getOrderInfo,
    createOrder,
    updateOrder,
    cancelOrder
}