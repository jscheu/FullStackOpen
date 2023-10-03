const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
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

blogsRouter.post('/',
    middleware.tokenValidator,
    middleware.userExtractor,
    async (request, response) => {

    const user = request.user

    const blogData = request.body
    blogData.user = user._id

    const blog = new Blog(blogData)

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    user.markModified('blogs')
    await user.save()

    return response.status(201).json(result)
})

blogsRouter.delete('/:id',
    middleware.tokenValidator,
    middleware.userExtractor,
    async (request, response) => {
        
    const blog = await Blog.findById(request.params.id)

    if(!blog) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    if(blog.user.toString() !== request.user._id.toString()) {
        return response.status(403).json({
            error: 'user not authorized to delete this resource'
        })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })

    response.json(result)
})

module.exports = blogsRouter