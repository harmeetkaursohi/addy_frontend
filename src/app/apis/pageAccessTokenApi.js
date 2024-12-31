import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {formatPageAccessTokenDTOToConnect} from "../../utils/dataFormatterUtils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../utils/commonUtils";
import {setAuthenticationHeader} from "../auth/auth";
import {showErrorToast} from "../../features/common/components/Toast";


const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}/pages`
export const pageAccessTokenApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getAllConnectedPages: build.query({
            query: () => {
                return {
                    url: `${baseUrl}/connected`,
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
            },
            providesTags:["getAllConnectedPagesApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        connectPage: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/connect`,
                    method: 'POST',
                    body: formatPageAccessTokenDTOToConnect(requestBody) ,
                    headers:getAuthorizationHeader()
                };
            },
            invalidatesTags:["getConnectedSocialAccountApi","getAllConnectedPagesApi","getSocialMediaPostsByCriteriaApi","getPostsForPlannerApi", "getPlannerPostsCountApi", "getPublishedPostsApi", "getPostByPageIdAndPostStatusApi", "getPostDataWithInsightsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        disconnectDisabledPages: build.mutation({
            query: (pagesToDisconnect) => {
                return {
                    url: `${baseUrl}/disconnect`,
                    method: 'POST',
                    body: pagesToDisconnect ,
                    headers:getAuthorizationHeader()
                };
            },
            invalidatesTags:["getConnectedSocialAccountApi","getAllConnectedPagesApi","getSocialMediaPostsByCriteriaApi","getPostsForPlannerApi", "getPlannerPostsCountApi", "getPublishedPostsApi", "getPostByPageIdAndPostStatusApi", "getPostDataWithInsightsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updatePageByIds: build.mutation({
            query: (data) => {
                return {
                    url: `${baseUrl}?ids=${data?.ids}`,
                    method: 'PUT',
                    body: data?.data ,
                    headers:getAuthorizationHeader()
                };
            },
            invalidatesTags:["getConnectedSocialAccountApi","getAllConnectedPagesApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});


export const {
    useGetAllConnectedPagesQuery,
    useDisconnectDisabledPagesMutation,
    useConnectPageMutation,
    useUpdatePageByIdsMutation,
} = pageAccessTokenApi