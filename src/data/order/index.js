'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const orderDetailsData = require('../../data/order_details');

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "order")


const getOrder = async () => {
    try {
        const finalData = []
        const q = await query(collectionRef, orderBy("order_date", "desc"))

        const querySnapshot = await getDocs(q)
        
        // Using map to create an array of promises
        const promises = querySnapshot.docs.map(async (doc) => {
            let preprocessedData = doc.data();
            preprocessedData.order_date = convertFirebaseDate(preprocessedData.order_date);
            preprocessedData.order_details = await orderDetailsData.getByOrderID(preprocessedData.order_id);
            // console.log(preprocessedData);
            finalData.push(preprocessedData);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        
        return finalData
    } catch (error) {
        // console.log(error.message);
        return error.message;
    }
}

const getByUserId = async(user_id) => {
    try {
        const finalData = []
        const q = await query(collectionRef,
            where("user_id", "==", Number(user_id)),
            orderBy("order_id", "desc")
        )

        const querySnapshot = await getDocs(q)
        
        // Using map to create an array of promises
        const promises = querySnapshot.docs.map(async (doc) => {
            let preprocessedData = doc.data();
            preprocessedData.order_date = convertFirebaseDate(preprocessedData.order_date);
            preprocessedData.order_details = await orderDetailsData.getByOrderID(preprocessedData.order_id);
            // console.log(preprocessedData);
            finalData.push(preprocessedData);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        
        return finalData
    } catch (error) {
        return error.message;
    }
}

const getOrderInfo = async (order_id) => {
    try {
        let finalData
        const q = await query(collectionRef,
            where("order_id", "==", Number(order_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        // Using map to create an array of promises
        const promises = querySnapshot.docs.map(async (doc) => {
            let preprocessedData = doc.data();
            preprocessedData.order_date = convertFirebaseDate(preprocessedData.order_date);
            preprocessedData.order_details = await orderDetailsData.getByOrderID(preprocessedData.order_id);
            // console.log(preprocessedData);
            finalData = (preprocessedData);
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
        
        return finalData
    } catch (error) {
        // console.log(error.message);
        return error.message;
    }
}

const getOrderStatus = async (order_id) => {
    try {
        let finalData
        const q = await query(collectionRef,
            where("order_id", "==", Number(order_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData = (doc.data())
        });
        
        return finalData.status
    } catch (error) {
        // console.log(error.message);
        return error.message
    }
}

const createOrder = async (user_id, data) => {
    try {
        const preprocessedData = {
            "delivery_address" : String(data.delivery_address) ,
            "discount" : Number(0),
            "note" : String(data.note),
            "order_date" : new Date(),
            "order_id" : Number(await autoId()),
            "payment_method" : "COD",
            "receiver" : String(data.receiver),
            "receiver_phone" : String(data.receiver_phone),
            "status" : 1,
            "total" : 0,
            "transport_fee" : "",
            "user_id" : Number(user_id)

        }

        const orderDocRef = await addDoc(collectionRef, preprocessedData)

        const orderDetailsCollectionRef = collection(orderDocRef, "order_details")

        // Optionally, add an empty document to the subcollection (if needed)
        await addDoc(orderDetailsCollectionRef, {})  

        return ({"status":"OK", "message": 'Add successfully', "order_data" : preprocessedData});
    } catch (error) {
        // console.log(error)
        return error.message;
    }
}

const updateOrder = async (data) => {
    try {

        let docId
        const q = await query(collectionRef,
            where("order_id", "==", Number(data.order_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            docId = (doc.id)
        });

        const preprocessedData = {
            // "delivery_address" : String(data.delivery_address) ,
            // "discount" : Number(0),
            // "note" : String(data.note),
            // "order_date" : Date(data.order_date),
            // "order_id" : Number(await autoId()),
            // "payment_method" : String(data.payment_method),
            // "receiver" : String(data.receiver),
            // "receiver_phone" : String(data.receiver_phone),
            "status" : data.status,
            // "transport_fee" : "",
            // "user_id" : Number(user_id)  
        }

        if (docId) {
            await updateDoc(doc(collectionRef, docId), preprocessedData)
            return ({"status":"OK", "message": 'Update successfully', "order_data" : preprocessedData});
        }
        
        else return {"status": "error", "message": "Order not found"}
        
    } catch (error) {
        return error.message;
    }
}

const cancelOrder = async(data) => {
    try {
        let docId
        const q = await query(collectionRef,
            where("order_id", "==", Number(data.order_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            docId = (doc.id)
        });

        const preprocessedData = {
            "status" : 0
        }

        if (docId) {
            await updateDoc(doc(collectionRef, docId), preprocessedData)
            return ({"status":"OK", "message": 'Update successfully', "order_data" : preprocessedData});
        }
        
        else return {"status": "error", "message": "Order not found"}
        
    } catch (error) {
        return error.message;
    }
}

// const updateQuantPay = async (product_id, user_id, order_id) => {
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('orders/sql');

//         const update = await pool.request()
//             .input('order_id', sql.Int, order_id)
//             .input('user_id', sql.Int, user_id)
//             .input('product_id', sql.Int, product_id)
//             .input('id', sql.Int, product_id)
//             .query(sqlQueries.updateQuantPay);

//         console.log('update quant recordset: ',update.recordset);
//         return update.recordset;
//     } catch (error) {
//         return error.message;
//     }
// };


// const deleteOrder = async (id) => {
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('orders/sql');
//         const deleteEvent = await pool.request()
//                             .input('id', sql.Int, id)
//                             .query(sqlQueries.deleteOrder);
//         return deleteEvent.recordset;
//     } catch (error) {
//         return error.message;
//     }
// }

// const checkQuantInStock = async (user_id, product_id) =>{
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('orders/sql');
//         const quantity = await pool.request()
//                             .input('user_id', sql.Int, user_id)
//                             .input('product_id', sql.Int, product_id)
//                             .query(sqlQueries.checkQuantInStock);
//                             //console.log(quantity.recordset[0].Result);
//         return quantity.recordset[0].Result;
//     } catch (error) {
//         return error.message;
//     }
// }

// const returnProQuant = async (id, returnQuant) =>{
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('orders/sql');
//         const quantity = await pool.request()
//                             .input('id', sql.Int, id)
//                             .input('returnQuant', sql.Int, returnQuant)
//                             .query(sqlQueries.returnProQuant);
//                             //console.log(quantity.recordset);
//         return quantity.recordset;
//     } catch (error) {
//         return error.message;
//     }
// }

const autoId = async () => {
    const finalData = []
    const q = await query(collectionRef, 
        orderBy('order_id', 'desc'),
        limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
    finalData.push(doc.data())
    });

    return finalData[0].order_id +1;
}

function convertFirebaseDate(firebaseDate) {
    // Extract seconds and nanoseconds from the Firebase date object
    const seconds = firebaseDate.seconds;
    const nanoseconds = firebaseDate.nanoseconds;
  
    // Create a JavaScript Date object from the seconds
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  
    // Add nanoseconds for more precise millisecond representation (optional)
    date.setMilliseconds(date.getMilliseconds() + nanoseconds / 1000000);
  
    // Format the date according to the desired format
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const secondsFormatted = date.getSeconds().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${secondsFormatted}`;
  }
  

module.exports = {
    getOrder,
    getByUserId,
    getOrderInfo,
    getOrderStatus,
    createOrder,
    updateOrder,
    // updateQuantPay,
    // deleteOrder, 
    // checkQuantInStock,
    // returnProQuant
    cancelOrder,
}