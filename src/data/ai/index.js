'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const productData = require('../product')
const dotenv = require('dotenv');
const axios = require('axios');

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "product")
dotenv.config()
// Set your OpenAI API key
const KEY = process.env.KEY;

const chatBox = async (data) => {
    try {

        let products = await productData.getProduct()
        
        
        let question = data.question + " from my dataset " + JSON.stringify(products)
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        };

        const API_URL = 'https://api.openai.com/v1/chat/completions';

        // Prepare request body for OpenAI API
        const requestBody = {
            model: 'gpt-3.5-turbo-1106',
            messages: [
                {
                    role: 'user',
                    content: question
                }
            ],
            max_tokens: 1000
        };

        // Send request to OpenAI API
        let ans = "";
        await axios.post(API_URL, requestBody, { headers })
            .then(response => {
                ans = response.data.choices[0].message.content;
            })
            .catch(error => {
                console.error('Error:', error.response.data);
            });

        // Send the response back to the client
        return ({ answer : ans });
        
    } catch (error) {
        console.log(error);
        return error.message;
    }
}



module.exports = {
    chatBox,
}