import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

export const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      databaseURL: process.env.DATABASE_URL,
      storageBucket: process.env.STORAGE_BUCKET
    })
  }
}

// ref型のオブジェクトをgetInitialPropsの返り値に含めると循環参照となりSSRが失敗する
// ref型を参照先のID(string)に置き換えて回避するメソッド
export const refToPath = <T, U extends keyof T>(docData: T, pathField: U) => {
  const refField: any = docData[pathField]
  if (!refField) { return docData }
  const pathSegments = refField._key.path.segments
  const fieldId = pathSegments[pathSegments.length - 1]
  return {
    ...docData,
    [pathField]: fieldId
  }
}