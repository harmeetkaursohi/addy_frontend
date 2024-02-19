
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthenticationHeaderWithMultipart } from "../../auth/auth";
import { baseAxios } from "../../../utils/commonUtils";

export const changeProfile = createAsyncThunk('userProfile/changeProfile', async (data, thunkAPI) => {
    console.log(data,"data00")
    const apiUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/customers/profile-pic`;
    return baseAxios.post(apiUrl,data.formdata ,setAuthenticationHeaderWithMultipart(data.token) ).then((response) => {
        return response.data;
    }).catch((error) => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.message);
    });
});