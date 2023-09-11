import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";
import {setAuthenticationHeader} from "../../auth/auth.js";


export const socialAccountConnectActions = createAsyncThunk('socialAccount/socialAccountConnectActions', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/connect/${data.customerId}`, data.socialAccountData, setAuthenticationHeader(data.token)).then(res => {
        console.log("response", res.data);
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

})


export const getAllConnectedSocialAccountAction = createAsyncThunk('socialAccount/getAllConnectedSocialAccountAction', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/${data.customerId}`, setAuthenticationHeader(data.token)).then(res => {
        console.log("res.data----->",res.data)
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});