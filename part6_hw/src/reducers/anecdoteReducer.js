import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action){
      const id = action.payload
      const anecdoteToAdd = state.find(a => a.id === id)
      const addedAnecdote = {
        ...anecdoteToAdd,
        votes: anecdoteToAdd.votes + 1
      }
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : addedAnecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})
  
export const { addVote, appendAnecdote, setAnecdotes} = anecdoteSlice.actions 

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const AddVote = (id, content) => {
  return async dispatch => {
    await anecdoteService.update(id, content)
    dispatch(addVote(id))
  }
}

export default anecdoteSlice.reducer