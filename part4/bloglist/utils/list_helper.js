const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(Array.isArray(blogs) && blogs.length > 0) {
        return blogs.reduce((accumulator, currentBlog) => {
            return accumulator + currentBlog.likes
        }, 0)
    } else return 0
}

const favoriteBlog = (blogs) => {
    if(Array.isArray(blogs) && blogs.length > 0) {
        const favorite = blogs.reduce((mostLikes, currentBlog) => {
            return mostLikes.likes >= currentBlog.likes ? mostLikes : currentBlog
        })

        return {
            title: favorite.title,
            author: favorite.author,
            likes: favorite.likes
        }
    } else return null
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}