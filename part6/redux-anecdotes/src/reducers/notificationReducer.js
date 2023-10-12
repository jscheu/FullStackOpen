import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        notify(state, action) {
            return action.payload
        },
        clearNotify(state, action) {
            return null
        }
    }
})

export const { notify, clearNotify } = notificationSlice.actions
export default notificationSlice.reducer