'use strict';
const express = require('express');
const newsletterController = require('../controllers/newsletterController');
const router = express.Router();

router.post('/get-newsletter', newsletterController.sendLetterMail); //send the newsletter

module.exports = {
    routes: router
};
