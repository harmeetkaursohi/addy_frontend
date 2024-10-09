import {addyApi} from "../addyApi";
import {handleQueryError} from "../../utils/RTKQueryUtils";
import {
    getFacebookAccountReachAndEngagement,
    getFacebookDemographicData,
    getFacebookGraphReportByPage,
    getFacebookPageReports, getFacebookProfileInsightsInfo, getFacebookProfileVisits,
    getFacebookReportByPage
} from "../../services/facebookService";
import {
    getInstagramDemographicData,
    getInstagramGraphReportByPage,
    getInstagramPageReports, getInstagramProfileInsightsInfo, getInstagramProfileVisits,
    getInstagramReportByPage
} from "../../services/instagramService";
import {
    getLinkedinAccountReachAndEngagement,
    getLinkedInDemographicData,
    getLinkedinGraphReportByPage,
    getLinkedinPageReports, getLinkedinProfileInsightsInfo, getLinkedinProfileVisits,
    getLinkedinReportByPage
} from "../../services/linkedinService";
import {
    getPinterestBoardReports, getPinterestGraphReportByPage, getPinterestProfileInsightsInfo,
    getPinterestReportByPage
} from "../../services/pinterestService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    baseAxios,
    generateUnixTimestampFor,
    getDatesForPinterest,
} from "../../utils/commonUtils";
import {
    getFormattedAccountReachAndEngagementData
} from "../../utils/dataFormatterUtils";
import {showErrorToast} from "../../features/common/components/Toast";
import {setAuthenticationHeader} from "../auth/auth";


export const insightApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getSocialMediaReport: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaAccountInfo?.provider) {
                    case "FACEBOOK": {
                        result = await getFacebookPageReports(data?.pages)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramPageReports(data?.pages, data?.socialMediaAccountInfo?.accessToken)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinPageReports(data?.pages)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestBoardReports(data?.pages, data?.socialMediaAccountInfo)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getSocialMediaReportByPage: build.query({
            async queryFn(data) {
                let result;
                switch (data?.page?.provider) {
                    case "FACEBOOK": {
                        result = await getFacebookReportByPage(data?.page)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramReportByPage(data?.page)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinReportByPage(data?.page)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestReportByPage(data?.page)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getSocialMediaGraphReportByPage: build.query({
            async queryFn(data) {
                let result;
                switch (data?.page?.provider) {
                    case "FACEBOOK": {
                        result = await getFacebookGraphReportByPage(data?.page, data?.query)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramGraphReportByPage(data?.page, data?.query)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinGraphReportByPage(data?.page, data?.query)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestGraphReportByPage(data?.page, data?.query)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getProfileInsightsInfo: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookProfileInsightsInfo(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramProfileInsightsInfo(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinProfileInsightsInfo(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestProfileInsightsInfo()
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getDemographicsInsight: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookDemographicData(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramDemographicData(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedInDemographicData(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getProfileVisitsInsights: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookProfileVisits(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramProfileVisits(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinProfileVisits(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getAccountsReachAndEngagement: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookAccountReachAndEngagement(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramProfileVisits(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinAccountReachAndEngagement(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getFacebookAccountReachAndEngagement(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});


export const getAccountReachedAndAccountEngaged = createAsyncThunk('insight/getAccountReachedAndAccountEngaged', async (data, thunkAPI) => {

    switch (data?.socialMediaType) {
        case "INSTAGRAM": {
            return await getAccountReachedAndAccountEngagedForInstagram(data, thunkAPI).then((res) => {
                return getFormattedAccountReachAndEngagementData(res, data?.socialMediaType);
            })
        }
        case "PINTEREST": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest((data?.period * 2) + 1)}&end_date=${getDatesForPinterest("now")}`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return getFormattedAccountReachAndEngagementData(res?.data, data?.socialMediaType);
            }).catch(error => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
    }
});


export const {
    useGetSocialMediaReportQuery,
    useGetSocialMediaReportByPageQuery,
    useGetSocialMediaGraphReportByPageQuery,
    useGetProfileInsightsInfoQuery,
    useGetDemographicsInsightQuery,
    useGetProfileVisitsInsightsQuery,
    useGetAccountsReachAndEngagementQuery,
} = insightApi