import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAuthenticationHeader, setAuthenticationHeaderWithMultipart} from "../../auth/auth.js";
import {showErrorToast, showSuccessToast, showWarningToast} from "../../../features/common/components/Toast.jsx";
import {baseAxios, isErrorInInstagramMention, objectToQueryString} from "../../../utils/commonUtils";
import {CouldNotPostComment, SocialAccountProvider, UpdateCommentFailedMsg} from "../../../utils/contantData";

export const addCommentOnPostAction = createAsyncThunk('post/addCommentOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case "FACEBOOK":{
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,created_time,attachment,comment_count,can_comment,message_tags`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?&access_token=${data?.pageAccessToken}&fields=id,text,timestamp,like_count,from{id,username},user{id,profile_picture_url},replies`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(isErrorInInstagramMention( error) ? CouldNotPostComment : error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comment`;
            return baseAxios.post(apiUrl, {
                actor: data?.pageId,
                object: data?.id,
                text: data?.data?.message,
                parentObjectUrn: data?.id,
            }, setAuthenticationHeader(data?.token)).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }

});

export const replyCommentOnPostAction = createAsyncThunk('post/replyCommentOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK":{
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent{id},created_time,attachment,comment_count,can_comment,message_tags`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/replies?access_token=${data?.pageAccessToken}&fields=id,text,timestamp,like_count,from{id,username},user{id,profile_picture_url},parent_id`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(isErrorInInstagramMention( error) ? CouldNotPostComment : error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comment`;
            return baseAxios.post(apiUrl, {
                actor: data?.actor,
                object: data?.object,
                text: data?.message,
                parentComment: data?.parentComment,
                parentObjectUrn: data?.parentComment,
                attributes: data?.attributes,
            }, setAuthenticationHeader(data?.token)).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }
});


export const getCommentsOnPostAction = createAsyncThunk('post/getCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?${objectToQueryString({
                access_token:data?.pageAccessToken,
                order:"reverse_chronological",
                limit:data?.limit,
                fields:"id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,to,created_time,attachment,comment_count,can_comment,message_tags",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?${objectToQueryString({
                access_token:data?.pageAccessToken,
                limit:data?.limit,
                fields:"id,text,timestamp,like_count,from{id,username},user{profile_picture_url},replies{id}",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comments/${data.id}?pageSize=${data?.pageSize}&start=${data?.start}`;
            return baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }
});

export const getRepliesOnComment = createAsyncThunk('post/getRepliesOnComment', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK":{
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?${objectToQueryString({
                access_token:data?.pageAccessToken,
                order:"chronological",
                limit:data?.limit,
                fields:"id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent{id},to,created_time,attachment,comment_count,can_comment,message_tags",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/replies?${objectToQueryString({
                access_token:data?.pageAccessToken,
                limit:data?.limit,
                fields:"id,text,timestamp,like_count,from{id,username},user{profile_picture_url},parent_id",
                after:data?.next
            })}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comments/${data?.id}?pageSize=${data?.pageSize}&start=${data?.start}`;
            return baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {
        }
    }
});


export const deleteCommentsOnPostAction = createAsyncThunk('post/deleteCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case  "INSTAGRAM":
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}?access_token=${data?.pageAccessToken}`;
            return baseAxios.delete(apiUrl, null).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comment?commentId=${data?.commentId}&parentObjectUrn=${data?.parentObjectUrn}&orgId=${data?.orgId}`;
            return baseAxios.delete(apiUrl, setAuthenticationHeader(data?.token)).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {

        }
    }
});
export const updateCommentsOnPostAction = createAsyncThunk('post/updateCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,created_time,attachment,comment_count,can_comment,message_tags`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(UpdateCommentFailedMsg);
                return thunkAPI.rejectWithValue(error.message);
            });

        }
        case  "INSTAGRAM": {
            break;
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/comment/${data?.commentId}`;
            return baseAxios.put(apiUrl, {
                text: data?.text,
                actor: data?.actor,
                parentObjectUrn: data?.parentObjectUrn,
                attributes: data?.attributes,
            }, setAuthenticationHeader(data?.token)).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });
        }
        default : {

        }

    }


});


export const dislikePostAction = createAsyncThunk('post/dislikePostAction', async (data, thunkAPI) => {
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.postId}/likes?access_token=${data?.pageAccessToken}`;
    return baseAxios.delete(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
    });
});

