import {createAsyncThunk} from "@reduxjs/toolkit";
import {showErrorToast} from "../../../features/common/components/Toast";
import {setAuthenticationHeader} from "../../auth/auth.js";
import {baseAxios} from "../../../utils/commonUtils.js";

export const getAllPagesIds = createAsyncThunk('linkedin/getAllPagesIds', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_PROXY_SERVER_URL}`+`${import.meta.env.VITE_APP_LINKEDIN_BASE_URL}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`, setAuthenticationHeader(data?.accessToken)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.error.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});
export const getAllLinkedinPages = createAsyncThunk('linkedin/getAllLinkedinPages', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_PROXY_SERVER_URL}`+`${import.meta.env.VITE_APP_LINKEDIN_BASE_URL}/organizations?ids=List(${data.orgIds})&projection=(results(*(localizedName,logoV2(original~:playableStreams,cropped~:playableStreams,cropInfo))))`, setAuthenticationHeader(data?.accessToken)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
});