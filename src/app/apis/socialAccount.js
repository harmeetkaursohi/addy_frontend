import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {showErrorToast} from "../../features/common/components/Toast";
import { cleanAndValidateRequestURL} from "../../utils/commonUtils";
import {  getInstagramBusinessAccounts} from "../../utils/dataFormatterUtils";
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
        getAllInstagramBusinessAccounts: build.query({
            query: (accessToken) => {
                return {
                    url:`${fbBaseUrl}/me/accounts?access_token=${accessToken}&fields=instagram_business_account{id,name,username,profile_picture_url},id`,
                    method: 'GET'
                };
            },
            async transformResponse(response, meta, arg) {
                return getInstagramBusinessAccounts(response.data);
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getAllPinterestBoards: build.query({
            query: (socialMediaAccountId) => {
                return {
                    url:`${baseUrl}/pinterest/boards/${socialMediaAccountId}`,
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getAllLinkedinPages: build.query({
            query: (data) => {
                return {
                    url:`${baseUrl}/linkedin/organizationAcls?q=${data?.q}&role=${data?.role}&state=${data?.state}`,
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
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
            invalidatesTags:["getAllConnectedPagesApi","getSocialMediaPostsByCriteriaApi","getPostsForPlannerApi", "getPlannerPostsCountApi", "getPublishedPostsApi", "getPostByPageIdAndPostStatusApi", "getPostDataWithInsightsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});

export const {
    useGetConnectedSocialAccountQuery,
    useGetAllFacebookPagesQuery,
    useGetAllInstagramBusinessAccountsQuery,
    useGetAllPinterestBoardsQuery,
    useGetAllLinkedinPagesQuery,
    useConnectSocialAccountMutation,
    useDisconnectSocialAccountMutation,
} = socialAccount