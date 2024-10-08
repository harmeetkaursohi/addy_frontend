import {addyApi} from "../addyApi";
import {handleQueryError} from "../../utils/RTKQueryUtils";
import {
    getFacebookGraphReportByPage,
    getFacebookPageReports,
    getFacebookReportByPage
} from "../../services/facebookService";
import {
    getInstagramGraphReportByPage,
    getInstagramPageReports,
    getInstagramReportByPage
} from "../../services/instagramService";
import {
    getLinkedinGraphReportByPage,
    getLinkedinPageReports,
    getLinkedinReportByPage
} from "../../services/linkedinService";
import {
    getPinterestBoardReports, getPinterestGraphReportByPage,
    getPinterestReportByPage
} from "../../services/pinterestService";


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
    }),
});

export const {
    useGetSocialMediaReportQuery,
    useGetSocialMediaReportByPageQuery,
    useGetSocialMediaGraphReportByPageQuery,
} = insightApi