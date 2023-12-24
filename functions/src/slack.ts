import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import axios from 'axios'
import { PubSub } from '@google-cloud/pubsub'

const onRequest = functions.https.onRequest

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

    const pubsub = new PubSub()
    const topic = pubsub.topic('list-submission')
    await topic.publish(Buffer.from(JSON.stringify({
      data: {}
    })))
    res.status(200).json({ text: 'Loading...' })
  } else {
    res.status(200).json({ text: 'Help `/gishohaku list`' })
  }
})