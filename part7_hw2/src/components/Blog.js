import { useState } from "react";

const Blog = ({ blog, addLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const handleLike = () => {
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    addLikes(blog.id, changedBlog);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };
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
            <button onClick={handleLike} id="like-button">
              like
            </button>
          </div>
          <div>author: {blog.author}</div>
          <div>
            <button onClick={handleDelete} id="delete-button">
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
