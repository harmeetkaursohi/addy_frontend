import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChatById, sendChatSaveRequest } from '../../../services/needHelpService';


export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ authToken, senderId, messageText }) => {
        return await sendChatSaveRequest(authToken, senderId, messageText);
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ authToken, size,page}) => {
        const response = await fetchChatById(authToken,size,page);
        return response.content;
    }
);



const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                action.error = "undefined";
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                action.messages=[]
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                action.error = "";
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
