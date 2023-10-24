import { useState } from 'react'
import { useNotificationDispatch, infoNotification, errorNotification } from '../contexts/NotificationContext'
import { useUserValue } from '../contexts/UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogForm = ({ onCreateBlog }) => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch()
  const user = useUserValue()
  const token = user.token

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  console.log('blog form render')

  const createMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (response) => {
      setTitle('')
      setAuthor('')
      setUrl('')

      const blog = response.data

      queryClient.setQueryData(['blogs'], (oldData) => {
        return oldData.concat(blog)
      })

      notificationDispatch(
        infoNotification(`new blog ${blog.title} by ${blog.author} added`))
      
      onCreateBlog()
    },
    onError: (error) => {
      notificationDispatch(
        errorNotification(`error creating blog: ${error.message}`))
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const content = {
      title,
      author,
      url
    }

    createMutation.mutate({ token, content })
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
            placeholder="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
              author:
          <input
            type="text"
            value={author}
            name="author"
            placeholder="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
              url:
          <input
            type="text"
            value={url}
            name="url"
            placeholder="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm