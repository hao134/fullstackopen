import { useDispatch } from 'react-redux'
import { createBlog } from "../reducers/blogReducer"
import { NOTIFICATION } from '../reducers/notificationReducer'

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
      <div>
        title:{" "}
        <input name="title" id="title" />
      </div>
      <div>
        author:{" "}
        <input name="author" id="author" />
      </div>
      <div>
        url:{" "}
        <input name="url" id="url" />
      </div>
      <div>
        <button type="submit" id="create-blog">
          create
        </button>
      </div>
    </form>
    </div>
  );
};

export default BlogForm;
