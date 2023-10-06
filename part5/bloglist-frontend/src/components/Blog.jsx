import { useState } from 'react'

const Blog = ({ blog }) => {
  const [details, setDetails] = useState(false)

  const buttonText = details ? 'hide' : 'view'

  const showDetails = { display: details ? '' : 'none' }

  const toggleDetails = () => {
    setDetails(!details)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleDetails}>{buttonText}</button>
      </div>
      <div style={showDetails}>
        <div>{blog.url}</div>
        <div>likes: {blog.likes}<button>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog