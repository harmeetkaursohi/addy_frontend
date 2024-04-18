import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues, generateUnixTimestampFor, getFormattedAccountReachAndEngagementData,

} from "../utils/commonUtils";
import {showErrorToast} from "../features/common/components/Toast";
import {SocialAccountProvider, SomethingWentWrong} from "../utils/contantData";

export async function exchangeForLongLivedToken(shortLivedToken, socialMediaType) {
    const url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/oauth/access_token`;
    const client_Id = import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID;
    const client_secret = import.meta.env.VITE_APP_FACEBOOK_CLIENT_SECRET;

    const params = {
        grant_type: 'fb_exchange_token',
        client_id: client_Id,
        fb_exchange_token: shortLivedToken,
        client_secret: client_secret
    };

    try {
        const response = await baseAxios.get(url, {params});

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

export async function getAllFacebookConnectedSocialMediaAccounts(accessToken) {
    const url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/me/accounts?access_token=${accessToken}&fields=instagram_business_account{id,name,username,profile_picture_url},access_token,name,id`;
    try {
        const response = await baseAxios.get(url);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error(SomethingWentWrong);
        }
    } catch (error) {
        showErrorToast(SomethingWentWrong)
        throw error;
    }
}


export const conventStringToArrayString = (captionData) => {
    const response = captionData?.choices[0]?.message?.content;
    const arrayOfStrings = response?.replaceAll('\"', "")?.split('\n');
    const captionList = arrayOfStrings?.map((str) => {
        return str.replace(/^\d+\.\s/, '');
    });

    // Filter Empty Array Elements
    return captionList?.filter(caption => {
        return caption !== "";
    });
}


export const getFacebookConnectedPageIdsReport = async (listOfPages) => {

    let initialObject = {
        Followers: {lifeTime: 0, month: "N/A"},
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
            await baseAxios.get(fullPathTotalFollowers)
                .then((response) => {
                    const pageData = response.data;
                    if (pageData) {
                        initialObject.Followers.lifeTime += pageData?.followers_count || 0;
                    }
                })
                .catch((error) => {
                    initialObject.Followers.lifeTime += 0;
                });

            //last 1 month
            // await baseAxios.get(await computeInsightURL(pageId, "page_follows", accessToken, false))
            //     .then((response) => {
            //         const lastMonthCount = response.data?.data.find(item => item.period === "month")?.values[0]?.value || 0;
            //         initialObject.Followers.month += lastMonthCount;
            //     })
            //     .catch((error) => {
            //         initialObject.Followers.month += 0;
            //         console.error('Error:', error);
            //     });

            //Post Engagement and Impressions monthly
            await baseAxios.get(`${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=last_30d&access_token=${accessToken}`).then(res => {
                initialObject.Accounts_Reached.month = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
                initialObject.Post_Activity.month = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value;
            }).catch(error => {
                initialObject.Accounts_Reached.month = "N/A"
                initialObject.Post_Activity.month = "N/A"
            });

            //Post Engagement and Impressions last 2 years
            await baseAxios.get(`${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=maximum&access_token=${accessToken}`).then(res => {
                initialObject.Accounts_Reached.lifeTime = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
                initialObject.Post_Activity.lifeTime = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value
            }).catch(error => {
                initialObject.Accounts_Reached.lifeTime = "N/A"
                initialObject.Post_Activity.lifeTime = "N/A"
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
            await baseAxios.get(await computeInsightURL(pageId, "page_impressions_unique,page_fan_adds", accessToken, false, {
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


    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount, SocialAccountProvider.FACEBOOK?.toUpperCase()));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.FACEBOOK?.toUpperCase()));
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

export const getFacebookInsightForSinglePost = async (accessToken, postId) => {
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${postId}?access_token=${accessToken}&fields=id,message,likes.summary(true),comments.summary(true),shares,attachments,created_time,is_published,insights.metric(post_impressions)`;
    return baseAxios.get(apiUrl);
}
