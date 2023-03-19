import { useDispatch } from "react-redux"
import { AddLike, deleteBlog } from "../reducers/blogReducer";
import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const handleAddLike = async () => {
    const addedBlog = {...blog, likes: blog.likes + 1, user: blog.user.id }
    dispatch(AddLike(blog.id, addedBlog))
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog))
    }
  }

  return (
    <div className="blog">
      <div>
        <span className="title">{blog.title} - </span>
        <span className="author">{blog.author} </span>
        <button onClick={toggleVisibility} id="show-button">
          {visible ? "hide" : "show"}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div>url: {blog.url}</div>
          <div>
            likes: {blog.likes}{" "}
            <button onClick={handleAddLike} id="like-button">
              like
            </button>
          </div>
          <div>author: {blog.author}</div>
          <div>
            <button onClick={handleDelete} id="delete-button">Remove</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
