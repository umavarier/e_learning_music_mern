import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null,
    userId: null,
    userToken : null,
    userImage: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png', // Default user image
  },
 
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.userName;
      state.userId = action.payload.userId;
      state.userToken = action.payload.userToken;
    },
    changeImage: (state, action) => {
      state.userImage = action.payload;
    },
    changeUsername: (state, action) => {
      state.username = action.payload;
    },
  },
});

export const { setUser , changeImage , changeUsername} = userSlice.actions;
export default userSlice.reducer;
