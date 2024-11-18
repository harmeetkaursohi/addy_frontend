import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {mapCreateChatDataToFormData} from "../../utils/dataFormatterUtils";
import { objectToQueryString} from "../../utils/commonUtils";
import { searchMessage} from "../../services/postToGetService";


const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`
export const chatApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        createChat: build.mutation({
            query: (initiatorId) => {
                return {
                    url: `${baseUrl}/chat/${initiatorId}`,
                    method: 'POST',
                    headers: getAuthorizationHeader(),
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getChatByInitiatorId: build.query({
            query: (initiatorId) => {
                return {
                    url: `${baseUrl}/chat/initiator/${initiatorId}`,
                    method: 'GET',
                    headers: getAuthorizationHeader(),
                };
            },
            providesTags:["getChatByInitiatorIdApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        sendMessage: build.mutation({
            query: (data) => {
                const formData = mapCreateChatDataToFormData(data?.data)
                return {
                    url: `${baseUrl}/chat/message?${objectToQueryString(data?.chunksInfo)}`,
                    method: 'POST',
                    body: formData,
                    headers: getAuthorizationHeader(),
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        searchMessage: build.query({
            async queryFn(data) {
                let result = await searchMessage(data)
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),

    }),
});


export const {
    useCreateChatMutation,
    useGetChatByInitiatorIdQuery,
    useSearchMessageQuery,
    useSendMessageMutation,
} = chatApi