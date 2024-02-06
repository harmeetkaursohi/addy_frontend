import {createSlice} from '@reduxjs/toolkit'
import {
    loginUser,
    createPassword,
    signUpUser,
    forgotPassword,
    getUserInfo
} from "../../actions/userActions/userActions.js";

const userSlice = createSlice({
        name: 'user',
        initialState: {
            loginUserReducer: {loading: false},
            signUpReducer: {loading: false},
            createPasswordReducer: {loading: false},
            forgotPasswordReducer: {loading: false},
            token: localStorage.getItem('token') || null,
            userInfoReducer: {loading: false},
        },

        extraReducers: {

            //login-user
            [loginUser.pending]: (state) => {
                state.loginUserReducer = {loading: true}
            },
            [loginUser.fulfilled]: (state, action) => {
                state.loginUserReducer = {loading: false}
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            },
            [loginUser.rejected]: (state) => {
                state.loginUserReducer = {loading: false}
            },

            // register-user
            [signUpUser.pending]: (state) => {
                state.signUpReducer = {loading: true};
            },
            [signUpUser.fulfilled]: (state) => {
                state.signUpReducer = {loading: false}
            },
            [signUpUser.rejected]: (state) => {
                state.signUpReducer = {loading: false}
            },

            // create password
            [createPassword.pending]: (state) => {
                state.createPasswordReducer = {loading: true};
            },
            [createPassword.fulfilled]: (state) => {
                state.createPasswordReducer = {loading: false}
            },
            [createPassword.rejected]: (state) => {
                state.createPasswordReducer = {loading: false}
            },
            // forgot password
            [forgotPassword.pending]: (state) => {
                state.forgotPasswordReducer = {loading: true};
            },
            [forgotPassword.fulfilled]: (state) => {
                state.forgotPasswordReducer = {loading: false}
            },
            [forgotPassword.rejected]: (state) => {
                state.forgotPasswordReducer = {loading: false}
            },
            //user info
            [getUserInfo.pending]: (state) => {
                state.userInfoReducer = {loading: true};
            },
            [getUserInfo.fulfilled]: (state, action) => {
                state.userInfoReducer = {loading: false, data: action.payload}
            },
            [getUserInfo.rejected]: (state) => {
                state.userInfoReducer = {loading: false}
            }
        }
    });

export const {} = userSlice.actions;
export default userSlice.reducer;
