import {
    baseAxios,
    calculatePercentageGrowth,
    computeAndReturnSummedDateValues, extractParameterFromUrl,
    generateUnixTimestampFor, getFormattedPostTime, isErrorInInstagramMention, objectToQueryString
} from "../utils/commonUtils";
import {
    getFormattedAccountReachAndEngagementData, getFormattedDataForPlannerPostPreviewModal,
    getFormattedDemographicData,
    getFormattedInsightsForProfileViews, getFormattedPostWithInsightsApiData, getFormattedPostWithInsightsApiResponse
} from "../utils/dataFormatterUtils";
import {CouldNotPostComment, SocialAccountProvider} from "../utils/contantData";
import {getFormattedInsightProfileInfo} from "../utils/dataFormatterUtils";
import {showErrorToast} from "../features/common/components/Toast";

const fbBaseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`

export const getInstagramPageReports = async (pagesList, accessToken) => {
    let result = {}

    if (Array.isArray(pagesList)) {

        for (const page of pagesList) {
            let initialObject = {
                Followers: {lifeTime: 0, month: 0},
                Accounts_Reached: {lifeTime: 0, month: 0},
                Post_Activity: {lifeTime: 0, month: 0},
            };

            const pageId = page?.id;

            const fullPathTotalFollowers = `${fbBaseUrl}/${pageId}?fields=followers_count&access_token=${accessToken}`;

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
            const followersLastMonthUrlPath = `${fbBaseUrl}/${pageId}/insights?metric=follower_count&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
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
            let Url = `${fbBaseUrl}/${pageId}/insights?metric=accounts_engaged,reach&metric_type=total_value&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
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
            result = {
                ...result,
                [page.id]: initialObject
            }
        }

    }
    return result;
};

export const getInstagramReportByPage = async (page, accessToken) => {
    let initialObject = {
        Followers: {lifeTime: 0, month: 0},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {

        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        const fullPathTotalFollowers = `${fbBaseUrl}/${pageId}?fields=followers_count&access_token=${accessToken}`;

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
        const followersLastMonthUrlPath = `${fbBaseUrl}/${pageId}/insights?metric=follower_count&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
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
        let Url = `${fbBaseUrl}/${pageId}/insights?metric=accounts_engaged,reach&metric_type=total_value&period=day&since=${generateUnixTimestampFor(30)}&until=${generateUnixTimestampFor("now")}&access_token=${accessToken}`;
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

