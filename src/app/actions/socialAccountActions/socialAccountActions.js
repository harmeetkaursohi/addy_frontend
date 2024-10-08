import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {
    getDashBoardFacebookGraphReport,
} from "../../../services/facebookService";
import {
    getDashBoardInstagramGraphReport,
} from "../../../services/instagramService";
import { getInstagramBusinessAccounts} from "../../../utils/dataFormatterUtils";
import {baseAxios} from "../../../utils/commonUtils";
import {getDashBoardPinterestGraphReport} from "../../../services/pinterestService";
import {getDashBoardLinkedinGraphReport} from "../../../services/linkedinService";


// export const socialAccountConnectActions = createAsyncThunk('socialAccount/socialAccountConnectActions', async (data, thunkAPI) => {
//     return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account`, data.socialAccountData, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         error.response.data.status!=="409" && showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// })

// export const getAllConnectedSocialAccountAction = createAsyncThunk('socialAccount/getAllConnectedSocialAccountAction', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// });

// export const disconnectSocialAccountAction = createAsyncThunk('socialAccount/disconnectSocialAccountAction', async (data, thunkAPI) => {
//     return await baseAxios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/${data.socialMediaAccountId}`, setAuthenticationHeader(data.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// })
// export const getAllInstagramBusinessAccounts = createAsyncThunk('socialAccount/getAllInstagramBusinessAccounts', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/me/accounts?access_token=${data.accessToken}&fields=instagram_business_account{id,name,username,profile_picture_url},id`).then(res => {
//         return getInstagramBusinessAccounts(res.data.data);
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// })

// export const getAllPinterestBoards = createAsyncThunk('socialAccount/getAllPinterestBoards', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/pinterest/boards/${data?.socialMediaAccountId}`,setAuthenticationHeader(data?.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// })
// export const getAllLinkedinPages = createAsyncThunk('socialAccount/getAllLinkedinPages', async (data, thunkAPI) => {
//     return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/linkedin/organizationAcls?q=${data?.q}&role=${data?.role}&state=${data?.state}`,setAuthenticationHeader(data?.token)).then(res => {
//         return res.data;
//     }).catch(error => {
//         showErrorToast(error.response.data.message);
//         return thunkAPI.rejectWithValue(error.response);
//     });
// })


// export const getSocialMediaReportByProviderTypeAction = createAsyncThunk('socialAccount/getSocialMediaReportByProviderTypeAction', async (data, thunkAPI) => {
//
//     switch (data?.socialMediaType) {
//
//         case "FACEBOOK": {
//               return await  getFacebookConnectedPageIdsReport(data?.pages).then((res)=>{
//                   return res;
//               }).catch(error=>{
//                   showErrorToast(error.response.data.message);
//                   return thunkAPI.rejectWithValue(error.response);
//               })
//         }
//         case  "INSTAGRAM": {
//             return await  getInstagramConnectedPageIdsReport(data?.pages[0]).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         case  "LINKEDIN": {
//             return await  getLinkedinAccountReport(data?.pages[0],data?.token).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         case  "PINTEREST": {
//             return await  getPinterestAccountReport(data?.pages[0],data?.token).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         default : {
//
//         }
//
//     }
//
//
// });




// export const getSocialMediaGraphByProviderTypeAction = createAsyncThunk('socialAccount/getSocialMediaGraphByProviderTypeAction', async (data, thunkAPI) => {
//
//     switch (data?.socialMediaType) {
//         case "FACEBOOK": {
//             return await  getDashBoardFacebookGraphReport(data?.pages || [],data?.query || {}).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         case  "INSTAGRAM": {
//             return await  getDashBoardInstagramGraphReport(data?.pages[0] ,data?.query || {}).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         case  "PINTEREST": {
//             return await  getDashBoardPinterestGraphReport(data?.pages[0] ,data?.query || {},data?.token).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//         }
//         case  "LINKEDIN": {
//             return await  getDashBoardLinkedinGraphReport(data?.pages[0] ,data?.query || {},data?.token).then((res)=>{
//                 return res;
//             }).catch(error=>{
//                 showErrorToast(error.response.data.message);
//                 return thunkAPI.rejectWithValue(error.response);
//             })
//
//         }
//         default : {
//
//         }
//
//     }
//
//
// });


export const findSocialAccountByProviderAndCustomerIdAction = createAsyncThunk('socialAccount/findSocialAccountByProviderAndCustomerIdAction', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/findSocialAccountByProviderAndCustomerId/${data.customerId}?provider=${data.provider}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getAllByCustomerIdAction = createAsyncThunk('socialAccount/getAllByCustomerIdAction', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});
