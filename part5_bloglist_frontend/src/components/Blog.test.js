import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const addLikes = jest.fn()
  const deleteBlog = jest.fn()
  const blog = {
    title: 'Title',
    author: 'Author',
    url: 'https://www.test.com/',
    likes: 0
  }

  beforeEach(() => {
    component = render(
      <Blog
        key={blog.id}
        blog={blog}
        addLikes={addLikes}
        deleteBlog={deleteBlog}
      />
    )
  })

  test('renders title and author but not url or likes by default', () => {
    expect(component.container.querySelector('.title')).toHaveTextContent(blog.title)
    expect(component.container.querySelector('.author')).toHaveTextContent(blog.author)
    expect(component.queryByText(blog.url)).not.toBeInTheDocument()
    expect(component.queryByText('likes')).not.toBeInTheDocument()
  })

  test('at start the children are not displayed', () => {
    const details = component.container.querySelector('.blog-details')
    expect(details).toEqual(null)
  })
})