// import admin from 'firebase-admin'
const firebase = require('firebase')
require('firebase/storage')
// import firebase from 'firebase'

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
})

const main = async () => {
  // console.log(firebase)
  const storage = firebase.storage()
  const storageRef = storage.ref()
  const fileRef = storageRef.child('uploads/WFymqWb3SgOA9HhudNMsEnDqa852/1558770101861')
  fileRef
    .updateMetadata({
      cacheControl: 'public, max-age=3600'
    })
    .then(result => {
      console.log(result)
    })
}

main()
