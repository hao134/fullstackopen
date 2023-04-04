import { useQuery } from '@apollo/client'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  Button
} from "@mui/material";

const Books = (props) => {
  const [genre, setGenre] = useState('all')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }
  
  if (result.loading){
    return <div>loading...</div>
  }

  

  const books = result.data.allBooks || []

  // Get only unique genres
  const genres = [...new Set(books.flatMap((book) => book.genres))]

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre}</strong>
      </p>
      <div>
        {genres.map((genre) => (
          <Button size='small' key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </Button>
        ))}
        <Button size = "small" color="success" onClick={() => setGenre('all')}>show all</Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {books
              .filter((b) => (genre !== 'all' ? b.genres.includes(genre) : b))
              .map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{b.author.name}</TableCell>
                  <TableCell>{b.published}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  )
}

export default Books
