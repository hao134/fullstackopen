import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer";
import { NOTIFICATION } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleAddAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(NOTIFICATION(`You created ${content}`, 5))
    }
  
    return (
      <div>
        <h2>create new</h2> 
        <form onSubmit={handleAddAnecdote}>
            <input name="anecdote" />
            <button type="submit"> add </button>
        </form>
      </div>
    )
  }
  
  export default AnecdoteForm