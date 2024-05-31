'use strict';

const express = require('express'); 
const aiController = require('../controllers/aiController');  
const router = express.Router();

router.get('/chat-box/', aiController.chatBox);

module.exports = {
    routes: router
}