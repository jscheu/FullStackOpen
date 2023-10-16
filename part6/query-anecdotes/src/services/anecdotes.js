import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const asObject = (content) => {
    return {
      content,
      votes: 0
    }
  }

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createNew = async (content) => {
    const object = asObject(content)
    const response = await axios.post(baseUrl, object)
    return response.data
}

const vote = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    const currentVotes = response.data.votes

    const updatedVotes = currentVotes + 1
    const update = await axios.put(`${baseUrl}/${id}`, { ...response.data, votes: updatedVotes })
    return update.data
}

const exports = { getAll, createNew, vote }

export default exports