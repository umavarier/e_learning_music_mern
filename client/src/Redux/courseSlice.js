// courseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    addCourse: (state, action) => {
      state.push(action.payload);
    },
    editCourse: (state, action) => {
      const { id, updatedCourse } = action.payload;
      const courseIndex = state.findIndex((course) => course.id === id);
      if (courseIndex !== -1) {
        state[courseIndex] = { ...state[courseIndex], ...updatedCourse };
      }
    },
    deleteCourse: (state, action) => {
      return state.filter((course) => course.id !== action.payload);
    },
  },
});

export const { addCourse, editCourse, deleteCourse } = courseSlice.actions;

export default courseSlice.reducer;
