'use strict';

const express = require('express'); 
const userController = require('../controllers/userController');   
const router = express.Router();

const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})


router.get('/users', userController.getAllUsers);   //use for admin to get all users
router.get('/user/id/', userController.getUserById); //get user by id
router.get('/user/id_get/', userController.getUserByIdAdmin);//For admin to retrieve user

router.post('/user/add/', userController.addUser); //add user
router.post('/user/avatar/', upload.single("avatar"), userController.uploadAvatar); //Insert avatar for user
router.post('/user/avatarAdmin/', upload.single("avatar"), userController.uploadUserAvatar); // for admin to add avatar for user
router.put('/user/info/', userController.updateUser); //for user update them self
router.put('/user/update/', userController.updateUserInfo);  //for admin update user's info
router.put('/user/security/', userController.updateUserPassword); // For user to update user password
router.put('/user/reset/', userController.resetPassword); // for user to reset password
router.put('/user/disable', userController.deleteUser);    //for admin to disable user
router.put('/user/enable', userController.enableUser); //use for admin enable user
// router.put('/user/remove-admin/', userController.removeAdmin); //to change admin to normal user
router.get('/user/recent/', userController.getRecentProducts); //get recent products of user



module.exports = {
    routes: router
}