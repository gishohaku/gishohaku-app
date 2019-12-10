import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import axios from 'axios'

export const notifyToSlack = async (data: any) => {
  const webhookUrl = functions.config().slack.webhook.submission
  return await axios.post(webhookUrl, data)
}

const circleUrl = (circleId: string) => `https://gishohaku.dev/gishohaku2/circles/${circleId}`

const buildSubmissionMessage = (submission: any, book: any) => ({
  blocks: [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:arrow_up: 見本誌がアップロードされました:\n *<${submission.url}|${book.title}>* （<${circleUrl(book.circle.ref.id)}|${book.circle.name}>）`
      }
    },
    {
      "type": "divider",
      "block_id": "actions"
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": ":eyes: View all items with `/gishohaku list` in `#core-mihonshi`"
        }
      ]
    }
  ]
})

const getBookData = async (bookId: string) => {
  const bookRef = admin.firestore().collection('books').doc(bookId)
  return {
    ...(await bookRef.get()).data()!,
    id: bookId
  }
}

export const createSubmission = functions.firestore
  .document('bookSubmissions/{bookId}')
  .onCreate(async (snapshot, context) => {
    const bookId = context.params.bookId as string
    const submission = snapshot.data()
    const book = await getBookData(bookId)

    await notifyToSlack(buildSubmissionMessage(submission, book))
  })

export const updateSubmission = functions.firestore
  .document('bookSubmissions/{bookId}')
  .onUpdate(async (change, context) => {
    const bookId = context.params.bookId as string
    const submission = change.after.data()
    const book = await getBookData(bookId)

    await notifyToSlack(buildSubmissionMessage(submission, book))
  })