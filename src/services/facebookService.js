import axios from 'axios';
import {
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues
} from "../utils/commonUtils";
import {SocialAccountProvider} from "../utils/contantData";


export async function exchangeForLongLivedToken(shortLivedToken, type) {

    let url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/oauth/access_token`;
    let client_Id = import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID;
    let client_secret = import.meta.env.VITE_APP_FACEBOOK_CLIENT_SECRET;
    let grant_type = 'fb_exchange_token';

    let params = {};

    switch (type) {
        case SocialAccountProvider.FACEBOOK: {

            params = {
                grant_type: grant_type,
                client_id: client_Id,
                fb_exchange_token: shortLivedToken,
                client_secret: client_secret
            };
            break;
        }
        case SocialAccountProvider.INSTAGRAM: {
            url = `${import.meta.env.VITE_APP_INSTAGRAM_BASE_URL}/access_token`;
            client_secret = import.meta.env.VITE_APP_INSTAGRAM_CLIENT_SECRET;
            grant_type = 'ig_exchange_token';

            params = {
                grant_type: grant_type,
                access_token: shortLivedToken,
                client_secret: client_secret
            };

        }
        default: {
            break;
        }
    }

    try {

        const response = await axios.get(url, {params});
        if (response.status === 200 && response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            throw new Error('Something went wrong!');
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export const conventStringToArrayString = (captionData) => {
    const response = captionData?.choices[0]?.message?.content;
    const arrayOfStrings = response?.replaceAll('\"', "")?.split('\n');

    const captionList = arrayOfStrings?.map((str) => {
        return str.replace(/^\d+\.\s/, '');
    });

    return captionList;
}


export const getFacebookConnectedPageIdsReport = async (listOfPages) => {

    let initialObject = {
        Followers: {lifeTime: 0, month: 0},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (Array.isArray(listOfPages)) {

        for (const curPage of listOfPages) {


            const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`;

            const pageId = curPage?.pageId;
            const accessToken = curPage?.access_token;

            const fullPathTotalFollowers = `${baseUrl}/${pageId}?fields=name,followers_count&access_token=${accessToken}`;

            //total lifeTime followers
            await axios.get(fullPathTotalFollowers)
                .then((response) => {
                    const pageData = response.data;
                    if (pageData) {
                        initialObject.Followers.lifeTime += pageData?.followers_count || 0;
                    }
                })
                .catch((error) => {
                    console.log("---->error", error);
                    initialObject.Followers.lifeTime += 0;
                });

            //last 1 month
            await axios.get(await computeInsightURL(pageId, "page_follows", accessToken, false))
                .then((response) => {
                    const lastMonthCount = response.data?.data.find(item => item.period === "month")?.values[0]?.value || 0;
                    initialObject.Followers.month += lastMonthCount;
                })
                .catch((error) => {
                    initialObject.Followers.month += 0;
                    console.error('Error:', error);
                });


            //Post activities lifetime
            await axios.get(await computeInsightURL(pageId, "page_engaged_users", accessToken, true))
                .then((response) => {
                    const lifeTimeCount = response.data?.data.find(item => item.period === "total_over_range")?.values[0]?.value || 0;
                    initialObject.Post_Activity.lifeTime += lifeTimeCount;
                })
                .catch((error) => {
                    initialObject.Post_Activity.lifeTime += 0;
                    console.error('Error:', error);
                });


            //last 1 month
            await axios.get(await computeInsightURL(pageId, "page_engaged_users", accessToken, false))
                .then((response) => {
                    const lastMonthCount = response.data?.data.find(item => item.period === "month")?.values[0]?.value || 0;
                    initialObject.Post_Activity.month += lastMonthCount;
                })
                .catch((error) => {
                    initialObject.Post_Activity.month += 0;
                    console.error('Error:', error);
                });


            //Page reach lifetime
            await axios.get(await computeInsightURL(pageId, "page_impressions", accessToken, true))
                .then((response) => {
                    const lifeTimeCount = response.data?.data.find(item => item.period === "total_over_range")?.values[0]?.value || 0;
                    initialObject.Accounts_Reached.lifeTime += lifeTimeCount;
                })
                .catch((error) => {
                    initialObject.Accounts_Reached.lifeTime += 0;
                    console.error('Error:', error);
                });


            //reach reach 1 month
            await axios.get(await computeInsightURL(pageId, "page_impressions", accessToken, false))
                .then((response) => {
                    const lastMonthCount = response.data?.data.find(item => item.period === "month")?.values[0]?.value || 0;
                    initialObject.Accounts_Reached.month += lastMonthCount;
                })
                .catch((error) => {
                    initialObject.Accounts_Reached.month += 0;
                    console.error('Error:', error);
                });
        }
    }

    return initialObject;
};


export const getDashBoardFacebookGraphReport = async (listOfPages, query) => {

    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };

    let followersReportCount = [];
    let reachedReportCount = [];

    if (Array.isArray(listOfPages)) {

        for (const curPage of listOfPages) {

            const pageId = curPage?.pageId;
            const accessToken = curPage?.access_token;

            //Page reach by provided date
            await axios.get(await computeInsightURL(pageId, "page_impressions,page_fan_adds", accessToken, false, {
                period: 'day', since: query?.createdFrom,
                until: query?.createdTo
            })).then((response) => {
                if (Array.isArray(response.data?.data) && Array.isArray(response.data?.data)) {
                    reachedReportCount?.push(...response.data?.data[0].values || [])
                    followersReportCount?.push(...response.data?.data[1].values || [])
                }
            }).catch((error) => {
                console.error('Error:', error);
            });

        }
    }


    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount));

    return initialObject;
};


export const computeInsightURL = async (pageId, metric, pageAccessToken, isLifeTime = false, mandatoryQueryParams = null) => {

    // Construct the base URL
    const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${pageId}/insights`;

    let finalQuery = await finalQueryParam(pageId, metric, pageAccessToken, isLifeTime, mandatoryQueryParams);

    // Construct the query parameters
    let queryParams = new URLSearchParams(finalQuery);


    // Combine the base URL and query parameters
    return `${baseUrl}?${queryParams.toString()}`;
}


const finalQueryParam = async (pageId, metric, pageAccessToken, isLifeTime = false, mandatoryQueryParams = null) => {

    let baseObject = {metric: metric, access_token: pageAccessToken};

    if (isLifeTime) {
        return Object.assign(baseObject, {period: 'total_over_range', date_preset: 'maximum'})
    } else if (mandatoryQueryParams === null && !isLifeTime) {
        return Object.assign(baseObject, {period: 'month'})
    } else if (mandatoryQueryParams !== null && !isLifeTime) {
        return Object.assign(baseObject, mandatoryQueryParams)
    }

}

