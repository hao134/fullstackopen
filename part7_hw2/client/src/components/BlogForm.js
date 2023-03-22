import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { NOTIFICATION } from "../reducers/notificationReducer";
import { TextField, Button } from "@mui/material";
import { useField } from "../hooks";

const BlogForm = () => {
  const dispatch = useDispatch();
  const { reset: resetTitle, ...title } = useField("text");
  const { reset: resetAuthor, ...author } = useField("text");
  const { reset: resetUrl, ...url } = useField("text");

  const handleAddBlog = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    };
    resetTitle();
    resetAuthor();
    resetUrl();
    dispatch(createBlog(newBlog));
    dispatch(
      NOTIFICATION(`A new blog ${newBlog.title} by ${newBlog.author} added`, 3)
    );
  };

  return (
    <div>
      <form onSubmit={handleAddBlog}>
        <div style={{ marginBottom: "0.5rem" }}>
          <TextField label="title" id="title" {...title} />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <TextField label="author" id="author" {...author} />
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <TextField label="url" id="url" {...url} />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            id="create-blog"
          >
            ADD
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
