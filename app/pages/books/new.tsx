import Link from 'next/link'

import { firestore } from 'firebase'

import {
  List,
  ListItem,
  Button,
  IconChevronRight,
  InputGroup,
  Input,
  TextArea,
  Container,
} from 'sancho'
import Layout from '../../components/layout'
import router, { withRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Book {
  id: string
  title: string
}

const Index = (props: any) => {
  const [posts, setPosts] = useState<Book[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <Layout tab={props.router.query.tab}>
      <Container>

        <form onSubmit={(event) => {
          const db = firestore()
          db.collection("books").add({
            title, description
          }).then((docRef) => {
            console.log(docRef)
            // debugger
            router.push('/books')
          })
          event.preventDefault()
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
      </Container>
    </Layout>
  )
}

export default withRouter(Index)
