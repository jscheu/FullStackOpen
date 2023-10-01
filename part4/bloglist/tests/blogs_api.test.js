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

describe('basic GET operations', () => {
    test('correct number of blogs retured', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
    
        expect(response.body).toHaveLength(testData.lists.listWithManyBlogs.length)
    })
    
    test('blogs returned in JSON format', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('id property is has been correctly formatted', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
    
        expect(response.body[0].id).toBeDefined()
    })
})

describe.only('adding blogs with POST method', () => {
    test('POST request creates a new blog post', async () => {
        const initialResult = await api
            .get('/api/blogs')
            .expect(200)
        
        const blog = testData.blogs.correctlyFormattedBlog

        const initialTitles = initialResult.body.map(b => b.title)

        expect(initialTitles).not.toContain(blog.title)

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201)
        
        const finalResult = await api
            .get('/api/blogs')
            .expect(200)
        
        const finalTitles = finalResult.body.map(b => b.title)

        expect(finalTitles).toContain(blog.title)

        expect(finalResult.body.length).toBe(initialResult.body.length + 1)
    })
    
    test('missing title results in status 400', async () => {
        await api
            .post('/api/blogs')
            .send(testData.blogs.blogWithMissingTitle)
            .expect(400)
    })
    
    test('missing url results in status 400', async () => {
        await api
            .post('/api/blogs')
            .send(testData.blogs.blogWithMissingUrl)
            .expect(400)
    })
    
    test('missing likes property defaults to 0', async () => {
        const result = await api
            .post('/api/blogs')
            .send(testData.blogs.blogWithMissingLikes)
            .expect(201)
        
        expect(result.body.likes).toBe(0)
    })
})

describe('deleting blogs with DELETE method', () => {
    test('delete a single blog entry by id', async () => {
        const initialResult = await api
            .get('/api/blogs')
            .expect(200)
    
        const firstId = initialResult.body[0].id
    
        await api
            .delete(`/api/blogs/${firstId}`)
            .expect(204)
        
        const finalResult = await api
            .get('/api/blogs')
            .expect(200)
    
        const ids = finalResult.body.map(b => b.id)
    
        expect(finalResult.body).toHaveLength(initialResult.body.length - 1)
        expect(ids).not.toContain(firstId)
    })
})

describe('updating blogs with PUT method', () =>{
    test('update a single blog entry by id', async () => {
        const initialResult = await api
            .get('/api/blogs')
            .expect(200)

        const initialBlog = initialResult.body[0]
    
        const updates = testData.blogs.correctlyFormattedBlog

        expect(initialBlog.title).not.toEqual(updates.title)
        expect(initialBlog.author).not.toEqual(updates.author)
        expect(initialBlog.url).not.toEqual(updates.url)
        expect(initialBlog.likes).not.toBe(updates.likes)
    
        const response = await api
            .put(`/api/blogs/${initialBlog.id}`)
            .send(updates)
            .expect(200)
    
        const updatedBlog = response.body
        
        expect(updatedBlog.title).toEqual(updates.title)
        expect(updatedBlog.author).toEqual(updates.author)
        expect(updatedBlog.url).toEqual(updates.url)
        expect(updatedBlog.likes).toBe(updates.likes)

        const finalResult = await api
            .get('/api/blogs')
            .expect(200)
        
        const finalBlog = finalResult.body.find(b => b.id === initialBlog.id)

        expect(finalBlog.title).toEqual(updates.title)
        expect(finalBlog.author).toEqual(updates.author)
        expect(finalBlog.url).toEqual(updates.url)
        expect(finalBlog.likes).toBe(updates.likes)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})