import {createSlice} from "@reduxjs/toolkit";

export const globalSliceReducerInitialState = {
    token: localStorage.getItem('token') || null,
}

const globalSlice = createSlice({
    name: "GLOBAL",
    initialState: globalSliceReducerInitialState,
    reducers: {
        setShowSidebar: (state, action) => {
            state.isCollapsed = action.payload;
        },
    }
})
export const {
    setShowSidebar
} = globalSlice.actions
export default globalSlice.reducer;