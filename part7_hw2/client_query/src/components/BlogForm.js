import { useMutation, useQueryClient } from 'react-query'
import axios from "axios";
import { useNotificationDispatch } from "../NotificationContext";
import { TextField, Button } from "@mui/material";
import { useField } from '../hooks'

const BlogForm = () => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newBlogMutation = useMutation(
    async () => {
      const newBlog = {
        title: title.value,
        author: author.value,
        url: url.value,
      };
      const userData = window.localStorage.getItem('loggedBlogappUser')
      const token = JSON.parse(userData).token
      const config = {
        headers: { Authorization: `bearer ${token}` },
      };
      const response = await axios.post('/api/blogs',newBlog , config)
      return response.data
    },{
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    },
    onError: (exception) => {
      dispatch({ type: 'ERROR', payload : exception})
      setTimeout(() => dispatch({type: 'ERASE'}), 5000)
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()

    if (title.value.length < 5 || author.value.length < 1 || url.value.length < 10){
      dispatch({ type: 'ERROR', payload : 'title or author or url too short!'})
      setTimeout(() => dispatch({ type:'ERASE' }), 5000)
      return
    }
    newBlogMutation.mutate()
    dispatch( {type:'CREATE', payload: [title.value, author.value]} )
    setTimeout(() => dispatch({type:'ERASE'}), 3000)
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
      <form onSubmit={onCreate}>
      <div style={{ marginBottom : "0.5rem" }}>
        <TextField label="title" id="title" {...title} />
      </div>
      <div style={{ marginBottom : "0.5rem" }}>
        <TextField label="author" id="author" {...author} />
      </div>
      <div style={{ marginBottom : "0.5rem" }}>
        <TextField label="url" id="url" {...url} />
      </div>
      <div>
        <Button
          variant='contained'
          color="primary"
          type="submit"
          id="create-blog"
        >
          create
        </Button>
      </div>
    </form>
  )
}

export default BlogForm