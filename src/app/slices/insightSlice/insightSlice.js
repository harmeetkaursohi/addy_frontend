import {createSlice} from '@reduxjs/toolkit'
import {
    getPostDataWithInsights,
    // getProfileInsightsInfo,
    // getProfileVisitsInsightsInfo,
    getAccountReachedAndAccountEngaged,
    // getDemographicsInsight,
    pinterestPinClick,
    postEngagement
    
} from "../../actions/InsightActions/insightAction";

const insightSlice = createSlice({
    name: 'insight',
    initialState: {
        getPostDataWithInsightsReducer: {loading: false},
        // getProfileInfoReducer: {loading: false},
        getAccountReachedAndAccountEngagedReducer: {loading: false},
        // getDemographicsInsightReducer: {loading: false},
        // getProfileVisitsInsightsInfoReducer:{loading:false},
        getpinterestPostEngageReducer:{loading:false},
        getfacebookPostEngageReducer:{loading:false},
        getlinkedinPostEngageReducer:{loading:false},
        getpinterestPinClickReducer:{loading:false}
  
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
        // [getProfileInsightsInfo.pending]: (state) => {
        //     state.getProfileInfoReducer = {loading: true}
        // },
        // [getProfileInsightsInfo.fulfilled]: (state, action) => {
        //     state.getProfileInfoReducer = {loading: false, data: action.payload}
        // },
        // [getProfileInsightsInfo.rejected]: (state) => {
        //     state.getProfileInfoReducer = {loading: false}
        // },

        // [getProfileVisitsInsightsInfo.pending]: (state) => {
        //     state.getProfileVisitsInsightsInfoReducer = {loading: true}
        // },
        // [getProfileVisitsInsightsInfo.fulfilled]: (state, action) => {
        //     state.getProfileVisitsInsightsInfoReducer = {loading: false, data: action.payload}
        // },
        // [getProfileVisitsInsightsInfo.rejected]: (state) => {
        //     state.getProfileVisitsInsightsInfoReducer = {loading: false}
        // },

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
        // [getDemographicsInsight.pending]: (state) => {
        //     state.getDemographicsInsightReducer = {loading: true}
        // },
        // [getDemographicsInsight.fulfilled]: (state, action) => {
        //     state.getDemographicsInsightReducer = {loading: false, data: action.payload}
        // },
        // [getDemographicsInsight.rejected]: (state) => {
        //     state.getDemographicsInsightReducer = {loading: false}
        // },
      
        
        
        // get pinterest pin click data 

        
        [pinterestPinClick.pending]: (state) => {
            state.getpinterestPinClickReducer = {loading: true}
        },
        [pinterestPinClick.fulfilled]: (state, action) => {
            state.getpinterestPinClickReducer = {loading: false, data: action.payload}
        },
        [pinterestPinClick.rejected]: (state) => {
            state.getpinterestPinClickReducer = {loading: false}
        },

        // get all social platform insight engagement data 
        [postEngagement.pending]: (state) => {
            state.getpostEngagementReducer = {loading: true}
        },
        [postEngagement.fulfilled]: (state, action) => {
            state.getpostEngagementReducer = {loading: false, data: action.payload}
        },
        [postEngagement.rejected]: (state) => {
            state.getpostEngagementReducer = {loading: false}
        },
    }
});

export const {} = insightSlice.actions;
export default insightSlice.reducer;
