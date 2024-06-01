'use strict';
const { app, fireStoreDb } = require('../../../firebasedb');
const fireStore = require('firebase/firestore')
const fs = require('fs')
const path = require('path')

// get firebase related functions
const { getFirestore, doc, setDoc, collection, getDocs, query, where, orderBy, addDoc, updateDoc, limit} = require('firebase/firestore');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const collectionRef = collection(fireStoreDb, "product")

const getProduct = async () => {
    try {
        const finalData = []
        const q = await query(collectionRef, 
            orderBy("product_id", "asc")
        )
        const querySnapshot = await getDocs(q).then()

        if (querySnapshot.empty) return ('No data')

        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });
        return finalData;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

const getProductAdmin = async () => {
    try {
        const finalData = []
        const q = await query(collectionRef, 
            orderBy("product_id", "asc")
        )
        
        const querySnapshot = await getDocs(q).then()

        if (querySnapshot.empty) return ('No data')

        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });
        return finalData;
    } catch (error) {
        console.log(error.message);
        return error.message;

    }
}

const getById = async(data) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('product_id', '==', Number(data.product_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });
        return finalData;
    } catch (error) {
        return error.message;

    }
}


const getByCat = async (data) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('category_id', '==', Number(data.category_id)),
            where('deleted', '==', false), 
            orderBy("product_id", "asc")
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });
        return finalData;
    } catch (error) {
        return error.message;
    }
}

const createProduct = async (data, img) => {
    try {
        const preprocessedData = {
            'product_id' : Number( await autoId() ),
            'category_id': Number(data.category_id),
            'title': String(data.title),
            'quantity': Number(data.quantity),
            'deleted' : false,
            'price': Number(data.price),
            'description' : String(data.description),
            'ingredients' : String (data.ingredients),  
            'thumbnail': await updateProImg(img, String(data.title)),
            // 'thumbnail' : "https://firebasestorage.googleapis.com/v0/b/foodapp-5e715.appspot.com/o/food_img%2Fproduct_img%2FChicken_Nugget.jpg?alt=media&token=c51ebdba-3fcd-4cdc-b8e1-1d44048f3b9d",
            'sold' : 0
        }
        const uploadData = await addDoc(collection(fireStoreDb, "product"), preprocessedData);
        return preprocessedData
    } catch (error) {
        return error.message;
    }
}

const autoId = async () => {
    const finalData = []
    const q = await query(collectionRef, 
        orderBy('product_id', 'desc'),
        limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
    finalData.push(doc.data())
    });

    return finalData[0].product_id +1;
}

const updateProImg = async (img, title) => {
    try {
        const storage = getStorage(app)

        const fileBuffer = fs.readFileSync(img.path); // Read the file from disk
        const extension = img.path.slice(img.originalname.lastIndexOf(".")); // Extract from last dot

        const storageRef = ref(storage, `food_img/product_img/${title.trim().replace(/\s/g, "_") + extension}`)
        const metadata = {contentType : "image/jpeg"}
        const snapshot = await uploadBytesResumable(storageRef, fileBuffer, metadata)

        const downloadURL = await getDownloadURL(snapshot.ref)
        // console.log(downloadURL)
        return downloadURL
    } catch (error){
        return error.message;
    }

}

const searchProduct = async (title) => {
    try {
        const finalData = []
        let searchOutput = []
        const q = await query(
            collectionRef,
            orderBy("product_id", "asc")
        )

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.data())
        });

        for (let i = 0; i<finalData.length; i++) {
            if (finalData[i].title.toLowerCase().includes(title.toLowerCase())) {
                searchOutput.push(finalData[i])
            }
        }

        return searchOutput;
    } catch (error) {
        return error.message;
    }
}

const updateProduct = async (data, img) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('product_id', '==', Number(data.product_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0])

        let preprocessedData = {
            'category_id': Number(data.category_id),
            'title': String(data.title),
            'quantity': Number(data.quantity),
            // 'deleted' : Boolean (data.status),
            'price': Number(data.price),
            'description' : String(data.description),
            'ingredients' : String (data.ingredients),
        }   

        if (img!= undefined){
            preprocessedData.thumbnail = await updateProImg(img, preprocessedData.title);
        }

        // console.log(preprocessedData)

        await updateDoc(docRef, preprocessedData)
        return preprocessedData

    } catch (error) {
        console.error(error)
        return error.message;
    }
}

