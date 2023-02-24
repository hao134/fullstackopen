import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({
        username, 
        password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }


  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  return (
    <div>
      <h1>Blogs App</h1>
      <Notification message={errorMessage} />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && <div>
        <h2>blogs</h2>
        <strong>{user.name} logged in</strong>
        <button onClick={handleLogout}>logout</button>  
        <Blogs blogs={blogs} />
        </div>
      }
    </div>
  )
}

export default App