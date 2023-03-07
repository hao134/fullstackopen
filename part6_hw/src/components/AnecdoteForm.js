import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import {
  setNotification,
  hideNotification,
} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const handleAddAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`You created ${content}`))
        setTimeout(() => dispatch(hideNotification()), 5000)
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