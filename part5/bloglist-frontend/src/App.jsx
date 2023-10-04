import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  console.log('app.jsx render')

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if(loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON)
      setUser(userLogin)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const userLogin = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(userLogin)
      )
      setUser(userLogin)
      setUsername('')
      setPassword('')
    } catch (e) {
      console.error(e.name)
      console.error(e.message)
      console.error(e.stack)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    const token = user.token

    const content = {
      title: title,
      author: author,
      url: url
    }

    try {
      const response = await blogService.create({ token, content })
      if(response.status === 201) {
        setBlogs([...blogs, response.data])
        setTitle('')
        setAuthor('')
        setUrl('')
      } else {
        //handle unsuccessful blog creation
        console.log(response.status)
      }
    } catch (e) {
      console.error(e.name)
      console.error(e.message)
      console.error(e.stack)
    }
  }

  if(user === null) {
    return (
      <div>
       <h2>log in to application</h2>
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
            <input type="password"
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
      <p>{user.name} logged in<button name="logout" onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input type="text"
            value={title}
            name="title"
            onChange={({target}) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input type="text"
            value={author}
            name="author"
            onChange={({target}) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input type="text"
            value={url}
            name="url"
            onChange={({target}) => setUrl(target.value)}/>
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App