import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleAddBlog = (event) => {
    event.preventDefault()
    addBlog(newBlog.title, newBlog.author, newBlog.url)
    setNewBlog({ title: '', author: '', url: '' })
  }
  return (
    <form onSubmit={handleAddBlog}>
      <div>
        title:{' '}
        <input
          name="title"
          id="title"
          value={newBlog.title}
          onChange={handleChange}
        />
      </div>
      <div>
        author:{' '}
        <input
          name="author"
          id="author"
          value={newBlog.author}
          onChange={handleChange}
        />
      </div>
      <div>
        url:{' '}
        <input
          name="url"
          id="url"
          value={newBlog.url}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="submit" id="create-blog">create</button>
      </div>
    </form>
  )
}

export default BlogForm