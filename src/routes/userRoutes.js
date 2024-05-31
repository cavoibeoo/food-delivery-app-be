'use strict';

const express = require('express'); 
const userController = require('../controllers/userController');   
const router = express.Router();

const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})


router.get('/users', userController.getAllUsers);   //use for admin
router.get('/user/id/', userController.getUserById);
router.get('/user/id_get/', userController.getUserByIdAdmin);//For admin to retrieve user

router.post('/user/add/', userController.addUser);
router.post('/user/avatar/', upload.single("avatar"), userController.uploadAvatar);
router.post('/user/avatarAdmin/', upload.single("avatar"), userController.uploadUserAvatar);
router.put('/user/info/', userController.updateUser); //for user update them self
router.put('/user/update/', userController.updateUserInfo);  //for admin update user's info
router.put('/user/security/', userController.updateUserPassword);
router.put('/user/reset/', userController.resetPassword);
router.put('/user/disable', userController.deleteUser);    //update deleted = 1
router.put('/user/enable', userController.enableUser); //use for admin enable user
// router.put('/user/remove-admin/', userController.removeAdmin); //to change admin to normal user
router.get('/user/recent/', userController.getRecentProducts); //



module.exports = {
    routes: router
}