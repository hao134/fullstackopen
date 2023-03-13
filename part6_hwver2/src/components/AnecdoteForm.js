import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    }
  })
  
  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch( {type:'CREATE', payload: content} )
    setTimeout(() => dispatch({type:'ERASE'}), 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' minLength="5" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
