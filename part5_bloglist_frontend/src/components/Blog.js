import { useState } from 'react'

const Blog = ({ blog }) => {
    const [visible, setVisible] = useState(false)
    const toggleVisibility = () => {
      setVisible(!visible)
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
              <p>likes: {blog.likes} <button>like</button></p>
              <p>author: {blog.author}</p>
            </div>
          )}
        </div>
    )
}

export default Blog