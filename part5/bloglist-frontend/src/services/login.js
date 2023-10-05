import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/login`

const login = async ({ username, password}) => {
    const response = await axios.post(apiUrl, { username, password })
    return response.data
}

export default { login }