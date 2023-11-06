import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAuthenticationHeader, setAuthenticationHeaderWithMultipart} from "../../auth/auth.js";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";
import {getFacebookConnectedPageIdsReport} from "../../../services/facebookService";
import {baseAxios, parseComments} from "../../../utils/commonUtils";
import {UpdateCommentFailedMsg} from "../../../utils/contantData";

export const addCommentOnPostAction = createAsyncThunk('post/addCommentOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?&access_token=${data?.pageAccessToken}`;
            return baseAxios.post(apiUrl, data?.data).then((response) => {
                return response.data;
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
export const getCommentsOnPostAction = createAsyncThunk('post/getCommentsOnPostAction', async (data, thunkAPI) => {
    switch (data?.socialMediaType) {

        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}/comments?access_token=${data?.pageAccessToken}&fields=id,like_count,user_likes,can_like,message,can_remove,from{id,name,picture},parent,to,created_time,attachment,comment_count,can_comment,message_tags`;
            return baseAxios.get(apiUrl, null).then((response) => {
                return parseComments(data?.socialMediaType,response.data,data?.hasParentComment,data.hasParentComment?data.parentComments:[]);
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
        case "FACEBOOK": {
            const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/${data.id}?access_token=${data?.pageAccessToken}`;
            return baseAxios.delete(apiUrl, null).then((response) => {
                return response.data;
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
    const postIds = data.postIds.map(id => id).join(',');
    const apiUrl = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/?ids=${postIds}&access_token=${data?.pageAccessToken}&fields=id,message,attachments,created_time,is_published,likes.summary(true),comments.summary(true),shares`;
    return await baseAxios.get(apiUrl).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getPostsPageAction = createAsyncThunk('post/getPostsPageAction', async (data, thunkAPI) => {

    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/reviews`, data, setAuthenticationHeader(data.token)).then(res => {
        console.log('res.datares.datares.data',res.data)
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
    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/publish/${data?.batchId}`, null, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const deletePostByBatchIdAction = createAsyncThunk('post/deletePostByBatchIdAction', async (data, thunkAPI) => {
    return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data?.batchId}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const updatePostOnSocialMediaAction = createAsyncThunk('post/updatePostOnSocialMediaAction', async (data, thunkAPI) => {

    const formData = new FormData();

    // Create a FormData object to hold the data.
    formData.append('caption', data.updatePostRequestDTO.caption);
    formData.append('hashTag', data.updatePostRequestDTO.hashTag);
    formData.append('boostPost', data.updatePostRequestDTO.boostPost);
    formData.append('postStatus', data.updatePostRequestDTO.postStatus);

    if (data.updatePostRequestDTO.scheduleDate!==null) {
        formData.append('scheduleDate', data.updatePostRequestDTO.scheduleDate);
    }

    data.updatePostRequestDTO.pageIds.forEach((pageId, index) => {
        formData.append(`pageIds[${index}]`, pageId);
    });


    if (data.updatePostRequestDTO.attachments.length > 0) {
        data.updatePostRequestDTO.attachments.forEach((attachment, index) => {
            if (attachment?.file !== null && attachment?.file !== "null") {
                formData.append(`attachments[${index}].file`, attachment?.file);
                formData.append(`attachments[${index}].mediaType`, attachment?.file.type.includes("image") ? "IMAGE":"VIDEO");
            }
        });
    }

    // Iterate through the FormData entries and log them to the console
    for (const entry of formData.entries()) {
        const [key, value] = entry;
        console.log("entries", `${key}: ${value}`);
    }
    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.batchId}`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getAllPostsByBatchIdAction = createAsyncThunk('post/getAllPostsByBatchIdAction', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/batch/${data.batchId}`, setAuthenticationHeader(data.token)).then(res => {
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
    formData.append('caption', data.postRequestDto.caption);
    formData.append('hashTag', data.postRequestDto.hashTag);
    formData.append('boostPost', data.postRequestDto.boostPost);
    formData.append('postStatus', data.postRequestDto.postStatus);

    if (data.postRequestDto.scheduleDate) {
        formData.append('scheduleDate', data.postRequestDto.scheduleDate);
    }

    data.postRequestDto.pageIds.forEach((pageId, index) => {
        formData.append(`pageIds[${index}]`, pageId);
    });

    // Loop through the attachments array and append each attachment's data.
    data.postRequestDto.attachments.forEach((attachment, index) => {
        console.log("attachment.file",attachment.file)
        formData.append(`attachments[${index}].mediaType`, attachment.mediaType);
        formData.append(`attachments[${index}].file`, attachment.file);
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
        response_format:imageRequestBody.response_format
    }
    return await baseAxios.post(`${import.meta.env.VITE_APP_AI_GENERATE_IMAGE_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}


export const generateAICaptionAndHashTagService = async (requestBody) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}