import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues,
    filterAndSumPinterestUserAnalyticsDataFor,
    getDatesForPinterest, objectToQueryString,

} from "../utils/commonUtils";
import {setAuthenticationHeader} from "../app/auth/auth";
import {SocialAccountProvider} from "../utils/contantData";
import {getAuthHeader, getAuthorizationHeader} from "../utils/RTKQueryUtils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../features/common/components/Toast";
import {
    getFormattedAccountReachAndEngagementData,
    getFormattedInsightProfileInfo, getFormattedPostWithInsightsApiData,
    getFormattedPostWithInsightsApiResponse
} from "../utils/dataFormatterUtils";
import axios from "axios";

const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`

export const getPinterestReportByPage = async (page) => {
    let initialObject = {
        Followers: {lifeTime: 0, month: "N/A"},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {

        const fullPathTotalFollowers = `${baseUrl}/pinterest/user_account`;

        //total lifeTime followers
        await baseAxios.get(fullPathTotalFollowers, getAuthHeader())
            .then((response) => {
                const pinterestAccountData = response.data;
                if (pinterestAccountData) {
                    initialObject.Followers.lifeTime += pinterestAccountData?.follower_count;
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime = "N/A";
            });

        //Pinterest Analytics

        const fullPathAnalytics = `${baseUrl}/pinterest/user_account/analytics?start_date=${getDatesForPinterest(90)}&end_date=${getDatesForPinterest("now")}`;
        await baseAxios.get(fullPathAnalytics, getAuthHeader())
            .then((response) => {
                const pinterestAccountData = response.data;
                if (pinterestAccountData) {
                    initialObject.Accounts_Reached.lifeTime = pinterestAccountData?.all?.summary_metrics?.IMPRESSION;
                    initialObject.Post_Activity.lifeTime = pinterestAccountData?.all?.summary_metrics?.ENGAGEMENT;
                    const filteredDataFor30Days = filterAndSumPinterestUserAnalyticsDataFor(pinterestAccountData?.all?.daily_metrics, 30, ["IMPRESSION", "ENGAGEMENT"]);
                    initialObject.Accounts_Reached.month = filteredDataFor30Days?.IMPRESSION;
                    initialObject.Post_Activity.month = filteredDataFor30Days?.ENGAGEMENT;
                }
            })
            .catch((error) => {
                initialObject.Accounts_Reached.lifeTime = "N/A";
                initialObject.Post_Activity.lifeTime = "N/A";
                initialObject.Accounts_Reached.month = "N/A";
                initialObject.Post_Activity.month = "N/A";
            });
    }
    return initialObject;

};

export const getPinterestBoardReports = async (pagesList, socialMediaAccount) => {
    let result = {}
    if (Array.isArray(pagesList)) {
        let initialObject = {
            Followers: {lifeTime: 0, month: "N/A"},
            Pin_Count: {lifeTime: 0, month: "N/A"},
        };
        const fullPath = `${baseUrl}/pinterest/boards/${socialMediaAccount?.id}`;

        //total lifeTime followers
        await baseAxios.get(fullPath, getAuthHeader())
            .then((response) => {
                const pinterestAccountData = response.data.items;
                if (pinterestAccountData) {
                    for (const curPage of pagesList) {
                        const filteredBoard = pinterestAccountData?.filter(cur => cur.id === curPage.id)?.[0]
                        initialObject.Followers.lifeTime = filteredBoard.follower_count
                        initialObject.Pin_Count.lifeTime = filteredBoard.pin_count
                        result = {
                            ...result,
                            [filteredBoard.id]: initialObject
                        }
                    }
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime = "N/A";
                initialObject.Pin_Count.lifeTime = "N/A";
            });

        return result;
    }
};

export const getPinterestGraphReportByPage = async (page, query, token) => {
    let initialObject = {
        Accounts_Reached: [],
    };
    let reachedReportCount = [];
    if (page) {
        await baseAxios.get(`${baseUrl}/pinterest/user_account/analytics?start_date=${query?.startDate}&end_date=${query?.endDate}`, getAuthHeader()).then((response) => {
            const pinterestAccountData = response.data;
            if (pinterestAccountData) {
                reachedReportCount = (pinterestAccountData?.all?.daily_metrics?.filter(dailyAnalyticData => dailyAnalyticData?.data_status === "READY") || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.PINTEREST?.toUpperCase()));
    return initialObject;
};

export const getDashBoardPinterestGraphReport = async (page, query, token) => {
    let initialObject = {
        Accounts_Reached: [],
    };
    let reachedReportCount = [];
    if (page) {
        await baseAxios.get(`${baseUrl}/pinterest/user_account/analytics?start_date=${query?.startDate}&end_date=${query?.endDate}`, setAuthenticationHeader(token)).then((response) => {
            const pinterestAccountData = response.data;
            if (pinterestAccountData) {
                reachedReportCount = (pinterestAccountData?.all?.daily_metrics?.filter(dailyAnalyticData => dailyAnalyticData?.data_status === "READY") || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.PINTEREST?.toUpperCase()));
    return initialObject;
};

export const getPinterestProfileInsightsInfo = async () => {
    try {
        const apiUrl = `${baseUrl}/pinterest/user_account`;
        const res = await baseAxios.get(apiUrl, getAuthHeader())
        return getFormattedInsightProfileInfo(res.data, "PINTEREST");
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }
}

export const getPinterestAccountReachAndEngagement = async (data) => {
    const apiUrl = `${baseUrl}/pinterest/user_account/analytics?start_date=${getDatesForPinterest((data?.period * 2) + 1)}&end_date=${getDatesForPinterest("now")}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return getFormattedAccountReachAndEngagementData(res?.data, data?.socialMediaType);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}
export const getPinterestPostDataWithInsights = async (data) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${baseUrl}/pinterest/pin-insights?ids=${postIds}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.PINTEREST);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}
export const getPinterestPostInsights = async (data) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${baseUrl}/pinterest/pin-insights?ids=${postIds}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return getFormattedPostWithInsightsApiData(res.data, data.socialMediaType);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}
export const getPinterestPostEngagements = async (data) => {
    let apiUrl = `${baseUrl}/pinterest/user_account/analytics?`+ objectToQueryString(data.query)
    return await baseAxios.get(apiUrl, getAuthHeader()).then((res) => {
        return res.data;
    }).catch((error) => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getPinterestPostSocioData = async (data) => {
    const apiUrl = `${baseUrl}/pinterest/pin-insights?ids=${data?.postId}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}
