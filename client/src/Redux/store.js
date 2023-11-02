import {configureStore} from '@reduxjs/toolkit';
import userimageReducer from './userimageReducer';
// import usernameReducer from './usernameReducer';
import userReducer from './userSlice';
import teacherReducer from './teacherSlice'
import courseReducer from './courseSlice'
import notificationReducer from './notificationSlice'
import studentReducer from './studentSlice';

const store=configureStore({
    reducer : {
        // username : usernameReducer,
        userImg : userimageReducer,
        user : userReducer,
        teacher:teacherReducer,
        course:courseReducer,
        notification:notificationReducer,
        student: studentReducer,
    },
})

export default store;