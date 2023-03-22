import { createComment } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { TextField, Button } from "@mui/material";
import { useField } from "../hooks";

const Comments = ({ blog }) => {
  const dispatch = useDispatch();
  const { reset: resetComment, ...comment } = useField("text");

  const { id, comments } = blog;

  const handleAddComment = async (event) => {
    event.preventDefault();
    dispatch(createComment(id, comment.value));
    resetComment();
  };

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <div>
          <TextField label="comment" id="comment" {...comment} />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            id="create-comment"
          >
            add comment
          </Button>
        </div>
      </form>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment}> {comment} </li>
          ))}
        </ul>
      ) : (
        <p>no comments yet...</p>
      )}
    </div>
  );
};

export default Comments;
