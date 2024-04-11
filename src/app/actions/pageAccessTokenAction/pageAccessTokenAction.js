import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {setAuthenticationHeader} from "../../auth/auth";
import {showErrorToast} from "../../../features/common/components/Toast";

export const updatePageAccessTokenByIds = createAsyncThunk('pageAccessTokenSlice/updatePageAccessTokenByIds', async (data, thunkAPI) => {
    return await baseAxios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/pages?ids=${data?.ids}`, data.data, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });
})