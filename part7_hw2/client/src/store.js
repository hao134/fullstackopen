import { configureStore } from "@reduxjs/toolkit";
import blogReducer from './reducers/blogReducer'
import loginReducer from './reducers/loginReducer'

import notificationReducer from "./reducers/notificationReducer";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    login: loginReducer
  }
})

export default store