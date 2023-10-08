import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast, showSuccessToast} from "../../../features/common/components/Toast";
import Swal from "sweetalert2";
import {setAuthenticationHeader} from "../../auth/auth";


export const loginUser = createAsyncThunk('user/loginUser', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`, data.values).then(res => {
        showSuccessToast('User logged in successfully');
        data.navigate("/dashboard")
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const signUpUser = createAsyncThunk('user/signUpUser', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/register`, data).then(res => {
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            html: `
                 <p>Your registration is complete, and we've sent a confirmation email to your email address</p>
             `,
            showConfirmButton: true,
            showCancelButton: false,
        });
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
})

export const createPassword = createAsyncThunk('user/createPassword', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/reset-password`, data.values).then(res => {
        showSuccessToast('Create password successfully');
        data.navigate("/login");
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
})

export const forgetPassword = createAsyncThunk('user/forgetPassword', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/forgot-password?email=${data.values.email}`, null).then(res => {
        showSuccessToast('Forget password successfully');
        data.navigate("/login");
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
})

export const getUserInfo = createAsyncThunk('user/getUserInfo', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/customers`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});
