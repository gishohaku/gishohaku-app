import { useState, FormEvent } from 'react'
import {
  Button,
  InputGroup,
  Input,
  TextArea,
} from 'sancho'

interface Props {
  onSubmit: (event: FormEvent<HTMLFormElement>, book: Book) => void,
  book?: Book
}

interface Book {
  id?: string
  title: string
  description: string
}

const BookForm = ({ onSubmit, book: initialBook }: Props) => {

  const [title, setTitle] = useState(initialBook ? initialBook.title : '')
  const [description, setDescription] = useState(initialBook ? initialBook.description : '')

  return <form onSubmit={(event) => {
    onSubmit(event, {
      title, description
    })
    // const db = firestore()
    // db.collection("books").add({
    //   title, description
    // }).then((docRef) => {
    //   console.log(docRef)
    //   // debugger
    //   router.push('/books')
    // })
    // event.preventDefault()
    return false
  }} className="Form-basics">
    <InputGroup label="Title">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" required placeholder="Book Title" />
    </InputGroup>
    <InputGroup
      label="Description"
      helpText="Book Description."
    >
      <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Book Description" />
    </InputGroup>
    <Button size="lg" block intent="primary">
      Submit
    </Button>
  </form>
}

export default BookForm