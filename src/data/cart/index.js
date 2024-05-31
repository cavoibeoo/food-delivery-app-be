'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const productData = require('../product');

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "user")

const getCartById = async (user_id) => {
    try {
        const finalData = []
        const userDocRef = await getUserDocInstance(user_id)
        const cartCollectionRef = collection(userDocRef, "cart")
        const q = await query(cartCollectionRef)

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            // console.log(doc.data())  
            if (doc.data().product_id) finalData.push(doc.data())
        });
        
        return finalData

    }catch(error) {
        console.log(error)
        return error.message;
    }
}

const addProduct = async (user_id, data) => {
    
    try {
        if (Number(data.quantity) == 0) return {"status":"not added", "message":"quantity is 0"}
        const finalData = []
        const userDocRef = await getUserDocInstance(user_id)
        const cartCollectionRef = collection(userDocRef, "cart")

        const q = await query(cartCollectionRef,
            where('product_id', '==', Number(data.product_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });


        let preprocessedData = {
            "product_id" : Number(data.product_id),
            "quantity" : Number(data.quantity)
        }

        if (finalData.length > 0) {
            const sum = Number(finalData[0].data().quantity) + Number(data.quantity)
            preprocessedData.quantity = sum

            const checkStock = await productData.checkStock(data.product_id , sum)

            if (!checkStock) {
                return {"status":"not added", "Message":"Stock not enough to be added"}
            }

            //If existed then update the quantity of product in cart
            if (sum > 0){
                const docRef = doc(cartCollectionRef, String (finalData[0].id))
                await updateDoc(docRef,{
                    "quantity" : sum
                } )
                return {"status":"updated", "product": preprocessedData}
            } 
            else {

                //or remove it
                return await removeProduct(user_id, data)
            }
        } else {

            //If not existed then add a new product to cart
            await addDoc(cartCollectionRef,preprocessedData )

            return {"status":"added", "product": preprocessedData}
        }



    }catch(error) {
        console.log(error)  
        return error.message;
    }
}

const removeProduct = async (user_id, data) => {

    try {
        const finalData = []
        const userDocRef = await getUserDocInstance(user_id)
        const cartCollectionRef = collection(userDocRef, "cart")

        const preprocessedData = {
            "product_id" : data.product_id,
        }

        const q = await query(cartCollectionRef,
            where('product_id', '==', Number(data.product_id)),
            limit(1)
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        console.log(finalData[0])

        const docRef = doc(cartCollectionRef, finalData[0])
        await deleteDoc( docRef )
        return {"status":"removed", "product" : preprocessedData}

    }catch(error) {
        console.log(error)
        return error.message;
    }
}

const removeMultipleProducts = async(user_id, product_ids)=>{
    try {
        let count = 0
        for (let i=0; i<product_ids.length; i++) {
            await removeProduct(user_id, {"product_id" : product_ids[i]})
            count++
        }
        return {"status":"removed", "count" : count}

    }catch(error) {
        return error.message;
    }
}

const getUserDocInstance = async(user_id) => {
    try {
        let finalData 
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(user_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData = (doc.id)
        });

        return doc(collectionRef, String(finalData)) 
    } catch (error) {
        return error.message;
    }
}

const validateCartItem = async (user_id, product_ids) => {
    try {

        const cart = await getCartById(user_id)

        const finalData = []
        cart.forEach(cartItem => {
            for (let i=0; i<product_ids.length; i++) {
                if (cartItem.product_id == Number(product_ids[i])){
                    finalData.push(cartItem)
                }
            }
        });

        // Check if the id not found from cart
        if (finalData.length != product_ids.length) 
            return { "status":"error", "message":"Cart item not found"}

        //Check for stock
        for (let i=0; i< finalData.length; i++) {
            const check = await productData.checkStock(finalData[i].product_id, finalData[i].quantity)
            // console.log(finalData[i].product_id, check)

            if (!check){
                return {"status": "error", "message": "Stock not enough", product : finalData[i]}
            }
        }

        return { "status":"OK", 
                "message": finalData.length +" items" ,
                products : finalData}
    }
    catch(error){
        console.log(error);
        return error.message;
    }
}

module.exports = {
    getCartById,
    addProduct,
    removeProduct,
    validateCartItem,
    removeMultipleProducts
}