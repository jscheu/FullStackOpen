import { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = ({ newBlog, user, notify }) => {
    const [blogs, setBlogs] = useState([])

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
          notify('info', `you liked "${updatedBlog.title}"`)
        }
      } catch (e) {
        notify('error', `error: ${e.message}`)
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
            notify('info', `removed "${blog.title}" by ${blog.author}`)
          } else {
            notify('error', `error removing blog: status ${response.status}`)
          }
        } catch (e) {
          notify('error', `error removing blog: ${e.message}`)
        }
      }
    }

    console.log('blog list render')

    useEffect(() => {
        const fetchBlogs = async () => {
          const blogs = await blogService.getAll()
          setBlogs(sortByLikes(blogs))
        }
        try {
          fetchBlogs()
        } catch (e) {
          notify('error', `error fetching blogs: ${e.message}`)
        }
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

export default BlogList