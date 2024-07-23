import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues,
    generateUnixTimestampFor
} from "../utils/commonUtils";
import {SocialAccountProvider} from "../utils/contantData";

export const getInstagramConnectedPageIdsReport = async (page) => {
    let initialObject = {
        Followers: {lifeTime: 0, month: 0},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {

        const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`;
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        const fullPathTotalFollowers = `${baseUrl}/${pageId}?fields=followers_count&access_token=${accessToken}`;

        //total lifeTime followers
        await baseAxios.get(fullPathTotalFollowers)
            .then((response) => {
                const pageData = response?.data;
                if (pageData) {
                    initialObject.Followers.lifeTime = pageData?.followers_count || 0;
                }
            })
            .catch((error) => {
                initialObject.Followers.lifeTime += 0;
            });

        //last 1 month
        const followersLastMonthUrlPath = `${baseUrl}/${pageId}/insights?metric=follower_count&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
        await baseAxios.get(followersLastMonthUrlPath)
            .then((response) => {
                const data = response?.data?.data
                if (data?.length === 0) {
                    initialObject.Followers.month = "N/A";
                } else {
                    const followersGainedInLast30Days = data[0]?.values?.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.value;
                    }, 0)
                    initialObject.Followers.month += followersGainedInLast30Days;
                }
            })
            .catch((error) => {
                initialObject.Followers.month += 0;
                console.error('Error:', error);
            });


        //Post activities Page reach
        let accounts_Reached = {lifeTime: 0, month: 0};
        let post_Activity = {lifeTime: 0, month: 0};
        let Url = `${baseUrl}/${pageId}/insights?metric=accounts_engaged,reach&metric_type=total_value&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
        for (let i = 0; i < 3; i++) {
            await baseAxios.get(Url)
                .then((response) => {
                    const reachData = response?.data?.data?.filter(data => data?.name === "reach")[0]
                    const activityData = response?.data?.data?.filter(data => data?.name === "accounts_engaged")[0]
                    Url = response?.data?.paging?.previous
                    accounts_Reached.lifeTime += reachData?.total_value?.value || 0
                    post_Activity.lifeTime += activityData?.total_value?.value || 0
                    if (i === 0) {
                        accounts_Reached.month += reachData?.total_value?.value || 0
                        post_Activity.month += activityData?.total_value?.value || 0
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        initialObject.Accounts_Reached = accounts_Reached
        initialObject.Post_Activity = post_Activity
    }


    return initialObject;
};


export const getDashBoardInstagramGraphReport = async (page, query) => {

    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };

    let followersReportCount = [];
    let reachedReportCount = [];

    if (page) {
        // for (const curPage of listOfPages) {
        const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`;
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        //Page reach by provided date
        const graphDataApiUrl = `${baseUrl}/${pageId}/insights?metric=reach,follower_count&metric_type=time_series&period=day&since=${query?.createdFrom}&until=${query?.createdTo}&access_token=${accessToken}`;


        await baseAxios.get(graphDataApiUrl).then((response) => {
            if (Array.isArray(response.data?.data)) {
                reachedReportCount?.push(...response.data?.data[0]?.values || [])
                followersReportCount?.push(...response.data?.data[1]?.values || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount, SocialAccountProvider.INSTAGRAM?.toUpperCase()));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.INSTAGRAM?.toUpperCase()));

    return initialObject;
};