import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const addyApi = createApi({
    reducerPath: "addyApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: ""
    }),
    tagTypes: ["getUserInfoApi","getFaqListApi","getConnectedSocialAccountApi","getAllConnectedPagesApi","getSocialMediaPostsByCriteriaApi","getPostsForPlannerApi","getPlannerPostsCountApi","getPublishedPostsApi","searchNotificationsApi","getUnseenNotificationsApi","getPostDataWithInsightsApi","getPostsByIdApi","getPostSocioDataApi","searchMessageApi","getUnSeenMessagesApi"],
    endpoints: () => ({}),
})