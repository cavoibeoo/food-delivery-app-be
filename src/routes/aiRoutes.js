'use strict';

const express = require('express'); 
const aiController = require('../controllers/aiController');  
const router = express.Router();
const path = require('path');

const multer = require('multer');
// Path to the image in the static/uploads folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../static', 'uploads',))
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({storage: storage})

router.post('/chat-box/', aiController.chatBox);
router.post('/similar/', upload.single("thumbnail"), aiController.similarImg);


module.exports = {
    routes: router
}