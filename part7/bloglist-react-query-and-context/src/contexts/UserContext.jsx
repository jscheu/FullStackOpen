import { createContext, useReducer, useContext } from "react"

const initialState = null

const userReducer = (state, action) => {
    switch(action.type) {
        case 'SET':
            return action.payload
        case 'CLEAR':
            return initialState
        default: return state
    }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
    const [state, dispatch] = useReducer(userReducer, initialState)

    return (
        <UserContext.Provider value={[state, dispatch]}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUserValue = () => {
    const [state, dispatch] = useContext(UserContext)
    return state
}

export const useUserDispatch = () => {
    const [state, dispatch] = useContext(UserContext)
    return dispatch
}

export const setUser = (user) => {
    return {
        type: 'SET',
        payload: user
    }
}

export const clearUser = () => {
    return {
        type: 'CLEAR',
        payload: null
    }
}

export default UserContext