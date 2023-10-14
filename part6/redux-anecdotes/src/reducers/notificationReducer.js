import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return null
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timerId
export const notify = (message, timeout = 5) => {
    return dispatch => {
        if(timerId) clearTimeout(timerId)

        dispatch(setNotification(message))
        const timeoutInMillisecods = timeout * 1000

        timerId = setTimeout(() => {
            dispatch(clearNotification())
        }, timeoutInMillisecods)
    }
}
export default notificationSlice.reducer