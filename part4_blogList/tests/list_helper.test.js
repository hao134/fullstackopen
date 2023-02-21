const listHelper = require('../utils/list_helper')
const { listWithZeroBlog, listWithOneBlog, listWithManyBlogs } = require('./blog_posts.js')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithZeroBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blogs', () => {
  test('when list is empty, return null', () => {
    const result = listHelper.favoriteLikes(listWithZeroBlog)
    expect(result).toBe(null)
  })

  test('when list has only one blog post, equals the post itself', () => {
    const result = listHelper.favoriteLikes(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blog posts, equals the post has most likes', () => {
    const result = listHelper.favoriteLikes(listWithManyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})


describe('favorite blogs', () => {
  test('when list is empty, return null', () => {
    const result = listHelper.favoriteLikes(listWithZeroBlog)
    expect(result).toBe(null)
  })

  test('when list has only one blog post, equals the post itself', () => {
    const result = listHelper.favoriteLikes(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('when list has many blog posts, equals the post has most likes', () => {
    const result = listHelper.favoriteLikes(listWithManyBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})


describe('author has most blogs', () => {
  test('when list is empty, the author post is null', () => {
    const result = listHelper.mostBlogPosts(listWithZeroBlog)
    expect(result).toBe(null)
  })

  test('when list has only one blog post, the author has one post', () => {
    const result = listHelper.mostBlogPosts(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has many blog posts, return the author who has most blogs', () => {
    const result = listHelper.mostBlogPosts(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})