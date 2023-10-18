import {configureStore} from '@reduxjs/toolkit';
// import userimageReducer from './userimageReducer';
// import usernameReducer from './usernameReducer';
import userReducer from './userSlice';
import teacherReducer from './teacherSlice'
import courseReducer from './courseSlice'
import notificationReducer from './notificationSlice'

const store=configureStore({
    reducer : {
        // username : usernameReducer,
        // userImage : userimageReducer,
        user : userReducer,
        teacher:teacherReducer,
        course:courseReducer,
        notification:notificationReducer,
    },
})

export default store;