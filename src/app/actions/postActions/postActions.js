import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAuthenticationHeader, setAuthenticationHeaderWithMultipart} from "../../auth/auth.js";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";
import {getFacebookConnectedPageIdsReport} from "../../../services/facebookService";
import {baseAxios, isErrorInInstagramMention} from "../../../utils/commonUtils";
import {CouldNotPostComment, SocialAccountProvider, UpdateCommentFailedMsg} from "../../../utils/contantData";

export const addCommentOnPostAction = createAsyncThunk('post/addCommentOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case "FACEBOOK":
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?&access_token=${data?.pageAccessToken}`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(isErrorInInstagramMention(data?.socialMediaType, error) ? CouldNotPostComment : error.response.data.error.message);
                return thunkAPI.rejectWithValue(error.message);
            });

        }
        case  "LINKEDIN": {

        }
        default : {

        }

    }

});
export const replyCommentOnPostAction = createAsyncThunk('post/replyCommentOnPostAction', async (data, thunkAPI) => {
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/replies?access_token=${data?.pageAccessToken}`;
    return baseAxios.post(apiUrl, data?.data).then((response) => {
        return response.data.data;
    }).catch((error) => {
        showErrorToast(isErrorInInstagramMention(data?.socialMediaType, error) ? CouldNotPostComment : error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.message);
    });


});
export const getCommentsOnPostAction = createAsyncThunk('post/getCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?access_token=${data?.pageAccessToken}&order=reverse_chronological&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,to,created_time,attachment,comment_count,can_comment,message_tags,comments{id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,to,created_time,attachment,comment_count,can_comment,message_tags}`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return response?.data
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.message);
            });

        }
        case  "INSTAGRAM": {

        }
        case  "LINKEDIN": {

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
            break;
        }
        case  "LINKEDIN": {

        }
        default : {

        }

    }


});
export const updateCommentsOnPostAction = createAsyncThunk('post/updateCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}?access_token=${data?.pageAccessToken}`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
            }).catch((error) => {
                showErrorToast(UpdateCommentFailedMsg);
                return thunkAPI.rejectWithValue(error.message);
            });

        }
        case  "INSTAGRAM": {

        }
        case  "LINKEDIN": {

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
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,attachments,created_time,is_published,likes.summary(true),comments.summary(true),shares`;
            return await baseAxios.get(apiUrl).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
            break;
        }
        case  "INSTAGRAM": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data?.postIds[0]}?access_token=${data?.pageAccessToken}&fields=id,caption,is_comment_enabled,comments_count,like_count,media_type,media_url,thumbnail_url,permalink,timestamp,username,children{id,media_type,media_url,thumbnail_url},comments{id,text,timestamp,like_count,from,user{profile_picture_url},replies{id,text,from,timestamp,like_count,parent_id}}`;
            return await baseAxios.get(apiUrl).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
            break;
        }
        case  "PINTEREST": {
            const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/pin-insights?ids=${data?.postIds[0]}`;
            return await baseAxios.get(apiUrl,setAuthenticationHeader(data?.token)).then(res => {
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
            break;
        }
        case  "LINKEDIN": {

        }
        default : {

        }

    }

});

export const getPostsPageAction = createAsyncThunk('post/getPostsPageAction', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/reviews`, data, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});

export const getAllPlannerPostAction = createAsyncThunk('post/getAllPlannerPostAction', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/by-criteria`, data?.query, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const publishedPostAction = createAsyncThunk('post/publishedPostAction', async (data, thunkAPI) => {
    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/publish/${data?.postId}`, null, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const deletePostByBatchIdAction = createAsyncThunk('post/deletePostByBatchIdAction', async (data, thunkAPI) => {
    return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data?.postId}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const updatePostOnSocialMediaAction = createAsyncThunk('post/updatePostOnSocialMediaAction', async (data, thunkAPI) => {

    const formData = new FormData();

    console.log("updatePostRequestDTO---->", data);

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
    if (data.updatePostRequestDTO.postPageInfos?.some(pageInfo => pageInfo?.socialMediaType === SocialAccountProvider.PINTEREST.toUpperCase())) {
        formData.append('pinTitle', data.updatePostRequestDTO.pinTitle);
        formData.append('pinDestinationUrl', data.updatePostRequestDTO.destinationUrl);
    }

    data.updatePostRequestDTO.postPageInfos.forEach((pageInfo, index) => {
        formData.append(`postPageInfos[${index}].pageId`, pageInfo?.pageId);
        formData.append(`postPageInfos[${index}].socialMediaType`, pageInfo?.socialMediaType);
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


    // Iterate through the FormData entries and log them to the console
    for (const entry of formData.entries()) {
        const [key, value] = entry;
        console.log("entries", `${key}: ${value}`);
    }

    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.id}`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getPostsByIdAction = createAsyncThunk('post/getPostsByIdAction', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.id}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getAllPostsForPlannerAction = createAsyncThunk('post/getAllPostsForPlannerAction', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner`, data?.query, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getAllSocialMediaPostsByCriteria = createAsyncThunk('post/getAllSocialMediaPostsByCriteria', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/by-criteria`, data?.query, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const getPlannerPostCountAction = createAsyncThunk('get/getPlannerPostCountAction', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner-report`, data?.query, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const createFacebookPostAction = createAsyncThunk('post/createFacebookPostAction', async (data, thunkAPI) => {

    console.log("@@@@ RequestBody ::: ", data)

    const formData = new FormData();

    // Create a FormData object to hold the data.
    if (data.postRequestDto.caption !== null && data.postRequestDto.caption !== "null") {
        formData.append('caption', data.postRequestDto.caption);
    }
    if (data.postRequestDto.hashTag !== null && data.postRequestDto.hashTag !== "null") {
        formData.append('hashTag', data.postRequestDto.hashTag);
    }
    if (data.postRequestDto.postPageInfos?.some(pageInfo => pageInfo?.provider === SocialAccountProvider.PINTEREST.toUpperCase())) {
        formData.append('pinTitle', data.postRequestDto.pinTitle);
        formData.append('pinDestinationUrl', data.postRequestDto.destinationUrl);
    }

    formData.append('boostPost', data.postRequestDto?.boostPost);
    formData.append('postStatus', data.postRequestDto.postStatus);

    if (data.postRequestDto.scheduledPostDate) {
        formData.append('scheduledPostDate', data.postRequestDto.scheduledPostDate);
    }

    data.postRequestDto.postPageInfos.forEach((pageInfo, index) => {
        formData.append(`postPageInfos[${index}].pageId`, pageInfo?.pageId);
        formData.append(`postPageInfos[${index}].socialMediaType`, pageInfo?.provider);
    });


    // Loop through the attachments array and append each attachment's data.
    data.postRequestDto.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}].mediaType`, attachment?.mediaType);
        formData.append(`attachments[${index}].file`, attachment?.file);
    });

    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

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
export const getPostByPageIdAndPostStatus = createAsyncThunk('post/getPostByPageIdAndPostStatus', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/byPageAndStatus`, data?.requestBody, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});