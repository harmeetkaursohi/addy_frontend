import {addyApi} from "../addyApi";
import {
    handleQueryError
} from "../../utils/RTKQueryUtils";
import {getFacebookComments, getFacebookRepliesOnComments, postFacebookComment} from "../../services/facebookService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios, isErrorInInstagramMention, objectToQueryString} from "../../utils/commonUtils";
import {showErrorToast} from "../../features/common/components/Toast";
import {setAuthenticationHeader} from "../auth/auth";
import {CouldNotPostComment} from "../../utils/contantData";


export const commentApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getComments: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookComments(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        // TODO : For INSTAGRAM
                        // result = await getInstagramPageReports(data?.pages, data?.socialMediaAccountInfo?.accessToken)
                        break;
                    }
                    case  "LINKEDIN": {
                        // TODO : For LINKEDIN
                        // result = await getLinkedinPageReports(data?.pages)
                        break;
                    }
                    case  "PINTEREST": {
                        // TODO : For PINTEREST
                        // result = await getPinterestBoardReports(data?.pages, data?.socialMediaAccountInfo)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getRepliesOnComments: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookRepliesOnComments(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        // TODO : For INSTAGRAM
                        // result = await getInstagramPageReports(data?.pages, data?.socialMediaAccountInfo?.accessToken)
                        break;
                    }
                    case  "LINKEDIN": {
                        // TODO : For LINKEDIN
                        // result = await getLinkedinPageReports(data?.pages)
                        break;
                    }
                    case  "PINTEREST": {
                        // TODO : For PINTEREST
                        // result = await getPinterestBoardReports(data?.pages, data?.socialMediaAccountInfo)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        postComment: build.mutation({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await postFacebookComment(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        // TODO : For INSTAGRAM
                        // result = await getInstagramPageReports(data?.pages, data?.socialMediaAccountInfo?.accessToken)
                        break;
                    }
                    case  "LINKEDIN": {
                        // TODO : For LINKEDIN
                        // result = await getLinkedinPageReports(data?.pages)
                        break;
                    }
                    case  "PINTEREST": {
                        // TODO : For PINTEREST
                        // result = await getPinterestBoardReports(data?.pages, data?.socialMediaAccountInfo)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});



export const getCommentsOnPostAction = createAsyncThunk('post/getCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?${objectToQueryString({
                access_token:data?.pageAccessToken,
                limit:data?.limit,
                fields:"id,text,timestamp,like_count,from{id,username},user{profile_picture_url},replies{id}",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comments/${data.id}?pageSize=${data?.pageSize}&start=${data?.start}`;
            return baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }
});

export const getRepliesOnComment = createAsyncThunk('post/getRepliesOnComment', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/replies?${objectToQueryString({
                access_token:data?.pageAccessToken,
                limit:data?.limit,
                fields:"id,text,timestamp,like_count,from{id,username},user{profile_picture_url},parent_id",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comments/${data?.id}?pageSize=${data?.pageSize}&start=${data?.start}`;
            return baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }
});

export const addCommentOnPostAction = createAsyncThunk('post/addCommentOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {


        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?&access_token=${data?.pageAccessToken}&fields=id,text,timestamp,like_count,from{id,username},user{id,profile_picture_url},replies`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(isErrorInInstagramMention( error) ? CouldNotPostComment : error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comment`;
            return baseAxios.post(apiUrl, {
                actor: data?.pageId,
                object: data?.id,
                text: data?.data?.message,
                parentObjectUrn: data?.id,
            }, setAuthenticationHeader(data?.token)).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }

});





export const {
    useLazyGetCommentsQuery,
    useLazyGetRepliesOnCommentsQuery,
    usePostCommentMutation,
} = commentApi