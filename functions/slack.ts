import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import axios from 'axios'
import { notifyToSlack } from './firestore'

const onRequest = functions.https.onRequest

// TODO: slack-actions
export const actions = onRequest(async (req, res) => {
  const body = JSON.parse(req.body.payload)
  const action = body.actions[0]

  if (action.action_id === 'approve_submission') {
    const bookId = ''
    const ref = admin.firestore().collection('bookSubmissions').doc(bookId)
    await ref.update({ isChecked: true })
    await axios.post(body.response_url, {
      text: `チェックしました`
    })
    return res.status(200).send()
  }

  res.status(200).send()
})

// slack-commands
export const commands = onRequest(async (req, res) => {
  const body = req.body

  console.log(body)
  if (body.token !== functions.config().slack.token) {
    res.status(200).json({ text: 'Invalid token.' })
  }

  // /gishohaku list
  if (body.text === 'list') {
    console.log(body.channel_id, body.channel_name)
    if (body.channel_id !== 'GLMG8URB8') // #core-mihonshi
      res.status(200).json({ text: '#core-mihonshi チャンネルで実行してください' })
    const query = admin.firestore().collection('bookSubmissions').where("eventId", "==", "gishohaku2")
    const refs = await query.get()
    const rows = refs.docs.map(doc => {
      const { url, book } = doc.data()
      return `/books/${doc.id} <${url}|${book.title}>`
    })
    // await notifyToSlack({ text: rows.join('\n') })
    const token = functions.config().slack.token
    axios.post('https://slack.com/api/files.upload', {
      token, channels: 'GLMG8URB8', content: rows.join('\n'),
    })
    res.status(200).json({ text: '' })
  } else {
    res.status(200).json({ text: 'Help `/gishohaku list`' })
  }
})