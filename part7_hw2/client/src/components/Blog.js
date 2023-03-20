import { useDispatch } from "react-redux"
import { AddLike, deleteBlog } from "../reducers/blogReducer";
import { Button } from "@mui/material"

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

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
      <h2>
        {blog.title} - {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes{' '}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleAddLike}
        >
          like
        </Button>{" "}
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleDelete}
        >
          delete
        </Button>
      </div>
      <div>
        added by <strong>{blog.user.name}</strong>
      </div>
    </div>
  );
};

export default Blog;
