import {createSlice} from '@reduxjs/toolkit'
import {
    facebookPageConnect,
    getAllFacebookPages,
    getFacebookConnectedPages
} from '../../actions/facebookActions/facebookActions.js';

const facebookSlice = createSlice({
    name: 'facebook',
    initialState: {
        getFacebookPageReducer: {loading: false},
        facebookPageConnectReducer: {loading: false},
        getFacebookConnectedPagesReducer: {loading: false},
    },

    extraReducers: {

        //get all facebook page list
        [getAllFacebookPages.pending]: (state) => {
            state.getFacebookPageReducer = {loading: true}
        },
        [getAllFacebookPages.fulfilled]: (state, action) => {
            state.getFacebookPageReducer = {loading: false, facebookPageList: action.payload}
        },
        [getAllFacebookPages.rejected]: (state) => {
            state.getFacebookPageReducer = {loading: false}
        },

        // facebookPage connect
        [facebookPageConnect.pending]: (state) => {
            state.facebookPageConnectReducer = {loading: true}
        },
        [facebookPageConnect.fulfilled]: (state) => {
            state.facebookPageConnectReducer = {loading: false}
        },
        [facebookPageConnect.rejected]: (state) => {
            state.facebookPageConnectReducer = {loading: false}
        },

        // getFacebookConnectedPages
        [getFacebookConnectedPages.pending]: (state) => {
            state.getFacebookConnectedPagesReducer = {loading: true}
        },
        [getFacebookConnectedPages.fulfilled]: (state, action) => {
            state.getFacebookConnectedPagesReducer = {loading: false, facebookConnectedPages: action.payload==="" ? [] :action.payload }
        },
        [getFacebookConnectedPages.rejected]: (state) => {
            state.getFacebookConnectedPagesReducer = {loading: false}
        },

    }
});

export const {} = facebookSlice.actions;
export default facebookSlice.reducer;
