import axios from "axios";
import {
    baseAxios
} from "../utils/commonUtils";
import {setAuthenticationHeader} from "../app/auth/auth";

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
            Followers: {lifeTime: 0, month: "N/A"},
            Accounts_Reached: {lifeTime: 0, month: 0},
            Post_Activity: {lifeTime: 0, month: 0},
        };


        const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}`;
        const fullPathFollowersStatistics = `${baseUrl}/linkedin/networkSizes/${page?.pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER`;

        //  Followers Stats Full + Monthly
        await baseAxios.get(fullPathFollowersStatistics, setAuthenticationHeader(token))
            .then((response) => {
                const linkedinTotalFollowers = response.data;
                if (linkedinTotalFollowers) {
                    initialObject.Followers.lifeTime += linkedinTotalFollowers?.firstDegreeSize;
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime = "N/A";
            });


        // //Pinterest Analytics
        //
        // const fullPathAnalytics = `${baseUrl}/pinterest/user_account/analytics?start_date=${getDatesForPinterest(90)}&end_date=${getDatesForPinterest("now")}`;
        // await baseAxios.get(fullPathAnalytics, setAuthenticationHeader(token))
        //     .then((response) => {
        //         const pinterestAccountData = response.data;
        //         if (pinterestAccountData) {
        //             initialObject.Accounts_Reached.lifeTime = pinterestAccountData?.all?.summary_metrics?.IMPRESSION;
        //             initialObject.Post_Activity.lifeTime = pinterestAccountData?.all?.summary_metrics?.ENGAGEMENT;
        //             const filteredDataFor30Days = filterAndSumPinterestUserAnalyticsDataFor(pinterestAccountData?.all?.daily_metrics, 30, ["IMPRESSION", "ENGAGEMENT"]);
        //             initialObject.Accounts_Reached.month = filteredDataFor30Days?.IMPRESSION;
        //             initialObject.Post_Activity.month = filteredDataFor30Days?.ENGAGEMENT;
        //         }
        //     })
        //     .catch((error) => {
        //         initialObject.Accounts_Reached.lifeTime = "N/A";
        //         initialObject.Post_Activity.lifeTime = "N/A";
        //         initialObject.Accounts_Reached.month = "N/A";
        //         initialObject.Post_Activity.month = "N/A";
        //     });

        return initialObject;

    }

};