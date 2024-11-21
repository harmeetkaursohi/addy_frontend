import {addyApi} from "../addyApi";
import {
    getAuthorizationHeader,
    handleQueryError
} from "../../utils/RTKQueryUtils";
import {
    getPlannerPostsCount, getPostByPageIdAndPostStatus,
    getPostsForPlanner,
    getPublishedPosts,
    getSocialMediaPostsByCriteria
} from "../../services/postToGetService";
import {showErrorToast, showSuccessToast, showWarningToast} from "../../features/common/components/Toast";
import {mapCreatePostDataToFormData, mapUpdatePostDataToFormData} from "../../utils/dataFormatterUtils";
import {getFacebookPostSocioData} from "../../services/facebookService";
import {getInstagramPostSocioData} from "../../services/instagramService";
import {getLinkedinPostSocioData} from "../../services/linkedinService";
import {getPinterestPostSocioData} from "../../services/pinterestService";


const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`
export const postApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getSocialMediaPostsByCriteria: build.query({
            async queryFn(data) {
                let result = await getSocialMediaPostsByCriteria(data)
                return {data: result};
            },
            providesTags: ["getSocialMediaPostsByCriteriaApi"],
        }),
        getPostsForPlanner: build.query({
            async queryFn(data) {
                let result = await getPostsForPlanner(data)
                return {data: result};
            },
            providesTags: ["getPostsForPlannerApi"],
        }),
        getPlannerPostsCount: build.query({
            async queryFn(data) {
                let result = await getPlannerPostsCount(data)
                return {data: result};
            },
            providesTags: ["getPlannerPostsCountApi"],
        }),
        deletePostById: build.mutation({
            query: (id) => {
                return {
                    url: `${baseUrl}/posts/${id}`,
                    method: 'DELETE',
                    headers: getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        deletePostPageInfo: build.mutation({
            query: (data) => {
                return {
                    url: `${baseUrl}/posts/post-page-info`,
                    method: 'PUT',
                    headers: getAuthorizationHeader(),
                    body: data
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        deletePostFromPagesByPageIds: build.mutation({
            query: (data) => {
                return {
                    url: `${baseUrl}/posts?postId=${data?.postId}&pageIds=${data.pageIds.map(id => id).join(',')}`,
                    method: 'DELETE',
                    headers: getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        publishedPostById: build.mutation({
            query: (id) => {
                return {
                    url: `${baseUrl}/posts/publish/${id}`,
                    method: 'PUT',
                    headers: getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                queryFulfilled.then(res => {
                    if (res?.data?.every(c => !c.success)) {
                        showErrorToast("Post encountered with an issue. Currently saved as a draft.");
                    } else if (res?.data?.every(c => c.success)) {
                        showSuccessToast("Post has been successfully shared to the chosen platform.");
                    } else {
                        showWarningToast(`Post successfully on ${res?.data?.filter(c => c.success)?.map(c => c.pageName).join(" , ")} and failed to post on ${res?.data?.filter(c => !c.success)?.map(c => c.pageName).join(" , ")}`)
                    }
                })
                await handleQueryError(queryFulfilled)
            },
        }),
        createPost: build.mutation({
            query: (requestBody) => {
                const formData = mapCreatePostDataToFormData(requestBody)
                return {
                    url: `${baseUrl}/posts`,
                    method: 'POST',
                    body: formData,
                    headers: getAuthorizationHeader(),
                };
            },
            invalidatesTags: ["getSocialMediaPostsByCriteriaApi", "getPostsForPlannerApi", "getPlannerPostsCountApi", "getPublishedPostsApi", "getPostByPageIdAndPostStatusApi", "getPostDataWithInsightsApi","getPostsByIdApi"],
            async onQueryStarted(requestBody, {queryFulfilled,}) {
                queryFulfilled.then(res => {
                    if (requestBody.postStatus === "DRAFT") {
                        showSuccessToast("The post has been successfully saved as a draft.");
                    }
                    if (requestBody.postStatus === "SCHEDULED") {
                        showSuccessToast("The post has been successfully scheduled.");
                    }
                    if (requestBody.postStatus === "PUBLISHED") {
                        if (res?.data?.every(response => !response.success)) {
                            showErrorToast("Post encountered with an issue. Currently saved as a draft.");
                        } else if (res?.data?.every(response => response.success)) {
                            showSuccessToast("Post has been successfully shared to the chosen platform.");
                        } else {
                            showWarningToast(`Post successfully on ${res?.data?.filter(response => response.success)?.map(res => res.pageName).join(" , ")} and failed to post on ${res?.data?.filter(response => !response.success)?.map(res => res.pageName).join(" , ")}`)
                        }
                    }
                })
                await handleQueryError(queryFulfilled)
            },
        }),
        getPublishedPosts: build.query({
            async queryFn(data) {
                let result = await getPublishedPosts(data)
                return {data: result};
            },
            providesTags: ["getPublishedPostsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getPostByPageIdAndPostStatus: build.query({
            async queryFn(data) {
                let result = await getPostByPageIdAndPostStatus(data)
                return {data: result};
            },
            providesTags: ["getPostByPageIdAndPostStatusApi"],
        }),
        getPostsById: build.query({
            query: (id) => {
                return {
                    url: `${baseUrl}/posts/${id}`,
                    method: 'GET',
                    headers: getAuthorizationHeader()
                };
            },
            providesTags: ["getPostsByIdApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updatePostById: build.mutation({
            query: (requestBody) => {
                const formData = mapUpdatePostDataToFormData(requestBody)
                return {
                    url: `${baseUrl}/posts/${requestBody?.id}`,
                    method: 'PUT',
                    headers: getAuthorizationHeader(),
                    body: formData
                };
            },
            invalidatesTags: ["getSocialMediaPostsByCriteriaApi", "getPostsForPlannerApi", "getPlannerPostsCountApi", "getPublishedPostsApi", "getPostByPageIdAndPostStatusApi", "getPostDataWithInsightsApi","getPostsByIdApi"],
            async onQueryStarted(requestBody, {queryFulfilled,}) {
                queryFulfilled.then(res => {
                    if (requestBody.updatePostRequestDTO.postStatus === "DRAFT") {
                        showSuccessToast("The post has been successfully saved as a draft.");
                    }
                    if (requestBody.updatePostRequestDTO.postStatus === "SCHEDULED") {
                        showSuccessToast("The post has been successfully scheduled.");
                    }
                    if (requestBody.updatePostRequestDTO.postStatus === "PUBLISHED") {
                        if (res?.data?.every(c => !c.success)) {
                            showErrorToast("Post encountered with an issue. Currently saved as a draft.");
                        } else if (res?.data?.every(c => c.success)) {
                            showSuccessToast("Post has been successfully shared to the chosen platform.");
                        } else {
                            showWarningToast(`Post successfully on ${res?.data?.filter(c => c.success)?.map(c => c.pageName).join(" , ")} and failed to post on ${res?.data?.filter(c => !c.success)?.map(c => c.pageName).join(" , ")}`)
                        }
                    }
                })
                await handleQueryError(queryFulfilled)
            },
        }),
        getPostSocioData: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookPostSocioData(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramPostSocioData(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinPostSocioData(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestPostSocioData(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            providesTags: ["getPostSocioDataApi"],
            async onQueryStarted(requestBody, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});


export const {
    useGetSocialMediaPostsByCriteriaQuery,
    useGetPostsForPlannerQuery,
    useGetPlannerPostsCountQuery,
    useGetPublishedPostsQuery,
    useGetPostByPageIdAndPostStatusQuery,
    useDeletePostByIdMutation,
    useDeletePostFromPagesByPageIdsMutation,
    usePublishedPostByIdMutation,
    useCreatePostMutation,
    useGetPostsByIdQuery,
    useUpdatePostByIdMutation,
    useLazyGetPostSocioDataQuery,
    useDeletePostPageInfoMutation,
} = postApi