'use strict';

const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const crypto = require('crypto');


// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "user")

const KEY = "cavoibeoo"

const checkLogin = async (data) => {
    try {
        const finalData = []

        const q = await query(
            collectionRef,
            where('email', '==', String(data.email)),
            where ('password', '==', String(data.password)),
            limit(1))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });

        return finalData.length != 0;
    } catch (error) {
        return error.message;
    }
}

const checkPassword = async (data) => {
    try {
        let finalData

        const q = await query(
            collectionRef,
            where('user_id', '==', Number(data.user_id)),
            limit(1))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            finalData = (doc.data())
        });

        return finalData.password == data.password;
    } catch (error) {
        return error.message;
    }
}

const checkConfirmCode = async(data) =>{
    try {
        const finalData = []
        let otpDb = ""
        const q = await query(
            collectionRef,
            where('email', '==', String(data.to)),
            limit(1))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
          otpDb = (doc.data().otp)
        });

        // console.log(finalData[0])

        const docRef = await doc(collectionRef, finalData[0])
        updateDoc(docRef, {"otp" : ""})

        return String(generateHMAC(data.otp, KEY))  == String (otpDb);
    } catch (error) {
        return error.message;
    }
}


const confirmCode = async (email) => {
    try {
        // const code = ()=>{
            let strCode = ""
            for(let i = 0; i<= 5; i++){
                let randomItem = Math.floor(Math.random() * 10).toString();
                strCode = strCode + randomItem;
            }

            // console.log(strCode)

            // Save to db
            await saveOtp(email, strCode);

            // Save to db
            return strCode

        // }

        // console.log(code())

        // return code();
    } catch (error) {
        return error.message;
    }
}

const saveOtp = async (email, otp) => {
    try {
        const finalData = []

        const q = await query(
            collectionRef,
            where('email', '==', String(email)),
            limit(1))
    
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });
    
        const docRef = doc(collectionRef, finalData[0])
        await updateDoc(docRef, { "otp" : String(generateHMAC(otp, KEY)) })
    }
    catch (error) {
        return error.message;
    }
}

function generateHMAC(data, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    const hmacResult = hmac.digest('hex');
    return hmacResult;
  }

module.exports = {
    checkLogin,
    checkPassword,
    confirmCode,
    checkConfirmCode
}