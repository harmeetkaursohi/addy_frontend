import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {formatPageAccessTokenDTOToConnect} from "../../utils/dataFormatterUtils";


const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}`
const fbBaseUrl=`${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`
export const pageAccessTokenApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getAllConnectedPages: build.query({
            query: () => {
                return {
                    url: `${baseUrl}/pages/connected`,
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
                    url: `${baseUrl}/pages/connect`,
                    method: 'POST',
                    body: formatPageAccessTokenDTOToConnect(requestBody) ,
                    headers:getAuthorizationHeader()
                };
            },
            invalidatesTags:["getAllConnectedPagesApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        disconnectDisabledPages: build.mutation({
            query: (pagesToDisconnect) => {
                return {
                    url: `${baseUrl}/pages/disconnect`,
                    method: 'POST',
                    body: pagesToDisconnect ,
                    headers:getAuthorizationHeader()
                };
            },
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
} = pageAccessTokenApi