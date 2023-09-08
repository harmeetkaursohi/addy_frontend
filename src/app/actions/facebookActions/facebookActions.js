import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import axios from "axios";
import {setAuthenticationHeader} from "../../auth/auth.js";

export const getAllFacebookPages = createAsyncThunk('facebook/getAllFacebookPages', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/facebook?customerId=${data.customerId}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const facebookPageConnect = createAsyncThunk('facebook/facebookPageConnect', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/facebook/page-connect/${data.customerId}`, data.pageAccessTokenDTO, setAuthenticationHeader(data.token)).then(res => {
        console.log("response", res.data);
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});

export const getFacebookConnectedPages = createAsyncThunk('facebook/getFacebookConnectedPages', async (data, thunkAPI) => {
    console.log("data---->",data);
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/facebook/connected-pages/${data.customerId}`,setAuthenticationHeader(data.token)).then(res => {
        console.log("response---->", res.data);
        return res.data;
    }).catch(error => {
        console.log(error.response.data.message);
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});