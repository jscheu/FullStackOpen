import { createContext, useReducer, useContext } from "react";

const initialState = {
    type: null,
    message: null,
    timeout: null
};

const notificationReducer = (state, action) => {
    const { message, timeout } = action.payload
    switch(action.type) {
        case 'INFO':
            return {
                type: 'info',
                message,
                timeout
            }
        case 'ERROR':
            return {
                type: 'error',
                message,
                timeout
            }
        case 'RESET':
            return initialState
        default: return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState)

    return (
        <NotificationContext.Provider value ={[state, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}

export const infoNotification = (message, timeout) => {
    return {
        type: 'INFO',
        payload: { message, timeout }
    }
}

export const errorNotification = (message, timeout) => {
    return {
        type: 'ERROR',
        payload: { message, timeout }
    }
}

export const clearNotification = () => {
    return {
        type: 'RESET',
        payload: { message: null, timeout: null }
    }
}

export default NotificationContext
