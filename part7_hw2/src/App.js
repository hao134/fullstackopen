import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogShow from "./components/BlogShow";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useDispatch, useSelector } from "react-redux";
import { NOTIFICATION } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])
  const blogs = useSelector(state => state.blogs)
  const Blogs = [...blogs]
  
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  return (
    <div>
      <h1>Blogs App</h1>
      <p>root salainen</p>
      <Notification />
      {!user && (
        <div>
          <Togglable buttonLabel="log in">
            <LoginForm handleLogin={handleLogin} />
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
