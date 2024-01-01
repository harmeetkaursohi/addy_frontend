import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {baseAxios, cleanAndValidateRequestURL} from "../../../utils/commonUtils.js";
import {exchangeForLongLivedToken} from "../../../services/facebookService.js";
import {SocialAccountProvider} from "../../../utils/contantData";

export const getAllFacebookPages = createAsyncThunk('facebook/getAllFacebookPages', async (data, thunkAPI) => {
        try {
            const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.providerId}`;
            const path = `/accounts`;
            const response = await baseAxios.get(cleanAndValidateRequestURL(baseUrl, path, '', data.accessToken))
            const pageInfoList = [];
            for (let obj of response.data.data) {
                const pageInfoResponse = await getPageFullInfoByPageAccessToken(obj.access_token);
                const longLivedToken = await exchangeForLongLivedToken(pageInfoResponse?.data?.access_token,SocialAccountProvider.FACEBOOK);
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
export const disconnectDisabledPages = createAsyncThunk('facebook/disconnectDisabledPages', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/pages/disconnect`, data.pagesToDisconnect, setAuthenticationHeader(data.token)).then(res => {
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
export const getFacebookPostDataWithInsights = createAsyncThunk('facebook/getFacebookPostDataWithInsights', async (data, thunkAPI) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,likes.summary(true),comments.summary(true),shares,attachments,created_time,is_published,insights.metric(post_impressions,post_engaged_users)`;
    return await baseAxios.get(apiUrl).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});







