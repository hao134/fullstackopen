import { useDispatch, useSelector } from "react-redux"
import {
    setNotification,
    hideNotification,
} from "../reducers/notificationReducer";
import { AddVote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const handleAddVote = async (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        const addedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        dispatch(AddVote(id, addedAnecdote))
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