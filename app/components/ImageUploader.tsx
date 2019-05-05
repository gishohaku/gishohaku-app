/** @jsx jsx */
import { useDropzone } from 'react-dropzone';
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/storage'

interface Props {
  user: firebase.User
}

const ImageUploader: React.FC<Props> = (props) => {

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/gif,image/jpeg,image/png,image/jpg',
    onDropAccepted: async (files) => {
      console.log('file is accepted')
      console.log(files)
      const storageRef = firebase.storage().ref()
      const ref = storageRef.child(`/uploads/${props.user.uid}/${Date.now()}`)
      console.log('begin upload')
      const snapshot = await ref.put(files[0])
      console.log('Uploaded a blob or file!', snapshot);
      const url = await snapshot.ref.getDownloadURL()
      console.log(url)
    },
    onDropRejected: () => {
      console.log('file is rejected')

    }
  });

  return (
    <section className="container">
      <div {...getRootProps({
        className: 'dropzone', css: css`
          background-color: #ddd;
      ` })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  );
}

export default ImageUploader