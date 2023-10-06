import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null, // You can add more user-related data here
    userId: null,
    userToken : null,
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.userName;
      state.userId = action.payload.userId;
      state.userToken = action.payload.userToken;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
