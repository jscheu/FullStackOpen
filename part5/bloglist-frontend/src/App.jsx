import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  console.log(user)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const userLogin = await loginService.login({
        username, password
      })
      setUser(userLogin)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception.name)
      console.log(exception.message)
      console.log(exception.stack)
    }
  }

  if(user === null) {
    return (
      <div>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text"
              value={username}
              name="Username"
              onChange={({target}) => setUsername(target.value)}/>
          </div>
          <div>
            password
            <input type="text"
              value={password}
              name="Password"
              onChange={({target}) => setPassword(target.value)}/>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name}</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App