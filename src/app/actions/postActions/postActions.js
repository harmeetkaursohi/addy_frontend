import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {setAuthenticationHeader, setAuthenticationHeaderWithMultipart} from "../../auth/auth.js";
import {showErrorToast, showSuccessToast} from "../../../features/common/components/Toast.jsx";

export const createFacebookPostAction = createAsyncThunk('post/createFacebookPostAction', async (data, thunkAPI) => {
    console.log("createFacebookPostAction", data)

    const formData = new FormData();
    formData.append('caption', data.postRequestDto.caption);
    formData.append('hashTag', data.postRequestDto.hashTag);
    formData.append('boostPost', data.postRequestDto.boostPost);
    formData.append('scheduleDate', data.postRequestDto.scheduleDate);
    formData.append('attachments[0].mediaType', data.postRequestDto.attachments[0].mediaType);
    formData.append('attachments[0].file', data.postRequestDto.attachments[0].file);
    formData.append('attachments[0].pageId', data.postRequestDto.attachments[0].pageId);

    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/${data.customerId}`, formData, setAuthenticationHeaderWithMultipart(data.token)).then(res => {
        return res.data;
        showSuccessToast("Post Uploaded Success")
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