import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { TextField, Button } from "@mui/material";

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    // onError: (error) => {
    //   props.setError(error.graphQLErrors[0].message)
    // }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: {username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div style={{ marginTop: "0.5rem" }}>
          <TextField 
            label="username" 
            value={username} 
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <TextField 
            type="password"
            label="password" 
            value={password} 
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button
          variant='contained'
          color="primary"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm