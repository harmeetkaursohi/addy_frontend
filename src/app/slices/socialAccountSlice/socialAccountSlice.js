import {createSlice} from "@reduxjs/toolkit";
import {
    getAllConnectedSocialAccountAction,
    socialAccountConnectActions
} from "../../actions/socialAccountActions/socialAccountActions.js";
import {getAllFacebookPages} from "../../actions/facebookActions/facebookActions.js";


const socialAccountSlice = createSlice({
    name: 'socialAccount',
    initialState: {
        connectSocialAccountReducer: {loading: false},
        getAllConnectedSocialAccountReducer: {loading: false}
    },
    reducers: {
        resetSocialAccountReducer: (state) => {
            state.connectSocialAccountReducer = {loading: false, facebookConnectedPages: []};
        }
    },

    extraReducers: {

        // social account connect
        [socialAccountConnectActions.pending]: (state) => {
            state.connectSocialAccountReducer = {loading: true}
        },
        [socialAccountConnectActions.fulfilled]: (state) => {
            state.connectSocialAccountReducer = {loading: false}
        },
        [socialAccountConnectActions.rejected]: (state) => {
            state.connectSocialAccountReducer = {loading: false}
        },

        //get all social connected account list
        [getAllConnectedSocialAccountAction.pending]: (state) => {
            state.getAllConnectedSocialAccountReducer = {loading: true}
        },
        [getAllConnectedSocialAccountAction.fulfilled]: (state, action) => {
            console.log("action.payload----->",action.payload);
            state.getAllConnectedSocialAccountReducer = {loading: false, data: action.payload}
        },
        [getAllConnectedSocialAccountAction.rejected]: (state) => {
            state.getAllConnectedSocialAccountReducer = {loading: false}
        },



    }

});

export const {resetSocialAccountReducer} = socialAccountSlice.actions;
export default socialAccountSlice.reducer;
