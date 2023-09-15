import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import axios from "axios";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {cleanAndValidateRequestURL} from "../../../utils/commonUtils.js";
import {exchangeForLongLivedToken} from "../../../services/facebookService.js";

export const getAllFacebookPages = createAsyncThunk('facebook/getAllFacebookPages', async (data, thunkAPI) => {
        try {
            const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.providerId}`;
            const path = `/accounts`;
            const response = await axios.get(cleanAndValidateRequestURL(baseUrl, path, '', data.accessToken))
            const pageInfoList = [];
            for (let obj of response.data.data) {
                const pageInfoResponse = await getPageFullInfoByPageAccessToken(obj.access_token);
                console.log("@@@ pageInfoResponse  ::: ", pageInfoResponse?.data?.access_token)
                const longLivedToken = await exchangeForLongLivedToken(pageInfoResponse?.data?.access_token);
                pageInfoResponse.data.access_token = longLivedToken;
                pageInfoList.push(pageInfoResponse.data);
            }
            return pageInfoList;
        } catch (error) {
            showErrorToast(error.response.data.message);
            return thunkAPI.rejectWithValue(error.response);
        }
    }
);

const getPageFullInfoByPageAccessToken = async (pageAccessToken) => {
    const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`;
    const path = '/me';
    const fields = 'id,name,feed,about,access_token,bio,photos,picture';
    return await axios.get(cleanAndValidateRequestURL(baseUrl, path, fields, pageAccessToken));
};

export const facebookPageConnect = createAsyncThunk('facebook/facebookPageConnect', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/facebook/page-connect/${data.customerId}`, data.pageAccessTokenDTO, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});

export const getFacebookConnectedPages = createAsyncThunk('facebook/getFacebookConnectedPages', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/facebook/connected-pages/${data.customerId}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getFacebookUserInfo = createAsyncThunk('facebook/getFacebookUserInfo', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/me`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});








