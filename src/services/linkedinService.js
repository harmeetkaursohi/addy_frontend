import axios from "axios";
import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues,
    generateUnixTimestampFor, objectToQueryString,
} from "../utils/commonUtils";
import {
    getFormattedAccountReachAndEngagementData,
    getFormattedDemographicData,
    getFormattedInsightsForProfileViews, getFormattedPostWithInsightsApiResponse
} from "../utils/dataFormatterUtils";
import {getToken, setAuthenticationHeader} from "../app/auth/auth";
import {SocialAccountProvider} from "../utils/contantData";
import {getAuthHeader} from "../utils/RTKQueryUtils";
import {getFormattedInsightProfileInfo} from "../utils/dataFormatterUtils";
import {showErrorToast} from "../features/common/components/Toast";
import {getPinterestPostEngagements} from "./pinterestService";

const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`

export const fetchUserProfile = async (accessToken) => {
    try {
        const response = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {Authorization: `Bearer ${accessToken}`}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching LinkedIn user information:', error);
    }
};

export const getLinkedinPageReports = async (pagesList) => {
    let result = {}
    if (Array.isArray(pagesList)) {
        for (const page of pagesList) {
            let initialObject = {
                Followers: {lifeTime: 0, month: 0},
                Accounts_Reached: {lifeTime: 0, month: 0},
                Post_Activity: {lifeTime: 0, month: 0},
            };

            const fullPathFollowersStatistics = `${baseUrl}/linkedin/networkSizes/${page?.id}?edgeType=COMPANY_FOLLOWED_BY_MEMBER&startDate=${generateUnixTimestampFor(30) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timeGranularityType=MONTH`;
            //  Followers Stats Full + Monthly
            await baseAxios.get(fullPathFollowersStatistics, getAuthHeader())
                .then((response) => {
                    const linkedinFollowersStatistics = response.data;
                    if (linkedinFollowersStatistics) {
                        initialObject.Followers.lifeTime += linkedinFollowersStatistics?.all_time?.firstDegreeSize;
                        const totalOrganicGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.organicFollowerGain, 0);
                        const totalPaidGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.paidFollowerGain, 0);
                        initialObject.Followers.month += totalOrganicGainMonthly + totalPaidGainMonthly;
                    }
                })
                .catch((error) => {
                    initialObject.Followers.lifeTime = "N/A";
                    initialObject.Followers.month = "N/A";
                });


            //Linkedin Analytics
            const fullPathAnalytics = `${baseUrl}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${page?.id}&timeGranularityType=MONTH&startDate=${generateUnixTimestampFor(30) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timePeriod=timeBound,all_time`;
            await baseAxios.get(fullPathAnalytics, getAuthHeader())
                .then((response) => {
                    const linkedinOrgStatistics = response.data;
                    if (linkedinOrgStatistics) {
                        initialObject.Accounts_Reached.lifeTime = linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount;
                        initialObject.Post_Activity.lifeTime = Math.round(linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount * linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.engagement);
                        const impressionCountMonthly = linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + element.totalShareStatistics.impressionCount, 0);
                        const engagementMonthly = linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + (element.totalShareStatistics.impressionCount * element.totalShareStatistics.engagement), 0);
                        initialObject.Accounts_Reached.month = impressionCountMonthly;
                        initialObject.Post_Activity.month = Math.round(engagementMonthly);
                    }
                })
                .catch((error) => {
                    initialObject.Accounts_Reached.lifeTime = "N/A";
                    initialObject.Post_Activity.lifeTime = "N/A";
                    initialObject.Accounts_Reached.month = "N/A";
                    initialObject.Post_Activity.month = "N/A";
                });

            result = {
                ...result,
                [page.id]: initialObject
            }
        }

    }
    return result;
};

export const getLinkedinReportByPage = async (page) => {
    let initialObject = {
        Followers: {lifeTime: 0, month: 0},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {
        const pageId = page?.pageId;
        const fullPathFollowersStatistics = `${baseUrl}/linkedin/networkSizes/${pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER&startDate=${generateUnixTimestampFor(30) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timeGranularityType=MONTH`;
        //  Followers Stats Full + Monthly
        await baseAxios.get(fullPathFollowersStatistics, getAuthHeader())
            .then((response) => {
                const linkedinFollowersStatistics = response.data;
                if (linkedinFollowersStatistics) {
                    initialObject.Followers.lifeTime += linkedinFollowersStatistics?.all_time?.firstDegreeSize;
                    const totalOrganicGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.organicFollowerGain, 0);
                    const totalPaidGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.paidFollowerGain, 0);
                    initialObject.Followers.month += totalOrganicGainMonthly + totalPaidGainMonthly;
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime = "N/A";
                initialObject.Followers.month = "N/A";
            });


        //Linkedin Analytics
        const fullPathAnalytics = `${baseUrl}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${pageId}&timeGranularityType=MONTH&startDate=${generateUnixTimestampFor(30) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timePeriod=timeBound,all_time`;
        await baseAxios.get(fullPathAnalytics, getAuthHeader())
            .then((response) => {
                const linkedinOrgStatistics = response.data;
                if (linkedinOrgStatistics) {
                    initialObject.Accounts_Reached.lifeTime = linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount;
                    initialObject.Post_Activity.lifeTime = Math.round(linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount * linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.engagement);
                    const impressionCountMonthly = linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + element.totalShareStatistics.impressionCount, 0);
                    const engagementMonthly = linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + (element.totalShareStatistics.impressionCount * element.totalShareStatistics.engagement), 0);
                    initialObject.Accounts_Reached.month = impressionCountMonthly;
                    initialObject.Post_Activity.month = Math.round(engagementMonthly);
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

export const getLinkedinGraphReportByPage = async (page, query) => {
    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };
    let followersReportCount = [];
    let reachedReportCount = [];

    if (page) {
        const graphDataApiUrl = `${baseUrl}/linkedin/dashboard-graph/${page?.pageId}?q=organizationalEntity&startDate=${query?.createdFrom}&endDate=${query?.createdTo}&timeGranularityType=DAY`;
        await baseAxios.get(graphDataApiUrl, getAuthHeader()).then((response) => {
            const linkedinGraphData = response.data;
            if (linkedinGraphData) {
                followersReportCount?.push(...linkedinGraphData?.followers_data?.elements || [])
                linkedinGraphData?.org_statistics_data?.elements?.pop()
                reachedReportCount?.push(...linkedinGraphData?.org_statistics_data?.elements || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount, SocialAccountProvider.LINKEDIN?.toUpperCase()));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.LINKEDIN?.toUpperCase()));
    return initialObject;
};

export const getDashBoardLinkedinGraphReport = async (page, query, token) => {
    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };
    let followersReportCount = [];
    let reachedReportCount = [];

    if (page) {
        const graphDataApiUrl = `${baseUrl}/linkedin/dashboard-graph/${page?.pageId}?q=organizationalEntity&startDate=${query?.createdFrom}&endDate=${query?.createdTo}&timeGranularityType=DAY`;
        await baseAxios.get(graphDataApiUrl, setAuthenticationHeader(token)).then((response) => {
            const linkedinGraphData = response.data;
            if (linkedinGraphData) {
                followersReportCount?.push(...linkedinGraphData?.followers_data?.elements || [])
                linkedinGraphData?.org_statistics_data?.elements?.pop()
                reachedReportCount?.push(...linkedinGraphData?.org_statistics_data?.elements || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount, SocialAccountProvider.LINKEDIN?.toUpperCase()));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.LINKEDIN?.toUpperCase()));
    return initialObject;
};

export const getLinkedinProfileInsightsInfo = async (data) => {
    try {
        const apiUrl = `${baseUrl}/linkedin/networkSizes/${data?.pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER`;
        const res = await baseAxios.get(apiUrl, getAuthHeader())
        return getFormattedInsightProfileInfo(res.data, "LINKEDIN");
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }

}

export const getLinkedInDemographicData = async (data) => {
    let formattedApiResponse = {
        country: null,
    }
    try {
        const response = await baseAxios.get(`${baseUrl}/linkedin/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationId=${data?.pageId}&fields=followerCountsByGeoCountry`, getAuthHeader());
        return {
            ...formattedApiResponse,
            country: getFormattedDemographicData(response.data, "followerCountsByGeoCountry", "LINKEDIN"),
        };
    } catch (error) {
        showErrorToast(error.response.data.message);
        throw error;
    }
}

export const getLinkedinProfileVisits = async (data) => {
    const profile_view_url = `${baseUrl}/linkedin/organizationPageStatistics?` + objectToQueryString(data.query);
    return await baseAxios.get(profile_view_url, setAuthenticationHeader(getToken())).then(res => {
        return getFormattedInsightsForProfileViews(res.data || {}, "LINKEDIN");
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getLinkedinAccountReachAndEngagement = async (data) => {
    const apiUrl = `${baseUrl}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${data?.pageId}&timeGranularityType=DAY&startDate=${generateUnixTimestampFor(data?.period * 2) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timePeriod=timeBound`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then((response) => {
        return getFormattedAccountReachAndEngagementData(response?.data, data?.socialMediaType);
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const getLinkedinPostDataWithInsights = async (data) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${baseUrl}/linkedin/post/insights?ids=${postIds}&orgId=${data?.pageId}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.LINKEDIN);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getLinkedinPostEngagements = async (data) => {
    const apiUrl = `${baseUrl}/linkedin/insight-graph/${data?.pageId}?`+ objectToQueryString(data.query);
    return await baseAxios.get(apiUrl, getAuthHeader()).then((res) => {
        return res?.data;
    }).catch((error) => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getLinkedinPostSocioData = async (data) => {
    const apiUrl = `${baseUrl}/linkedin/socialActions/${data?.postId}`;
    return await baseAxios.get(apiUrl, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}