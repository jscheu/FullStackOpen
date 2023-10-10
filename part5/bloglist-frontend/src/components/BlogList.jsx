import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = ({ newBlog, user, notify }) => {
  const [blogs, setBlogs] = useState([])

  const notifyRef = useRef(notify)

  const sortByLikes = (unsortedBlogs) => {
    const sortedBlogs = unsortedBlogs.sort((a, b) => b.likes - a.likes)
    return sortedBlogs
  }

  const handleLikeClick = async (blogId) => {
    try {
      const response = await blogService.like({
        token: user.token,
        id: blogId
      })

      if(response.status === 200) {
        const updatedBlog = response.data
        const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
        setBlogs(sortByLikes(updatedBlogs))
        if(notify) notify('info', `you liked "${updatedBlog.title}"`)
      }
    } catch (e) {
      if(notify) notify('error', `error: ${e.message}`)
    }
  }

  const handleRemoveClick = async (blog) => {
    const confirmed = window.confirm(`remove "${blog.title}" by ${blog.author}?`)

    if(confirmed) {
      console.log(user.token)
      try {
        const response = await blogService.remove({
          token: user.token,
          id: blog.id
        })

        if(response.status === 204) {
          setBlogs(blogs => blogs.filter(b => b.id !== blog.id))
          if(notify) notify('info', `removed "${blog.title}" by ${blog.author}`)
        } else {
          if(notify) notify('error', `error removing blog: status ${response.status}`)
        }
      } catch (e) {
        if(notify) notify('error', `error removing blog: ${e.message}`)
      }
    }
  }

  console.log('blog list render')

  useEffect(() => {
    notifyRef.current = notify
  }, [notify])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(sortByLikes(blogs))
      } catch (e) {
        if(notifyRef.current) notifyRef('error', `error fetching blogs: ${e.message}`)
      }
    }
    fetchBlogs()
  }, [])


  useEffect(() => {
    if(newBlog) setBlogs(blogs => [...blogs, newBlog])
  }, [newBlog])

  return (
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLikeClick={handleLikeClick}
          onRemoveClick={handleRemoveClick}/>
      )}
    </div>
  )
}

BlogList.propTypes = {
  newBlog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    })
  }),
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
  }),
  notify: PropTypes.func
}

BlogList.defaultProps = {
  notify: () => {}
}

export default BlogList