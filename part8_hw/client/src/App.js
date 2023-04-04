import { useState, useEffect } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'
import { Button } from "@mui/material";



const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const userFromStorage = localStorage.getItem('library-user-token')
    if (userFromStorage) {
      setToken(userFromStorage)
    }
  }, [])
 
  if (!token){
    return (
      <div>
        <div>
          <Button onClick={() => setPage('authors')}>authors</Button>
          <Button onClick={() => setPage('books')}>books</Button>
          <Button onClick={() => setPage('login')}>login</Button>
        </div>
  
        <Authors show={page === 'authors'} />
  
        <Books show={page === 'books'} />
  
        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Button onClick={() => setPage('authors')}>authors</Button>
        <Button onClick={() => setPage('books')}>books</Button>
        <Button onClick={() => setPage('add')}>add book</Button>
        <Button color="error" onClick={logout}>logout</Button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      

    </div>
  )
}

export default App
