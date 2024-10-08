import {addyApi} from "../addyApi";
import {
    getAuthorizationHeader,
    handleQueryError
} from "../../utils/RTKQueryUtils";
import {getPlannerPostsCount, getPostsForPlanner, getSocialMediaPostsByCriteria} from "../../services/postToGetService";


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
    }),
});


export const {
    useGetSocialMediaPostsByCriteriaQuery,
    useGetPostsForPlannerQuery,
    useGetPlannerPostsCountQuery,
    useDeletePostByIdMutation,
    useDeletePostFromPagesByPageIdsMutation,
} = postApi