const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 100000)

// step 1
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})

// step 2
test('blogs have id properties instead of _id properties', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map((blog) => blog.id)
  for (const id of ids) {
    expect(id).toBeDefined()
  }
})

// step 3
test ('a valid blog can be added', async () => {
  const newBlog = {
    title: 'google search page',
    author: 'somebody',
    url: 'https://www.google.com',
    likes: 1000,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'google search page'
  )
}, 100000)

// step 4
test ('if like forget to be added, the likes value set to zero', async () => {
  const newBlog = {
    title: 'likes is zero?',
    author: 'nobody',
    url: 'https://www.google.com.tw',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
}, 100000)

// step 5
test ('if title or author are lost, return stauts 400', async () => {
  const newBlog = {
    likes: 50
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})