import {createSlice} from '@reduxjs/toolkit'
import {list} from "../../actions/faqActions/faqActions";

const faqSlice = createSlice({
    name: 'faq',
    initialState: {
        listReducer: {loading: false},
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
    }
});

export const {} = faqSlice.actions;
export default faqSlice.reducer;