export const getInstagramGraphReportByPage = async (page, query) => {

    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };

    let followersReportCount = [];
    let reachedReportCount = [];

    if (page && query) {
        // for (const curPage of listOfPages) {
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        //Page reach by provided date
        const graphDataApiUrl = `${fbBaseUrl}/${pageId}/insights?metric=reach,follower_count&metric_type=time_series&period=day&since=${query?.createdFrom}&until=${query?.createdTo}&access_token=${accessToken}`;


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

export const getDashBoardInstagramGraphReport = async (page, query) => {

    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };

    let followersReportCount = [];
    let reachedReportCount = [];

    if (page) {
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        //Page reach by provided date
        const graphDataApiUrl = `${fbBaseUrl}/${pageId}/insights?metric=reach,follower_count&metric_type=time_series&period=day&since=${query?.createdFrom}&until=${query?.createdTo}&access_token=${accessToken}`;


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

export const getInstagramProfileInsightsInfo = async (data) => {
    try {
        const profile_count_info = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}?fields=name,followers_count,follows_count,media_count,profile_picture_url,biography&access_token=${data?.pageAccessToken}`;
        const res = await baseAxios.get(profile_count_info)
        return getFormattedInsightProfileInfo(res.data, "INSTAGRAM")
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }
}

export const getInstagramDemographicData = async (data) => {
    let formattedApiResponse = {
        age: null,
        gender: null,
        country: null,
        city: null
    }
    // const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=reached_audience_demographics&period=lifetime&timeframe=${data?.period}&metric_type=total_value&access_token=${data?.pageAccessToken}`;
    // const cityDemographicDataApiUrl = baseUrl + "&breakdown=city";
    // await baseAxios.get(cityDemographicDataApiUrl).then(cityDemographicData => {
    //     formattedApiResponse = {
    //         ...formattedApiResponse,
    //         city: getFormattedDemographicData(cityDemographicData, "CITY", "INSTAGRAM")
    //     }
    // }).catch(error => {
    //     // showErrorToast(error.response.data.error.message);
    //     return thunkAPI.rejectWithValue(error.response);
    // });

    // const ageDemographicDataApiUrl = baseUrl + "&breakdown=age";
    // await baseAxios.get(ageDemographicDataApiUrl).then(ageDemographicData => {
    //     formattedApiResponse = {
    //         ...formattedApiResponse,
    //         age: getFormattedDemographicData(ageDemographicData, "AGE", "INSTAGRAM")
    //     }
    // }).catch(error => {
    //     // showErrorToast(error.response.data.error.message);
    //     return thunkAPI.rejectWithValue(error.response);
    // });
    // const genderDemographicDataApiUrl = baseUrl + "&breakdown=gender";
    // await baseAxios.get(genderDemographicDataApiUrl).then(genderDemographicData => {
    //     formattedApiResponse = {
    //         ...formattedApiResponse,
    //         gender: getFormattedDemographicData(genderDemographicData, "GENDER", "INSTAGRAM")
    //     }
    // }).catch(error => {
    //     // showErrorToast(error.response.data.error.message);
    //     return thunkAPI.rejectWithValue(error.response);
    // });


    try {
        const baseUrl = `${fbBaseUrl}/${data?.pageId}/insights?metric=follower_demographics&period=lifetime&metric_type=total_value&access_token=${data?.pageAccessToken}`;
        const countryDemographicDataApiUrl = baseUrl + "&breakdown=country";
        const countryDemographicData = await baseAxios.get(countryDemographicDataApiUrl)
        return {
            ...formattedApiResponse,
            country: getFormattedDemographicData(countryDemographicData, "COUNTRY", "INSTAGRAM")
        }
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }

}

export const getInstagramProfileVisits = async (data) => {
    const profile_view_url = `${fbBaseUrl}/${data?.pageId}/insights?` + objectToQueryString(data.query);
    return await baseAxios.get(profile_view_url).then(res => {
        return getFormattedInsightsForProfileViews(res.data || {}, "INSTAGRAM");
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

const getAccountReachedAndAccountEngagedForInstagram = async (data) => {
    let apiResponse = {
        previousData: {
            data: null,
            dateRange: null
        },
        presentData: null
    }
    const apiUrl = `${fbBaseUrl}/${data?.pageId}/insights?metric=reach,accounts_engaged&metric_type=total_value&period=day&since=${generateUnixTimestampFor(data?.period)}&until=${generateUnixTimestampFor("now")}&access_token=${data?.pageAccessToken}`;
    return await baseAxios.get(apiUrl).then(async presentData => {
        if (presentData?.status === 200) {
            apiResponse = {...apiResponse, presentData: presentData?.data?.data}
            await baseAxios.get(presentData?.data?.paging?.previous).then(previousData => {
                if (previousData?.status === 200) {
                    apiResponse = {
                        ...apiResponse,
                        previousData: {
                            data: previousData?.data?.data,
                            dateRange: `${getFormattedPostTime(new Date(extractParameterFromUrl(presentData?.data?.paging?.previous, "since") * 1000), "DD-Mon")}` + "-" + `${getFormattedPostTime(new Date(extractParameterFromUrl(presentData?.data?.paging?.previous, "until") * 1000), "DD-Mon")}`
                        }
                    }
                }
            })
        }
        return apiResponse
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error
    });

}


export const getInstagramAccountReachAndEngagement = async (data) => {
    return await getAccountReachedAndAccountEngagedForInstagram(data).then((res) => {
        return getFormattedAccountReachAndEngagementData(res, data?.socialMediaType);
    })
}

export const getInstagramPostDataWithInsights = async (data) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${fbBaseUrl}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,insights.metric(reach,shares),caption,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}`;
    return await baseAxios.get(apiUrl).then(res => {
        return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.INSTAGRAM);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getInstagramPostInsights = async (data) => {
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${fbBaseUrl}/?ids=${postIds}&access_token=${data?.accessToken}&fields=id,insights.metric(shares),comments_count,like_count`;
    return await baseAxios.get(apiUrl).then(res => {
        return getFormattedPostWithInsightsApiData(res.data, data.socialMediaType);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getInstagramPostSocioData = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data?.postId}?access_token=${data?.pageAccessToken}&fields=id,caption,is_comment_enabled,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}`;
    return await baseAxios.get(apiUrl).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const getInstagramComments = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?${objectToQueryString({
        access_token: data?.pageAccessToken,
        limit: data?.limit,
        fields: "id,text,timestamp,like_count,from{id,username},user{profile_picture_url},replies{id}",
        after: data?.next
    })}`;
    return baseAxios.get(apiUrl, null).then((response) => {
        return response?.data
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const postInstagramComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?&access_token=${data?.pageAccessToken}&fields=id,text,timestamp,like_count,from{id,username},user{id,profile_picture_url},replies`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(isErrorInInstagramMention( error) ? CouldNotPostComment : error.response.data.error.message);
        throw error;
    });
}

export const getInstagramRepliesOnComments = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/replies?${objectToQueryString({
        access_token:data?.pageAccessToken,
        limit:data?.limit,
        fields:"id,text,timestamp,like_count,from{id,username},user{profile_picture_url},parent_id",
        after:data?.next
    })}`;
    return baseAxios.get(apiUrl, null).then((response) => {
        return response?.data
    }).catch((error) => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const postInstagramReplyOnComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/replies?access_token=${data?.pageAccessToken}&fields=id,text,timestamp,like_count,from{id,username},user{id,profile_picture_url},parent_id`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(isErrorInInstagramMention( error) ? CouldNotPostComment : error.response.data.error.message);
        throw error;
    });
}