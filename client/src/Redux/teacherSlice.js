// teacherSlice.js

import { createSlice } from '@reduxjs/toolkit';

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    id: null,
    name: '',
  },
  reducers: {
    setTeacher: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    clearTeacher: (state) => {
      state.id = null;
      state.name = '';
    },
  },
});

export const { setTeacher, clearTeacher } = teacherSlice.actions;
export const selectTeacherName = (state) => state.teacher.name;
export const selectTeacherId = (state) => state.teacher.id;
export default teacherSlice.reducer;
