import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";


const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}`
const cmsBaseUrl=`${import.meta.env.VITE_APP_CMS_API_BASE_URL}`
export const webApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        faqList: build.query({
            query: (requestBody) => {
                return {
                    url: `${cmsBaseUrl}/faq?per_page=20&page=${requestBody.page}&search=${requestBody.search}`,
                    method: 'GET'
                };
            },
            providesTags:["getFaqListApi"],
            transformResponse(res, meta, arg) {
                const linkHeader = res.headers.link;
                return {hasNextPage:(linkHeader && linkHeader.includes('rel="next"')),dataList:res.data};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        addContactUs: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${baseUrl}/contactUs`,
                    method: 'POST',
                    body:requestBody,
                    headers:getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        contactUs: build.mutation({
            query: (requestBody) => {
                return {
                    url: `${cmsBaseUrl}/save_contact_query`,
                    method: 'POST',
                    body:requestBody,
                    headers:{'Content-Type': 'multipart/form-data'}
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),

    }),
});


export const {useAddContactUsMutation,useContactUsMutation,useLazyFaqListQuery} = webApi