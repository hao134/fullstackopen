import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { NOTIFICATION } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action){
      const updatedBlog = action.payload
      const { id } = updatedBlog
      return state.map((blog) => (blog.id !== id ? blog: updatedBlog))
    },
    appendBlog(state, action){
      state.push(action.payload)
    },
    setBlogs(state, action){
      return action.payload
    },
    removeBlog(state, action){
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    }
  }
})

export const { updateBlog, appendBlog, setBlogs, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const AddLike = (id, blog) => {
  return async dispatch => {
    try{
      const likedBlog = await blogService.update(id, blog)
      dispatch(updateBlog(likedBlog))
      dispatch(NOTIFICATION(`You voted for ${blog.title}`, 3))
    }catch (error){
      dispatch(NOTIFICATION(`error ${error.response.data.error}`, 3))
    }
    
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try {
      await blogService.remove(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(NOTIFICATION(`${blog.title} by ${blog.author} removed`, 3))
    } catch (error) {
      dispatch(NOTIFICATION(`error ${error.response.data.error}`))
    }
  }
}

export default blogSlice.reducer