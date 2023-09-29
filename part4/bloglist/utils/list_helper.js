const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    //Return 0 if blogs is not an array
    if(!Array.isArray(blogs)) return 0
    
    return blogs.reduce((accumulator, currentBlog) => {
        //Skips objects if likes cannot be resolved to an integer
        if(typeof currentBlog !== 'object'
            || currentBlog == null
            || !Number.isInteger(currentBlog.likes))
            return accumulator

        return accumulator + currentBlog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    //Return null if blogs is not an array
    if(!Array.isArray(blogs)) return null

    const favorite = blogs.reduce((mostLikes, currentBlog) => {
        //Skips object if keys cannot be resolved
        if(typeof currentBlog !== 'object'
            || currentBlog == null
            || currentBlog.author == null
            || currentBlog.title == null
            || !Number.isInteger(currentBlog.likes))
            return mostLikes

        return mostLikes.likes >= currentBlog.likes ? mostLikes : currentBlog
    }, {title: null, author: null, likes: -1})

    //Handles the case where no objects could be evaluated due to missing keys
    if(favorite.likes === -1) return null

    //Create output object
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    //Return null if blogs is not an array
    if(!Array.isArray(blogs)) return null

    //Create a frequecy map of unique authors and blog count
    const frequencyMap = blogs.reduce((accumulator, currentBlog) => {
        //Skips object if author cannot be resolved
        if(typeof currentBlog !== 'object'
            || currentBlog == null
            || currentBlog.author == null)
            return accumulator

        const author = currentBlog.author

        accumulator[author] = (accumulator[author] || 0) + 1
        return accumulator
    }, {})

    //Handles the case where the frequency map was emplty due to missing or null authors
    if(Object.keys(frequencyMap).length === 0) return null

    //Find the maximum frequency value
    const mostFrequentCount = Math.max(...Object.values(frequencyMap))

    //Find the first author that matches the maximum frequency count
    const mostFrequentAuthor = Object.keys(frequencyMap).find(author => frequencyMap[author] === mostFrequentCount)

    //Create output object
    return { author: mostFrequentAuthor, blogs: mostFrequentCount }
}

const mostLikes = (blogs) => {
    //Return null if blogs is not an array
    if(!Array.isArray(blogs)) return null

    //Create a frequecy map of unique authors and likes count
    const frequencyMap = blogs.reduce((accumulator, currentBlog) => {
        //Skips object if author cannot be resolved
        if(typeof currentBlog !== 'object'
            || currentBlog == null
            || currentBlog.author == null
            || !Number.isInteger(currentBlog.likes))
            return accumulator

        const author = currentBlog.author

        accumulator[author] = (accumulator[author] || 0) + currentBlog.likes
        return accumulator
    }, {})

    //Handles the case where the frequency map was emplty due to missing or null keys
    if(Object.keys(frequencyMap).length === 0) return null

    //Find the highest value for likes
    const highestLikes = Math.max(...Object.values(frequencyMap))

    //Find the first author that matches the highes likes value
    const mostLikedAuthor = Object.keys(frequencyMap).find(author => frequencyMap[author] === highestLikes)

    //Create output object
    return { author: mostLikedAuthor, likes: highestLikes}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}