import {createSlice} from '@reduxjs/toolkit'
import {addContactUsActions, contactUsFormActions} from "../../actions/contactUsActions/contactUsActions";

const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState: {
        addContactUsReducer: {loading: false},
        contactUsFormReducer: {loading: false},
    },
    extraReducers: {
        [addContactUsActions.pending]: (state) => {
            state.addContactUsReducer = {loading: true}
        },
        [addContactUsActions.fulfilled]: (state, action) => {
            state.addContactUsReducer = {loading: false, data: action.payload}
        },
        [addContactUsActions.rejected]: (state) => {
            state.addContactUsReducer = {loading: false}
        },
        [contactUsFormActions.pending]: (state) => {
            state.contactUsFormReducer = {loading: true}
        },
        [contactUsFormActions.fulfilled]: (state, action) => {
            state.contactUsFormReducer = {loading: false, data: action.payload}
        },
        [contactUsFormActions.rejected]: (state) => {
            state.contactUsFormReducer = {loading: false}
        },
    }
});

export const {} = contactUsSlice.actions;
export default contactUsSlice.reducer;