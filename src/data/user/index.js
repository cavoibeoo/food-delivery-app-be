'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit, deleteDoc} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "user")

const getUser = async () => {
    try {  
        const finalData = []
        const q = await query(collectionRef)
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
        finalData.push(doc.data())
        });

        console.log(autoId())

        return(finalData)
    } catch (error) {
        console.log(error.message);
    }
}

const getById = async(data) => {
    try {
        const finalData = []

        const q = await query(
            collectionRef,
            where('user_id', '==', Number(data)),
            limit(1))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });

        // console.log(finalData)

        return finalData;
    } catch (error) {
        return error.message;
    }
}

const getByEmail = async(data) => {
    try {
        const finalData = []
        
        const q = await query(
            collectionRef,
            where('email', '==', data.email),)

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });

        // console.log(finalData)

        return finalData;
    } catch (error) {
        return error.message;
    }
}

const createUser = async (data) => {
    try {
        const preprocessedData = {
            "address" : String(data.address),
            "avatar" : "Chua co",
            "email" : String(data.email),
            "full_name" : String(data.full_name) ,
            "password" : String(data.password) ,
            "phone_num" : String(data.phone_num),
            // "gender" : Boolean(data.gender),
            "role_id" : Number(data.role_id),
            "deleted": false,
            "user_id" : Number(await autoId()),
            "otp": "",
        }

        const userDocRef = await addDoc(collectionRef, preprocessedData)

        const cartSubcollectionRef = collection(userDocRef, "cart")
        const recentSubcollectionRef = collection(userDocRef, "recent")

        // Optionally, add an empty document to the subcollection (if needed)
        await addDoc(cartSubcollectionRef, {})  
        await addDoc(recentSubcollectionRef, {})

        return ({msg: 'Add successfully', preprocessedData});
    } catch (error) {
        // console.log(error)
        return error.message;
    }
}

const autoId = async () => {
    const finalData = []
    const q = await query(collectionRef, 
        orderBy('user_id', 'desc'),
        limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
    finalData.push(doc.data())
    });

    // console.log(finalData[0].user_id +1)

    return finalData[0].user_id +1;
}

const checkEmailExist = async(email) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('email', '==',email))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });

        if (finalData.length !=0) return true
        else return false
        // return finalData;
    } catch (error) {
        return error.message;
    }
}

//Update for user
const updateUser = async (id, data) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0].id)

        const preprocessedData = {
            "address" : String(data.address),
            "email" : String(data.email),
            "full_name" : String(data.full_name) ,
            // "gender" : Boolean(data.gender),
            "phone_num" : String(data.phone_num),
        }

        if (await checkEmailExist(preprocessedData.email) && finalData[0].data().email != preprocessedData.email)  {
            // console.log(await checkEmailExist(preprocessedData.email))
            return ({msg: 'Email existed, updated failed', data : preprocessedData} );
        }

        await updateDoc(docRef, preprocessedData)
        return ({msg: 'Update successfully', data : preprocessedData});
    } catch (error) {
        return error.message;
    }
}
//For user
const updateUserPassword = async(id, password)=>{
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0])

        await updateDoc(docRef,{"password" : String(password)} )
        return ({msg: 'Password changed successfully'});
    } catch (error) {
        return error.message;
    }
}

const uploadUserAva = async (id, avatar) => {
    try {

        // FInd for user document
        const finalData = []
        const user_email = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
          user_email.push(doc.data().email)
        });

        // console.log(finalData[0],"   " , user_email)
        const docRef = doc(collectionRef, finalData[0])
        
        const downloadUrl = await updateProImg(avatar, user_email)

        let preprocessedData = {
            "avatar": downloadUrl
        }   

        await updateDoc(docRef, preprocessedData)
        return downloadUrl

    } catch (error) {
        // console.log(error)
        return error.message;
    }
}

// Get upload img links
const updateProImg = async (img, email) => {
    try {
        const storage = getStorage(app)

        const extension = img.originalname.slice(img.originalname.lastIndexOf(".")); // Extract from last dot

        const storageRef = ref(storage, `user_img/${email + extension}`)
        const metadata = {contentType : "image/jpeg"}
        const snapshot = await uploadBytesResumable(storageRef, img.buffer, metadata)

        const downloadURL = await getDownloadURL(snapshot.ref)
        // console.log(downloadURL)
        return downloadURL
    } catch (error){
        // console.log(error)
        return error.message;
    }

}

