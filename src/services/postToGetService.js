import {baseAxios} from "../utils/commonUtils";
import {showErrorToast} from "../features/common/components/Toast";
import {getAuthHeader} from "../utils/RTKQueryUtils";


// Planner Service
export const getPostsForPlanner=async (data)=>{
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner`, data, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}
export const getPlannerPostsCount=async (data)=>{
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/planner-report`, data, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}
export const getSocialMediaPostsByCriteria=async (data)=>{
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/posts/by-criteria`, data, getAuthHeader()).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        throw error;
    });
}
