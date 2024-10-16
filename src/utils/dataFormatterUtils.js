import {
    convertUnixTimestampToDateTime,
    filterAndSumLinkedinOrgStatisticsDataFor,
    filterAndSumPinterestUserAnalyticsDataFor,
    filterGenderAgeDataFromFacebookDemographicData, getAttachmentsData,
    getFormattedPostTime, getLinkedinIdTypeFromUrn, getValueOrDefault,
    isNullOrEmpty
} from "./commonUtils";
import {ErrorFetchingPost, SocialAccountProvider} from "./contantData";

export const getInstagramBusinessAccounts = (accountsData) => {
    const businessAccounts = accountsData?.filter(data => {
        return data.hasOwnProperty("instagram_business_account")
    })
    if (isNullOrEmpty(businessAccounts)) {
        return [];
    }
    return businessAccounts?.map(data => {
        return data["instagram_business_account"]
    })
}

export const formatPageAccessTokenDTOToConnect = ({data, socialMediaAccountInfo}) => {
    let pageAccessTokenDTO = {
        pageId: data?.id,
        name: data?.name,
        socialMediaAccountId: socialMediaAccountInfo?.id
    }
    switch (socialMediaAccountInfo?.provider) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data.picture?.data?.url,
                about: data?.about,
                access_token: data?.access_token,
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.profile_picture_url,
                about: data?.about,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        case SocialAccountProvider.PINTEREST.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.media?.image_cover_url,
                about: data?.description,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.logo_url,
                about: data?.description,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        default: {
        }
    }
    return pageAccessTokenDTO;
}

export const getConnectedSocialMediaAccount = (connectedSocialAccount) => {
    return {
        facebook: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "FACEBOOK")?.[0] || null,
        instagram: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "INSTAGRAM")?.[0] || null,
        linkedin: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "LINKEDIN")?.[0] || null,
        pinterest: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "PINTEREST")?.[0] || null
    }

}

export const getFormattedInsightProfileInfo = (data, socialMediaType) => {
    let response;
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.name,
                followers: data?.followers_count,
                likes: data?.fan_count,
                about: data?.about,
                imageUrl: data?.picture?.data?.url
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase() : {
            response = {
                id: data?.id,
                name: data?.name,
                followers: data?.followers_count,
                following: data?.follows_count,
                about: data?.biography,
                total_posts: data?.media_count,
                imageUrl: data?.profile_picture_url
            }
            break;
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.business_name,
                followers: data?.follower_count,
                following: data?.following_count,
                about: data?.about,
                total_posts: data?.pin_count,
                imageUrl: data?.profile_image
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            response = {
                followers: data?.all_time?.firstDegreeSize
            }
            break;
        }
    }
    return response;
}

export const getFormattedDemographicData = (data, key, socialMediaType) => {
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            let formattedData;
            if (data?.data?.data?.length > 0) {
                let demographicData;
                if (key === "CITY") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_city")
                }
                if (key === "COUNTRY") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_country")
                }
                if (key === "AGE" || key === "GENDER") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_gender_age")
                }
                if (demographicData?.length > 0) {
                    if (key === "CITY") {
                        formattedData = Object.keys(demographicData[0]?.values[0]?.value)?.map(cur => {
                            return {
                                city_name: cur,
                                value: demographicData[0]?.values[0]?.value[cur]
                            }
                        })
                    }
                    if (key === "COUNTRY") {
                        formattedData = Object.keys(demographicData[0]?.values[0]?.value)?.map(cur => {
                            return {
                                country_code: cur,
                                value: demographicData[0]?.values[0]?.value[cur]
                            }
                        })
                    }
                    if (key === "AGE" || key === "GENDER") {
                        return filterGenderAgeDataFromFacebookDemographicData(demographicData[0]?.values[0]?.value, key)
                    }
                } else {
                    formattedData = null
                }

            } else {
                formattedData = null
            }
            return formattedData
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
            let formattedData;
            if (data?.data?.data[0]?.total_value?.breakdowns[0]?.results === undefined || data?.data?.data[0]?.total_value?.breakdowns[0]?.results === null || data?.data?.data[0]?.total_value?.breakdowns[0]?.results?.length === 0) {
                formattedData = null
            } else {
                formattedData = data?.data?.data[0]?.total_value?.breakdowns[0]?.results?.map(data => {
                    if (key === "CITY") {
                        return {
                            city_name: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "COUNTRY") {
                        return {
                            country_code: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "GENDER") {
                        return {
                            gender: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "AGE") {
                        return {
                            age_range: data?.dimension_values[0],
                            value: data?.value
                        }
                    }

                })
            }
            return formattedData
        }
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            let formattedData;
            const keyData = data?.elements?.filter(data => data.hasOwnProperty(key))
            if (keyData?.length === 0) {
                formattedData = null;
            } else {
                if (key === "followerCountsByGeoCountry") {
                    formattedData = keyData[0]?.followerCountsByGeoCountry?.map(data => {
                        return {
                            country_name: data?.geo,
                            value: data?.followerCounts?.organicFollowerCount + data?.followerCounts?.paidFollowerCount
                        }
                    });
                }
            }
            return formattedData
        }
    }
}