// For user
const resetPassword = async(email, password)=>{
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('email', '==', email))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0])

        await updateDoc(docRef,{"password" : String(password)} )
        return ({msg: 'Password changed successfully'});
    } catch (error) {
        return error.message;
    }
}

const addRecentProduct = async(user_id, product_id)=>{
    try{
        const finalData = []
        const userDocRef = await getUserDocInstance(user_id)
        const cartCollectionRef = collection(userDocRef, "recent")

        const now = new Date();
        const preprocessedData = {
            "product_id" : Number(product_id),
            "date" : new Date()
        }

        const q = await query(cartCollectionRef,
            where('product_id', '==', Number(product_id)),
            limit(1)
        )
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });

        if (finalData.length > 0) {

            const docRef = doc(cartCollectionRef, String(finalData[0].id))
            await updateDoc(docRef,{
                "date" : new Date()
            } )
            return {"status":"updated", "product": preprocessedData}

        } else {

            //If not existed then add a new product to cart
            await addDoc(cartCollectionRef,preprocessedData )

            return {"status":"added", "product": preprocessedData}
        }
    }catch (error) {    
        console.log(error)
        return error.message;       
    }
}

const getRecentProduct = async(user_id)=>{
    const finalData = []
    const userDocRef = await getUserDocInstance(user_id)
    const cartCollectionRef = collection(userDocRef, "recent")
    
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)); // Calculate 3 days in milliseconds

    const q = await query(cartCollectionRef, 
        where("date",">=", threeDaysAgo),
        limit(5)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
        finalData.push(doc.data())
    });

    return finalData
}

const getUserDocInstance = async(user_id) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(user_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        return doc(collectionRef, String(finalData[0])) 
    } catch (error) {
        console.log(error)
        return error.message;
    }
}

// For admin
const updateUserInfo = async(data)=>{
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(data.user_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0].id)

        const preprocessedData = {
            "address" : String(data.address),
            "email" : String(data.email),
            "full_name" : String(data.full_name) ,
            // "gender" : Boolean(data.gender),
            "phone_num" : String(data.phone_num),
            // "role_id" : Number(data.role_id),
            // "deleted" : Boolean(data.deleted)
        }

        if (await checkEmailExist(preprocessedData.email) && finalData[0].data().email != preprocessedData.email)  {
            // console.log(await checkEmailExist(preprocessedData.email))
            return ({msg: 'Email existed, updated failed', data : preprocessedData} );
        }
            
        await updateDoc(docRef, preprocessedData)
        return ({msg: 'Update successfully', data : preprocessedData} );
    } catch (error) {
        return error.message
    }
}

const deleteUser = async (user_id) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(user_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0].id)

        const preprocessedData = {
            "deleted" : true,
        }
            
        await updateDoc(docRef, preprocessedData)
        return ({msg: 'Update successfully', data : preprocessedData} );
    } catch (error) {
        return error.message;
    }
}

const enableUser = async(user_id) =>{
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('user_id', '==', Number(user_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0].id)

        const preprocessedData = {
            "deleted" : false,
        }
            
        await updateDoc(docRef, preprocessedData)
        return ({msg: 'Update successfully', data : preprocessedData} );
    } catch (error) {
        return error.message;
    }
}

// const removeAdmin = async(id) =>{
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('users/sql');
//         const remove = await pool.request()
//                             .input('id', sql.Int, id)
//                             .query(sqlQueries.removeAdmin);
//         return remove.recordset;
//     } catch (error) {
//         return error.message;
//     }
// }

module.exports = {
    getUser,
    getById,
    getByEmail,
    createUser,
    updateUser,
    updateUserInfo,
    updateUserPassword,
    resetPassword,
    uploadUserAva,
    deleteUser,
    enableUser,
    checkEmailExist,
    // removeAdmin]
    addRecentProduct,
    getRecentProduct,

}