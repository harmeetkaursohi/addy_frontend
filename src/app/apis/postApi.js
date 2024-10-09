import {addyApi} from "../addyApi";
import {
    getAuthorizationHeader,
    handleQueryError
} from "../../utils/RTKQueryUtils";
import {
    getPlannerPostsCount,
    getPostsForPlanner,
    getPublishedPosts,
    getSocialMediaPostsByCriteria
} from "../../services/postToGetService";
import {showErrorToast, showSuccessToast, showWarningToast} from "../../features/common/components/Toast";


const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`
export const postApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getSocialMediaPostsByCriteria: build.query({
            async queryFn (data)  {
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
                queryFulfilled.then(res=>{
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
        getPublishedPosts: build.query({
            async queryFn (data) {
                let result = await getPublishedPosts(data)
                return {data: result};
            },
            providesTags: ["getPublishedPostsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
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
    useDeletePostByIdMutation,
    useDeletePostFromPagesByPageIdsMutation,
    usePublishedPostByIdMutation,
} = postApi