jest.mock('../services/blogs', () => ({
  create: jest.fn()
}))

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'
import { waitFor } from '@testing-library/react'
import blogService from '../services/blogs'

describe('<BlogForm />', () => {
  test('calls onCreateBlog with the right details when submitting form', async () => {

    const onCreateBlogMock = jest.fn()
    const notifyMock = jest.fn()

    const user = {
      name: 'test name',
      username: 'test username',
      id: 'test userId'
    }

    const blogData = {
      title: 'test blog',
      author: 'test author',
      url: 'http://test.url'
    }

    const responseData = {
      id: 'test blogId',
      title: 'test blog',
      author: 'test author',
      url: 'http://test.url',
      user: user
    }

    blogService.create.mockResolvedValue({ data: responseData })

    const { getByPlaceholderText, getByText } = render(
      <BlogForm
        token="testToken"
        onCreateBlog={onCreateBlogMock}
        notify={notifyMock}/>
    )

    fireEvent.change(getByPlaceholderText('title'), {
      target: { value: 'test blog' },
    })
    fireEvent.change(getByPlaceholderText('author'), {
      target: { value: 'test author' },
    })
    fireEvent.change(getByPlaceholderText('url'), {
      target: { value: 'http://test.url' },
    })

    fireEvent.click(getByText('create'))

    await waitFor(() => {
      expect(onCreateBlogMock).toHaveBeenCalledWith(responseData)
    })
  })
})
