const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testData = require('./test_data')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = testData.lists.listWithManyBlogs.map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
})

test('correct number of blogs retured in JSON format', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(testData.lists.listWithManyBlogs.length)
})

test('id property is has been correctly formatted', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('POST request creates a new blog post', async () => {
    const lengthBefore = (await api.get('/api/blogs')).body.length

    const blog = testData.blogs.correctlyFormattedBlog

    await api.post('/api/blogs')
        .send(blog)
        .expect(201)

    const result = await api.get('/api/blogs')

    const titles = result.body.map(b => b.title)

    expect(result.body).toHaveLength(lengthBefore + 1)
    expect(titles).toContain(blog.title)
})

test('missing title results in status 400', async () => {
    await api.post('/api/blogs')
        .send(testData.blogs.blogWithMissingTitle)
        .expect(400)
})

test('missing url results in status 400', async () => {
    await api.post('/api/blogs')
        .send(testData.blogs.blogWithMissingUrl)
        .expect(400)
})

test('missing likes property defaults to 0', async () => {
    const blog = testData.blogs.blogWithMissingLikes

    await api.post('/api/blogs')
        .send(blog)
        .expect(201)

    const result = await api.get('/api/blogs')

    const savedBlog = result.body.find(b => b.title === blog.title)

    expect(savedBlog.likes).toBe(0)
})

test('delete a single blog entry by id', async () => {
    const initialResult = await api.get('/api/blogs')

    const firstId = initialResult.body[0].id

    await api.delete(`/api/blogs/${firstId}`)
        .expect(204)
    
    const finalResult = await api.get('/api/blogs')

    const ids = finalResult.body.map(b => b.id)

    expect(finalResult.body).toHaveLength(initialResult.body.length - 1)
    expect(ids).not.toContain(firstId)
})

test('update a single blog entry by id', async () => {
    const initialBlog = (await api.get('/api/blogs')).body[0]

    const updates = testData.blogs.correctlyFormattedBlog

    const result = await api.put(`/api/blogs/${initialBlog.id}`)
        .send(updates)

    const updatedBlog = result.body
    
    expect(updatedBlog.title).toEqual(updates.title)
    expect(updatedBlog.author).toEqual(updates.author)
    expect(updatedBlog.url).toEqual(updates.url)
    expect(updatedBlog.likes).toBe(updates.likes)
})

afterAll(async () => {
    await mongoose.connection.close()
})