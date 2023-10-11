import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ onLoginSuccess, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  console.log('login form render')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userLogin = await loginService.login({
        username, password
      })
      notify('info', `logged in as ${userLogin.name}`)
      onLoginSuccess(userLogin)
    } catch (e) {
      if(e.response && e.response.status === 401) {
        notify('error', 'wrong username or password')
      } else {
        notify('error', `error: ${e.message}`)
      }
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
                    username
          <input
            id="username"
            type="test"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
                    password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm