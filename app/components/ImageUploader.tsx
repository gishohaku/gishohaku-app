/** @jsx jsx */
import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/storage'
import { useState } from 'react';
import { Spinner, IconUpload } from 'sancho';

interface Props {
  user: firebase.User
  addUrl: Function
  size?: 'square' | 'circlecut'
}

const ImageUploader: React.FC<Props> = ({ user, addUrl, size }) => {
  const [isUploading, setUploading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/gif,image/jpeg,image/png,image/jpg',
    onDropAccepted: async (files) => {
      setUploading(true)
      const storageRef = firebase.storage().ref()
      const ref = storageRef.child(`/uploads/${user.uid}/${Date.now()}`)
      console.log('begin upload')
      const snapshot = await ref.put(files[0])
      const url = await snapshot.ref.getDownloadURL()
      console.log(url)
      addUrl(url)
      setUploading(false)
    },
    onDropRejected: (files, event) => {
      alert('画像アップロードに失敗しました')
    },
    maxSize: 1000 * 1000 * 1,
    disabled: isUploading
  });

  return (
    <section>
      <div {...getRootProps({
        css: css`
            background-color: #e5e5e5;
            min-width: 180px;
            width: 180px;
            height: ${size == 'circlecut' ? '255px' : '180px'};
            display: flex;
            align-items: center;
            justify-content: center;
        ` })}>
        {isUploading &&
          <Spinner label="Uploading..."></Spinner>
        }

        {(!isUploading) &&
          <>
            <input {...getInputProps()} />
            <IconUpload size="xl" />
          </>
        }
      </div>
    </section>
  );
}

export default ImageUploader