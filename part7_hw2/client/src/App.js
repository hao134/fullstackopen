import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogShow from "./components/BlogShow";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { loggedUser, logOutUser } from "./reducers/loginReducer";

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loggedUser())
    dispatch(initializeBlogs())
  },[dispatch])

  const user = useSelector(state => state.login)
  const blogs = useSelector(state => state.blogs)
  const Blogs = [...blogs]
  const blogFormRef = useRef();

  const handleLogout = () => {
    dispatch(logOutUser())
  };

  return (
    <div>
      <h1>Blogs App</h1>
      <p>root salainen</p>
      <Notification />
      {!user && (
        <div>
          <Togglable buttonLabel="log in">
            <LoginForm />
          </Togglable>
          {Blogs
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
            <BlogForm />
          </Togglable>
          {Blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
