import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import { useQuery } from 'react-query'
import { getBlogs } from './requests'
import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Notification from './components/Notification'


const App = () => {
  const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  const matchBlog = useMatch('/blogs/:id')
  const result = useQuery(
    'blogs', getBlogs,
      {
        retry: 1,
        refetchOnWindowFocus: false
      }
  )
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
    
  if ( result.isError ) {
    return <div>blog service not available due to problems in server</div>
  }

  const Blogs = result.data
  
  const blogId = matchBlog
    ? Blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  return (
    <div>
      {user === null ?(
        <div>
          <h2>You need log in</h2>
          <p>root salainen</p>
          <LoginForm/>
        </div>  
      ):(
        <div>
          <h1>Blogs App</h1>
          <Menu />
          <Notification />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList/>} />
            <Route path="/blogs/:id" element={<Blog blog={blogId} user = {user} />} />
          </Routes>
          
      </div>
      )}
      
    </div>
  );
};

export default App;