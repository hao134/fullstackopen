import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { NOTIFICATION } from './notificationReducer'

const loginSlice = createSlice({
    name: 'login',
    initialState: null,
    reducers: {
      setUser(state, action){
        return action.payload
      },
      login(state, action){
        return action.payload
      },
      logout(state, action){
        return action.payload
      }
    }
  })
  
export const { setUser, login, logout } = loginSlice.actions

export const loggedUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const logInUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(login(user))
      dispatch(NOTIFICATION(`Welcome ${user.name}`, 3))
    } catch (exception) {
      dispatch(NOTIFICATION('error: ' + exception.response.data.error, 3))
    }
  }
}

export const logOutUser = () => {
  return async dispatch =>{
    window.localStorage.clear()
    dispatch(logout(null))
  }
}

export default loginSlice.reducer