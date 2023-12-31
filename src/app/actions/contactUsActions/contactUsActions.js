import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {setAuthenticationHeader} from "../../auth/auth";
import {showErrorToast} from "../../../features/common/components/Toast";

export const addContactUsActions = createAsyncThunk('facebook/addContactUsActions', async (data, thunkAPI) => {
    return await baseAxios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/contactUs`, data.contactUs, setAuthenticationHeader(data.token)).then(res => {
        return res.data;
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});
