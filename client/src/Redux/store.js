import {configureStore} from '@reduxjs/toolkit';
import userimageReducer from './userimageReducer';
import usernameReducer from './usernameReducer';
import userReducer from './userSlice';
import teacherReducer from './teacherSlice'

const store=configureStore({
    reducer : {
        username : usernameReducer,
        userImage : userimageReducer,
        user : userReducer,
        teacher:teacherReducer,
    },
})

export default store;