'use strict';

const feedbackData = require('../data/feedback');

/* viết hàm tương tự với roleController */
const getAllFeedbacks = async (req, res, next) => {
    try {

        const feedbackList = await feedbackData.getFeedback();
        //console.log(rolelist)
        res.send(feedbackList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get feedback by product_id
const getFeedbackById = async (req, res, next) => {
    try {
        const data = req.body;
        const feedback = await feedbackData.getById(data);
        console.log(feedback, data);
        res.send(feedback);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const addFeedback = async (req, res, next) => {
    try {
        const data = req.body;
        if (!req.cookies.user_id) return res.status(404).send("User not found")
        data.user_id = req.cookies.user_id

        if (! await feedbackData.isBought(data)) {
            return res.status(401).send({
                status: 'Error',
                message: 'You have not bought this product'
            });
        }

        if (await feedbackData.isFeedback(data)) {
            return res.status(401).send({
                status: 'Error',
                message: 'You have give this product a feedback'
            });
        }

        const insert = await feedbackData.createFeedback(data);
        res.send(insert);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// const updateFeedback = async (req, res, next) => {
//     try {
//         const data = req.body;
//         const updated = await feedbackData.updateFeedback(data);
//         res.send(updated);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

// const deleteFeedback = async (req, res, next) => {
//     try {
//         const data = req.body;
//         const deleted = await feedbackData.deleteFeedback(data);
//         res.send(deleted);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

module.exports = {
    /* viết xong r export nó ra đây */
    getAllFeedbacks,
    getFeedbackById,
    addFeedback,
    // updateFeedback,
    // deleteFeedback
}