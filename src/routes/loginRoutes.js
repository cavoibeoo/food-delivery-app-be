'use strict';

const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.post('/login', loginController.checkLogin); // loginController
router.post('/login/check-password', loginController.checkPassword); //check the user password
router.get('/login/check-status/', loginController.checkLoginStatus); //check the current user login status
router.get('/logout', loginController.logout); //log out the user
router.post('/login/forgot-sendmail', loginController.forgotSendmail); //forgot password function
router.post('/login/check-code', loginController.checkConfirmCode) //check the input otp code of forgot password



module.exports = {
    routes: router
}