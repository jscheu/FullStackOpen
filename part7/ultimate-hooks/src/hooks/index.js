import { useCallback, useEffect, useState } from "react"
import axios from 'axios'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    const getAll = useCallback(async () => {
        const response = await axios.get(baseUrl)
        setResources(response.data)
        return response.data
    }, [baseUrl])

    useEffect(() => {
        getAll()
    }, [getAll])

    const create = async (resource) => {
        const response = await axios.post(baseUrl, resource)
        setResources(resources.concat(response.data))
        return response.data
    }

    const update = async (id, newObject) => {
        const response = await axios.put(`${baseUrl}/${id}`, newObject)
        const updatedResource = response.data

        setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r))
        return updatedResource
    }

    const service = {
        create,
        update
    }

    return [
        resources, service
    ]
}
