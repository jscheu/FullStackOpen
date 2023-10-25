import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    setActiveUser(state, action) {
      return action.payload;
    },
  },
});

export const { setActiveUser } = activeUserSlice.actions;

export default activeUserSlice.reducer;
