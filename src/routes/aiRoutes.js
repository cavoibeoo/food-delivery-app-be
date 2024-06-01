'use strict';

const express = require('express'); 
const aiController = require('../controllers/aiController');  
const router = express.Router();
const path = require('path');

const multer = require('multer');

// path of the input image when compare similar, the python code will compare files in public/upload with public/dataset
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public', 'uploads',))
    },
    filename: function(req, file, cb) {
        cb(null, "compareImg.jpg")
    }
})
const upload = multer({storage: storage})

router.post('/ai/chat-box/', aiController.chatBox); //Call the chat box Controller
router.post('/ai/similar/', upload.single("thumbnail"), aiController.similarImg); //Compare similar product image Controller
router.get('/ai/get-dataset/', aiController.getDataset) //unused


module.exports = {
    routes: router
}