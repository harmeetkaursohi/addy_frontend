import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {baseAxios, cleanAndValidateRequestURL} from "../../../utils/commonUtils.js";
import {exchangeForLongLivedToken} from "../../../services/facebookService.js";

export const getAllFacebookPages = createAsyncThunk('facebook/getAllFacebookPages', async (data, thunkAPI) => {
        try {
            const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.providerId}`;
            const path = `/accounts`;
            const response = await baseAxios.get(cleanAndValidateRequestURL(baseUrl, path, '', data.accessToken))
            const pageInfoList = [];
            for (let obj of response.data.data) {
                const pageInfoResponse = await getPageFullInfoByPageAccessToken(obj.access_token);
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
    return await baseAxios.get(cleanAndValidateRequestURL(baseUrl, path, fields, pageAccessToken));
};

export const facebookPageConnect = createAsyncThunk('facebook/facebookPageConnect', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/pages/connect`, data.pageAccessTokenDTO, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});

export const getFacebookConnectedPages = createAsyncThunk('facebook/getFacebookConnectedPages', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/pages/connected`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});








