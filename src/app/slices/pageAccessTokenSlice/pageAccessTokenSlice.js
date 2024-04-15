import {createSlice} from '@reduxjs/toolkit'
import {updatePageAccessTokenByIds} from "../../actions/pageAccessTokenAction/pageAccessTokenAction";

const pageAccessTokenSlice = createSlice({
    name: 'pageAccessTokenSlice',
    initialState: {
        updatePageAccessTokenByIdsReducer: {loading: false},
    },
    extraReducers: {
        // Get Facebook Post Data With Insights
        [updatePageAccessTokenByIds.pending]: (state) => {
            state.updatePageAccessTokenByIdsReducer = {loading: true}
        },
        [updatePageAccessTokenByIds.fulfilled]: (state, action) => {
            state.updatePageAccessTokenByIdsReducer = {loading: false, data: action.payload}
        },
        [updatePageAccessTokenByIds.rejected]: (state) => {
            state.updatePageAccessTokenByIdsReducer = {loading: false}
        },
    }
});

export const {} = pageAccessTokenSlice.actions;
export default pageAccessTokenSlice.reducer;