export const getFormattedInsightsForProfileViews = (data, socialMediaType) => {
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase():
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            return Array.isArray(data.data) && data.data.length > 0 ? data.data[0].values || [] : [];
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            return Array.isArray(data?.elements) && data?.elements?.length > 0 ? data?.elements || [] : [];
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            break;
        }
    }
    return {};
}

export const getFormattedAccountReachAndEngagementData = (data, socialMediaType) => {
    let formattedData = {
        engagement: {
            presentData: null,
            previousData: {
                data: null,
                dateRange: null
            }
        },
        reach: {
            presentData: null,
            previousData: {
                data: null,
                dateRange: null
            }
        }
    }
    switch (socialMediaType) {
        case "FACEBOOK": {
            const engagement = data?.filter(data => data?.name === "page_post_engagements")[0]?.values
            const reach = data?.filter(data => data?.name === "page_impressions_unique")[0]?.values
            const totalEngagementForPreviousDate = engagement.slice(0, (engagement?.length) / 2);
            const totalEngagementForPresentDate = engagement.slice((engagement?.length) / 2)
            const totalReachForPreviousDate = reach.slice(0, (reach?.length) / 2);
            const totalReachForPresentDate = reach.slice((reach?.length) / 2)
            formattedData = {
                engagement: {
                    presentData: totalEngagementForPresentDate.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.value;
                    }, 0),
                    previousData: {
                        data: totalEngagementForPreviousDate.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.value;
                        }, 0),
                        dateRange: `${getFormattedPostTime(totalEngagementForPreviousDate[0]?.end_time, "DD-Mon") + "-" + getFormattedPostTime(totalEngagementForPreviousDate[totalEngagementForPreviousDate?.length - 1]?.end_time, "DD-Mon")}`
                    }
                },
                reach: {
                    presentData: totalReachForPresentDate.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.value;
                    }, 0),
                    previousData: {
                        data: totalReachForPreviousDate.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.value;
                        }, 0),
                        dateRange: `${getFormattedPostTime(totalReachForPreviousDate[0]?.end_time, "DD-Mon") + "-" + getFormattedPostTime(totalReachForPreviousDate[totalEngagementForPreviousDate?.length - 1]?.end_time, "DD-Mon")}`
                    }
                }

            }
            return formattedData;
        }
        case "INSTAGRAM": {
            const presentReach = data?.presentData?.filter(data => data?.name === "reach")[0]?.total_value?.value
            const presentEngagement = data?.presentData?.filter(data => data?.name === "accounts_engaged")[0]?.total_value?.value
            const previousReach = data?.previousData?.data?.filter(data => data?.name === "reach")[0]?.total_value?.value
            const previousEngagement = data?.previousData?.data?.filter(data => data?.name === "accounts_engaged")[0]?.total_value?.value
            formattedData = {
                engagement: {
                    presentData: presentEngagement,
                    previousData: {
                        data: previousEngagement,
                        dateRange: data?.previousData?.dateRange
                    }
                },
                reach: {
                    presentData: presentReach,
                    previousData: {
                        data: previousReach,
                        dateRange: data?.previousData?.dateRange
                    }
                }
            }
            return formattedData;
        }
        case "PINTEREST": {
            const readyData = data?.all?.daily_metrics?.filter(insightsData => insightsData?.data_status !== "PROCESSING");
            const totalDays = Math.floor(readyData?.length);
            const previousData = readyData?.slice(0, totalDays / 2);
            const presentData = readyData?.slice((totalDays / 2) * -1);
            const dateRange = getFormattedPostTime(new Date(previousData[0]?.date), "DD-Mon") + "-" + getFormattedPostTime(new Date(previousData[(totalDays / 2) - 1]?.date), "DD-Mon")
            const summedPreviousData = filterAndSumPinterestUserAnalyticsDataFor(previousData, previousData?.length, ["IMPRESSION", "ENGAGEMENT"]);
            const summedPresentData = filterAndSumPinterestUserAnalyticsDataFor(presentData, presentData?.length, ["IMPRESSION", "ENGAGEMENT"]);
            formattedData = {
                engagement: {
                    presentData: summedPresentData?.ENGAGEMENT || 0,
                    previousData: {
                        data: summedPreviousData?.ENGAGEMENT || 0,
                        dateRange: dateRange
                    }
                },
                reach: {
                    presentData: summedPresentData?.IMPRESSION || 0,
                    previousData: {
                        data: summedPreviousData?.IMPRESSION || 0,
                        dateRange: dateRange
                    }
                }
            }
            return formattedData;
        }
        case "LINKEDIN": {
            const statisticsData = data?.timeBound?.elements;
            const totalDays = Math.floor(statisticsData?.length);
            const previousData = statisticsData?.slice(0, totalDays / 2);
            const presentData = statisticsData?.slice((totalDays / 2) * -1);
            const dateRange = getFormattedPostTime(previousData[0]?.timeRange?.start, "DD-Mon") + "-" + getFormattedPostTime(previousData[previousData?.length - 1]?.timeRange?.start, "DD-Mon")
            const summedPreviousData = filterAndSumLinkedinOrgStatisticsDataFor(previousData, previousData?.length, ["impressionCount", "engagement"]);
            const summedPresentData = filterAndSumLinkedinOrgStatisticsDataFor(presentData, presentData?.length, ["impressionCount", "engagement"]);
            formattedData = {
                engagement: {
                    presentData: summedPresentData?.engagement,
                    previousData: {
                        data: summedPreviousData?.engagement,
                        dateRange: dateRange
                    }
                },
                reach: {
                    presentData: summedPresentData?.impressionCount,
                    previousData: {
                        data: summedPreviousData?.impressionCount,
                        dateRange: dateRange
                    }
                }
            }
            return formattedData;
            break;
        }
    }
}

