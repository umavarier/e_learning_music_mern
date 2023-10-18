import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    removeNotification: (state, action) => {
      // You can implement the logic to remove a notification by its ID or other criteria here
      const notificationId = action.payload;
      return state.filter((notification) => notification.id !== notificationId);
    },
    clearNotifications: (state) => {
      // This action clears all notifications
      return [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
