import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/auth'

const projectId = process.env.PROJECT_ID
const apiKey = process.env.API_KEY

if (!firebase.apps.length) {
  firebase.initializeApp({
    projectId,
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}.firebaseio.com/`,
    storageBucket: `gs://${projectId}.appspot.com`
  })
}

export { firebase }
export const db = firebase.firestore()
export const functions = firebase.functions()