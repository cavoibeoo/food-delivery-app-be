'use strict';

const aiData = require('../data/ai');

const chatBox = async (req, res, next) => {
    try {
        const data = req.body
        // console.log(data)
        const answer = await aiData.chatBox(data);
        res.send(answer);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

const similarImg = async (req, res, next) => {
    try {
        const data = req.file
        // console.log(data)
        const answer = await aiData.similarImg(data);
        res.send(answer);
    }catch(error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    chatBox,
    similarImg
}