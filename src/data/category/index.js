'use strict';

const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "category")

/* viết các hàm tương tự bên roles/index.js */
const getCategory = async () => {
    try {
        const finalData = []

        const q = await query(collectionRef, 
            orderBy("category_id", "asc"));

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            finalData.push(doc.data())
        });

        return finalData
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async(data) => {
    try {
        let finalData 

        const q = await query(collectionRef, 
            where("category_id","==", data.category_id),
            limit(1)
        );

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            finalData = (doc.data())
        });

        return finalData
    } catch (error) {
        return error.message;
    }
}

const createCategory = async (data) => {
    try {
        const preprocessedData = {
            "category_id": await autoId(),
            "category_name": data.category_name,
            "deleted": false
        }

        await addDoc(collectionRef, preprocessedData)

        return  preprocessedData;
    } catch (error) {
        return error.message;
    }
}

const updateCategory = async (data) => {
    try {
        let docRef

        const preprocessedData = {
            "category_name": data.category_name
        } 

        const q = await query(collectionRef, 
            where("category_id","==", data.category_id),
            limit(1)
        );

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            docRef = (doc)
        });

        if (docRef){
            await updateDoc(doc(collectionRef, docRef.id), preprocessedData)
        }

        preprocessedData.category_id = docRef.data().category_id;
        return preprocessedData;

    } catch (error) {
        return error.message;
    }
}

const enableCategory = async (data) => {
    try {
        let docRef

        const preprocessedData = {
            "deleted": false 
        } 

        const q = await query(collectionRef, 
            where("category_id","==", data.category_id),
            limit(1)
        );

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            docRef = (doc)
        });

        if (docRef){
            await updateDoc(doc(collectionRef, docRef.id), preprocessedData)
        }

        preprocessedData.category_id = docRef.data().category_id;
        return preprocessedData;

    } catch (error) {
        return error.message;
    }
}

const disableCategory = async (data) => {
    try {
        let docRef

        const preprocessedData = {
            "deleted": true 
        } 

        const q = await query(collectionRef, 
            where("category_id","==", data.category_id),
            limit(1)
        );

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            docRef = (doc)
        });

        if (docRef){
            await updateDoc(doc(collectionRef, docRef.id), preprocessedData)
        }

        preprocessedData.category_id = docRef.data().category_id;
        return preprocessedData;

    } catch (error) {
        return error.message;
    }
}


const autoId = async () => {
    const finalData = []
    const q = await query(collectionRef, 
        orderBy('category_id', 'desc'),
        limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
    finalData.push(doc.data())
    });

    // console.log(finalData[0].user_id +1)

    return finalData[0].category_id +1;
}

module.exports = {
    /* exports các hàm get, getById, create, update, delete tương tự như bên roles/index.js */
    getCategory,
    getById,
    createCategory,
    updateCategory,
    enableCategory,
    disableCategory,
}