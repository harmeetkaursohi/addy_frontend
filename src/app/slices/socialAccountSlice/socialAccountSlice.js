import {createSlice} from "@reduxjs/toolkit";
import {
    disconnectSocialAccountAction,
    findSocialAccountByProviderAndCustomerIdAction,
    getAllConnectedSocialAccountAction,
    socialAccountConnectActions,
    getAllByCustomerIdAction,
    getSocialMediaReportByProviderTypeAction,
    getSocialMediaGraphByProviderTypeAction,getAllInstagramBusinessAccounts
} from "../../actions/socialAccountActions/socialAccountActions.js";


const socialAccountSlice = createSlice({
    name: 'socialAccount',
    initialState: {
        connectSocialAccountReducer: {loading: false},
        getAllConnectedSocialAccountReducer: {loading: false},
        disconnectSocialAccountReducer: {loading: false},
        findSocialAccountByProviderAndCustomerIdReducer: {loading: false},
        getAllByCustomerIdReducer: {loading: false},
        getSocialMediaReportByProviderTypeReducer: {loading: false},
        getSocialMediaGraphByProviderTypeReducer: {loading: false},
        getAllInstagramBusinessAccountsReducer: {loading: false},

    },
    reducers: {
        resetSocialAccountReducer: (state) => {
            state.connectSocialAccountReducer = {loading: false, facebookConnectedPages: []};
        }
    },

    extraReducers: {


        // get social account by customer id and provider
        [getSocialMediaReportByProviderTypeAction.pending]: (state) => {
            state.getSocialMediaReportByProviderTypeReducer = {loading: true}
        },
        [getSocialMediaReportByProviderTypeAction.fulfilled]: (state, action) => {
            state.getSocialMediaReportByProviderTypeReducer = {loading: false, data: action.payload}
        },
        [getSocialMediaReportByProviderTypeAction.rejected]: (state) => {
            state.getSocialMediaReportByProviderTypeReducer = {loading: false}
        },


        [getSocialMediaGraphByProviderTypeAction.pending]: (state) => {
            state.getSocialMediaGraphByProviderTypeReducer = {loading: true}
        },
        [getSocialMediaGraphByProviderTypeAction.fulfilled]: (state, action) => {
            state.getSocialMediaGraphByProviderTypeReducer = {loading: false, data: action.payload}
        },
        [getSocialMediaGraphByProviderTypeAction.rejected]: (state) => {
            state.getSocialMediaGraphByProviderTypeReducer = {loading: false}
        },

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
            state.getAllConnectedSocialAccountReducer = {loading: false, data: action.payload}
        },
        [getAllConnectedSocialAccountAction.rejected]: (state) => {
            state.getAllConnectedSocialAccountReducer = {loading: false}
        },

        // social account disconnect
        [disconnectSocialAccountAction.pending]: (state) => {
            state.disconnectSocialAccountReducer = {loading: true}
        },
        [disconnectSocialAccountAction.fulfilled]: (state) => {
            state.disconnectSocialAccountReducer = {loading: false}
        },
        [disconnectSocialAccountAction.rejected]: (state) => {
            state.disconnectSocialAccountReducer = {loading: false}
        },

        // get social account by customer id and provider
        [findSocialAccountByProviderAndCustomerIdAction.pending]: (state) => {
            state.findSocialAccountByProviderAndCustomerIdReducer = {loading: true}
        },
        [findSocialAccountByProviderAndCustomerIdAction.fulfilled]: (state, action) => {
            state.findSocialAccountByProviderAndCustomerIdReducer = {loading: false, data: action.payload}
        },
        [findSocialAccountByProviderAndCustomerIdAction.rejected]: (state) => {
            state.findSocialAccountByProviderAndCustomerIdReducer = {loading: false}
        },

        // get social account by customer id and provider
        [getAllByCustomerIdAction.pending]: (state) => {
            state.getAllByCustomerIdReducer = {loading: true}
        },
        [getAllByCustomerIdAction.fulfilled]: (state, action) => {
            state.getAllByCustomerIdReducer = {loading: false, data: action.payload}
        },
        [getAllByCustomerIdAction.rejected]: (state) => {
            state.getAllByCustomerIdReducer = {loading: false}
        },
        [getAllInstagramBusinessAccounts.pending]: (state) => {
            state.getAllInstagramBusinessAccountsReducer = {loading: true}
        },
        [getAllInstagramBusinessAccounts.fulfilled]: (state, action) => {
            state.getAllInstagramBusinessAccountsReducer = {loading: false, data: action.payload}
        },
        [getAllInstagramBusinessAccounts.rejected]: (state) => {
            state.getAllInstagramBusinessAccountsReducer = {loading: false}
        },

    }

});

export const {resetSocialAccountReducer} = socialAccountSlice.actions;
export default socialAccountSlice.reducer;
