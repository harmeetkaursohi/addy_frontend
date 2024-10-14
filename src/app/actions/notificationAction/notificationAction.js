import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {showErrorToast} from "../../../features/common/components/Toast";
import { setAuthenticationHeader} from "../../auth/auth";

// export const searchNotification = createAsyncThunk('notification/searchNotification', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/search`, data?.data,setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const getUnseenNotifications = createAsyncThunk('notification/getUnseenNotifications', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/unseen`,setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const setNotificationsToSeen = createAsyncThunk('notification/setNotificationsToSeen', async (data, thunkAPI) => {
//     return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/notification?ids=${data?.ids?.map(ids=>ids).join(",")}`,{},setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const deleteNotification = createAsyncThunk('notification/deleteNotification', async (data, thunkAPI) => {
//     return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/${data?.id}`,setAuthenticationHeader(data?.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const clearAllNotification = createAsyncThunk('notification/clearAllNotification', async (data, thunkAPI) => {
//     return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/clear-all`,setAuthenticationHeader(data?.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });