import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/blogs`

const getAll = () => {
  const request = axios.get(apiUrl)
  return request.then(response => response.data)
}

export default { getAll }