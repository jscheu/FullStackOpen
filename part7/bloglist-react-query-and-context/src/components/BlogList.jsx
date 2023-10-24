import { useEffect } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useNotificationDispatch, infoNotification, errorNotification } from '../contexts/NotificationContext'
import { useUserValue } from '../contexts/UserContext'

import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()
  const user = useUserValue()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const likeMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (response) => {
      const updatedBlog = response.data
      queryClient.setQueryData(['blogs'], (oldData) => {
        return oldData.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
      })
      notificationDispatch(
        infoNotification(`you liked "${updatedBlog.title}"`))
    },
    onError: (error) => {
      notificationDispatch(
        errorNotification(`error: ${error.message}`))
    }
  })

  const handleLikeClick = (blogId) => {
    likeMutation.mutate({
      token: user.token,
      id: blogId
    })
  }

  const sortByLikes = (unsortedBlogs) => {
    const sortedBlogs = unsortedBlogs.sort((a, b) => b.likes - a.likes)
    return sortedBlogs
  }

  const removeMutation = useMutation({
    mutationFn: ({ token, id }) => {
      return blogService.remove({ token, id })
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['blogs'], (oldData) => {
        return oldData.filter(blog => blog.id !== variables.id)
      })
      notificationDispatch(infoNotification(`removed "${variables.title}"`))
    },
    onError: (error) => {
      notificationDispatch(
        errorNotification(`error: ${error.message}`))
    }
  })

  const handleRemoveClick = (blog) => {
    const confirmed = window
      .confirm(`remove "${blog.title}" by ${blog.author}?`)

    if(confirmed) {
      removeMutation.mutate({
        token: user.token,
        id: blog.id,
        title: blog.title
      })
    }
  }

  console.log('blog list render')

  useEffect(() => {
    if(result.error) {
      notificationDispatch(
        errorNotification(`error fetching blogs: ${result.error.message}`))
    }
  }, [result.error, notificationDispatch])

  if(result.isLoading) return <div>loading blogs...</div>

  const blogs = sortByLikes(result.data)

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