import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    generateUnixTimestampFor,
    getDatesForPinterest,
} from "../../../utils/commonUtils.js";
import { setAuthenticationHeader} from "../../auth/auth";
import axios from "axios";


// export const getPostDataWithInsights = createAsyncThunk('insight/getPostDataWithInsights', async (data, thunkAPI) => {
//
//     switch (data?.socialMediaType) {
//         case "INSTAGRAM": {
//             const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
//                 const id = Object.keys(obj)[0];
//                 return data?.postIds.includes(id);
//             });
//             if (filteredArray.length === data?.postIds.length) {
//                 let response = {};
//                 filteredArray?.forEach(postWithInsight => {
//                     const postId = Object.keys(postWithInsight)[0]
//                     response = {...response, [postId]: postWithInsight[postId]}
//                 })
//                 return response
//             } else {
//                 const postIds = data.postIds.map(id => id).join(',');
//                 const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,insights.metric(reach,shares),caption,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}`;
//                 return await baseAxios.get(apiUrl).then(res => {
//                     return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.INSTAGRAM);
//                 }).catch(error => {
//                     showErrorToast(error.response.data.error.message);
//                     return thunkAPI.rejectWithValue(error.response);
//                 });
//             }
//         }
//         case "FACEBOOK": {
//             const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
//                 const id = Object.keys(obj)[0];
//                 return data?.postIds.includes(id);
//             });
//             if (filteredArray.length === data?.postIds.length) {
//                 let response = {};
//                 filteredArray?.forEach(postWithInsight => {
//                     const postId = Object.keys(postWithInsight)[0]
//                     response = {...response, [postId]: postWithInsight[postId]}
//                 })
//                 return response
//             } else {
//                 const postIds = data?.postIds?.map(postId => postId).join(",");
//                 const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,likes.summary(true).limit(1),reactions.summary(total_count).limit(1),comments.summary(true),shares,attachments,created_time,is_published,insights.metric(post_impressions)`;
//                 return await baseAxios.get(apiUrl).then(res => {
//                     return res.data;
//                 }).catch(async error => {
//                     if (error?.response?.status === 400) {
//                         return getFormattedPostWithInsightsApiResponse(await Promise.all(data?.postIds?.map(postId => {
//                             return getFacebookInsightForSinglePost(data?.pageAccessToken, postId).catch(error => {
//                                 return {id: postId, ...error.response.data}
//                             })
//                         })), postIds, SocialAccountProvider?.FACEBOOK);
//
//                     } else {
//                         showErrorToast(ErrorFetchingPost);
//                         // showErrorToast(error.response.data.error.message);
//                     }
//                 });
//             }
//         }
//         case "PINTEREST": {
//             const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
//                 const id = Object.keys(obj)[0];
//                 return data?.postIds.includes(id);
//             });
//             if (filteredArray.length === data?.postIds.length) {
//                 let response = {};
//                 filteredArray?.forEach(postWithInsight => {
//                     const postId = Object.keys(postWithInsight)[0]
//                     response = {...response, [postId]: postWithInsight[postId]}
//                 })
//                 return response
//             } else {
//                 const postIds = data.postIds.map(id => id).join(',');
//                 const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/pin-insights?ids=${postIds}`;
//                 return await baseAxios.get(apiUrl, setAuthenticationHeader(data.token)).then(res => {
//                     return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.PINTEREST);
//                 }).catch(error => {
//                     showErrorToast(error.response.data.error.message);
//                     return thunkAPI.rejectWithValue(error.response);
//                 });
//             }
//             break;
//         }
//         case "LINKEDIN": {
//             const filteredArray = data?.insightsCache?.getPostDataWithInsightsDataCache.filter(obj => {
//                 const id = Object.keys(obj)[0];
//                 return data?.postIds.includes(id);
//             });
//             if (filteredArray.length === data?.postIds.length) {
//                 let response = {};
//                 filteredArray?.forEach(postWithInsight => {
//                     const postId = Object.keys(postWithInsight)[0]
//                     response = {...response, [postId]: postWithInsight[postId]}
//                 })
//                 return response
//             } else {
//                 const postIds = data.postIds.map(id => id).join(',');
//                 const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/post/insights?ids=${postIds}&orgId=${data?.pageId}`;
//                 return await baseAxios.get(apiUrl, setAuthenticationHeader(data.token)).then(res => {
//                     return getFormattedPostWithInsightsApiResponse(res.data, data.postIds, SocialAccountProvider?.LINKEDIN);
//                 }).catch(error => {
//                     showErrorToast(error.response.data.error.message);
//                     return thunkAPI.rejectWithValue(error.response);
//                 });
//             }
//             break;
//         }
//     }
//
// });
// export const getProfileInsightsInfo = createAsyncThunk('insight/getProfileInsightsInfo', async (data, thunkAPI) => {
//
//     switch (data?.socialMediaType) {
//         case "FACEBOOK": {
//             const profile_insights_url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}?fields=id,name,about,followers_count,likes,picture,fan_count,published_posts.summary(total_count)&access_token=${data?.pageAccessToken}`;
//             return await baseAxios.get(profile_insights_url).then(res => {
//                 return getFormattedInsightProfileInfo(res.data, "FACEBOOK")
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//
//         case "INSTAGRAM": {
//             const profile_count_info = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}?fields=name,followers_count,follows_count,media_count,profile_picture_url,biography&access_token=${data?.pageAccessToken}`;
//             return await baseAxios.get(profile_count_info).then(res => {
//                 return getFormattedInsightProfileInfo(res.data, "INSTAGRAM")
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//
//         case "PINTEREST": {
//             const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account`;
//             return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
//                 return getFormattedInsightProfileInfo(res.data, "PINTEREST");
//             }).catch(error => {
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//         case "LINKEDIN": {
//             const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/networkSizes/${data?.pageId}?edgeType=COMPANY_FOLLOWED_BY_MEMBER`;
//             return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
//                 return getFormattedInsightProfileInfo(res.data, "LINKEDIN");
//             }).catch(error => {
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//             break;
//         }
//     }
//
//
// });

