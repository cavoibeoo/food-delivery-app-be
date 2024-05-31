'use strict';

const express = require('express');
const feedbackController = require('../controllers/feedbackController');    
const router = express.Router();

router.get('/feedbacks', feedbackController.getAllFeedbacks);   //use gor admin page
router.post('/feedback/', feedbackController.getFeedbackById);
router.post('/feedback/send/', feedbackController.addFeedback);
// router.put('/feedback/', feedbackController.updateFeedback);
// router.delete('/feedback/', feedbackController.deleteFeedback);


module.exports = {
    routes: router
}