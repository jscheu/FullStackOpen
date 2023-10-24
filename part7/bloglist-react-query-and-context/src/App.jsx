import { useEffect, useRef, useContext } from 'react'
import { useNotificationDispatch, infoNotification } from './contexts/NotificationContext'
import UserContext, { setUser, clearUser} from './contexts/UserContext'

import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'

import './app.css'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const [user, userDispatch] = useContext(UserContext)

  const blogFormRef = useRef(null)

  console.log('app render')

  const onLoginSuccess = (userLogin) => {
    window.localStorage.setItem(
      'loggedBloglistUser', JSON.stringify(userLogin),
    )
    userDispatch(setUser(userLogin))
  }

  const handleLogout = () => {
    const name = user.name
    window.localStorage.removeItem('loggedBloglistUser')
    userDispatch(clearUser())
    notificationDispatch(infoNotification(`${name} successfully logged out`))
  }

  const onCreateBlog = () => {
    if (blogFormRef.current) blogFormRef.current.toggleVisibility()
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const userLogin = JSON.parse(loggedUserJSON)
      userDispatch(setUser(userLogin))
      notificationDispatch(infoNotification(`logged in as ${userLogin.name}`))
    }
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification />
        <LoginForm
          onLoginSuccess={onLoginSuccess}/>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>{user.name} logged in<button
        id="logout-button"
        name="logout"
        onClick={handleLogout}>logout</button></p>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          onCreateBlog={onCreateBlog}/>
      </Toggleable>
      <BlogList />
    </div>
  )
}

export default App
