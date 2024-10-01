import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {showErrorToast} from "../../features/common/components/Toast";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios, cleanAndValidateRequestURL} from "../../utils/commonUtils";
import {setAuthenticationHeader} from "../auth/auth";
import {exchangeForLongLivedToken, getPageFullInfoByPageAccessToken} from "../../services/facebookService";
import {SocialAccountProvider} from "../../utils/contantData";


const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}`
const fbBaseUrl=`${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`
export const socialAccount = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getConnectedSocialAccount: build.query({
            query: () => {
                return {
                    url: `${baseUrl}/social-account`,
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
            },
            providesTags:["getConnectedSocialAccountApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getAllFacebookPages: build.query({
            query: (data) => {
                return {
                    url: cleanAndValidateRequestURL(fbBaseUrl+`/${data.providerId}`, `/accounts`, '', data.accessToken),
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
            },
            async transformResponse(response, meta, arg) {
                const pageInfoList = [];
                for (let obj of response.data) {
                    const pageInfoResponse = await getPageFullInfoByPageAccessToken(obj.access_token);
                    pageInfoResponse.data.access_token = await exchangeForLongLivedToken(pageInfoResponse?.data?.access_token, SocialAccountProvider.FACEBOOK);
                    pageInfoList.push(pageInfoResponse.data);
                }
                return pageInfoList;
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        connectSocialAccount: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/social-account`,
                    method: 'POST',
                    body:requestBody,
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                queryFulfilled.catch(error => {
                    error.meta.response.status!==409 && showErrorToast(error.error.data.message);
                })
            },
        }),
        disconnectSocialAccount: build.mutation({
            query: (socialMediaAccountId) => {
                return {
                    url: `${baseUrl}/social-account/${socialMediaAccountId}`,
                    method: 'DELETE',
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});
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

export const {
    useGetConnectedSocialAccountQuery,
    useLazyGetAllFacebookPagesQuery,
    useGetAllFacebookPagesQuery,
    useConnectSocialAccountMutation,
    useDisconnectSocialAccountMutation,
} = socialAccount