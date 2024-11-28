import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {searchNotification} from "../../services/postToGetService";


const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`
export const notificationApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getUnseenNotifications: build.query({
            query: () => {
                return {
                    url: `${baseUrl}/notification/unseen`,
                    method: 'GET',
                    headers: getAuthorizationHeader()
                };
            },
            providesTags: ["getUnseenNotificationsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        searchNotifications: build.query({
            async queryFn(data) {
                let result = await searchNotification(data)
                return {data: result};
            },
            providesTags: ["searchNotificationsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        setNotificationsToSeen: build.mutation({
            query: (data) => {
                return {
                    url: `${baseUrl}/notification?ids=${data?.ids?.map(id => id).join(",")}`,
                    method: 'PUT',
                    headers: getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        setNotificationsToSeenByCustomerId: build.mutation({
            query: () => {
                return {
                    url: `${baseUrl}/notification/seen`,
                    method: 'PUT',
                    headers: getAuthorizationHeader()
                };
            },
            invalidatesTags:["searchNotificationsApi","getUnseenNotificationsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        deleteNotificationById: build.mutation({
            query: (id) => {
                return {
                    url: `${baseUrl}/notification/${id}`,
                    method: 'DELETE',
                    headers: getAuthorizationHeader()
                };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        clearAllNotification: build.mutation({
            query: (id) => {
                return {
                    url: `${baseUrl}/notification/clear-all`,
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
    useGetUnseenNotificationsQuery,
    useLazyGetUnseenNotificationsQuery,
    useSearchNotificationsQuery,
    useLazySearchNotificationsQuery,
    useSetNotificationsToSeenMutation,
    useSetNotificationsToSeenByCustomerIdMutation,
    useDeleteNotificationByIdMutation,
    useClearAllNotificationMutation,
} = notificationApi