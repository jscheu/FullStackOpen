const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const testData = require('./test_data')

describe('when the database is empty initially', () => {
    let response

    beforeAll(async () => {
        await User.deleteMany({})

        response = await api
            .post('/api/users')
            .send(testData.users.superuser)
    })
    
    test('creation of new user returns status code 201', () => {
        expect(response.status).toBe(201)
    })

    test('returned user has all fields defined correctyl', () => {
        expect(response.body.username)
            .toEqual(testData.users.superuser.username)

        expect(response.body.name)
            .toEqual(testData.users.superuser.name)

        expect(response.body.id).toBeDefined()
    })

    test('POST creates a new user', async () => {
        const result = await api.get('/api/users')

        expect(result.body.length).toBe(1)
    })
})

describe('when there are initally users in the database', () => {
    let initialResponse

    beforeAll(async () => {
        await User.deleteMany({})
    
        const userObjects = testData.users.listWithManyUsers
            .map(user => new User(user))
    
        const promiseArray = userObjects.map(user => user.save())
    
        await Promise.all(promiseArray)

        initialResponse = await api.get('/api/users')
    })
    
    describe('basic GET operations', () => {
        test('status code 200 returned', () => {
            expect(initialResponse.status).toBe(200)
        })
    
        test('users returned in JSON format', () => {
            expect(initialResponse.headers['content-type'])
                .toMatch(/application\/json/)
        })
    
        test('correct number of users returned', () => {
            expect(initialResponse.body.length)
                .toBe(testData.users.listWithManyUsers.length)
        })
    })

    describe('POST operations', () => {
        test('duplicate username results in status 409', async () => {
            await api
                .post('/api/users')
                .send(testData.users.listWithManyUsers[0])
                .expect(409)
        })

        test('missing username results in status 400', async () => {
            await api
                .post('/api/users')
                .send(testData.users.missingUsername)
                .expect(400)
        })

        test('missing password results in status 400', async () => {
            await api
                .post('/api/users')
                .send(testData.users.missingPassword)
                .expect(400)
        })

        test('username < 3 characters results in status 400', async () => {
            await api
                .post('/api/users')
                .send(testData.users.shortUsername)
                .expect(400)
        })

        test('password < 3 characters results in status 400', async () => {
            await api
                .post('/api/users')
                .send(testData.users.shortPassword)
                .expect(400)
        })

        test('invalid useres did not result in the creation of a new user', async ()=> {
            const result = await api.get('/api/users')

            expect(result.body.length)
                .toBe(initialResponse.body.length)
        })
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})