export const getFormattedPostWithInsightsApiResponse = (insightsData, postIds, socialMediaType) => {
    let response = {};
    switch (socialMediaType) {
        case SocialAccountProvider?.FACEBOOK: {
            insightsData?.map(res => {
                response = res.hasOwnProperty("error") ? {...response, [res?.id]: res} : {
                    ...response,
                    [res?.data?.id]: res?.data
                }
            })
            return response;
        }
        case SocialAccountProvider?.INSTAGRAM: {
            postIds?.map(postId => {
                response = insightsData[postId] === undefined ? {
                    ...response,
                    [postId]: {id: postId, error: {message: "Object does not exist"}}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
        case SocialAccountProvider?.PINTEREST: {
            postIds?.map(postId => {
                response = insightsData[postId].hasOwnProperty("error") ? {
                    ...response,
                    [postId]: {id: postId, error: insightsData[postId]}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
        case SocialAccountProvider?.LINKEDIN: {
            postIds?.map(postId => {
                response = insightsData[postId].hasOwnProperty("error") ? {
                    ...response,
                    [postId]: {id: postId, error: insightsData[postId]?.error}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
    }
}

export const getFormattedPostDataForSlider = (data, socialMediaType) => {
    if (data === null || data === undefined) {
        return []
    }
    let formattedData = {}
    let errorResponse = {id: data?.id, hasError: true, errorInfo: {}}
    switch (socialMediaType) {
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.message?.includes("Object does not exist"),
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.like_count,
                total_comment: data?.comments_count,
                total_share: data?.insights?.data?.filter(cur => cur.name === "shares")?.length === 0 ? "N/A" : data?.insights?.data?.filter(cur => cur.name === "shares")[0]?.values[0]?.value,
                account_reach: data?.insights?.data?.filter(cur => cur.name === "reach")[0]?.values[0]?.value,
                creation_time: data?.timestamp,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData
        }
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.message?.includes("Object does not exist"),
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.likes?.summary?.total_count + getValueOrDefault(data?.reactions?.summary?.total_count, 0),
                total_comment: data?.comments?.summary?.total_count,
                total_share: data?.shares?.count || 0,
                account_reach: data?.insights?.data[0]?.values[0]?.value,
                creation_time: data?.created_time,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.status === "404",
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.pin_metrics?.all_time?.reaction,
                total_comment: data?.pin_metrics?.all_time?.comment,
                total_save: data?.pin_metrics?.all_time?.save,
                account_reach: data?.pin_metrics?.all_time?.impression,
                creation_time: data?.created_at,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.status === "404",
                        errorMessage: data?.error?.message || ErrorFetchingPost
                    }
                }
            }
            formattedData = {
                total_like: data?.shareStatistics?.totalShareStatistics?.likeCount || 0,
                total_comment: data?.shareStatistics?.totalShareStatistics?.commentCount || 0,
                total_share: data?.shareStatistics?.totalShareStatistics?.shareCount || 0,
                account_reach: data?.shareStatistics?.totalShareStatistics?.impressionCount || 0,
                creation_time: data?.postInfo?.createdAt,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData;
        }
    }

}

export const getFormattedDataForPostEngagementGraph = (data, socialMediaType) => {
    if (data === null || data === undefined) {
        return []
    }
    let formattedData = []
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            formattedData = data?.data[0]?.values?.map((cur) => {
                const date = new Date(cur.end_time)
                const month = date.toLocaleString('default', {month: 'short'})
                const day = date.getDate();
                const year = date.getFullYear();
                const formattedDate = `${month} ${day} ${year}`

                return {
                    date: formattedDate,
                    "POST ENGAGEMENT": cur.value
                }
            })
            return formattedData
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            formattedData = data?.all?.daily_metrics?.map((cur) => {
                return {
                    date: cur.date,
                    "POST ENGAGEMENT": cur?.metrics?.ENGAGEMENT
                }
            })
            return formattedData;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            formattedData = data?.elements?.map((cur) => {
                return {
                    date: convertUnixTimestampToDateTime(cur?.timeRange?.start / 1000)?.date,
                    "POST ENGAGEMENT": cur?.totalShareStatistics?.engagement
                }
            })
            return formattedData;
        }
    }

}

export const mapCreatePostDataToFormData=(data)=>{
    const formData = new FormData();
    if (data.caption !== null && data.caption !== "null") {
        formData.append('caption', data.caption);
    }
    if (data.hashTag !== null && data.hashTag !== "null") {
        formData.append('hashTag', data.hashTag);
    }
    if (data.postPageInfos?.some(pageInfo => pageInfo?.provider === SocialAccountProvider.PINTEREST.toUpperCase())) {
        formData.append('pinTitle', data.pinTitle);
        formData.append('pinDestinationUrl', data.destinationUrl);
    }
    formData.append('boostPost', data?.boostPost);
    formData.append('postStatus', data.postStatus);
    if (data.scheduledPostDate) {
        formData.append('scheduledPostDate', data.scheduledPostDate);
    }
    data.postPageInfos.forEach((pageInfo, index) => {
        formData.append(`postPageInfos[${index}].pageId`, pageInfo?.pageId);
        formData.append(`postPageInfos[${index}].socialMediaType`, pageInfo?.provider);
    });
    // Loop through the attachments array and append each attachment's data.
    data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}].mediaType`, attachment?.mediaType);
        formData.append(`attachments[${index}].file`, attachment?.file);
    });
    return formData;
}

export const mapUpdatePostDataToFormData=(data)=>{
    const formData = new FormData();
    if (data.updatePostRequestDTO.caption !== null && data.updatePostRequestDTO.caption !== "null") {
        formData.append('caption', data.updatePostRequestDTO.caption);
    }
    if (data.updatePostRequestDTO.hashTag !== null && data.updatePostRequestDTO.hashTag !== "null") {
        formData.append('hashTag', data.updatePostRequestDTO.hashTag);
    }
    formData.append('boostPost', data.updatePostRequestDTO?.boostPost);
    formData.append('postStatus', data.updatePostRequestDTO.postStatus);
    if (data.updatePostRequestDTO.scheduledPostDate !== null) {
        formData.append('scheduledPostDate', data.updatePostRequestDTO.scheduledPostDate);
    }
    if (data.updatePostRequestDTO.postPageInfos?.some(pageInfo => pageInfo?.provider === SocialAccountProvider.PINTEREST.toUpperCase())) {
        formData.append('pinTitle', data.updatePostRequestDTO.pinTitle);
        formData.append('pinDestinationUrl', data.updatePostRequestDTO.destinationUrl);
    }
    data.updatePostRequestDTO.postPageInfos.forEach((pageInfo, index) => {
        formData.append(`postPageInfos[${index}].pageId`, pageInfo?.pageId);
        formData.append(`postPageInfos[${index}].socialMediaType`, pageInfo?.provider);
        if (pageInfo?.id !== null) {
            formData.append(`postPageInfos[${index}].id`, pageInfo?.id);
        }
    });
    if (data.updatePostRequestDTO.attachments.length > 0) {
        data.updatePostRequestDTO.attachments.forEach((attachment, index) => {
            if (attachment?.file !== null && attachment?.file !== "null") {
                formData.append(`attachments[${index}].file`, attachment?.file);
                // formData.append(`attachments[${index}].mediaType`, attachment?.file.type.includes("image") ? "IMAGE" : "VIDEO");
            }
            if (attachment?.mediaType !== "null" && attachment?.mediaType !== null) {
                formData.append(`attachments[${index}].mediaType`, attachment?.mediaType);
            }
            if (attachment?.id !== null) {
                formData.append(`attachments[${index}].id`, attachment?.id);
            }
            if (attachment?.gridFsId !== null) {
                formData.append(`attachments[${index}].gridFsId`, attachment?.gridFsId);
            }
        });
    }
    return formData;
}

export const getUpdateCommentMessage = (commentToUpdate, socialMediaType) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            let updatedMessage = commentToUpdate?.message
            if (commentToUpdate?.message_tags?.length === 0) {
                return commentToUpdate?.message
            }
            const mentionedAccounts = commentToUpdate?.message_tags?.filter(tags => tags?.type === "user")
            if (mentionedAccounts?.length === 0) {
                return commentToUpdate?.message
            } else {
                mentionedAccounts?.map(accounts => {
                    updatedMessage = updatedMessage?.replace(accounts?.name, `@[${accounts?.id}]`)
                })
            }
            return updatedMessage
        }
        case "LINKEDIN": {
            let updatedMessage = {
                text: commentToUpdate?.updatedMessage,
                actor: commentToUpdate?.comment?.actor,
                commentId: commentToUpdate?.comment?.id,
                parentObjectUrn: commentToUpdate?.comment?.hasOwnProperty("parentComment") ? commentToUpdate?.comment?.parentComment : commentToUpdate?.comment?.object,
            }

            if (commentToUpdate?.mentionedUsers?.length > 0) {
                const currentMentionedUsers = commentToUpdate?.mentionedUsers?.filter(mentionedUser => commentToUpdate?.updatedMessage?.includes(mentionedUser?.name))
                if (currentMentionedUsers?.length > 0) {
                    updatedMessage = {
                        ...updatedMessage,
                        attributes: currentMentionedUsers?.map(mentionedUser => {
                            const idType = getLinkedinIdTypeFromUrn(mentionedUser?.id);
                            return {
                                length: mentionedUser?.name?.length,
                                start: commentToUpdate?.updatedMessage?.indexOf(mentionedUser?.name),
                                value: {
                                    [idType]: {
                                        [idType]: mentionedUser?.id
                                    }
                                }
                            }
                        })
                    }
                }
            }
            return updatedMessage
        }
        default: {

        }
    }

}