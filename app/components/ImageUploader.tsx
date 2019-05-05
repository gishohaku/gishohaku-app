/** @jsx jsx */
import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/storage'
import { useState } from 'react';
import { Spinner, IconUpload } from 'sancho';

interface Props {
  user: firebase.User
}

const ImageUploader: React.FC<Props> = (props) => {
  const [isUploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/gif,image/jpeg,image/png,image/jpg',
    onDropAccepted: async (files) => {
      setUploading(true)
      console.log('file is accepted')
      console.log(files)
      const storageRef = firebase.storage().ref()
      const ref = storageRef.child(`/uploads/${props.user.uid}/${Date.now()}`)
      console.log('begin upload')
      const snapshot = await ref.put(files[0])
      console.log('Uploaded a blob or file!', snapshot);
      const url = await snapshot.ref.getDownloadURL()
      console.log(url)
      setUrl(url)
      setUploading(false)
    },
    onDropRejected: () => {
      console.log('file is rejected')
    },
    disabled: (isUploading || url.length > 0)
  });

  return (
    <section>
      <div {...getRootProps({
        css: css`
            background-color: #e5e5e5;
            width: 180px;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
        ` })}>
        {isUploading &&
          <Spinner label="Uploading..."></Spinner>
        }

        {url &&
          <img width='180' height='180' src={url} />
        }

        {(!isUploading && !url) &&
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