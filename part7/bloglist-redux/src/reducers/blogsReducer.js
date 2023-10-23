import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return state.concat(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
    },
    removeBlogById(state, action) {
      const id = action.payload;
      const updatedState = state.filter((b) => b.id !== id);
      return updatedState;
    },
  },
});

export const { setBlogs, addBlog, updateBlog, removeBlogById } =
  blogsSlice.actions;

export default blogsSlice.reducer;
