import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseAxios} from "../../../utils/commonUtils";
import {showErrorToast} from "../../../features/common/components/Toast";

export const list = createAsyncThunk('faq/list', async (data, thunkAPI) => {
    return await baseAxios.get(`${import.meta.env.VITE_APP_CMS_API_BASE_URL}faq?per_page=1&page=${data.page}&search=${data.search}`).then(res => {
        const linkHeader = res.headers.link;                
        return {hasNextPage:(linkHeader && linkHeader.includes('rel="next"')),dataList:res.data};
    }).catch(error => {
        showErrorToast(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response);
    });

});
