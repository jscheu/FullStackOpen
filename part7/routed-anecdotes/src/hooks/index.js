import { useState } from "react"

export const useField = (type,  name = null) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        field: {
            type,
            value,
            onChange,
            ...(name && { name })
        },
        setValue,
        reset: () => setValue('')
    }
}
