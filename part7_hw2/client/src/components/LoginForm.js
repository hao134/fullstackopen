import { useDispatch } from 'react-redux'
import { logInUser } from "../reducers/loginReducer";
import { TextField, Button } from '@mui/material';

const LoginForm = () => {
  const dispatch = useDispatch()

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(logInUser(
      event.target.username.value, 
      event.target.password.value
    ))
    event.target.username.value = ''
    event.target.password.value = ''
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>log in to application</h2>
      <p>root salainen</p>
      <div style={{ marginBottom: '1rem' }}>
        <TextField label='username' name='username' id='username'/>
      </div>
      <div>
        <TextField label='password' type='password' name='password' id='password'/>
      </div>
      <div>
        <Button variant='contained' color='primary' type='submit' id='login-button'>
          login
        </Button>
      </div>
    </form>
  )
}

export default LoginForm;
