import axios from "axios";
import {
    baseAxios, calculatePercentageGrowth, computeAndReturnSummedDateValues, generateUnixTimestampFor
} from "../utils/commonUtils";
import {setAuthenticationHeader} from "../app/auth/auth";
import {SocialAccountProvider} from "../utils/contantData";

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
export const getLinkedinAccountReport = async (page, token) => {

    if (page) {

        let initialObject = {
            Followers: {lifeTime: 0, month: 0},
            Accounts_Reached: {lifeTime: 0, month: 0},
            Post_Activity: {lifeTime: 0, month: 0},
        };


        const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`;
        const fullPathFollowersStatistics = `${baseUrl}/linkedin/networkSizes/${page?.pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER&startDate=${generateUnixTimestampFor(30)*1000}&endDate=${generateUnixTimestampFor("now")*1000}&timeGranularityType=MONTH`;
        //  Followers Stats Full + Monthly
        await baseAxios.get(fullPathFollowersStatistics, setAuthenticationHeader(token))
            .then((response) => {
                const linkedinFollowersStatistics = response.data;
                if (linkedinFollowersStatistics) {
                    initialObject.Followers.lifeTime += linkedinFollowersStatistics?.all_time?.firstDegreeSize;
                    const totalOrganicGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.organicFollowerGain, 0);
                    const totalPaidGainMonthly = linkedinFollowersStatistics?.monthly?.elements.reduce((sum, element) => sum + element.followerGains.paidFollowerGain, 0);
                    initialObject.Followers.month += totalOrganicGainMonthly+totalPaidGainMonthly;
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime = "N/A";
                initialObject.Followers.month = "N/A";
            });


        //Linkedin Analytics
        const fullPathAnalytics = `${baseUrl}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${page?.pageId}&timeGranularityType=MONTH&startDate=${generateUnixTimestampFor(30)*1000}&endDate=${generateUnixTimestampFor("now")*1000}&timePeriod=timeBound,all_time`;
        await baseAxios.get(fullPathAnalytics, setAuthenticationHeader(token))
            .then((response) => {
                const linkedinOrgStatistics = response.data;
                if (linkedinOrgStatistics) {
                    initialObject.Accounts_Reached.lifeTime = linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount;
                    initialObject.Post_Activity.lifeTime = Math.round(linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.impressionCount*linkedinOrgStatistics?.all_time?.elements[0]?.totalShareStatistics?.engagement);
                    const impressionCountMonthly=linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + element.totalShareStatistics.impressionCount, 0);
                    const engagementMonthly=linkedinOrgStatistics?.timeBound?.elements.reduce((sum, element) => sum + (element.totalShareStatistics.impressionCount* element.totalShareStatistics.engagement), 0);
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

        return initialObject;

    }

};

export const getDashBoardLinkedinGraphReport = async (page, query, token) => {
    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };
    let followersReportCount = [];
    let reachedReportCount = [];

    if (page) {
        const graphDataApiUrl=`${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/dashboard-graph/${page?.pageId}?q=organizationalEntity&startDate=${query?.createdFrom}&endDate=${query?.createdTo}&timeGranularityType=DAY`;
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

    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount,SocialAccountProvider.LINKEDIN?.toUpperCase()));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount,SocialAccountProvider.LINKEDIN?.toUpperCase()));
    return initialObject;
};