import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'

import './app.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [note, setNote] = useState(null)
  const [latestBlog, setLatestBlog] = useState(null)

  const blogFormRef = useRef(null)

  console.log('app render')

  const noteTimeout = 5000
  let timeoutId = null

  const notify = (type, message) => {
    if(timeoutId) clearTimeout(timeoutId)

    setNote({ type, message })

    timeoutId = setTimeout(() => {
      setNote(null)
    }, noteTimeout)
  }

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(userLogin)
    )
    setUser(userLogin)
    notify('info', `logged in as ${userLogin.name}`)
  }

  const onLoginError = (e) => {
    if(e.response && e.response.status === 401) {
      notify('error', 'wrong username or password')
    } else {
      notify('error', `error: ${e.message}`)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const onCreateBlog = (blog) => {
    setLatestBlog(blog)
    if(blogFormRef.current) blogFormRef.current.toggleVisibility()
    notify('info', `new blog ${blog.title} by ${blog.author} added`)
  }

  const onCreateBlogError = (e) => {
    notify('error', `error: ${e.message}`)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if(loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON)
      setUser(userLogin)
      notify('info', `logged in as ${userLogin.name}`)
    }

    return () => clearTimeout(timeoutId)
  }, [])

  if(user === null) {
    return (
      <div>
        <Notification note={note}/>
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onLoginError={onLoginError}/>
      </div>
    )
  }

  return (
    <div>
      <Notification note={note}/>
      <h2>blogs</h2>
      <p>{user.name} logged in<button name="logout" onClick={handleLogout}>logout</button></p>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          token={user.token}
          onCreateBlog={onCreateBlog}
          onCreateBlogError={onCreateBlogError}/>
      </Toggleable>
      <BlogList newBlog={latestBlog}/>
    </div>
  )
}

export default App