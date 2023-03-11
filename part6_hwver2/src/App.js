import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'


const App = () => {
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updateAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData(
        'anecdotes', 
        anecdotes.map(anecdote => 
          anecdote.id !== updateAnecdote.id ? anecdote : updateAnecdote
        ))
    }
  })
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }
  const result = useQuery(
    'anecdotes', getAnecdotes,
    {
      retry: 1,
      refetchOnWindowFocus: false
    }
  )
  console.log(result)

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default App
