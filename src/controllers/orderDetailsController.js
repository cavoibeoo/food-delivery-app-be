'use strict';

const orderDetailData = require('../data/order_details');

//Get order by user id
const getByOrderID = async (req, res, next) => {
    try {
        const orderDetails = await orderDetailData.getByOrderID(req.body.order_id);
        //console.log(orderdetail, data);
        res.status(200).send({status : "Success" , orderDetails : orderDetails});

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    getByOrderID    
}