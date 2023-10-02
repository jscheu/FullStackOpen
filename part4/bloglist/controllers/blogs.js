const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = (await User.find({}))[0]

    const blogData = request.body
    blogData.user = user.toJSON().id

    const blog = new Blog(blogData)

    const result = await blog.save()

    user.blogs = user.blogs.concat(result.toJSON().id)
    user.markModified('blogs')
    await user.save()

    return response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

    response.json(result)
})

module.exports = blogsRouter