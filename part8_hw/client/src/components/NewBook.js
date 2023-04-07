import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import { TextField, Button } from "@mui/material";
import { updateCache } from '../App';

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
    onError: (error) => {
      error.graphQLErrors > 0
        ? props.setError(error.graphQLErrors[0].message)
        : props.setError(error.message);
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
      console.log(response.data)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: { title, author, published: parseInt(published), genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div style={{ marginTop: "0.5rem" }}>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <TextField
            label="published"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <TextField
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button onClick={addGenre} type="button">
            add genre
          </Button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <Button variant='contained' type="submit">create book</Button>
      </form>
    </div>
  )
}

export default NewBook