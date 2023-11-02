// studentSlice.js

import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    studentUserId: null, // Initially, no student is selected
  },
  reducers: {
    setStudentUserId: (state, action) => {
      state.studentUserId = action.payload;
    },
  },
});

export const { setStudentUserId } = studentSlice.actions;

export const selectStudentUserId = (state) => state.student.studentUserId;

export default studentSlice.reducer;
