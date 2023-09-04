import { createSlice } from '@reduxjs/toolkit'
import { loginUser, signUpUser } from "../../actions/userActions/userActions.js";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loginUserReducer: { loading: false },
        signUpReducer: { loading: false },
        token: localStorage.getItem('token') || null,
    },
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        clearUser: (state) => {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: {

        //login-user
        [loginUser.pending]: (state) => {
            state.loginUserReducer = { loading: true }
        },
        [loginUser.fulfilled]: (state, action) => {
            state.loginUserReducer = { loading: false }
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        [loginUser.rejected]: (state) => {
            state.loginUserReducer = { loading: false }
        },

        // register-user
        [signUpUser.pending]: (state) => {
            state.signUpReducer = { loading: true }
        },
        [signUpUser.fulfilled]: (state, action) => {
            state.signUpReducer = { loading: false, data: action.payload.data }
        },
        [signUpUser.rejected]: (state) => {
            state.signUpReducer = { loading: false }
        },
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
