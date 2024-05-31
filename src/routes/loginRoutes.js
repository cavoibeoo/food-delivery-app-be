'use strict';

const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.post('/login', loginController.checkLogin);
router.post('/login/check-password', loginController.checkPassword);
router.get('/login/check-status/', loginController.checkLoginStatus);
router.get('/logout', loginController.logout);
router.post('/login/forgot-sendmail', loginController.forgotSendmail);
router.post('/login/check-code', loginController.checkConfirmCode)



module.exports = {
    routes: router
}