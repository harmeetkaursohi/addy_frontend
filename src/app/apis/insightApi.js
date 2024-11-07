import {addyApi} from "../addyApi";
import {getAuthorizationHeader, handleQueryError} from "../../utils/RTKQueryUtils";
import {
    getFacebookAccountReachAndEngagement,
    getFacebookDemographicData,
    getFacebookGraphReportByPage,
    getFacebookPageReports,
    getFacebookPostDataWithInsights,
    getFacebookPostEngagements, getFacebookPostInsights,
    getFacebookProfileInsightsInfo,
    getFacebookProfileVisits,
    getFacebookReportByPage
} from "../../services/facebookService";
import {
    getInstagramAccountReachAndEngagement,
    getInstagramDemographicData,
    getInstagramGraphReportByPage,
    getInstagramPageReports,
    getInstagramPostDataWithInsights, getInstagramPostInsights,
    getInstagramProfileInsightsInfo,
    getInstagramProfileVisits,
    getInstagramReportByPage
} from "../../services/instagramService";
import {
    getLinkedinAccountReachAndEngagement,
    getLinkedInDemographicData,
    getLinkedinGraphReportByPage,
    getLinkedinPageReports,
    getLinkedinPostDataWithInsights,
    getLinkedinPostEngagements, getLinkedinPostInsights,
    getLinkedinProfileInsightsInfo,
    getLinkedinProfileVisits,
    getLinkedinReportByPage
} from "../../services/linkedinService";
import {
    getPinterestAccountReachAndEngagement,
    getPinterestBoardReports,
    getPinterestGraphReportByPage,
    getPinterestPostDataWithInsights, getPinterestPostEngagements, getPinterestPostInsights,
    getPinterestProfileInsightsInfo,
    getPinterestReportByPage
} from "../../services/pinterestService";
import { getDatesForPinterest} from "../../utils/commonUtils";


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
                        result = await getInstagramAccountReachAndEngagement(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinAccountReachAndEngagement(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestAccountReachAndEngagement(data)
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
        getPostDataWithInsights: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookPostDataWithInsights(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramPostDataWithInsights(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinPostDataWithInsights(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestPostDataWithInsights(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            providesTags:["getPostDataWithInsightsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        // Only Like,comment and share count
        getPostInsights: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookPostInsights(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramPostInsights(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinPostInsights(data)
                        break;
                    }
                    case  "PINTEREST": {
                        result = await getPinterestPostInsights(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            providesTags:["getPostDataWithInsightsApi"],
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getPinClicks: build.query({
             query:(day) =>{
                 return {
                     url: `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest(day)}&end_date=${getDatesForPinterest("now")}`,
                     method: 'GET',
                     headers:getAuthorizationHeader()
                 };
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getPostEngagements: build.query({
             async queryFn(data){
                 let result;
                 switch (data?.socialMediaType) {
                     case "FACEBOOK": {
                         result = await getFacebookPostEngagements(data)
                         break;
                     }
                     case  "LINKEDIN": {
                         result = await getLinkedinPostEngagements(data)
                         break;
                     }
                     case  "PINTEREST": {
                         result = await getPinterestPostEngagements(data)
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


export const {
    useGetSocialMediaReportQuery,
    useGetSocialMediaReportByPageQuery,
    useGetSocialMediaGraphReportByPageQuery,
    useGetProfileInsightsInfoQuery,
    useGetDemographicsInsightQuery,
    useGetProfileVisitsInsightsQuery,
    useGetAccountsReachAndEngagementQuery,
    useGetPostDataWithInsightsQuery,
    useGetPostInsightsQuery,
    useGetPinClicksQuery,
    useGetPostEngagementsQuery,
} = insightApi