// export const getAccountReachedAndAccountEngaged = createAsyncThunk('insight/getAccountReachedAndAccountEngaged', async (data, thunkAPI) => {
//
//     switch (data?.socialMediaType) {
//         case "INSTAGRAM": {
//             return await getAccountReachedAndAccountEngagedForInstagram(data, thunkAPI).then((res) => {
//                 return getFormattedAccountReachAndEngagementData(res, data?.socialMediaType);
//             })
//         }
//         case "FACEBOOK": {
//             const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?metric=page_impressions_unique,page_post_engagements&period=day&since=${generateUnixTimestampFor(data?.period * 2)}&until=${generateUnixTimestampFor("now")}&access_token=${data?.pageAccessToken}`;
//             return await baseAxios.get(apiUrl).then(res => {
//                 return getFormattedAccountReachAndEngagementData(res.data?.data, data?.socialMediaType);
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//         case "PINTEREST": {
//             const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest((data?.period * 2) + 1)}&end_date=${getDatesForPinterest("now")}`;
//             return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
//                 return getFormattedAccountReachAndEngagementData(res?.data, data?.socialMediaType);
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//         case "LINKEDIN": {
//             const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${data?.pageId}&timeGranularityType=DAY&startDate=${generateUnixTimestampFor(data?.period * 2) * 1000}&endDate=${generateUnixTimestampFor("now") * 1000}&timePeriod=timeBound`;
//             return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token))
//                 .then((response) => {
//                     return getFormattedAccountReachAndEngagementData(response?.data, data?.socialMediaType);
//                 })
//                 .catch((error) => {
//                     showErrorToast(error.response.data.message);
//                     return thunkAPI.rejectWithValue(error.response);
//                 });
//         }
//     }
// });
// export const getDemographicsInsight = createAsyncThunk('insight/getDemographicsInsight', async (data, thunkAPI) => {
//     switch (data?.socialMediaType) {
//         case "INSTAGRAM": {
//             return await getInstagramDemographicData(data, thunkAPI).then((res) => {
//                 return res;
//             })
//         }
//         case "FACEBOOK": {
//             return await getFacebookDemographicData(data, thunkAPI).then((res) => {
//                 return res;
//             })
//
//         }
//         case "LINKEDIN": {
//             return await getLinkedInDemographicData(data, thunkAPI).then((res) => {
//                 return res;
//             })
//         }
//     }
// });





