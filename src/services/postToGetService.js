import {baseAxios} from "../utils/commonUtils";
import {showErrorToast} from "../features/common/components/Toast";
import {getAuthHeader, getAuthorizationHeader} from "../utils/RTKQueryUtils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAuthenticationHeader} from "../app/auth/auth";

const baseUrl=`${import.meta.env.VITE_APP_API_BASE_URL}`
// Planner Service
export const getPostsForPlanner=async (data)=>{
    try {
        const res=await baseAxios.post(`${baseUrl}/posts/planner`, data, getAuthHeader())
        return res.data;
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }
}
export const getPlannerPostsCount=async (data)=>{
    try {
        const res=await baseAxios.post(`${baseUrl}/posts/planner-report`, data, getAuthHeader())
        return res.data;
    } catch (error) {
        showErrorToast(error.response.data.error.message);
        throw error;
    }
}
export const getSocialMediaPostsByCriteria=async (data)=>{
    try {
        const res=await baseAxios.post(`${baseUrl}/posts/by-criteria`, data, getAuthHeader())
        return res.data;
    } catch (error) {
        showErrorToast(error.response.data.message);
        throw error;
    }
}
export const getPublishedPosts=async (data)=>{
    try {
        const res=await baseAxios.post(`${baseUrl}/posts/reviews`, data, getAuthHeader())
        return res.data;
    } catch (error) {
        showErrorToast(error.response.data.message);
        throw error;
    }
}
export const getPostByPageIdAndPostStatus=async (data)=>{
    return await baseAxios.post(`${baseUrl}/posts/byPageAndStatus`, data, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}
export const searchNotification=async (data)=>{
    return await baseAxios.post(`${baseUrl}/notification/search`, data,getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error
    });
}
export const searchMessage=async (data)=>{
    return await baseAxios.post(`${baseUrl}/chat/message/search`, data,getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error
    });
}