export const likePostAction = createAsyncThunk('post/likePostAction', async (data, thunkAPI) => {
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.postId}/likes?access_token=${data?.pageAccessToken}`;
    return baseAxios.post(apiUrl, null).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
    });
});


export const getPostPageInfoAction = createAsyncThunk('post/getPostPageInfoAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK": {
            const postIds = data.postIds.map(id => id).join(',');
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,attachments,created_time,is_published,likes.summary(true).limit(2),reactions.summary(true).limit(2),comments.summary(true).limit(1){id},shares`;
            return await baseAxios.get(apiUrl).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.postIds[0]}?access_token=${data?.pageAccessToken}&fields=id,caption,is_comment_enabled,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url}`;
            return await baseAxios.get(apiUrl).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case  "PINTEREST": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/pin-insights?ids=${data?.postIds[0]}`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        case  "LINKEDIN": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/socialActions/${data?.postIds[0]}`;
            return await baseAxios.get(apiUrl, setAuthenticationHeader(data?.token)).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
        default : {

        }

    }

});

// export const getPostsPageAction = createAsyncThunk('post/getPostsPageAction', async (data, thunkAPI) => {
//     console.log("data--->", data)
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/reviews`, data, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
//
// });

// export const getAllPlannerPostAction = createAsyncThunk('post/getAllPlannerPostAction', async (data, thunkAPI) => {
//     console.log("here it is requiring")
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/by-criteria`, data?.query, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });


// export const publishedPostAction = createAsyncThunk('post/publishedPostAction', async (data, thunkAPI) => {
//     return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/publish/${data?.postId}`, null, setAuthenticationHeader(data.token)).then(res => {
//         if (res?.data?.every(c => !c.success)) {
//             showErrorToast("Post encountered with an issue. Currently saved as a draft.");
//         } else if (res?.data?.every(c => c.success)) {
//             showSuccessToast("Post has been successfully shared to the chosen platform.");
//         } else {
//             showWarningToast(`Post successfully on ${res?.data?.filter(c => c.success)?.map(c => c.pageName).join(" , ")} and failed to post on ${res?.data?.filter(c => !c.success)?.map(c => c.pageName).join(" , ")}`)
//         }
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });


// export const deletePostByBatchIdAction = createAsyncThunk('post/deletePostByBatchIdAction', async (data, thunkAPI) => {
//     return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data?.postId}`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const deletePostFromPage = createAsyncThunk('post/deletePostFromPage', async (data, thunkAPI) => {
//     return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/posts?postId=${data?.postId}&pageIds=${data.pageIds.map(id => id).join(',')}`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });


export const updatePostOnSocialMediaAction = createAsyncThunk('post/updatePostOnSocialMediaAction', async (data, thunkAPI) => {

    const formData = new FormData();

    // Create a FormData object to hold the data.
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

    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.id}`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {

        if (data.updatePostRequestDTO.postStatus === "DRAFT") {
            showSuccessToast("Post has been put to draft successfully");
        }
        if (data.updatePostRequestDTO.postStatus === "SCHEDULED") {
            showSuccessToast("Post planned successfully");
        }
        if (data.updatePostRequestDTO.postStatus === "PUBLISHED") {
            if (res?.data?.every(c => !c.success)) {
                showErrorToast("Post encountered with an issue. Currently saved as a draft.");
            } else if (res?.data?.every(c => c.success)) {
                showSuccessToast("Post has been successfully shared to the chosen platform.");
            } else {
                showWarningToast(`Post successfully on ${res?.data?.filter(c => c.success)?.map(c => c.pageName).join(" , ")} and failed to post on ${res?.data?.filter(c => !c.success)?.map(c => c.pageName).join(" , ")}`)
            }
        }
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

// export const getPostsByIdAction = createAsyncThunk('post/getPostsByIdAction', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.id}`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const getAllPostsForPlannerAction = createAsyncThunk('post/getAllPostsForPlannerAction', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner`, data?.query, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const getAllSocialMediaPostsByCriteria = createAsyncThunk('post/getAllSocialMediaPostsByCriteria', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/by-criteria`, data?.query, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });


// export const getPlannerPostCountAction = createAsyncThunk('get/getPlannerPostCountAction', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner-report`, data?.query, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });


