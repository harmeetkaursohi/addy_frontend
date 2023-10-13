import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {showErrorToast} from "../../../features/common/components/Toast.jsx";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {getDashBoardFacebookGraphReport, getFacebookConnectedPageIdsReport} from "../../../services/facebookService";


export const socialAccountConnectActions = createAsyncThunk('socialAccount/socialAccountConnectActions', async (data, thunkAPI) => {
    return await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/connect`, data.socialAccountData, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
})

export const disconnectSocialAccountAction = createAsyncThunk('socialAccount/disconnectSocialAccountAction', async (data, thunkAPI) => {
    return await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/disconnect/${data.socialAccountId}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
})


export const getSocialMediaReportByProviderTypeAction = createAsyncThunk('socialAccount/getSocialMediaReportByProviderTypeAction', async (data, thunkAPI) => {

    console.log("reportSelectPages---->",data);

    switch (data?.socialAccountType) {

        case "FACEBOOK": {
              return await  getFacebookConnectedPageIdsReport(data?.pages).then((res)=>{
                  console.log("res getFacebookConnectedPageIdsReport---->",res);
                  return res;
              }).catch(error=>{
                  console.log("error---->",res);

                  showErrorToast(error.response.data.message);
                  return thunkAPI.rejectWithValue(error.response);
              })
        }
        case  "INSTAGRAM": {

        }
        case  "LINKEDIN": {

        }
        default : {

        }

    }


});




export const getSocialMediaGraphByProviderTypeAction = createAsyncThunk('socialAccount/getSocialMediaGraphByProviderTypeAction', async (data, thunkAPI) => {

    console.log("reportSelectPages---->",data);

    switch (data?.socialAccountType) {

        case "FACEBOOK": {
            return await  getDashBoardFacebookGraphReport(data?.pages || [],data?.query || {}).then((res)=>{
                console.log("res getDashBoardFacebookGraphReport---->",res);
                return res;
            }).catch(error=>{
                console.log("error---->",res);

                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            })
        }
        case  "INSTAGRAM": {

        }
        case  "LINKEDIN": {

        }
        default : {

        }

    }


});


export const getAllConnectedSocialAccountAction = createAsyncThunk('socialAccount/getAllConnectedSocialAccountAction', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});


export const findSocialAccountByProviderAndCustomerIdAction = createAsyncThunk('socialAccount/findSocialAccountByProviderAndCustomerIdAction', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account/findSocialAccountByProviderAndCustomerId/${data.customerId}?provider=${data.provider}`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});

export const getAllByCustomerIdAction = createAsyncThunk('socialAccount/getAllByCustomerIdAction', async (data, thunkAPI) => {
    return await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/social-account`, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});