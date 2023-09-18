import {createSlice} from '@reduxjs/toolkit'
import {
    generateAIImageAction,
    generateAIHashTagAction,
    generateAICaptionAction,
    createFacebookPostAction
} from "../../actions/postActions/postActions.js";


const postSlice = createSlice({
    name: 'post',
    initialState: {
        generateAIImageReducer: {loading: false},
        generateAIHashTagReducer: {loading: false},
        generateAICaptionReducer: {loading: false},
        createFacebookPostActionReducer: {loading: false}
    },
    extraReducers: {

        //ai generate image
        [generateAIImageAction.pending]: (state) => {
            state.generateAIImageReducer = {loading: true}
        },
        [generateAIImageAction.fulfilled]: (state, action) => {
            state.generateAIImageReducer = {loading: false, data: action.payload}
        },
        [generateAIImageAction.rejected]: (state) => {
            state.generateAIImageReducer = {loading: false}
        },

        //  ai generate hash tag
        [generateAIHashTagAction.pending]: (state) => {
            state.generateAIHashTagReducer = {loading: true}
        },
        [generateAIHashTagAction.fulfilled]: (state, action) => {
            state.generateAIHashTagReducer = {loading: false, data: action.payload}
        },
        [generateAIHashTagAction.rejected]: (state) => {
            state.generateAIHashTagReducer = {loading: false}
        },

        //  ai generate caption
        [generateAICaptionAction.pending]: (state) => {
            state.generateAICaptionReducer = {loading: true}
        },
        [generateAICaptionAction.fulfilled]: (state, action) => {
            state.generateAICaptionReducer = {loading: false, data: action.payload}
        },
        [generateAICaptionAction.rejected]: (state) => {
            state.generateAICaptionReducer = {loading: false}
        },

        [createFacebookPostAction.pending]: (state) => {
            state.createFacebookPostActionReducer = {loading: true}
        },
        [createFacebookPostAction.fulfilled]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },
        [createFacebookPostAction.rejected]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },


    }
});

export const {} = postSlice.actions;
export default postSlice.reducer;
