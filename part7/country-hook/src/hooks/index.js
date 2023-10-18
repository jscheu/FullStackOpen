import { useState, useEffect } from "react"
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

export const useCountry = (name) => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if(name) {
            axios.get(`${baseUrl}/${name}`)
                .then(response => {
                    if(response.status === 200) setCountry({ ...response, found: true })
                    else setCountry({ found: false })
                })
                .catch(error => {
                    setCountry({ found: false })
                })
        }
    }, [name])

    return country
}
