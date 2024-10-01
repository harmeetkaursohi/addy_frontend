import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast, showSuccessToast} from "../../../features/common/components/Toast";
import {setAuthenticationHeader} from "../../auth/auth";
import {baseAxios} from "../../../utils/commonUtils";


// export const loginUser = createAsyncThunk('user/loginUser', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, data.values).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const signUpUser = createAsyncThunk('user/signUpUser', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/register`, data).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     })
// })


// export const createPassword = createAsyncThunk('user/createPassword', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/reset-password`, data.values).then(res => {
//         showSuccessToast('Create password successfully');
//         data.navigate("/login");
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     })
// })

// export const forgotPassword = createAsyncThunk('user/forgetPassword', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/forgot-password?email=${data.values.email}`, null).then(res => {
//         showSuccessToast(`Email has been sent to ${data.values.email}`);
//         data.navigate("/login");
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     })
// })

// export const getUserInfo = createAsyncThunk('user/getUserInfo', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/customers`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const updateProfilePic = createAsyncThunk('user/updateProfilePic', async (data, thunkAPI) => {
//     const formData = new FormData();
//     formData.append('mediaType', data.formData?.mediaType);
//     formData.append('file', data.formData?.file);
//     return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/customers/profile-pic`, formData,setAuthenticationHeader(data.token)).then(res => {
//         showSuccessToast(`Profile Image Updated Successfully.`);
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const updatePassword = createAsyncThunk('user/updatePassword', async (data, thunkAPI) => {
//     return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/password`, data?.data,setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const updateCustomer = createAsyncThunk('user/updateCustomer', async (data, thunkAPI) => {
//     return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/customers`, data?.data,setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });