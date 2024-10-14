import {createSlice} from "@reduxjs/toolkit";
import {removeDuplicatesObjectsFromArray} from "../../utils/commonUtils";

export const globalSliceReducerInitialState = {
    token: localStorage.getItem('token') || null,
    unseenNotificationsCount: 0,
    notificationEvent: [],
}

const globalSlice = createSlice({
    name: "GLOBAL",
    initialState: globalSliceReducerInitialState,
    reducers: {
        setShowSidebar: (state, action) => {
            state.isCollapsed = action.payload;
        },
        // Notifications
        notificationEventData: (state, action) => {
            state.notificationEvent = {data: removeDuplicatesObjectsFromArray([...action.payload, ...state?.notificationEvent], "id")}
        },
        unseenNotificationsCount: (state, action) => {
            state.unseenNotificationsCount = action.payload.count
        },
        increaseUnseenNotificationsCount: (state, action) => {
            state.unseenNotificationsCount =  state.unseenNotificationsCount + action.payload.count;
        },
    }
})
export const {
    setShowSidebar,
    notificationEventData,
    unseenNotificationsCount,
    increaseUnseenNotificationsCount} = globalSlice.actions
export default globalSlice.reducer;