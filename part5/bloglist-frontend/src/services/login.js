import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/login`

const login = async ({ username, password}) => {
    const result = await axios.post(apiUrl, { username, password })
    return result.data
}

export default { login }