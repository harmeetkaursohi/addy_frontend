import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues,
    generateUnixTimestampFor
} from "../utils/commonUtils";
import {computeInsightURL} from "./facebookService";

export const getInstagramConnectedPageIdsReport = async (page) => {
    let initialObject = {
        Followers: {lifeTime: 0, month: 0},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {

        // for (const curPage of listOfPages) {

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


        //Post activities lifetime
        initialObject.Post_Activity =await getInstagramAccountEngagementData(baseUrl, pageId,accessToken);

        // await baseAxios.get(await computeInsightURL(pageId, "page_engaged_users", accessToken, true))
        //     .then((response) => {
        //         const lifeTimeCount = response.data?.data.find(item => item.period === "total_over_range")?.values[0]?.value || 0;
        //         initialObject.Post_Activity.lifeTime += lifeTimeCount;
        //     })
        //     .catch((error) => {
        //         initialObject.Post_Activity.lifeTime += 0;
        //         console.error('Error:', error);
        //     });


        //last 1 month
        // const engagementLastMonthUrlPath = `${baseUrl}/${pageId}/insights?metric=accounts_engaged&period=day&metric_type=total_value&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
        //
        // await baseAxios.get(engagementLastMonthUrlPath)
        //     .then((response) => {
        //         const data = response?.data?.data
        //         if (data?.length > 0) {
        //             const accountEngagementData = data[0]?.total_value?.value
        //             initialObject.Post_Activity.month += accountEngagementData;
        //         }
        //     })
        //     .catch((error) => {
        //         initialObject.Post_Activity.month += 0;
        //         console.error('Error:', error);
        //     });


        //Page reach 90 days


        initialObject.Accounts_Reached =await getInstagramReachData(baseUrl, pageId,accessToken);
        // await baseAxios.get(await computeInsightURL(pageId, "page_impressions", accessToken, true))
        //     .then((response) => {
        //         const lifeTimeCount = response.data?.data.find(item => item.period === "total_over_range")?.values[0]?.value || 0;
        //         initialObject.Accounts_Reached.lifeTime += lifeTimeCount;
        //     })
        //     .catch((error) => {
        //         initialObject.Accounts_Reached.lifeTime += 0;
        //         console.error('Error:', error);
        //     });


        //reach reach 1 month
        // const reachOneMonthUrlPath = `${baseUrl}/${pageId}/insights?metric=reach&period=days_28&access_token=${accessToken}`;
        // await baseAxios.get(reachOneMonthUrlPath)
        //     .then((response) => {
        //         const monthlyReachData = response?.data?.data
        //         if (monthlyReachData) {
        //             initialObject.Accounts_Reached.month += monthlyReachData[0]?.values[0]?.value
        //         }
        //     })
        //     .catch((error) => {
        //         initialObject.Accounts_Reached.month += 0;
        //         console.error('Error:', error);
        //     });
    }


    return initialObject;
};

const getInstagramReachData = async (baseUrl, pageId,accessToken) => {
    let accounts_Reached= {lifeTime: 0, month: 0};
    let Url = `${baseUrl}/${pageId}/insights?metric=reach&metric_type=total_value&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
    for (let i = 0; i < 3; i++) {
        await baseAxios.get(Url)
            .then((response) => {
                const reachData = response?.data?.data[0]
                Url=response?.data?.paging?.previous
                accounts_Reached.lifeTime += reachData?.total_value?.value || 0
                if(i===0){
                    accounts_Reached.month += reachData?.total_value?.value || 0
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return accounts_Reached;
}
const getInstagramAccountEngagementData = async (baseUrl, pageId,accessToken) => {
    let post_Activity= {lifeTime: 0, month: 0};
    let Url = `${baseUrl}/${pageId}/insights?metric=accounts_engaged&metric_type=total_value&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
    for (let i = 0; i < 3; i++) {
        await baseAxios.get(Url)
            .then((response) => {
                const engagementData = response?.data?.data[0]
                Url=response?.data?.paging?.previous
                post_Activity.lifeTime += engagementData?.total_value?.value || 0
                if(i===0){
                    post_Activity.month += engagementData?.total_value?.value || 0
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    return post_Activity;
}


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
        const graphDataApiUrl=`${baseUrl}/${pageId}/insights?metric=impressions,follower_count&metric_type=time_series&period=day&since=${query?.createdFrom}&until=${query?.createdTo}&access_token=${accessToken}`;


        await baseAxios.get(graphDataApiUrl).then((response) => {
            if (Array.isArray(response.data?.data)) {
                reachedReportCount?.push(...response.data?.data[0]?.values || [])
                followersReportCount?.push(...response.data?.data[1]?.values || [])
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount));
    initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount));

    return initialObject;
};