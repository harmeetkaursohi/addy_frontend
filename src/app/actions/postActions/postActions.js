import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";

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
    return await axios.post(`${import.meta.env.VITE_APP_AI_GENERATE_IMAGE_URL}`, requestBody, setAuthenticationHeader(`Bearer ${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}


export const generateAICaptionAndHashTagService = async (requestBody) => {
    return await axios.post(`${import.meta.env.VITE_APP_AI_GENERATE_CAPTION_URL}`, requestBody, setAuthenticationHeader(`Bearer ${import.meta.env.VITE_APP_OPEN_API_SECRET_KEY}`))
}