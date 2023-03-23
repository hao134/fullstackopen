import { Button } from "@mui/material"
import { useMutation, useQueryClient } from 'react-query'
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { useNotificationDispatch } from "../NotificationContext";

const Blog = ({ blog, user }) => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const updateBlogMutation = useMutation(
    async () =>{
      const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id}
      const response = await axios.put(`/api/blogs/${blog.id}`, updatedBlog)
      return response.data
    }, {
    onSuccess: (updateBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData(
        'blogs', 
        blogs.map(blog => 
          blog.id !== updateBlog.id ? blog : updateBlog
        ))
    },
    onError: (exception) => {
      dispatch({ type: 'ERROR', payload : exception})
      setTimeout(() => dispatch({type: 'ERASE'}), 5000)
    }
  })

  const deleteBlogMutation = useMutation(
    async () =>{
      const userData = window.localStorage.getItem('loggedBlogappUser')
      const token = JSON.parse(userData).token
      const config = {
        headers: { Authorization: `bearer ${token}` },
      }
      const response = await axios.delete(`/api/blogs/${blog.id}`, config)
      return response.data
    },{
      onSuccess: (deleteBlog) =>{
        const blogs = queryClient.getQueryData('blogs')
        queryClient.setQueryData(
          'blogs', 
          blogs.filter(blog => 
            blog.id !== deleteBlog.id
          ))
      },
      onError: (exception) => {
        dispatch({ type: 'ERROR', payload : exception})
        setTimeout(() => dispatch({type: 'ERASE'}), 5000)
      }
    }
  )
  const handleAddLike = async () => {
    updateBlogMutation.mutate()
    dispatch( {type:'LIKE', payload: blog.title} )
    setTimeout(() => dispatch({type:'ERASE'}), 3000)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate()
      navigate("/blogs")
      dispatch( {type:'DELETE', payload: blog.title} )
      setTimeout(() => dispatch({type:'ERASE'}), 5000)
    }
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes{' '}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddLike}
        >
          like
        </Button>{" "}
        {user.username === blog.user.username && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            delete
          </Button>
        )}
        
      </div>
      <div>
        added by <strong>{blog.user.name}</strong>
      </div>
    </div>
  );
};

export default Blog;