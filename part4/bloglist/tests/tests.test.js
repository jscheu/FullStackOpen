const listHelper = require('../utils/list_helper')
const testData = require('./test_data')

test('dummy returns 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('giving a null value should return 0', () => {
        const result = listHelper.totalLikes(null)
        expect(result).toBe(0)
    })

    test('when list is empty, test should return 0', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('giving an array of integers should return 0', () => {
        const result = listHelper.totalLikes(testData.listWithIntegers)
        expect(result).toBe(0)
    })
  
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(testData.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has many blogs, equals total likes of all blogs', () => {
        const result = listHelper.totalLikes(testData.listWithManyBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('giving a null value should return a null value', () => {
        const result = listHelper.favoriteBlog(null)
        expect(result).toBe(null)
    })

    test('giving an empty list should return null', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })

    test('giving an array of integers should return null', () => {
        const result = listHelper.favoriteBlog(testData.listWithIntegers)
        expect(result).toBe(null)
    })

    test('giving a list where an object is missing expected keys should skip that blog', () => {
        const result = listHelper.favoriteBlog(testData.listWithMissingAuthor)
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        })
    })

    test('giving a list where all objects are missing expected keys should return null', () => {
        const result = listHelper.favoriteBlog(testData.listWithNoAuthors)
        expect(result).toBe(null)
    })

    test('giving a list with one blog should retrun that blog', () => {
        const result = listHelper.favoriteBlog(testData.listWithOneBlog)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('giving a list with many blogs should return the first blog with the highest number of likes', () => {
        const result = listHelper.favoriteBlog(testData.listWithManyBlogs)
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        })
    })
})

describe('most blogs', () => {
    test('giving a null value should retrun null', () => {
        const result = listHelper.mostBlogs(null)
        expect(result).toBe(null)
    })

    test('giving an empty array should return null', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe(null)
    })

    test('giving an array of integers should return null', () => {
        const result = listHelper.mostBlogs(testData.listWithIntegers)
        expect(result).toBe(null)
    })

    test('giving a list where an object is missing the author key should skip that blog', () => {
        const result = listHelper.mostBlogs(testData.listWithMissingAuthor)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            blogs: 2
        })
    })

    test('giving a list where all objects are missing the author key should return null', () => {
        const result = listHelper.mostBlogs(testData.listWithNoAuthors)
        expect(result).toBe(null)
    })

    test('giving an array with one author should return that author with 1 blog', () => {
        const result = listHelper.mostBlogs(testData.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('giving an array with many blogs should return one author with the number of blogs', () => {
        const result = listHelper.mostBlogs(testData.listWithManyBlogs)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})