import {createSlice} from '@reduxjs/toolkit'

import { changeProfile } from '../../actions/profileActions/profileActions.js';

const profileSlice = createSlice({
        name: 'userProfile',
        initialState: {
            changeProfile: {loading: false},
        },

        extraReducers: {

            //login-user
            [changeProfile.pending]: (state) => {
                state.changeProfileReducer = {loading: true}
            },
            [changeProfile.fulfilled]: (state, action) => {
                state.changeProfileReducer = {loading: false}
            
            },
            [changeProfile.rejected]: (state) => {
                state.changeProfileReducer = {loading: false}
            },
        }
        })

        
        export default profileSlice.reducer;
        