import { useState } from 'react'

const Blog = ({ blog, user, onLikeClick, onRemoveClick }) => {
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
      <div style={showDetails} className="details">
        <div>{blog.url}</div>
        <div>likes: {blog.likes}<button onClick={() => onLikeClick(blog.id)}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={() => onRemoveClick(blog)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog