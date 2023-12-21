import {createSlice} from '@reduxjs/toolkit'
import {
    getPostDataWithInsights,
    getTotalFollowers,
    getAccountReachedAndAccountEngaged,
    getDemographicsInsight
} from "../../actions/InsightActions/insightAction";

const insightSlice = createSlice({
    name: 'insight',
    initialState: {
        getPostDataWithInsightsReducer: {loading: false},
        getTotalFollowersReducer: {loading: false},
        getAccountReachedAndAccountEngagedReducer: {loading: false},
        getDemographicsInsightReducer: {loading: false},
    },
    extraReducers: {
        // Get Facebook Post Data With Insights
        [getPostDataWithInsights.pending]: (state) => {
            state.getPostDataWithInsightsReducer = {loading: true}
        },
        [getPostDataWithInsights.fulfilled]: (state, action) => {
            state.getPostDataWithInsightsReducer = {loading: false, data: action.payload}
        },
        [getPostDataWithInsights.rejected]: (state) => {
            state.getPostDataWithInsightsReducer = {loading: false}
        },

        // Get Total Followers
        [getTotalFollowers.pending]: (state) => {
            state.getTotalFollowersReducer = {loading: true}
        },
        [getTotalFollowers.fulfilled]: (state, action) => {
            state.getTotalFollowersReducer = {loading: false, data: action.payload}
        },
        [getTotalFollowers.rejected]: (state) => {
            state.getTotalFollowersReducer = {loading: false}
        },

        // Get Account Reached And Account Engaged
        [getAccountReachedAndAccountEngaged.pending]: (state) => {
            state.getAccountReachedAndAccountEngagedReducer = {loading: true}
        },
        [getAccountReachedAndAccountEngaged.fulfilled]: (state, action) => {
            state.getAccountReachedAndAccountEngagedReducer = {loading: false, data: action.payload}
        },
        [getAccountReachedAndAccountEngaged.rejected]: (state) => {
            state.getAccountReachedAndAccountEngagedReducer = {loading: false}
        },

        // Get Demographics Insight
        [getDemographicsInsight.pending]: (state) => {
            state.getDemographicsInsightReducer = {loading: true}
        },
        [getDemographicsInsight.fulfilled]: (state, action) => {
            state.getDemographicsInsightReducer = {loading: false, data: action.payload}
        },
        [getDemographicsInsight.rejected]: (state) => {
            state.getDemographicsInsightReducer = {loading: false}
        },
    }
});

export const {} = insightSlice.actions;
export default insightSlice.reducer;