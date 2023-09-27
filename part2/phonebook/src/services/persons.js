import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = `${apiBaseUrl}/api/persons`

const getAll = () => {
    const request = axios.get(apiUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(apiUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${apiUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(`${apiUrl}/${id}`)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    update,
    remove
}