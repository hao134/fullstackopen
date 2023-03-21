import { useDispatch } from 'react-redux'
import { createBlog } from "../reducers/blogReducer"
import { NOTIFICATION } from '../reducers/notificationReducer'
import { TextField, Button } from '@mui/material';

const BlogForm = () => {
  const dispatch = useDispatch()

  const handleAddBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value
    }
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    dispatch(createBlog(newBlog))
    dispatch(NOTIFICATION(`A new blog ${newBlog.title} by ${newBlog.author} added`, 3))
  }
  
  return (
    <div>
      <form onSubmit={handleAddBlog}>
        <div style={{ marginBottom: '0.5rem' }}>
          <TextField label='title' name='title' id='title'/>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <TextField label='author' name='author' id='author'/>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <TextField label='url' name='url' id='url'/>
        </div>
        <div>
          <Button variant='contained' color='primary' type='submit' id='create-blog'>
            ADD
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
