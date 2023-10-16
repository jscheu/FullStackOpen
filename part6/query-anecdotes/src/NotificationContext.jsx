import { PropTypes } from "prop-types"
import { createContext, useContext, useReducer, useRef } from "react"

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "INFO":
            return {
                type: 'info',
                message: action.payload
            }
        case "ERROR":
            return {
                type: 'error',
                message: action.payload
            }
        case "RESET":
            return null
        default: return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, null)
    const timerId = useRef(null)

    const setNotification = (type, message, timeout) => {
        notificationDispatch({ type, payload: message })

        if(timerId.current) clearTimeout(timerId.current)

        timerId.current = setTimeout(() => {
            notificationDispatch({ type: 'RESET' })
        }, timeout * 1000)
    }

    return (
        <NotificationContext.Provider value={[notification, setNotification]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

NotificationContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}

export default NotificationContext