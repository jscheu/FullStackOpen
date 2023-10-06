import { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = ({ newBlog }) => {
    const [blogs, setBlogs] = useState([])

    console.log('blog list render')

    useEffect(() => {
        const fetchBlogs = async () => {
          const blogs = await blogService.getAll()
          setBlogs(blogs)
        }
        fetchBlogs()
      }, [])

      useEffect(() => {
        if(newBlog) setBlogs(blogs => [...blogs, newBlog])
      }, [newBlog])

      return (
        <div>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog}/>
            )}
        </div>
      )
}

export default BlogList