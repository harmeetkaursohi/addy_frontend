import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {setAuthenticationHeader, setAuthenticationHeaderWithMultipart} from "../../auth/auth.js";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";

export const createFacebookPostAction = createAsyncThunk('post/createFacebookPostAction', async (data, thunkAPI) => {
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
        formData.append(`attachments[${index}].mediaType`, attachment.mediaType);
        formData.append(`attachments[${index}].file`, attachment.file);
    });

    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.customerId}`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
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
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
});

export const generateAICaptionAction = createAsyncThunk('post/generateAICaptionAction', async (data, thunkAPI) => {
    return generateAICaptionAndHashTagService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
});

export const generateAIHashTagAction = createAsyncThunk('post/generateAIHashTagAction', async (data, thunkAPI) => {
    return generateAICaptionAndHashTagService(data).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    })
});

export const generateAIImageService = async (imageRequestBody) => {
    const requestBody = {
        prompt: imageRequestBody.prompt,
        n: imageRequestBody.noOfImg,
        size: imageRequestBody.imageSize
    }
    return await axios.post(`${import.meta.env.VITE_APP_AI_GENERATE_IMAGE_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}


export const generateAICaptionAndHashTagService = async (requestBody) => {
    return await axios.post(`${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`, requestBody, setAuthenticationHeader(`${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}