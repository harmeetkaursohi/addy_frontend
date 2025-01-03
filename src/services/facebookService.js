import {
    baseAxios,
    calculatePercentageGrowth,
    cleanAndValidateRequestURL,
    computeAndReturnSummedDateValues,
    generateUnixTimestampFor,
    objectToQueryString,
} from "../utils/commonUtils";
import {
    getFormattedInsightsForProfileViews,
    getFormattedAccountReachAndEngagementData,
    getFormattedPostWithInsightsApiResponse, getFormattedPostWithInsightsApiData
} from "../utils/dataFormatterUtils";
import {getFormattedDemographicData} from "../utils/dataFormatterUtils";
import {getFormattedInsightProfileInfo} from "../utils/dataFormatterUtils"
import {showErrorToast} from "../features/common/components/Toast";
import {
    ErrorFetchingPost,
    SocialAccountProvider,
    SomethingWentWrong,
    UpdateCommentFailedMsg
} from "../utils/contantData";

const fbBaseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}`

export async function exchangeForLongLivedToken(shortLivedToken, socialMediaType) {
    const url = `${fbBaseUrl}/oauth/access_token`;
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
    const url = `${fbBaseUrl}/me/accounts?access_token=${accessToken}&fields=instagram_business_account{id,name,username,profile_picture_url},access_token,name,id`;
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

export const getFacebookReportByPage = async (page) => {

    let initialObject = {
        Followers: {lifeTime: 0, month: "N/A"},
        Accounts_Reached: {lifeTime: 0, month: 0},
        Post_Activity: {lifeTime: 0, month: 0},
    };
    if (page) {
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

        const fullPathTotalFollowers = `${fbBaseUrl}/${pageId}?fields=name,followers_count&access_token=${accessToken}`;

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
        await baseAxios.get(`${fbBaseUrl}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=last_30d&access_token=${accessToken}`).then(res => {
            initialObject.Accounts_Reached.month = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
            initialObject.Post_Activity.month = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value;
        }).catch(error => {
            initialObject.Accounts_Reached.month = "N/A"
            initialObject.Post_Activity.month = "N/A"
        });

        //Post Engagement and Impressions last 2 years
        await baseAxios.get(`${fbBaseUrl}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=maximum&access_token=${accessToken}`).then(res => {
            initialObject.Accounts_Reached.lifeTime = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
            initialObject.Post_Activity.lifeTime = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value
        }).catch(error => {
            initialObject.Accounts_Reached.lifeTime = "N/A"
            initialObject.Post_Activity.lifeTime = "N/A"
        });
    }

    return initialObject;
};

export const getFacebookPageReports = async (listOfPages) => {
    let result = {}
    if (Array.isArray(listOfPages)) {
        for (const curPage of listOfPages) {
            let initialObject = {
                Followers: {lifeTime: 0, month: "N/A"},
                Accounts_Reached: {lifeTime: 0, month: 0},
                Post_Activity: {lifeTime: 0, month: 0},
            };

            const pageId = curPage?.id;
            const accessToken = curPage?.access_token;

            const fullPathTotalFollowers = `${fbBaseUrl}/${pageId}?fields=name,followers_count&access_token=${accessToken}`;

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
            await baseAxios.get(`${fbBaseUrl}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=last_30d&access_token=${accessToken}`).then(res => {
                initialObject.Accounts_Reached.month = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
                initialObject.Post_Activity.month = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value;
            }).catch(error => {
                initialObject.Accounts_Reached.month = "N/A"
                initialObject.Post_Activity.month = "N/A"
            });

            //Post Engagement and Impressions last 2 years
            await baseAxios.get(`${fbBaseUrl}/${pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=total_over_range&date_preset=maximum&access_token=${accessToken}`).then(res => {
                initialObject.Accounts_Reached.lifeTime = res?.data?.data?.filter(data => data?.name === "page_impressions_unique")?.[0]?.values[0]?.value;
                initialObject.Post_Activity.lifeTime = res?.data?.data?.filter(data => data?.name === "page_post_engagements")?.[0]?.values[0]?.value
            }).catch(error => {
                initialObject.Accounts_Reached.lifeTime = "N/A"
                initialObject.Post_Activity.lifeTime = "N/A"
            });

            result = {
                ...result,
                [curPage.id]: initialObject
            }
        }
    }
    return result;
}

export const getFacebookGraphReportByPage = async (page, query) => {
    let initialObject = {
        Followers: [],
        Accounts_Reached: [],
    };

    let followersReportCount = [];
    let reachedReportCount = [];
    if (page && query) {
        const pageId = page?.pageId;
        const accessToken = page?.access_token;

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
        initialObject.Followers = await calculatePercentageGrowth(computeAndReturnSummedDateValues(followersReportCount, SocialAccountProvider.FACEBOOK?.toUpperCase()));
        initialObject.Accounts_Reached = await calculatePercentageGrowth(computeAndReturnSummedDateValues(reachedReportCount, SocialAccountProvider.FACEBOOK?.toUpperCase()));

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

    if (Array.isArray(listOfPages) && query) {

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
    const baseUrl = `${fbBaseUrl}/${pageId}/insights`;
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
    const apiUrl = `${fbBaseUrl}/${postId}?access_token=${accessToken}&fields=id,message,likes.summary(true),comments.summary(true),shares,attachments,created_time,is_published,insights.metric(post_impressions)`;
    return baseAxios.get(apiUrl);
}

export const getPageFullInfoByPageAccessToken = async (pageAccessToken) => {
    const path = '/me';
    const fields = 'id,name,feed,about,access_token,bio,photos,picture';
    return await baseAxios.get(cleanAndValidateRequestURL(fbBaseUrl, path, fields, pageAccessToken));
};

export const getFacebookProfileInsightsInfo = async (data) => {
    try {
        const profile_insights_url = `${fbBaseUrl}/${data?.pageId}?fields=id,name,about,followers_count,likes,picture,fan_count,published_posts.summary(total_count)&access_token=${data?.pageAccessToken}`;
        const res = await baseAxios.get(profile_insights_url)
        return getFormattedInsightProfileInfo(res.data, "FACEBOOK")
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }
}

export const getFacebookDemographicData = async (data) => {
    // page_fans_city
    try {
        const apiUrl = `${fbBaseUrl}/${data?.pageId}/insights?metric=page_fans_country&period=day&access_token=${data?.pageAccessToken}`;
        const demographicData = await baseAxios.get(apiUrl);
        return {
            // city: getFormattedDemographicData(demographicData, "CITY", "FACEBOOK"),
            country: getFormattedDemographicData(demographicData, "COUNTRY", "FACEBOOK"),
            // gender: getFormattedDemographicData(demographicData, "GENDER", "FACEBOOK"),
            // age: getFormattedDemographicData(demographicData, "AGE", "FACEBOOK")
        }
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }

}

export const getFacebookProfileVisits = async (data) => {
    const profile_view_url = `${fbBaseUrl}/${data?.pageId}/insights/page_views_total?` + objectToQueryString(data.query);
    return await baseAxios.get(profile_view_url).then(res => {
        return getFormattedInsightsForProfileViews(res.data || {}, "FACEBOOK");
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getFacebookAccountReachAndEngagement = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data?.pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=day&since=${generateUnixTimestampFor(data?.period * 2)}&until=${generateUnixTimestampFor("now")}&access_token=${data?.pageAccessToken}`;
    return await baseAxios.get(apiUrl).then(res => {
        return getFormattedAccountReachAndEngagementData(res.data?.data, data?.socialMediaType);
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getFacebookPostDataWithInsights = async (data) => {
    const postIds = data?.postIds?.map(postId => postId).join(",");
    const apiUrl = `${fbBaseUrl}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,likes.summary(true).limit(1),reactions.summary(total_count).limit(1),comments.summary(total_count).limit(1),shares,attachments,created_time,is_published,insights.metric(post_impressions)`;
    return await baseAxios.get(apiUrl).then(res => {
        return res.data;
    }).catch(async error => {
        if (error?.response?.status === 400) {
            return getFormattedPostWithInsightsApiResponse(await Promise.all(data?.postIds?.map(postId => {
                return getFacebookInsightForSinglePost(data?.pageAccessToken, postId).catch(error => {
                    return {id: postId, ...error.response.data}
                })
            })), postIds, SocialAccountProvider?.FACEBOOK);

        } else {
            showErrorToast(ErrorFetchingPost);
            throw error;
        }
    });
}

export const getFacebookPostInsights = async (data) => {
    const postIds = data?.postIds?.map(postId => postId).join(",");
    const apiUrl = `${fbBaseUrl}/?ids=${postIds}&access_token=${data?.accessToken}&fields=id,likes.summary(true).limit(1),reactions.summary(total_count).limit(1),comments.summary(true),shares,is_published`;
    return await baseAxios.get(apiUrl).then(res => {
        return getFormattedPostWithInsightsApiData(res.data,data.socialMediaType)
    }).catch(async error => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getFacebookPostEngagements = async (data) => {
    let apiUrl = `${fbBaseUrl}/${data?.pageId}/insights/page_post_engagements?` + objectToQueryString(data.query)
    return await baseAxios.get(apiUrl).then((res) => {
        return res.data;
    }).catch((error) => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const getFacebookPostSocioData = async (data) => {
    const apiUrl = `${fbBaseUrl}/?ids=${data.postId}&access_token=${data?.pageAccessToken}&fields=id,message,attachments,created_time,is_published,likes.summary(true).limit(2),reactions.summary(true).limit(2),comments.summary(true).limit(1){id},shares`;
    return await baseAxios.get(apiUrl).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const getFacebookComments = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?${objectToQueryString({
        access_token: data?.pageAccessToken,
        order: "reverse_chronological",
        limit: data?.limit,
        fields: "id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,to,created_time,attachment,comment_count,can_comment,message_tags",
        after: data?.next
    })}`;
    return baseAxios.get(apiUrl).then((response) => {
        return response?.data
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const getFacebookRepliesOnComments = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?${objectToQueryString({
        access_token: data?.pageAccessToken,
        order: "chronological",
        limit: data?.limit,
        fields: "id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent{id},to,created_time,attachment,comment_count,can_comment,message_tags",
        after: data?.next
    })}`;
    return baseAxios.get(apiUrl).then((response) => {
        return response?.data
    }).catch((error) => {
        showErrorToast(error.response.data.error.message);
        throw error;
    });
}

export const postFacebookComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,created_time,attachment,comment_count,can_comment,message_tags`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data;
    }).catch((error) => {
        throw error;
    });
}

export const postFacebookReplyOnComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}/comments?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent{id},created_time,attachment,comment_count,can_comment,message_tags`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data;
    }).catch((error) => {
        throw error;
    });
}

export const deleteFacebookComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}?access_token=${data?.pageAccessToken}`;
    return baseAxios.delete(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}

export const updateFacebookComment = async (data) => {
    const apiUrl = `${fbBaseUrl}/${data.id}?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,created_time,attachment,comment_count,can_comment,message_tags`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(UpdateCommentFailedMsg);
        throw error;
    });
}