import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import {
    baseAxios,
    extractParameterFromUrl,
    generateUnixTimestampFor, getDatesForPinterest,
    getFormattedAccountReachAndEngagementData,
    getFormattedDemographicData,
    getFormattedPostTime, getFormattedTotalFollowersCountData
} from "../../../utils/commonUtils.js";
import {getToken, setAuthenticationHeader} from "../../auth/auth";


export const getPostDataWithInsights = createAsyncThunk('insight/getPostDataWithInsights', async (data, thunkAPI) => {

    switch (data?.socialMediaType) {
        case "INSTAGRAM": {
            const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
                const id = Object.keys(obj)[0];
                return data?.postIds.includes(id);
            });
            if (filteredArray.length === data?.postIds.length) {
                let response = {};
                filteredArray?.forEach(postWithInsight => {
                    const postId = Object.keys(postWithInsight)[0]
                    response = {...response, [postId]: postWithInsight[postId]}
                })
                return response
            } else {
                const postIds = data.postIds.map(id => id).join(',');
                const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,insights.metric(reach,shares),caption,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}`;
                return await baseAxios.get(apiUrl).then(res => {
                    return res.data;
                }).catch(error => {
                    showErrorToast(error.response.data.error.message);
                    return thunkAPI.rejectWithValue(error.response);
                });
            }
        }
        case "FACEBOOK": {
            const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
                const id = Object.keys(obj)[0];
                return data?.postIds.includes(id);
            });
            if (filteredArray.length === data?.postIds.length) {
                let response = {};
                filteredArray?.forEach(postWithInsight => {
                    const postId = Object.keys(postWithInsight)[0]
                    response = {...response, [postId]: postWithInsight[postId]}
                })
                return response
            } else {
                const postIds = data.postIds.map(id => id).join(',');
                const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,likes.summary(true),comments.summary(true),shares,attachments,created_time,is_published,insights.metric(post_impressions)`;
                return await baseAxios.get(apiUrl).then(res => {
                    return res.data;
                }).catch(error => {
                    showErrorToast(error.response.data.error.message);
                    return thunkAPI.rejectWithValue(error.response);
                });
            }
        }
        case "PINTEREST": {
            const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
                const id = Object.keys(obj)[0];
                return data?.postIds.includes(id);
            });
            if (filteredArray.length === data?.postIds.length) {
                let response = {};
                filteredArray?.forEach(postWithInsight => {
                    const postId = Object.keys(postWithInsight)[0]
                    response = {...response, [postId]: postWithInsight[postId]}
                })
                return response
            } else {
                const postIds = data.postIds.map(id => id).join(',');
                const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/pin-insights?ids=${postIds}`;
                return await baseAxios.get(apiUrl, setAuthenticationHeader(data.token)).then(res => {
                    return res.data;
                }).catch(error => {
                    showErrorToast(error.response.data.error.message);
                    return thunkAPI.rejectWithValue(error.response);
                });
            }
            break;
        }
        case "LINKEDIN": {
            const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
                const id = Object.keys(obj)[0];
                return data?.postIds.includes(id);
            });
            if (filteredArray.length === data?.postIds.length) {
                let response = {};
                filteredArray?.forEach(postWithInsight => {
                    const postId = Object.keys(postWithInsight)[0]
                    response = {...response, [postId]: postWithInsight[postId]}
                })
                return response
            } else {
                const postIds = data.postIds.map(id => id).join(',');
                const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/post/insights?ids=${postIds}&orgId=${data?.pageId}`;
                return await baseAxios.get(apiUrl, setAuthenticationHeader(data.token)).then(res => {
                    return res.data;
                }).catch(error => {
                    showErrorToast(error.response.data.error.message);
                    return thunkAPI.rejectWithValue(error.response);
                });
            }
            break;
        }
    }

});
export const getTotalFollowers = createAsyncThunk('insight/getTotalFollowers', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "INSTAGRAM":
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}?fields=name,followers_count&access_token=${data?.pageAccessToken}`;
            return await baseAxios.get(apiUrl).then(res => {
                return getFormattedTotalFollowersCountData(res.data, "FACEBOOK");
            }).catch(error => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case "PINTEREST": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return getFormattedTotalFollowersCountData(res.data, "PINTEREST");
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/networkSizes/${data?.pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return getFormattedTotalFollowersCountData(res.data, "LINKEDIN");
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
            break;
        }
    }


});
export const getAccountReachedAndAccountEngaged = createAsyncThunk('insight/getAccountReachedAndAccountEngaged', async (data, thunkAPI) => {

    switch (data?.socialMediaType) {
        case "INSTAGRAM": {
            return await getAccountReachedAndAccountEngagedForInstagram(data, thunkAPI).then((res) => {
                return getFormattedAccountReachAndEngagementData(res, data?.socialMediaType);
            })
        }
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=page_impressions,page_post_engagements&period=day&since=${generateUnixTimestampFor(data?.period * 2)}&until=${generateUnixTimestampFor("now")}&access_token=${data?.pageAccessToken}`;
            return await baseAxios.get(apiUrl).then(res => {
                return getFormattedAccountReachAndEngagementData(res.data?.data, data?.socialMediaType);
            }).catch(error => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case "PINTEREST": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest((data?.period * 2) + 1)}&end_date=${getDatesForPinterest("now")}`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return getFormattedAccountReachAndEngagementData(res?.data, data?.socialMediaType);
            }).catch(error => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.response);
            });
            break;
        }
        case "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${data?.pageId}&timeGranularityType=DAY&startDate=${generateUnixTimestampFor(data?.period * 2) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timePeriod=timeBound`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token))
                .then((response) => {
                    return getFormattedAccountReachAndEngagementData(response?.data, data?.socialMediaType);
                })
                .catch((error) => {
                    showErrorToast(error.response.data.message);
                    return thunkAPI.rejectWithValue(error.response);
                });
            break;
        }
    }
});
export const getDemographicsInsight = createAsyncThunk('insight/getDemographicsInsight', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "INSTAGRAM": {
            return await getInstagramDemographicData(data, thunkAPI).then((res) => {
                return res;
            })
        }
        case "FACEBOOK": {
            return await getFacebookDemographicData(data, thunkAPI).then((res) => {
                return res;
            })

        }
        case "LINKEDIN": {
            return await getLinkedInDemographicData(data, thunkAPI).then((res) => {
                return res;
            })
        }
    }
});

