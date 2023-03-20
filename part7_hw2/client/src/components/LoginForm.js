import { useDispatch } from 'react-redux'
import { logInUser } from "../reducers/loginReducer";

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
      <div>
        username
        <input type="text" id="username" name="username"/>
      </div>
      <div>
        password
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  )
}

export default LoginForm;
