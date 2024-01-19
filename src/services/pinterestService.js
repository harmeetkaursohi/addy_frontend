import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues,
    filterAndSumPinterestUserAnalyticsDataFor,
    getDatesForPinterest,

} from "../utils/commonUtils";
import {setAuthenticationHeader} from "../app/auth/auth";
import {SocialAccountProvider} from "../utils/contantData";


export const getPinterestAccountReport = async (page, token) => {

    if (page) {

        let initialObject = {
            Followers: {lifeTime: 0, month: "N/A"},
            Accounts_Reached: {lifeTime: 0, month: 0},
            Post_Activity: {lifeTime: 0, month: 0},
        };

        const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`;
        const fullPathTotalFollowers = `${baseUrl}/pinterest/user_account`;

        //total lifeTime followers
        await baseAxios.get(fullPathTotalFollowers, setAuthenticationHeader(token))
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
        await baseAxios.get(fullPathAnalytics, setAuthenticationHeader(token))
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

        return initialObject;

    }

};

export const getDashBoardPinterestGraphReport = async (page, query, token) => {
    let initialObject = {
        Accounts_Reached: [],
    };
    let reachedReportCount = [];
    if (page) {
        await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${query?.startDate}&end_date=${query?.endDate}`, setAuthenticationHeader(token)).then((response) => {
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



