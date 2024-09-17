import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchChatById, sendChatSaveRequest, fetchAllChatById } from '../../../services/needHelpService';

// Thunks
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ authToken, senderId, messageText }) => {
        return await sendChatSaveRequest(authToken, senderId, messageText);
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ authToken, size, page }) => {
        const response = await fetchChatById(authToken, size, page);
        return response.content;
    }
);

export const fetchAllMessages = createAsyncThunk(
    'chat/fetchAllMessages',
    async ({ authToken }) => {
        // const response = await fetchAllChatById(authToken);
        return await fetchAllChatById(authToken);
    }
);

// Slice
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
            .addCase(fetchAllMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchAllMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                // Handle pagination, e.g., append messages if necessary
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
