const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    if(!blog.title || !blog.url) return response.status(400).end()

    const result = await blog.save()
    return response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = new Blog(request.body)

    if(!blog.title || !blog.url) {
        return response.status(400).end()
    }
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

    response.json(result)
})

module.exports = blogsRouter