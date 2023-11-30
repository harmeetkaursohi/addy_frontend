import {createSlice} from '@reduxjs/toolkit'
import {addContactUsActions} from "../../actions/contactUsActions/contactUsActions";

const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState: {
        addContactUsReducer: {loading: false},
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
    }
});

export const {} = contactUsSlice.actions;
export default contactUsSlice.reducer;