const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB')
    })

app.use(cors())
//app.use(express.static('build')) //will be used later
app.use(express.json())
//app.use(middleware.requestLogger) //will be used later

app.use('/api/blogs', blogsRouter)

//app.use(middleware.unknownEndpoint) //will be used later
//app.use(middleware.errorHandler) //will be used later

module.exports = app