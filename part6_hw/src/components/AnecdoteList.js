import { useDispatch, useSelector } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import {
    setNotification,
    hideNotification,
} from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const handleAddVote = (id) => {
        dispatch(addVote(id))
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        dispatch(setNotification(`You voted for ${anecdote.content}`))
        setTimeout(() => dispatch(hideNotification()), 5000)
    }

    return (
        <div>
            <h2>Anecdotes</h2>
            {anecdotes
                .filter((anecdote) => anecdote.content.includes(filter))
                .sort((a, b) => b.votes - a.votes)
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}{' '}
                            <button onClick={() => handleAddVote(anecdote.id)}>vote</button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default AnecdoteList