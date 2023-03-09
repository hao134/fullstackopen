import { useDispatch, useSelector } from "react-redux"
import { AddVote } from "../reducers/anecdoteReducer";
import { NOTIFICATION } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const handleAddVote = async (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        const addedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        dispatch(AddVote(id, addedAnecdote))
        dispatch(NOTIFICATION(`You voted for ${anecdote.content}`, 5))
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