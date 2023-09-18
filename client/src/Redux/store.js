import {configureStore} from '@reduxjs/toolkit';
import userimageReducer from './userimageReducer';
import userReducer from './usernameReducer';

const store=configureStore({
    reducer : {
        username : userReducer,
        userImage : userimageReducer,
    },
})

export default store;