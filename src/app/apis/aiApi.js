import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../features/common/components/Toast";
import {generateAICaptionAndHashTagService} from "../actions/postActions/postActions";


const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`
export const aiApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        generateCaption: build.mutation({
            query: (userCredentials) => {
                return {
                    url: `${baseUrl}/auth/login`,
                    method: 'POST',
                    body:userCredentials
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        signUp: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/auth/register`,
                    method: 'POST',
                    body:requestBody,
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        createPassword: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/auth/reset-password`,
                    method: 'POST',
                    body:requestBody,
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        forgotPassword: build.mutation({
            query: (email) => {
                return {
                    url: `${baseUrl}/auth/forgot-password?email=${email}`,
                    method: 'POST',
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updatePassword: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/auth/password`,
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

export const generateAICaptionAction = createAsyncThunk('post/generateAICaptionAction', async (data, thunkAPI) => {
    return generateAICaptionAndHashTagService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error);
    })
});

export const {} = aiApi