import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
//import { login } from "../requests";
import blogService from "../services/blogs";
import axios from "axios";


const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient()
  
  const loginMutation = useMutation(
    async () => {
      const response = await axios.post('/api/login', {
        username,
        password,
      })
      return response.data
    }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries('login')
        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(data))
        blogService.setToken(data.token)
        window.location.reload()
      }
  })

  const onSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate()
    setUsername("");
    setPassword("");
    //queryClient.invalidateQueries('accessUser')
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );
};


export default LoginForm;