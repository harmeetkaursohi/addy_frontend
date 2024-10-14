import {createSlice} from '@reduxjs/toolkit'
import {
    // clearAllNotification,
    // deleteNotification,
    // getUnseenNotifications,
    // searchNotification,
    // setNotificationsToSeen
} from "../../actions/notificationAction/notificationAction.js";
import {removeDuplicatesObjectsFromArray} from "../../../utils/commonUtils";


const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        // searchNotificationReducer: {loading: false},
        // deleteNotificationReducer: {loading: false},
        // getUnseenNotificationsReducer: {loading: false},
        // setNotificationsToSeenReducer: {loading: false},
        // clearAllNotificationReducer: {loading: false},
        // unseenNotificationsCountReducer: {},
        // notificationEventReducer: {data: []},
    },

    reducers: {
        // notificationEventData: (state, action) => {
        //     state.notificationEventReducer = {data: removeDuplicatesObjectsFromArray([...action.payload, ...state?.notificationEventReducer?.data], "id")}
        // },
        // resetNotificationEventData: (state) => {
        //     state.notificationEventReducer = {data: []}
        // },
        // unseenNotificationsCountData: (state, action) => {
        //     state.unseenNotificationsCountReducer = {count: action.payload.count}
        // },
        // increaseUnseenNotificationsCountData: (state, action) => {
        //     state.unseenNotificationsCountReducer = {count: state.unseenNotificationsCountReducer.count + action.payload.count}
        // },
    },

    extraReducers: {

        // Search Notifications
        // [searchNotification.pending]: (state) => {
        //     state.searchNotificationReducer = {loading: true}
        // },
        // [searchNotification.fulfilled]: (state, action) => {
        //     state.searchNotificationReducer = {loading: false, data: action.payload}
        // },
        // [searchNotification.rejected]: (state) => {
        //     state.searchNotificationReducer = {loading: false}
        // },

        // Delete Notifications
        // [deleteNotification.pending]: (state) => {
        //     state.deleteNotificationReducer = {loading: true}
        // },
        // [deleteNotification.fulfilled]: (state, action) => {
        //     state.deleteNotificationReducer = {loading: false}
        // },
        // [deleteNotification.rejected]: (state) => {
        //     state.deleteNotificationReducer = {loading: false}
        // },

        // Clear All Notification
        // [clearAllNotification.pending]: (state) => {
        //     state.clearAllNotificationReducer = {loading: true}
        // },
        // [clearAllNotification.fulfilled]: (state, action) => {
        //     state.clearAllNotificationReducer = {loading: false}
        // },
        // [clearAllNotification.rejected]: (state) => {
        //     state.clearAllNotificationReducer = {loading: false}
        // },

        // Get Unseen Notifications
        // [getUnseenNotifications.pending]: (state) => {
        //     state.getUnseenNotificationsReducer = {loading: true}
        // },
        // [getUnseenNotifications.fulfilled]: (state, action) => {
        //     state.getUnseenNotificationsReducer = {loading: false, data: action.payload}
        // },
        // [getUnseenNotifications.rejected]: (state) => {
        //     state.getUnseenNotificationsReducer = {loading: false}
        // },

        // Set Notifications To Seen
        // [setNotificationsToSeen.pending]: (state) => {
        //     state.setNotificationsToSeenReducer = {loading: true}
        // },
        // [setNotificationsToSeen.fulfilled]: (state, action) => {
        //     state.setNotificationsToSeenReducer = {loading: false}
        // },
        // [setNotificationsToSeen.rejected]: (state) => {
        //     state.setNotificationsToSeenReducer = {loading: false}
        // },


    }
});

export const {
    notificationEventData,
    unseenNotificationsCountData,
    increaseUnseenNotificationsCountData,
    resetNotificationEventData
} = notificationSlice.actions;
export default notificationSlice.reducer;
