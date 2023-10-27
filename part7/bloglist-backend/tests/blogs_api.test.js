const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const testData = require('./test_data')

const superuser = new User(testData.users.superuser)
const altUser = new User(testData.users.correctlyFormattedUser)

beforeAll(async () => {
    await User.deleteMany({})
    await superuser.save()
    await altUser.save()
})

const supertoken = jwt.sign({
    username: superuser.username,
    id: superuser.id
}, process.env.SECRET)

const altToken = jwt.sign({
    username: altUser.username,
    id: altUser.id
}, process.env.SECRET)

describe('posting blogs', () => {
    beforeAll(async () => {
        await Blog.deleteMany({})
    })

    describe('correctly formatted blog and valid token', () => {
        const blog = testData.blogs.correctlyFormattedBlog
        let result

        test('POST creates a new blog', async () => {
            result = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${supertoken}`)
                .send(blog)
                .expect(201)
        })

        test('new blog has all fields correctly defined', async () => {
            const returnedBlog = result.body

            expect(returnedBlog.title).toEqual(blog.title)
            expect(returnedBlog.url).toEqual(blog.url)
            expect(returnedBlog.likes).toBe(blog.likes)
            expect(returnedBlog.user.id).toEqual(superuser.id)
        })

        test('missing likes property defaults to 0', async () => {
            const noLikesResult = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${supertoken}`)
                .send(testData.blogs.blogWithMissingLikes)
                .expect(201)
            
            expect(noLikesResult.body.likes).toBe(0)
        })
    })

    describe('error cases', () => {
        let initialResult

        beforeAll(async () => {
            initialResult = await api
                .get('/api/blogs')
        })

        test('missing title results in status 400', async () => {
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${supertoken}`)
                .send(testData.blogs.blogWithMissingTitle)
                .expect(400)
        })
        
        test('missing url results in status 400', async () => {
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${supertoken}`)
                .send(testData.blogs.blogWithMissingUrl)
                .expect(400)
        })

        test('missing token results in status 401', async () => {
            await api
                .post('/api/blogs')
                .send(testData.blogs.correctlyFormattedBlog)
                .expect(401)
        })

        test('error cases did not create a new blog', async () => {
            const finalResult = await api
                .get('/api/blogs')

            expect(finalResult.body.length)
                .toBe(initialResult.body.length)
        })
    })
})

describe('when database contains blogs initially', () =>{
    let initialGet

    beforeAll(async () => {
        await Blog.deleteMany({})

        const blogData = testData.blogs.listWithManyBlogs
            .map(blog => {
                return {
                    ...blog,
                    user: superuser.id
                }
            })
        
        const blogObjects = blogData.map(blog => new Blog(blog))

        const promiseArray = blogObjects.map(blog => blog.save())

        await Promise.all(promiseArray)

        initialGet = await api.get('/api/blogs')
    })

    describe('GET functionality', () => {
        test('correct number of blogs returned', () => {
            expect(initialGet.body.length)
                .toBe(testData.blogs.listWithManyBlogs.length)
        })

        test('blogs returned in JSON format', () => {
            expect(initialGet.headers['content-type'])
                .toMatch(/application\/json/)
        })

        test('id property has been correctly formatted', () => {
            expect(initialGet.body[0].id).toBeDefined()
        })
    })

    describe('updating blogs', () => {
        test('update a blog with valid id and token', async () => {
            const initialBlog = initialGet.body[0]
            const updates = testData.blogs.correctlyFormattedBlog

            const result = await api
                .put(`/api/blogs/${initialBlog.id}`)
                .set('Authorization', `Bearer ${supertoken}`)
                .send(updates)
                .expect(200)

            const updatedBlog = result.body

            expect(updatedBlog.title).toEqual(updates.title)
            expect(updatedBlog.author).toEqual(updates.author)
            expect(updatedBlog.url).toEqual(updates.url)
            expect(updatedBlog.likes).toBe(updates.likes)

            expect(initialBlog.title).not.toEqual(updates.title)
            expect(initialBlog.author).not.toEqual(updates.author)
            expect(initialBlog.url).not.toEqual(updates.url)
            expect(initialBlog.likes).not.toBe(updates.likes)
        })

        test('like a blog with alt user', async () => {
            const initialBlog = (await api.get('/api/blogs')).body[0]

            const blogId = initialBlog.id

            const response = await api
                .put(`/api/blogs/${blogId}?action=incrementLike`)
                .set(`Authorization`, `Bearer ${altToken}`)
                .expect(200)

            expect(response.body.likes).toBe(initialBlog.likes + 1)
        })

        test('id not found results in status 404', async () => {
            falseId = new mongoose.Types.ObjectId()

            await api
                .put(`/api/blogs/${falseId}`)
                .set('Authorization', `Bearer ${supertoken}`)
                .send(testData.blogs.correctlyFormattedBlog)
                .expect(404)
        })

        test('missing token results in status 401', async () => {
            const initialBlog = initialGet.body[0]
            const updates = testData.blogs.correctlyFormattedBlog

            await api
                .put(`/api/blogs/${initialBlog.id}`)
                .send(updates)
                .expect(401)
        })
    })

    describe('deleting blogs', () => {
        let idsInDatabase
        const idsRemoved = []

        beforeAll(async () => {
            const initialBlogs = (await api.get('/api/blogs')).body
            idsInDatabase = initialBlogs.map(b => b.id)
        })

        test('delete by id with valid token', async () => {
            const idToRemove = idsInDatabase[idsInDatabase.length - 1]

            await api
                .delete(`/api/blogs/${idToRemove}`)
                .set(`Authorization`, `Bearer ${supertoken}`)
                .expect(204)
            
            const resultAfterDelete = await api.get('/api/blogs')

            const idsAfterDelete = resultAfterDelete.body.map(b => b.id)

            expect(idsAfterDelete.length).toBe(idsInDatabase.length - 1)
            expect(idsAfterDelete).not.toContain(idToRemove)

            idsRemoved.push(idsInDatabase.pop())
        })

        test('id not found resultsin status 404', async () => {
            const idToRemove = idsRemoved[0]

            await api
                .delete(`/api/blogs/${idToRemove}`)
                .set('Authorization', `Bearer ${supertoken}`)
                .expect(404)
        })

        test('missing token results in status 401', async () => {
            const idToRemove = idsInDatabase[0]

            await api
                .delete(`/api/blogs/${idToRemove}`)
                .expect(401)
        })

        test('unauthorized user results in status 403', async () => {
            const idToRemove = idsInDatabase[0]

            await api
                .delete(`/api/blogs/${idToRemove}`)
                .set(`Authorization`, `Bearer ${altToken}`)
                .expect(403)
        })

        test('error cases did not result in deletion', async () => {
            const finalResult = await api.get('/api/blogs')

            expect(finalResult.body.length).toBe(idsInDatabase.length)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})