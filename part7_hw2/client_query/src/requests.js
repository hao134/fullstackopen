import axios from 'axios'
const baseUrl = "/api/blogs";
const loginUrl = "/api/login"

export const getBlogs = () =>
  axios.get(baseUrl).then(res => res.data)

export const login = (credentials) => {
  axios.post(loginUrl, credentials).then(res => res.data)
};

export const getUser = (id) => {
  axios.get(`${baseUrl}/${id}`).then(res => res.data);
};

export const createBlog = newBlog =>
  axios.post(baseUrl, newBlog).then(res => res.data)