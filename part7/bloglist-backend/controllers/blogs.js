const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })
        .populate('comments', {
            content: 1,
            id: 1
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
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    user.markModified('blogs')
    await user.save()

    const populatedBlog = await Blog
        .findById(savedBlog._id)
        .populate('user', {
            username: 1,
            name: 1
        })
        .populate('comments', {
            content: 1,
            id: 1
        })

    return response.status(201).json(populatedBlog)
})

blogsRouter.post('/:id/comments',
    middleware.tokenValidator,
    async (request, response) => {

    const blog = await Blog.findById(request.params.id)

    if(!blog) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    const newComment = new Comment({
        content: request.body.content,
        blog: blog.id
    })

    const savedComment = await newComment.save()

    blog.comments.push(savedComment._id)
    await blog.save()

    return response.status(201).json(savedComment)
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
            error: 'user not authorized to delete this blog'
        })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id',
    middleware.tokenValidator,
    middleware.userExtractor,
    async (request, response) => {

    const initialBlog = await Blog.findById(request.params.id)

    if(!initialBlog) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    let update

    if(request.query.action === 'incrementLike') {
        update = { $inc: { likes: 1 } }
    } else {
        if(initialBlog.user.toString() !== request.user._id.toString()) {
            return response.status(403).json({
                error: 'user not authorized to modify this blog'
            })
        }

        update = request.body
    }

    const savedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        update,
        {
            new: true,
            runValidators: true
        }
    )

    const populatedBlog = await Blog
        .findById(savedBlog._id)
        .populate('user', {
            username: 1,
            name: 1
        })
        .populate('comments', {
            content: 1,
            id: 1
        })

    response.json(populatedBlog)
})

module.exports = blogsRouter