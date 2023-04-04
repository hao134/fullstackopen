import { useQuery } from "@apollo/client";
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
  const books = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (user.loading || books.loading) {
    return <div>loading...</div>
  }

  const { favoriteGenre } = user.data.me
  const { allBooks } = books.data

  const bookRecommendations = allBooks.filter((book) => 
    book.genres.includes(favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>
      {bookRecommendations.length > 0 ?(
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
              {bookRecommendations
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