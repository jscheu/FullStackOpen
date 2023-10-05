import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/blogs`

const getAll = async () => {
  const response = await axios.get(apiUrl)
  return response.data
}

const create = async ({ token, content }) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const response = await axios.post(apiUrl, content, {
    headers: headers
  })
  return response
}

export default {
  getAll,
  create
}