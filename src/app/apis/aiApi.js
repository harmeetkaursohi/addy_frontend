import {addyApi} from "../addyApi";
import {getOpenAIAuthHeader, handleQueryError} from "../../utils/RTKQueryUtils";


export const aiApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        generateCaption: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`,
                    method: 'POST',
                    body: requestBody,
                    headers: getOpenAIAuthHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        generateHashtag: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`,
                    method: 'POST',
                    body: requestBody,
                    headers: getOpenAIAuthHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        generateImage: build.mutation({
            query: (requestBody) => {
                const body = {
                    prompt: requestBody.prompt,
                    n: requestBody.noOfImg,
                    size: requestBody.imageSize,
                    response_format: requestBody.response_format
                }
                return {
                    url: `${import.meta.env.VITE_APP_AI_GENERATE_IMAGE_URL}`,
                    method: 'POST',
                    body: body,
                    headers: getOpenAIAuthHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});



export const {
    useGenerateCaptionMutation,
    useGenerateHashtagMutation,
    useGenerateImageMutation,
} = aiApi