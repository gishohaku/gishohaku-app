import { useState, FormEvent } from 'react'
import {
  Button,
  InputGroup,
  Input,
  TextArea,
} from 'sancho'
import { Book } from '../utils/firebase'

interface Props {
  onSubmit: (event: FormEvent<HTMLFormElement>, book: Book) => void,
  book?: Book
}

const BookForm = ({ onSubmit, book: initialBook }: Props) => {

  const [title, setTitle] = useState(initialBook ? initialBook.title : '')
  const [description, setDescription] = useState(initialBook ? initialBook.description : '')

  return <form onSubmit={(event) => {
    onSubmit(event, { title, description })
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