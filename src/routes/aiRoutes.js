'use strict';

const express = require('express'); 
const aiController = require('../controllers/aiController');  
const router = express.Router();
const path = require('path');

const multer = require('multer');

// Path to the image in the public/uploads folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public', 'uploads',))
    },
    filename: function(req, file, cb) {
        cb(null, "compareImg.jpg")
    }
})
const upload = multer({storage: storage})

router.post('/ai/chat-box/', aiController.chatBox);
router.post('/ai/similar/', upload.single("thumbnail"), aiController.similarImg);
router.get('/ai/get-dataset/', aiController.getDataset)


module.exports = {
    routes: router
}