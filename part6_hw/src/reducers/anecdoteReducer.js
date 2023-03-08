import { createSlice } from '@reduxjs/toolkit'

  
const getId = () => (100000 * Math.random()).toFixed(0)
  
// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }
  
// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action){
      const content = action.payload
      state.push({
        content,
        votes: 0,
        id: getId(),
      })
    },
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
  
export const { createAnecdote, addVote, appendAnecdote, setAnecdotes} = anecdoteSlice.actions 
export default anecdoteSlice.reducer