'use strict';

const aiData = require('../data/ai');

//Chat box controller that send request to OpenAI API to generate answer 
const chatBox = async (req, res, next) => {
    try {
        const data = req.body
        // console.log(data)
        const answer = await aiData.chatBox(data);
        res.send(answer);
    }catch(error) {
        res.send(error.message);
    }
}

//similar image controller that handle the request to return the similar product with the image
const similarImg = async (req, res, next) => {
    try {
        const data = req.file
        // console.log(data)
        const answer = await aiData.similarImg(data);
        res.send(answer);
    }catch(error) {
        res.send(error.message);
    }
}

//unused
const getDataset = async (req, res, next) => {
    try {
        const answer = await aiData.getDataset(res);
        res.send(answer);
    }catch(error) {
        res.send(error.message);
    }
}

module.exports = {
    chatBox,
    similarImg,
    getDataset
}