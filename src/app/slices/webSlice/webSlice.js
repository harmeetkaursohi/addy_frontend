import {createSlice} from '@reduxjs/toolkit'
import {addContactUsActions, contactUsFormActions, list} from "../../actions/webActions/webActions";

const webSlice = createSlice({
    name: 'web',
    initialState: {
        listReducer: {loading: false},
        addContactUsReducer: {loading: false},
        contactUsFormReducer: {loading: false},
    },
    extraReducers: {
        [list.pending]: (state) => {
            state.listReducer = {loading: true}
        },
        [list.fulfilled]: (state, action) => {            
            state.listReducer = {loading: false, hasNextPage: action.payload.hasNextPage, data: action.payload.dataList}
        },
        [list.rejected]: (state) => {
            state.listReducer = {loading: false}
        },
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

export const {} = webSlice.actions;
export default webSlice.reducer;