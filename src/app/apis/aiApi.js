import {addyApi} from "../addyApi";
import {getOpenAIAuthHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {showErrorToast} from "../../features/common/components/Toast";
import { ErrorGeneratingWithAI} from "../../utils/contantData";
import {formatMessage} from "../../utils/commonUtils";


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
            transformResponse: (response) => {
                try {
                    const rawContent = response.choices[0]?.message.content;
                    const parsedContent = JSON.parse(rawContent);
                    if (Array.isArray(parsedContent.captions)) {
                        return {captions: parsedContent.captions};
                    } else {
                        console.error('Invalid response structure:', parsedContent);
                        showErrorToast(formatMessage(ErrorGeneratingWithAI,["captions"]))
                        return {captions: []};
                    }
                } catch (error) {
                    console.error('Failed to parse response:', error);
                    showErrorToast(formatMessage(ErrorGeneratingWithAI,["captions"]))
                    return {captions: []};
                }
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
            transformResponse: (response) => {
                try {
                    const rawContent = response.choices[0]?.message.content;
                    const parsedContent = JSON.parse(rawContent);
                    if (Array.isArray(parsedContent.hashtags)) {
                        return {hashtags: parsedContent.hashtags};
                    } else {
                        console.error('Invalid response structure:', parsedContent);
                        showErrorToast(formatMessage(ErrorGeneratingWithAI,["hashtags"]))
                        return {hashtags: []};
                    }
                } catch (error) {
                    console.error('Failed to parse response:', error);
                    showErrorToast(formatMessage(ErrorGeneratingWithAI,["hashtags"]))
                    return {hashtags: []};
                }
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