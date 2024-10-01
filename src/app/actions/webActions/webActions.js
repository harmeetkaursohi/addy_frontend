import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {setAuthenticationHeader} from "../../auth/auth";
import {showErrorToast} from "../../../features/common/components/Toast";

// export const addContactUsActions = createAsyncThunk('web/addContactUsActions', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/contactUs`, data.contactUs, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
//
// });
// export const contactUsFormActions = createAsyncThunk('web/contactUsFormActions', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_CMS_API_BASE_URL}/save_contact_query`, data,{
//         headers: {'Content-Type': 'multipart/form-data'}
//     }).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const list = createAsyncThunk('web/list', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_CMS_API_BASE_URL}faq?per_page=20&page=${data.page}&search=${data.search}`).then(res => {
//         const linkHeader = res.headers.link;
//         return {hasNextPage:(linkHeader && linkHeader.includes('rel="next"')),dataList:res.data};
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
//
// });