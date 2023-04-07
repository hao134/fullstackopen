import { useQuery } from '@apollo/client';
import SetBirthYear from './SetBirthYear';

import { ALL_AUTHORS } from '../queries'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from "@mui/material";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  if (result.loading){
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }
  const authors = result.data.allAuthors || []

  return (
    <div>
      <h2>authors</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>born</TableCell>
              <TableCell>books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {authors
              .map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.born}</TableCell>
                  <TableCell>{a.bookCount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SetBirthYear authors={authors} setError = {props.setError}/>
    </div>
  )
}

export default Authors