// const updateSizeProduct = async (data) => {
//     try {
//         let pool = await sql.connect(config.sql);
//         const sqlQueries = await utils.loadSqlQueries('products/sql');
//         console.log(sqlQueries.updateSize);
//         const update = await pool.request()
//                         .input('id', sql.Int, data.id)
//                         .input('size', sql.NVarChar(50), data.size)
//                         .query(sqlQueries.updateSize);
//         return update.recordset;
//     } catch (error) {
//         return error.message;
//     }
// }

const deleteProduct = async (product_id) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('product_id', '==', Number(product_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        // console.log(finalData)

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0])

        let preprocessedData = {
            'deleted' : true,
        }   
        // console.log(preprocessedData)

        await updateDoc(docRef, preprocessedData)
        return {status : "Success", data : preprocessedData, product_id : product_id}
    } catch (error) {
        // console.log(error.message)
        return error.message;
    }
}

const enableProduct = async (product_id) => {
    try {
        const finalData = []
        const q = await query(
            collectionRef,
            where('product_id', '==', Number(product_id)))

        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          finalData.push(doc.id)
        });

        // console.log(finalData[0])
        const docRef = doc(collectionRef, finalData[0])

        let preprocessedData = {
            'deleted' : false,
        }   

        // console.log(preprocessedData)

        await updateDoc(docRef, preprocessedData)
        return {status : "Success", data : preprocessedData, product_id : product_id}
    } catch (error) {
        // console.log(error)
        return error.message;
    }
}

const checkStock = async(product_id, quantity)=>{
    try {
        
        const product = await getById({product_id})
        
        if (product.length > 0){
            if (product[0].quantity < quantity){
                return false
            }
            else return true
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//data = [{product_id: product_id, quantity: quantity}, ...]
const updateMultipleProductQuantity = async(data)=>{
    try {
        let count = 0
        let finalData = ""
        for (let i = 0; i < data.length; i++) {
            const q = await query(
            collectionRef,
            where('product_id', '==', Number(data[i].product_id)))

            const querySnapshot = await getDocs(q)
        
            querySnapshot.forEach((doc) => {
            finalData = (doc)
            });

            // console.log(finalData[0])
            const docRef = doc(collectionRef, finalData.id)
            
            await updateDoc(docRef, {"quantity" : Number(finalData.data().quantity) - Number(data[i].quantity)})
            count ++
        }

        if (count == data.length) return "Update " + count + " product stock"
        return "Update product stock failed - " + count + "succeeded"
    }catch(error){
        return error.message;
    }    

}

const getBestSeller = async() => {
    try {
        const finalData = []
        
        const q = await query(collectionRef, 
            orderBy("sold", "desc"),
            where('deleted', '==', false),
            limit(5)
        )
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
            finalData.push(doc.data())
        });

        return finalData
    }catch (error){
        // console.log(error)
        return error.message;
    }
}

const updateMultipleProductSold = async(data) => {
    try {
        let count = 0
        let finalData
        for (let i = 0; i < data.length; i++) {
            const q = await query(
            collectionRef,
            where('product_id', '==', Number(data[i].product_id)))

            const querySnapshot = await getDocs(q)
        
            querySnapshot.forEach((doc) => {
                finalData = (doc)
            });

            // console.log(finalData[0])
            const docRef = doc(collectionRef, finalData.id)
            
            await updateDoc(docRef, {"sold" : Number(finalData.data().sold) + Number(data[i].quantity)})
            count ++
        }  
            
        if (count == data.length) return "Update " + count + " product sold"
        return "Update product sold failed - " + count + "succeeded"
    }catch(error){
        return error.message;
    }  
}


module.exports = {
    getProduct,
    getById,
    getByCat,
    searchProduct,
    createProduct,
    updateProduct,
    // updateSizeProduct,
    deleteProduct,
    enableProduct,
    checkStock,
    updateMultipleProductQuantity,
    getBestSeller,
    updateMultipleProductSold,
    getProductAdmin

}