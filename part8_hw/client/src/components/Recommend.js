import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { USER, ALL_BOOKS } from '../queries'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TableHead,
} from "@mui/material"
const Recommend = (props) => {
  const user = useQuery(USER)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: 'no-cache',
  })
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (user.data) {
      setFavoriteGenre(user?.data?.me?.favoriteGenre)
      getBooks({ variables: { genre: favoriteGenre } })
    }
  }, [user.data, favoriteGenre, getBooks])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (result.loading || user.loading) {
    return <div>loading...</div>
  }


  return (
    <div>
      <h2>recommendations</h2>
      {books.length > 0 ?(
        <div>
          <p>
            books in your favorite genre <strong>{favoriteGenre}</strong>
          </p>
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
                .map((book ,i) => (
                  <TableRow key={i}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author.name}</TableCell>
                    <TableCell>{book.published}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ):(
        <p>
          No books have been added yet based on your favorite genre{" "}
          <strong>{favoriteGenre}</strong>
        </p>
      )}
    </div>
  )
}

export default Recommend