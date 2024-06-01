const {initializeApp} = require('firebase/app')
const config = require('./config');
const {getFirestore}  = require('firebase/firestore');

let app
let fireStoreDb

//Initialize connection to Firebase app and get Firestore database
try {
  app = initializeApp(config.firebaseConfig)
  fireStoreDb = getFirestore(app)
}
catch (error) {
  console.log("Error on firebase-initializeFirebaseApp - ",error.message);
}


module.exports = {app, fireStoreDb};    