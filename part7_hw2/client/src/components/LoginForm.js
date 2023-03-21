import { useDispatch } from 'react-redux'
import { logInUser } from "../reducers/loginReducer";
import { TextField, Button } from '@mui/material';
import { useField } from '../hooks';

const LoginForm = () => {
  const dispatch = useDispatch()
  const { reset: resetUser, ...user } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(logInUser(
      user.value, 
      password.value
    ))
    resetUser()
    resetPassword()
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>log in to application</h2>
      <p>root salainen</p>
      <div style={{ marginBottom: '1rem' }}>
        <TextField label='username' id='username' {...user} />
      </div>
      <div>
        <TextField label='password' id='password' {...password} />
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
