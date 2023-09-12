import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import axios from "axios";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {cleanAndValidateRequestURL} from "../../../utils/commonUtils.js";

export const getAllFacebookPages = createAsyncThunk(
    'facebook/getAllFacebookPages',
    async (data, thunkAPI) => {
        try {
            const baseUrl = `https://graph.facebook.com/v17.0/1540189680124559`;
            const path = `/accounts`;
            const response = await axios.get(cleanAndValidateRequestURL(baseUrl, path, '', 'EAAIhoNvCxpwBO5d47pbyC3ZBfN4K6bkMGdJn5UU1qV0X5fyxpZA2oOZBMjKiKHAZAzdjNZB956gQ8N4unK2UtDmavesVl6WwZApkb1H3vj4OZA8uk1kW980MXwIkOxMVce5RNbA4lJWwvpkAQ6UBt2NYqnvFyaX4jNvQzPibZBcMsXM9XFEYWjlDuRyhoyAwqIrsTuLro6AVkc6Etyzb35LFzE4XcZB5iaWB8f7sSggS2IgtLJReEFCW5jDC2DvbJ8AZDZD'))
            const pageInfoList = [];
            for (let obj of response.data.data) {
                // await exchangeForLongLivedToken(obj.access_token).then((response)=>{
                //     console.log("exchangeForLongLivedToken",response.data)
                // })
                const pageInfoResponse = await getPageFullInfoByPageAccessToken(obj.access_token);
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
    const baseUrl = 'https://graph.facebook.com/v17.0';
    const path = '/me';
    const fields = 'id,name,feed,about,access_token,bio,photos,picture';
    return await axios.get(cleanAndValidateRequestURL(baseUrl, path, fields, pageAccessToken));
};


const exchangeForLongLivedToken = async (shortLivedToken) => {
    const baseUrl = 'https://graph.facebook.com/v17.0';
    const url = `${baseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${688937182693504}&client_secret=${f758b83170899e5e9c9c1baa5342c877}&fb_exchange_token=${shortLivedToken}`;
    return await axios.get(url);
}


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





