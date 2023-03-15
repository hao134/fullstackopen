const Anecdote = ({ anecdote }) => {
    return (
        <div>
            <h2>{anecdote.content}</h2>
            <div>has {anecdote.votes} votes</div>
            <div>for more info see <a target='_blank' rel="noreferrer" href={anecdote.info}>{anecdote.info}</a></div>
        </div>
    )
}
export default Anecdote