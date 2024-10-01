import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";


const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}/customers`
export const userApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getUserInfo: build.query({
            query: () => {
                return {
                    url: `${baseUrl}`,
                    method: 'GET',
                    headers:getAuthorizationHeader()
                };
            },
            providesTags:["getUserInfoApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updateProfilePic: build.mutation({
            query: (requestBody) => {
                const formData = new FormData();
                formData.append('mediaType', requestBody?.mediaType);
                formData.append('file', requestBody?.file);
                return {
                    url: `${baseUrl}/profile-pic`,
                    method: 'PUT',
                    body:formData,
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updateUser: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}`,
                    method: 'PUT',
                    body:requestBody,
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});


export const {useLazyGetUserInfoQuery,useGetUserInfoQuery,useUpdateProfilePicMutation,useUpdateUserMutation} = userApi