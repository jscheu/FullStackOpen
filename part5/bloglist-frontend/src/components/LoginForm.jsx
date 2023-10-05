import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ onLoginSuccess, onLoginError }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    console.log('login form render')

    const handleLogin = async (event) => {
        event.preventDefault()
        
        try {
            const userLogin = await loginService.login({
                username, password
            })
    
            onLoginSuccess(userLogin)
        } catch (e) {
            onLoginError(e)
        }
    }

    return (
        <div>
            <h2>log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="test"
                        value={username}
                        name="Username"
                        onChange={({ target }) => setUsername(target.value)}/>
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({ target }) => setPassword(target.value)}/>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm