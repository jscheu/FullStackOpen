import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '1234',
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 1,
    user: {
      name: 'test name',
      username: 'test username'
    }
  }

  const user = {
    name: 'test name',
    user: 'test username'
  }

  let container
  let onLikeClick
  let onRemoveClick

  beforeEach(() => {
    onLikeClick = jest.fn()
    onRemoveClick = jest.fn()

    container = render(
      <Blog
        blog={blog}
        user={user}
        onLikeClick={onLikeClick}
        onRemoveClick={onRemoveClick}/>
    ).container
  })

  test('renders all elements', async () => {
    await screen.findByText(/test title/i)
    await screen.findByText(/test author/i)
    await screen.findByText(/test url/i)
    await screen.findByText(/likes: 1/i)
    await screen.findByText(/test name/i)
  })

  test('at start, details are not displayed', async () => {
    const div = container.querySelector('.details')
    expect(div).toHaveStyle('display: none')
  })

  test('view button reveals details', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText(/view/i)
    await user.click(viewButton)

    const div = container.querySelector('.details')
    expect(div).not.toHaveStyle('display: none')
  })

  test('like button calls onClick function once per click', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText(/view/i)
    const likeButton = screen.getByText('like')

    await user.click(viewButton)
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLikeClick.mock.calls).toHaveLength(2)
  })
})