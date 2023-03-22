//import { useState, useEffect, useRef } from "react";
import { useEffect } from "react";
import Blog from "./components/Blog";
import BlogShow from "./components/BlogShow";
import LoginForm from "./components/LoginForm";
//import BlogForm from "./components/BlogForm";
//import Notification from "./components/Notification";
//import Togglable from "./components/Togglable";
//import blogService from "./services/blogs";
//import loginService from "./services/login";
//import { useDispatch } from "react-redux";
//import { NOTIFICATION } from "./reducers/notificationReducer";
import { useQuery } from 'react-query'
import { getBlogs } from './requests'
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./components/Home";

const App = () => {
  //const [blogs, setBlogs] = useState([]);
  //const [user, setUser] = useState(null);
  //const blogFormRef = useRef();
  //const dispatch = useDispatch()

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);
  // const result = useQuery(
  //   'blogs', getBlogs,
  //   {
  //     retry: 1,
  //     refetchOnWindowFocus: false
  //   }
  // )
  // console.log(result)
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  const user = useQuery('login', () => {
    if (!loggedUserJSON){
      return null
    }
    return loggedUserJSON
  })
  console.log('user',user)

  // if ( result.isLoading ) {
  //   return <div>loading data...</div>
  // }

  // if ( result.isError ) {
  //   return <div>blog service not available due to problems in server</div>
  // }
  //const blogs = result.data


  

  
  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON);
  //     setUser(user);
  //     blogService.setToken(user.token);
  //   }
  // }, []);

  // const handleLogin = async (username, password) => {
  //   try {
  //     const user = await loginService.login({
  //       username,
  //       password,
  //     });
  //     window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
  //     blogService.setToken(user.token);
  //     setUser(user);
  //   } catch (exception) {
  //     dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
  //   }
  // };

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload()
  };

  // const addBlog = async (title, author, url) => {
  //   blogFormRef.current.toggleVisibility();
  //   try {
  //     const blog = await blogService.create({
  //       title,
  //       author,
  //       url,
  //     });
  //     setBlogs(blogs.concat(blog));
  //     dispatch(NOTIFICATION(`A new blog ${title} by ${author} added`, 3))
  //   } catch (exception) {
  //     dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
  //   }
  // };

  // const addLikes = async (id, changedBlog) => {
  //   try {
  //     const updatedBlog = await blogService.update(id, changedBlog);
  //     setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)));
  //     dispatch(NOTIFICATION(`You voted for ${changedBlog.title}`, 3))
  //   } catch (exception) {
  //     dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
  //   }
  // };

  // const deleteBlog = async (id) => {
  //   try {
  //     await blogService.remove(id);
  //     setBlogs(blogs.filter((blog) => blog.id !== id));
  //   } catch (exception) {
  //     dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
  //   }
  // };

  return (
    <div>
      {user.data === null ?(
        <div>
          <h2>You need log in</h2>
          <LoginForm/>
        </div>  
      ):(
        <div>
          <h1>Blogs App</h1>
          <p>root salainen</p>
          <Button onClick={handleLogout} color="success" variant="contained">
            logout
          </Button>
          {/* <Notification /> */}
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          
      </div>
      )}
      
      {/* {!user && (
        <div>
          <Togglable buttonLabel="log in">
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <BlogShow key={blog.id} blog={blog} />
            ))}
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <strong>{user.name} logged in</strong>
          <button onClick={handleLogout}>logout</button>
          <h2>create new</h2>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                addLikes={addLikes}
                deleteBlog={deleteBlog}
              />
            ))}
        </div>
      )} */}
    </div>
  );
};

export default App;