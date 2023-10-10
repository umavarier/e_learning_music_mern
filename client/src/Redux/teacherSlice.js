// teacherSlice.js

import { createSlice } from '@reduxjs/toolkit';

const  initialState= {
  id: null,
  name: '',
  isLoggedIn: localStorage.getItem('teacherLoggedIn') === 'true',
  profilePicture: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeacher: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.isLoggedIn = true;
      localStorage.setItem('teacherLoggedIn', 'true');
    },
    clearTeacher: (state) => {
      state.id = null;
      state.name = '';
      state.isLoggedIn = false;
      localStorage.setItem('teacherLoggedIn', 'false');
    },
    setTeacherLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload; // Set the login status based on payload (true/false)
      localStorage.setItem('teacherLoggedIn', action.payload.toString());
    },
    setTeacherProfilePicture: (state, action) => {
      state.profilePicture = action.payload; // Update the profile picture
    },
  },
});

export const { setTeacher, clearTeacher, setTeacherLoggedIn, setTeacherProfilePicture } = teacherSlice.actions;
export const selectTeacherName = (state) => state.teacher.name;
export const selectTeacherId = (state) => state.teacher.id;
export const selectIsTeacherLoggedIn = (state) => state.teacher.isLoggedIn;
export const selectTeacherProfilePicture = (state) => state.teacher.profilePicture;
export default teacherSlice.reducer;
