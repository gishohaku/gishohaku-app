import axios from 'axios'

export const getBooks = async () => {
  const result = await axios.get('https://us-central1-next-serverless-app.cloudfunctions.net/apiBooks')
  return result.data
}

export const getCircles = async () => {
  const result = await axios.get('https://us-central1-next-serverless-app.cloudfunctions.net/apiCircles')
  return result.data
}