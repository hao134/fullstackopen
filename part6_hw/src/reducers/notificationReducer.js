import { createSlice } from "@reduxjs/toolkit";

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state = action.payload
      return state
    },
    hideNotification(state, action) {
      return initialState
    }
  }
})
  
export const { setNotification, hideNotification } = notificationSlice.actions

export const NOTIFICATION = (text, time) => {
  return dispatch => {
    dispatch(setNotification(text))
    setTimeout(() => dispatch(hideNotification()), time*1000)
  }
}
export default notificationSlice.reducer