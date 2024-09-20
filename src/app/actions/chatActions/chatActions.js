import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {setAuthenticationHeader} from "../../auth/auth";
import {showErrorToast} from "../../../features/common/components/Toast";

export const createChat = createAsyncThunk('chat/createChat', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/${data.initiatorId}`, data?.data, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getChatByInitiatorId = createAsyncThunk('chat/getChatByInitiatorId', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/initiator/${data.initiatorId}`,  setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/message`,data.data , setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const searchMessage = createAsyncThunk('chat/searchMessage', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/chat/message/search`,data.data , setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});