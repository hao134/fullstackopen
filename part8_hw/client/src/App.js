import { useState, useEffect } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { Button } from "@mui/material";
import { ALL_BOOKS, BOOK_ADDED } from './queries'


export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}


const App = () => {
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      setMessage(`${addedBook.title} added`)
      
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  useEffect(() => {
    const userFromStorage = localStorage.getItem('library-user-token')
    if (userFromStorage) {
      setToken(userFromStorage)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [message]);
 
  if (!token){
    return (
      <div>
        <div>
          <Button onClick={() => setPage('authors')}>authors</Button>
          <Button onClick={() => setPage('books')}>books</Button>
          <Button onClick={() => setPage('login')}>login</Button>
        </div>
        <Notify message={message} />
        <Authors show={page === 'authors'} setError={setMessage}/>
  
        <Books show={page === 'books'} />
  
        <LoginForm show={page === 'login'} setToken={setToken} setError={setMessage}/>
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
        <Button onClick={() => setPage('recommend')}>recommend</Button>
        <Button color="error" onClick={logout}>logout</Button>
      </div>
      <Notify message={message} />
      <Authors show={page === 'authors'} setError={setMessage}/>

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={setMessage}/>

      <Recommend show={page === 'recommend'} />

    </div>
  )
}

export default App
