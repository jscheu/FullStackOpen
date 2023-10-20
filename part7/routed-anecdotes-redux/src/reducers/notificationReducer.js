import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  message: null,
  timeout: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log(action);
      const { type, message, timeout } = action.payload;
      const sanitizedTimeout = Number.isInteger(timeout) ? timeout : null;

      if (typeof type !== 'string' || typeof message !== 'string') {
        return state;
      }

      return {
        type,
        message,
        timeout: sanitizedTimeout,
      };
    },
    // eslint-disable-next-line no-unused-vars
    clearNotification(state, action) {
      return initialState;
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