// export const getProfileVisitsInsightsInfo = createAsyncThunk('insight/getProfileVisitsInsightsInfo', async (data, thunkAPI) => {
//     switch (data?.socialMediaType) {
//         case "FACEBOOK": {
//             const profile_view_url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights/page_views_total?` + objectToQueryString(data.query);
//             return await baseAxios.get(profile_view_url).then(res => {
//                 return getFormattedInsightsForProfileViews(res.data || {}, "FACEBOOK");
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//         case "INSTAGRAM": {
//             const profile_view_url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.pageId}/insights?` + objectToQueryString(data.query);
//             return await baseAxios.get(profile_view_url).then(res => {
//                 return getFormattedInsightsForProfileViews(res.data || {}, "INSTAGRAM");
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//         case "LINKEDIN": {
//             const profile_view_url = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/organizationPageStatistics?`+objectToQueryString(data.query);
//             return await baseAxios.get(profile_view_url,setAuthenticationHeader(getToken())).then(res => {
//                 return getFormattedInsightsForProfileViews(res.data || {}, "LINKEDIN");
//             }).catch(error => {
//                 showErrorToast(error.response.data.error.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             });
//         }
//
//         default: {
//             return {};
//         }
//
//     }
//
//
// });

//   pinterest pin click graph data

// export const pinterestPinClick = createAsyncThunk("insight/pinterestPinClick",
//     async (data, thunkAPI) => {
//
//         let apiurl=`${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest(data?.day)}&end_date=${getDatesForPinterest("now")}`
//       return await axios
//         .get(apiurl,setAuthenticationHeader(data?.token))
//         .then((res) => {
//           return res;
//         })
//         .catch((error) => {
//
//           return thunkAPI.rejectWithValue(error.response);
//         });
//     }
//   );


//   new enagagement code starts here

// export const postEngagement = createAsyncThunk("insight/postEngagement", async (data, thunkAPI) => {
//         console.log(data,"data?.since")
//         switch(data?.socialMediaType){
//             case "FACEBOOK": {
//                 let apiurl=`https://graph.facebook.com/v17.0/${data?.pageId}/insights/page_post_engagements?access_token=${data?.token}&since=${generateUnixTimestampFor(data?.since)}&until=${data?.until}&period=day`
//
//                 return await axios
//                   .get(apiurl,setAuthenticationHeader(data.token))
//                   .then((res) => {
//
//                     return res;
//                   })
//                   .catch((error) => {
//
//                     return thunkAPI.rejectWithValue(error.response);
//                   });
//             }
//             case "PINTEREST": {
//                 let apiurl=`${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/user_account/analytics?start_date=${getDatesForPinterest(data?.day)}&end_date=${getDatesForPinterest("now")}`
//             return await axios
//            .get(apiurl,setAuthenticationHeader(data?.token))
//            .then((res) => {
//
//           return res;
//         })
//         .catch((error) => {
//
//           return thunkAPI.rejectWithValue(error.response);
//         });
//             }
//             case "LINKEDIN": {
//
//         const apiurl=`${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/insight-graph/${data?.pageId}?q=organizationalEntity&startDate=${data?.since}&endDate=${data?.until}&timeGranularityType=DAY`;
//         return await axios
//           .get(apiurl,setAuthenticationHeader(data?.token))
//           .then((res) => {
//
//             return res?.data?.elements;
//           })
//           .catch((error) => {
//
//             return thunkAPI.rejectWithValue(error.response);
//           });
//             }
//         }
//     });