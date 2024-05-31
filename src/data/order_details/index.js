'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const productData = require('../product')

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "order")


const addOrderDetails = async (order_id, data)=>{
    try {
        let count =0
        let totalPrice =0
        let docRef 

        const orderDocRef = await getOrderDocInstance(order_id)
        const orderCollectionRef = collection(orderDocRef, "order_details")

        if (orderCollectionRef){
            for (let i=0; i<data.length; i++){
                const product = await productData.getById({ "product_id" : data[i].product_id})
                const preprocessedData = {
                    'product_id': Number(data[i].product_id),
                    'quantity': Number(data[i].quantity),
                    'price': Number(product[0].price),
                    'total': Number(data[i].quantity) * Number(product[0].price)
                }
                docRef = await addDoc(orderCollectionRef,preprocessedData )
                count ++
                totalPrice += Number(data[i].quantity) * Number(product[0].price)
                // console.log(totalPrice)
            }
        }
        else return {"status": "error", "added": 0}

        
            // console.log(totalPrice)
        await updateDoc(orderDocRef, {"total" : Number(totalPrice)})
    
        return {"status": "OK", "added": count + " order details", totalPrice: totalPrice}
    } catch (error) {
        console.log(error);
        return error.message;
    }
}

// const getOrderDetailsByUserID = async (order_id)=>{
//     try {
//         const finalData = []
//         const orderDocRef = await getOrderDocInstance(order_id)
//         const orderCollectionRef = collection(orderDocRef, "order_details")

//         const q = await query(orderCollectionRef)

//         const querySnapshot = await getDocs(q)
        
//         querySnapshot.forEach((doc) => {
//           finalData = (doc.data())
//         });

//         return finalData 

//     } catch (error) {
//         console.log(error);
//         return error.message;
//     }
// }

const getByOrderID = async (order_id)=>{
    try {
        const finalData = []
        const orderDocRef = await getOrderDocInstance(order_id, orderBy("product_id", "asc"))
        const orderCollectionRef = collection(orderDocRef, "order_details")

        const q = await query(orderCollectionRef)

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            if (doc.data().product_id) finalData.push(doc.data())
        });

        return finalData 

    } catch (error) {
        console.log(error);
        return error.message;
    }
}

const getOrderDocInstance = async(order_id) => {
    try {
        let finalData 
        const q = await query(
            collectionRef,
            where('order_id', '==', Number(order_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData = (doc.id)
        });

        return doc(collectionRef, String(finalData)) 
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    addOrderDetails,
    getByOrderID
}