import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/blogs`

const getAll = async () => {
  try {
    const response = await axios.get(apiUrl)
    return response.data
  } catch (e) {
    console.error('Error fetching blogs:', e)
    throw e
  }
}

const create = async ({ token, content }) => {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  try {
    const response = await axios.post(apiUrl, content, {
      headers: headers
    })
    return response
  } catch (e) {
    console.error('Error creating blog:', e)
    throw e
  }
}

export default {
  getAll,
  create
}