import { useMutation, useQueryClient } from "react-query";
//import blogService from "../services/blogs";
import axios from "axios";
import { useField } from "../hooks";
import { TextField, Button } from "@mui/material";


const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const queryClient = useQueryClient()
  
  const loginMutation = useMutation(
    async () => {
      const loginUser = {
        username: username.value,
        password: password.value,
      };
      const response = await axios.post('/api/login', loginUser)
      return response.data
    }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries('login')
        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(data))
        //blogService.setToken(data.token)
        window.location.reload()
      }
  })

  const onSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate()
    resetUsername()
    resetPassword()
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>log in to application</h2>
      <div style={{ marginBottom : "0.5rem" }}>
        <TextField label="username" id="username" {...username} />
      </div>
      <div style={{ marginBottom : "0.5rem" }}>
        <TextField label="password" id="password" {...password} />
      </div>
      <Button
          variant='contained'
          color="primary"
          type="submit"
          id="login-button"
        >
          login
        </Button>
    </form>
  );
};


export default LoginForm;