import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import CryptoJS from 'crypto-js';
import { showErrorToast, showSuccessToast } from "../../../features/common/components/Toast";


export const loginUser = createAsyncThunk('user/loginUser', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, data).then(res => {
        const encryptedToken = CryptoJS.AES.encrypt(res.data.token, import.meta.env.VITE_APP_SECRET_KEY).toString();
        res.data.token = encryptedToken;
        showSuccessToast('User logged in successfully');
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const signUpUser = createAsyncThunk('user/signUpUser', async (data, thunkAPI) => {

    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/register`, data).then(res => {
        showSuccessToast('Cereate password email send sucessfully on registerd email');
        console.log(res.data,"res.data")
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
})

export const resetPassword = createAsyncThunk('user/resetPassword', async (data, thunkAPI) => {
    console.log(data,"data")
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/reset-password`, data).then(res => {
        showSuccessToast('Create password successfully');
        console.log(res.data,"res.data")
        data.navigate("/login");
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
})
