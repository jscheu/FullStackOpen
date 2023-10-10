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
  const timeoutIdRef = useRef(null)

  const notify = (type, message) => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)

    setNote({ type, message })

    timeoutIdRef.current = setTimeout(() => {
      setNote(null)
    }, noteTimeout)
  }

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(userLogin),
    )
    setUser(userLogin)
  }

  const handleLogout = () => {
    const name = user.name
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    notify('info', `${name} successfully logged out`)
  }

  const onCreateBlog = (blog) => {
    setLatestBlog(blog)
    if (blogFormRef.current) blogFormRef.current.toggleVisibility()
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON)
      setUser(userLogin)
      notify('info', `logged in as ${userLogin.name}`)
    }

    return () => clearTimeout(timeoutIdRef)
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification note={note}/>
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          notify={notify}/>
      </div>
    )
  }

  return (
    <div>
      <Notification note={note}/>
      <h2>blogs</h2>
      <p>{user.name} logged in<button
        name="logout"
        onClick={handleLogout}>logout</button></p>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          token={user.token}
          onCreateBlog={onCreateBlog}
          notify={notify}/>
      </Toggleable>
      <BlogList
        newBlog={latestBlog}
        user={user}
        notify={notify}/>
    </div>
  )
}

export default App
