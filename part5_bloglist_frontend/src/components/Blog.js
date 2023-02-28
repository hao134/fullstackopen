import { useState } from 'react'

const Blog = ({ blog, addLikes, deleteBlog }) => {
    const [visible, setVisible] = useState(false)
    const toggleVisibility = () => {
      setVisible(!visible)
    }
    const handleLike = () => {
      const changedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id,
      }
      addLikes(blog.id, changedBlog)
    }

    const handleDelete = () => {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
        deleteBlog(blog.id)
      } 
    }
    return (
        <div className='blogStyle'>
          <div>
            {blog.title}{" "}
            <button onClick={toggleVisibility}>{visible ? "hide" : "show"}</button>
          </div>
          {visible && (
            <div>
              <div>url: {blog.url}</div>
              <div>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
              <div>author: {blog.author}</div>
              <div>
                <button onClick={handleDelete}>Remove</button>
              </div>
            </div>
          )}
        </div>
    )
}

export default Blog