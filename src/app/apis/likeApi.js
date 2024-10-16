import {addyApi} from "../addyApi";
import { handleQueryError} from "../../utils/RTKQueryUtils";

const fbBaseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`
export const likeApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        likePost: build.mutation({
            query: (data) => {
                return {
                    url: `${fbBaseUrl}/${data.postId}/likes?access_token=${data?.pageAccessToken}`,
                    method: 'POST',
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        disLikePost: build.mutation({
            query: (data) => {
                return {
                    url: `${fbBaseUrl}/${data.postId}/likes?access_token=${data?.pageAccessToken}`,
                    method: 'DELETE',
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});



export const {} = likeApi