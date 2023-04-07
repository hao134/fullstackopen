import { useQuery, useLazyQuery } from '@apollo/client'
import { useState, useEffect } from 'react'

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
  const result = useQuery(ALL_BOOKS)
  const [getBooksByGenre, genreResult] = useLazyQuery(ALL_BOOKS,{
    fetchPolicy: 'no-cache',
  })
  const [genre, setGenre] = useState('all')
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  useEffect(() => {
    if (genreResult.data) {
      setBooks(genreResult.data.allBooks)
    }
  }, [genreResult.data])
  

  if (!props.show) {
    return null
  }
  
  if (result.loading || genreResult.loading ){
    return <div>loading...</div>
  }

  if (result.error || genreResult.error) {
    return <div>error :(</div>;
  }

  const { allBooks } = result.data;

  // Get only unique genres
  const genres = [...new Set(allBooks.flatMap((book) => book.genres))].concat('all')

  const handleGenreClick = (genre) => {
    setGenre(genre)

    if (genre === 'all') {
      setBooks(allBooks)
      return
    }

    getBooksByGenre({ variables: { genre: genre } })
  }

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre}</strong>
      </p>
      <div>
        {genres.map((genre) => (
          <Button size='small' key={genre} onClick={() => handleGenreClick(genre)}>
            {genre}
          </Button>
        ))}
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
              {books.map((b) => (
                <TableRow key={b.title}>
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
