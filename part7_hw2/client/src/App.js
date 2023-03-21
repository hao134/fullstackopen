import { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser } from "./reducers/loginReducer";
import { initializeUsers } from "./reducers/userReducer";
import {
  Routes, Route, useMatch
} from 'react-router-dom'
import Menu from "./components/Menu"
import Users from "./components/Users"
import User from './components/User'
import Home from "./components/Home";
import BlogList from "./components/BlogList"
import Blog from "./components/Blog";
import { Container } from "@mui/material"

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loggedUser())
    dispatch(initializeUsers())
  }, [dispatch])

  const user = useSelector(state => state.login)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const Blogs = [...blogs]
  
  const matchUser = useMatch('/users/:id')
  const userId = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const blogId = matchBlog
    ? Blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  return (
    <Container>
      {user === null ? (
        <div>
          <Notification/>
          <LoginForm />
        </div>
      ) : (
        <div>
          <h1>Blogs App</h1>
          <Menu />
          <Notification />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<Blog blog={blogId} user={user} />} /> 
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User user={userId} />} />
            
          </Routes>
        </div>
      )}
    </Container>
  )
}

export default App;
