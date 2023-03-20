import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from 'react-redux'
import store from "./store";
import { setBlogs } from "./reducers/blogReducer";
import blogService from './services/blogs'
import { BrowserRouter as Router } from "react-router-dom"

blogService.getAll().then(blogs => 
  store.dispatch(setBlogs(blogs))
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={ store}>
    <Router>
      <App/>
    </Router>
  </Provider>
);