// export const createFacebookPostAction = createAsyncThunk('post/createFacebookPostAction', async (data, thunkAPI) => {
//
//     const formData = new FormData();
//
//     // Create a FormData object to hold the data.
//     if (data.postRequestDto.caption !== null && data.postRequestDto.caption !== "null") {
//         formData.append('caption', data.postRequestDto.caption);
//     }
//     if (data.postRequestDto.hashTag !== null && data.postRequestDto.hashTag !== "null") {
//         formData.append('hashTag', data.postRequestDto.hashTag);
//     }
//     if (data.postRequestDto.postPageInfos?.some(pageInfo => pageInfo?.provider === SocialAccountProvider.PINTEREST.toUpperCase())) {
//         formData.append('pinTitle', data.postRequestDto.pinTitle);
//         formData.append('pinDestinationUrl', data.postRequestDto.destinationUrl);
//     }
//
//     formData.append('boostPost', data.postRequestDto?.boostPost);
//     formData.append('postStatus', data.postRequestDto.postStatus);
//
//     if (data.postRequestDto.scheduledPostDate) {
//         formData.append('scheduledPostDate', data.postRequestDto.scheduledPostDate);
//     }
//
//     data.postRequestDto.postPageInfos.forEach((pageInfo, index) => {
//         formData.append(`postPageInfos[${index}].pageId`, pageInfo?.pageId);
//         formData.append(`postPageInfos[${index}].socialMediaType`, pageInfo?.provider);
//     });
//
//
//     // Loop through the attachments array and append each attachment's data.
//     data.postRequestDto.attachments.forEach((attachment, index) => {
//         formData.append(`attachments[${index}].mediaType`, attachment?.mediaType);
//         formData.append(`attachments[${index}].file`, attachment?.file);
//     });
//
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
//         if (data.postRequestDto.postStatus === "DRAFT") {
//             showSuccessToast("Post has been put to draft successfully");
//         }
//         if (data.postRequestDto.postStatus === "SCHEDULED") {
//             showSuccessToast("Post planned successfully");
//         }
//         if (data.postRequestDto.postStatus === "PUBLISHED") {
//             if (res?.data?.every(response => !response.success)) {
//                 showErrorToast("Post encountered with an issue. Currently saved as a draft.");
//             } else if (res?.data?.every(response => response.success)) {
//                 showSuccessToast("Post has been successfully shared to the chosen platform.");
//             } else {
//                 showWarningToast(`Post successfully on ${res?.data?.filter(response => response.success)?.map(res => res.pageName).join(" , ")} and failed to post on ${res?.data?.filter(response => !response.success)?.map(res => res.pageName).join(" , ")}`)
//             }
//         }
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

export const generateAIImageAction = createAsyncThunk('post/generateAIImageAction', async (data, thunkAPI) => {
    return generateAIImageService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    })
});

export const generateAICaptionAction = createAsyncThunk('post/generateAICaptionAction', async (data, thunkAPI) => {
    return generateAICaptionAndHashTagService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error);
    })
});

export const generateAIHashTagAction = createAsyncThunk('post/generateAIHashTagAction', async (data, thunkAPI) => {
    return generateAICaptionAndHashTagService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    })
});

export const generateAIImageService = async (imageRequestBody) => {
    const requestBody = {
        prompt: imageRequestBody.prompt,
        n: imageRequestBody.noOfImg,
        size: imageRequestBody.imageSize,
        response_format: imageRequestBody.response_format
    }
    return await baseAxios.post(`${import.meta.env.VITE_APP_AI_GENERATE_IMAGE_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}


export const generateAICaptionAndHashTagService = async (requestBody) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}
// export const getPostByPageIdAndPostStatus = createAsyncThunk('post/getPostByPageIdAndPostStatus', async (data, thunkAPI) => {
//     if (data?.insightPostsCache?.getPostByPageIdAndPostStatusDataCache[data?.requestBody?.pageNumber] === undefined) {
//         return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/byPageAndStatus`, data?.requestBody, setAuthenticationHeader(data.token)).then(res => {
//             return {...res.data, data: {...res.data.data[0]}};
//         }).catch(error => {
//             showErrorToast(error.response.data.message);
//             return thunkAPI.rejectWithValue(error.response);
//         });
//     } else {
//         return data.insightPostsCache.getPostByPageIdAndPostStatusDataCache[data?.requestBody?.pageNumber]
//     }
// });




