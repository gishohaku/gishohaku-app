const onRequest = require('firebase-functions').https.onRequest

// const index = require('./next/serverless/pages/index')
// const post = require('./next/serverless/pages/post')

// exports.index = onRequest((req, res) => index.render(req, res))
// exports.post = onRequest((req, res) => post.render(req, res))

const Firestore = require('@google-cloud/firestore');


exports.post = onRequest((req, res) => {
  res.send('aaaaaaaaaaaa')
})

// exports.db = onRequest((req, res) => {
//   const firestore = new Firestore();

//   const document = firestore.doc('posts/intro-to-firestore');
//   console.log('Document created');

// })