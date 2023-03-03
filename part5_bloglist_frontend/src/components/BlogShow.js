import { useState } from 'react'

const BlogShow = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div className='blog'>
      <div>
        <span className='title'>{blog.title} - </span>
        <span className='author'>{blog.author}{' '}</span>
        <button onClick={toggleVisibility} id="show-button">{visible ? 'hide' : 'show'}</button>
      </div>
      {visible && (
        <div className='blog-details'>
          <div>url: {blog.url}</div>
          <div>likes: {blog.likes} </div>
          <div>author: {blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default BlogShow