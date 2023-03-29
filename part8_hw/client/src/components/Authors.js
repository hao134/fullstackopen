import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')

  const [ changeBirth ] = useMutation(EDIT_AUTHOR,{
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = (event) => {
    event.preventDefault()
    changeBirth({ variables: { name, setBornTo: parseInt(birth) }})

    setName('')
    setBirth('')
  }

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
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        <div>
          name <input
             value={name}
             onChange={({ target }) => setName(target.value)}
           />
        </div>
        <div>
          born <input
            type="number"
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div> 
        <button type="submit">update author</button> 

      </form>
    </div>
  )
}

export default Authors
