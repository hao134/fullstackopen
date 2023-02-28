import { useState } from 'react'

const Blog = ({ blog, addLikes }) => {
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
    return (
        <div className='blogStyle'>
          <div>
            {blog.title}{" "}
            <button onClick={toggleVisibility}>{visible ? "hide" : "show"}</button>
          </div>
          {visible && (
            <div>
              <p>title: {blog.title}</p>
              <p>url: {blog.url}</p>
              <p>likes: {blog.likes} <button onClick={handleLike}>like</button></p>
              <p>author: {blog.author}</p>
            </div>
          )}
        </div>
    )
}

export default Blog