const getAccountReachedAndAccountEngagedForInstagram = async (data, thunkAPI) => {
    let apiResponse = {
        previousData: {
            data: null,
            dateRange: null
        },
        presentData: null
    }
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=reach,accounts_engaged&metric_type=total_value&period=day&since=${generateUnixTimestampFor(data?.period + 1)}&until=${generateUnixTimestampFor("now")}&access_token=${data?.pageAccessToken}`;
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
        return thunkAPI.rejectWithValue(error.response);
    });

}

const getInstagramDemographicData = async (data, thunkAPI) => {
    let formattedApiResponse = {
        age: null,
        gender: null,
        country: null,
        city: null
    }
    // const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=reached_audience_demographics&period=lifetime&timeframe=${data?.period}&metric_type=total_value&access_token=${data?.pageAccessToken}`;
    const baseUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=follower_demographics&period=lifetime&timeframe=${data?.period}&metric_type=total_value&access_token=${data?.pageAccessToken}`;
    const cityDemographicDataApiUrl = baseUrl + "&breakdown=city";
    await baseAxios.get(cityDemographicDataApiUrl).then(cityDemographicData => {
        formattedApiResponse = {
            ...formattedApiResponse,
            city: getFormattedDemographicData(cityDemographicData, "CITY", "INSTAGRAM")
        }
    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });
    const countryDemographicDataApiUrl = baseUrl + "&breakdown=country";
    await baseAxios.get(countryDemographicDataApiUrl).then(countryDemographicData => {
        formattedApiResponse = {
            ...formattedApiResponse,
            country: getFormattedDemographicData(countryDemographicData, "COUNTRY", "INSTAGRAM")
        }
    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });
    const ageDemographicDataApiUrl = baseUrl + "&breakdown=age";
    await baseAxios.get(ageDemographicDataApiUrl).then(ageDemographicData => {
        formattedApiResponse = {
            ...formattedApiResponse,
            age: getFormattedDemographicData(ageDemographicData, "AGE", "INSTAGRAM")
        }
    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });
    const genderDemographicDataApiUrl = baseUrl + "&breakdown=gender";
    await baseAxios.get(genderDemographicDataApiUrl).then(genderDemographicData => {
        formattedApiResponse = {
            ...formattedApiResponse,
            gender: getFormattedDemographicData(genderDemographicData, "GENDER", "INSTAGRAM")
        }
    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });

    return formattedApiResponse;
}
const getFacebookDemographicData = async (data, thunkAPI) => {
    let formattedApiResponse = {
        age: null,
        gender: null,
        country: null,
        city: null
    }
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=page_fans_city,page_fans_country,page_fans_gender_age&period=day&access_token=${data?.pageAccessToken}`;
    await baseAxios.get(apiUrl).then(demographicData => {
        formattedApiResponse = {
            ...formattedApiResponse,
            city: getFormattedDemographicData(demographicData, "CITY", "FACEBOOK"),
            country: getFormattedDemographicData(demographicData, "COUNTRY", "FACEBOOK"),
            gender: getFormattedDemographicData(demographicData, "GENDER", "FACEBOOK"),
            age: getFormattedDemographicData(demographicData, "AGE", "FACEBOOK")
        }


    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });


    return formattedApiResponse;
}
const getLinkedInDemographicData = async (data, thunkAPI) => {
    let formattedApiResponse = {
        staffCountRange: null,
        function: null,
        associationType: null,
        seniority: null,
        geoCountry: null,
        geo: null,
        industry: null,
    }
    const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/organizationalEntityFollowerStatistics/${data?.pageId}?pageAccessToken=${data?.pageAccessToken}`;
    await baseAxios.get(apiUrl, setAuthenticationHeader(getToken())).then(demographicData => {
        demographicData = demographicData.data
        formattedApiResponse = {
            ...formattedApiResponse,
            staffCountRange: getFormattedDemographicData(demographicData, "staffCountRange", "LINKEDIN"),
            function: getFormattedDemographicData(demographicData, "function", "LINKEDIN"),
            associationType: getFormattedDemographicData(demographicData, "associationType", "LINKEDIN"),
            seniority: getFormattedDemographicData(demographicData, "seniority", "LINKEDIN"),
            geoCountry: getFormattedDemographicData(demographicData, "geoCountry", "LINKEDIN"),
            geo: getFormattedDemographicData(demographicData, "geo", "LINKEDIN"),
            industry: getFormattedDemographicData(demographicData, "industry", "LINKEDIN"),
        }
    }).catch(error => {
        // showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });


    return formattedApiResponse;
}