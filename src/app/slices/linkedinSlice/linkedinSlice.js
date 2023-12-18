import {createSlice} from '@reduxjs/toolkit'
import {getAllPagesIds,getAllLinkedinPages} from "../../actions/linkedinActions/linkedinAction";

const linkedinSlice = createSlice({
    name: 'linkedin',
    initialState: {
        getAllPagesIdsReducer: {loading: false},
        getAllLinkedinPagesReducer: {loading: false}

    },
    reducers: {
    },

    extraReducers: {

        //Get Connected Pages Ids
        [getAllPagesIds.pending]: (state) => {
            state.getAllPagesIdsReducer = {loading: true}
        },
        [getAllPagesIds.fulfilled]: (state, action) => {
            state.getAllPagesIdsReducer = {loading: false, data: action.payload}
        },
        [getAllPagesIds.rejected]: (state) => {
            state.getAllPagesIdsReducer = {loading: false}
        },
        //Get Connected Pages Info
        [getAllLinkedinPages.pending]: (state) => {
            state.getAllLinkedinPagesReducer = {loading: true}
        },
        [getAllLinkedinPages.fulfilled]: (state, action) => {
            state.getAllLinkedinPagesReducer = {loading: false, data: action.payload}
        },
        [getAllLinkedinPages.rejected]: (state) => {
            state.getAllLinkedinPagesReducer = {loading: false}
        },


    }
});

export const {} = linkedinSlice.actions;
export default linkedinSlice.reducer;
