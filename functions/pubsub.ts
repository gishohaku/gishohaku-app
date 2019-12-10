import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import { WebClient } from '@slack/web-api'

export const listSubmission = functions.pubsub.topic('list-submission').onPublish(async message => {
  const query = admin.firestore().collection('bookSubmissions').where("eventId", "==", "gishohaku2")
  const refs = await query.get()
  const rows = refs.docs.map(doc => {
    const { url, book } = doc.data()
    return `/books/${doc.id} <${url}|${book.title}>`
  })

  const token = functions.config().slack.token
  const web = new WebClient(token)
  const res = await web.files.upload({ channels: 'GLMG8URB8', content: rows.join('\n') })
  console.log('listSubmission ok:', res.ok)
})