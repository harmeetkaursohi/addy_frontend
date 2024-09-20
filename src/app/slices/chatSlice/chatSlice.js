import {  createSlice } from '@reduxjs/toolkit';
import {createChat, getChatByInitiatorId, searchMessage, sendMessage} from "../../actions/chatActions/chatActions";


// Slice
const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        createChatReducer: {loading: false},
        getChatByInitiatorIdReducer: {loading: false},
        sendMessageReducer: {loading: false},
        searchMessageReducer: {loading: false},
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(createChat.pending, (state) => {
                state.createChatReducer={loading: true}
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.createChatReducer = {loading: false, data: action.payload}
            })
            .addCase(createChat.rejected, (state, action) => {
                state.createChatReducer = {loading: false}
            })
            .addCase(getChatByInitiatorId.pending, (state) => {
                state.getChatByInitiatorIdReducer={loading: true}
            })
            .addCase(getChatByInitiatorId.fulfilled, (state, action) => {
                state.getChatByInitiatorIdReducer = {loading: false, data: action.payload}
            })
            .addCase(getChatByInitiatorId.rejected, (state, action) => {
                state.getChatByInitiatorIdReducer = {loading: false}
            })
            .addCase(sendMessage.pending, (state) => {
                state.sendMessageReducer={loading: true}
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sendMessageReducer = {loading: false, data: action.payload}
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendMessageReducer = {loading: false}
            })
            .addCase(searchMessage.pending, (state) => {
                state.searchMessageReducer={loading: true}
            })
            .addCase(searchMessage.fulfilled, (state, action) => {
                state.searchMessageReducer = {loading: false, data: action.payload}
            })
            .addCase(searchMessage.rejected, (state, action) => {
                state.searchMessageReducer = {loading: false}
            })

    },
});

export const {  } = chatSlice.actions;
export default chatSlice.reducer;
