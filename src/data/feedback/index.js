'use strict';

const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const userData = require('../user')
const orderData = require('../order')

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "feedbacks")

const getFeedback = async () => {
    try {
        const finalData = []

        const q = await query(collectionRef, 
            orderBy("feedback_id", "asc"));

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            if (doc.data().product_id) finalData.push(doc.data())
        });

        return finalData
    } catch (error) {
        console.log(error.message);
    }
}

//get by product ID
const getById = async(data) => {
    try {
        const finalData = []

        const q = await query(collectionRef, 
            orderBy("feedback_id", "desc"), 
            where("product_id","==",data.product_id)
        );

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            if (doc.data().product_id) finalData.push(doc.data())
        });

        return finalData
    } catch (error) {
        return error.message;
    }
}

const createFeedback = async (data) => {
    try {

        const user = await userData.getById(data.user_id)

        const preprocessedData = {
            "feedback_id": await autoId(),
            "product_id" : Number(data.product_id),
            "user_id": Number (data.user_id),
            "note" : String (data.note),
            //auto generated
            "full_name": String( user[0].full_name),
            "email": String(user[0].email),
            "avatar" : String(user[0].avatar)
        }

        await addDoc(collectionRef, preprocessedData)

        return  preprocessedData;
    } catch (error) {
        return error.message;
    }
}

const updateFeedback = async (data) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('feedbacks/sql');
        const update = await pool.request()
                        .input('id', sql.Int, data.id)
                        .input('user_id', sql.Int, data.user_id)
                        .input('fullname', sql.NVarChar(50), data.fullname)
                        .input('email', sql.NVarChar(50), data.email)
                        .input('phone_number', sql.Char(10), data.phone_number)
                        .input('note', sql.NVarChar(sql.MAX), data.note)
                        .query(sqlQueries.updateFeedback);
        return update.recordset;
    } catch (error) {
        return error.message;
    }
}

const deleteFeedback = async (data) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('feedbacks/sql');
        const deleteEvent = await pool.request()
                            .input('id', sql.Int, data.id)
                            .query(sqlQueries.deleteFeedback);
        return deleteEvent.recordset;
    } catch (error) {
        return error.message;
    }
}

const isBought = async (data) => {

    const orders = await orderData.getByUserId(data.user_id)

    let result = false

    orders.forEach(order =>{
        for (let i = 0; i < order.order_details.length; i++){
            
            if (order.order_details[i].product_id == data.product_id) {
                // console.log("dung ne")
                result = true
                
            }
        }
    })

    return result
}

const isFeedback = async (data) => {

    const feedbacks = await getById(data)
    
    for (let i=0; i< feedbacks.length; i++){
        if (feedbacks[i].user_id == data.user_id) return true
        
    }
    return false
}

const autoId = async () => {
    const finalData = []
    const q = await query(collectionRef, 
        orderBy('feedback_id', 'desc'),
        limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
    finalData.push(doc.data())
    });

    // console.log(finalData[0].user_id +1)

    return finalData[0].feedback_id +1;
}



module.exports = {
    /* exports các hàm get, getById, create, update, delete tương tự như bên roles/index.js */
    getFeedback,
    getById,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    isBought,
    isFeedback
}