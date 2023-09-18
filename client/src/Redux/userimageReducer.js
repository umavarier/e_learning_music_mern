import { createSlice } from "@reduxjs/toolkit";

const initialState = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
const usernameSlice=createSlice({
    name:'userImage',
    initialState: initialState,
    reducers:{
        changeImage:(state,action)=>{
            return action.payload
        }
    },
    extraReducers:{
        logout:(state,action)=>{
            return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' ;
        }
    }
})

export const {changeImage} = usernameSlice.actions;
export default usernameSlice.reducer;