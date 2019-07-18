/** @jsx jsx */
import { IconUpload } from 'sancho'
import { jsx, css } from '@emotion/core'
import Book from '../utils/book'
import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import Loader from './Loader'
import { useDropzone } from 'react-dropzone'

interface Props {
  onSubmit: (book: Book) => void
  user: firebase.User
  book?: Book
}

const BookSubmitForm = ({ book }: Props) => {
  const [isLoading, setLoading] = useState(true)
  const [isUploading, setUploading] = useState(false)
  const [submission, setSubmission] = useState()

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/gif,image/jpeg,image/png,image/jpg',
    onDropAccepted: async files => {
      setUploading(true)
      const storageRef = firebase.storage().ref()
      const ref = storageRef.child(`/submissions/${book!.id}/${Date.now()}`)
      console.log('begin upload', files[0])
      const originalName = files[0].name
      console.log(originalName)

      await ref.put(files[0], {
        customMetadata: { originalName }
      })
      setUploading(false)
    },
    onDropRejected: () => {
      alert('画像アップロードに失敗しました')
    },
    maxSize: 1000 * 1000 * 1,
    disabled: isUploading
  })

  useEffect(() => {
    const id = book!.id
    const db: firebase.firestore.Firestore = firebase.firestore()
    setLoading(false)
    db.collection('bookSubmissions')
      .doc(id)
      .get()
      .then(docSnapshot => {
        setLoading(false)
        if (docSnapshot.exists) {
          console.log(docSnapshot.data())
          setSubmission(docSnapshot.data())
        }
      })
  }, [])

  return isLoading ? (
    <Loader />
  ) : (
    <section>
      {submission && <p>アップロード済み {submission.originalName}</p>}
      <div
        {...getRootProps({
          css: css`
            background-color: #e5e5e5;
            min-width: 180px;
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
          `
        })}
      >
        {isUploading && <Loader label="Uploading..." />}

        {!isUploading && (
          <>
            <input {...getInputProps()} />
            <IconUpload size="xl" />
          </>
        )}
      </div>
    </section>
  )
}

export default BookSubmitForm
