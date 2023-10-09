import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ token, onCreateBlog, notify }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    console.log('blog form render')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const content = {
            title,
            author,
            url
        }

        try {
            const response = await blogService.create({ token, content })
            setTitle('')
            setAuthor('')
            setUrl('')

            const blog = response.data
            notify('info', `new blog ${blog.title} by ${blog.author} added`)
            onCreateBlog(blog)
        } catch (e) {
            notify('error', `error creating blog: ${e.message}`)
        }
    }

    return (
        <div>
          <h2>create new</h2>
          <form onSubmit={handleSubmit}>
            <div>
              title:
              <input
                type="text"
                value={title}
                name="title"
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author:
              <input
                type="text"
                value={author}
                name="author"
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url:
              <input
                type="text"
                value={url}
                name="url"
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      )
}

export default BlogForm