'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const productData = require('../product')
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable, getStream, } = require('firebase/storage')

dotenv.config()
// Set your OpenAI API key
const KEY = process.env.KEY;

const chatBox = async (data) => {
    try {

        let products = await productData.getProduct()
        
        let question = data.question + " from my dataset " + JSON.stringify(products) + " not mentioned about image link, thumbnail and dataset, answer with the begin of the answer is: Hungry Cat has: "
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KEY}`
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

const similarImg = async (img) => {
    try {
        let responseData = "";

        const { stdout, stderr, error } = await new Promise((resolve, reject) => {
            exec(`set PYTHONIOENCODING=utf-8 && python src/app.py ${img.path}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });

        if (error) {
            console.error('Error executing Python script:', error);
            return ('Error executing Python script');
        }

        if (stderr) {
            console.error('Python script stderr:', stderr);
        }

        console.log('Python script stdout:', stdout);
        responseData = stdout;

        const newStr = responseData.replace(/'/g, '"')

        // Parse the JSON string to create a JavaScript object
        const sortedObject = JSON.parse(newStr);

        let products = await productData.getProduct()

        const finalData = []
        for (let i = 0; i < sortedObject.similar_images.length; i++) {
            for (let j = 0; j < products.length; j++) {

                let preTitle = sortedObject.similar_images[i]
                let extensionStartIndex = sortedObject.similar_images[i].lastIndexOf('.');  // Find the last dot index
                
                preTitle = preTitle.slice(0, extensionStartIndex);
                preTitle = preTitle.replace(/_/g, " ")

                // console.log(preTitle + " vs " + products[j].title)

                if (products[j].title == preTitle && products[j].deleted == false){
                    finalData.push(products[j])
                }
            }

        }

        return finalData
    } catch (error) {
        console.log(error);
        return error.message;
    }
}

const getDataset = async (res) => {
    try {
        
        // let products = await productData.getProduct()

        // for(let i = 0; i < products.length; i++) {

        //     let fileUrl = products[i].thumbnail
        //     const fileName = products[i].title.replace(/\s/g, "_") + ".jpg";
        //     const filePath = path.resolve(__dirname, '../../static/dataset' , fileName);
        
        //     const response = await axios({
        //         method: 'GET',
        //         url: fileUrl,
        //         responseType: 'stream',
        //     });
    
        //     const writer = fs.createWriteStream(filePath);
    
        //     response.data.pipe(writer);
    
        //     writer.on('finish', () => {
        //         res.download(filePath, fileName, (err) => {
        //             if (err) {
        //                 console.error('Error downloading the file:', err);
        //                 return ('Error downloading the file');
        //             } else {
        //                 fs.unlinkSync(filePath); // Remove the file after download
        //             }
        //         });
        //     });
    
        //     writer.on('error', (err) => {
        //         console.error('Error writing the file:', err);
        //         return ('Error writing the file');
        //     });
        // }

        // return ('All files downloaded successfully!');
    } catch (error) {
        console.log(error);
        return error.message;
    }
}

module.exports = {
    chatBox,
    similarImg,
    getDataset
}