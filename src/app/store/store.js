import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice.js";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import facebookSlice from "../slices/facebookSlice/facebookSlice.js";
import socialAccountSlice from "../slices/socialAccountSlice/socialAccountSlice.js";
import postSlice from "../slices/postSlice/postSlice.js";
import insightSlice from "../slices/insightSlice/insightSlice";
import notificationSlice from "../slices/notificationSlice/notificationSlice";
import pageAccessTokenSlice from "../slices/pageAccessTokenSlice/pageAccessTokenSlice";
import webSlice from "../slices/webSlice/webSlice";
import {resetReducers} from "../actions/commonActions/commonActions";
import chatSlice from "../slices/chatSlice/chatSlice";
import {addyApi} from "../addyApi";


const rootReducers = combineReducers({
    // user: userSlice,
    facebook: facebookSlice,
    pageAccessToken: pageAccessTokenSlice,
    socialAccount: socialAccountSlice,
    post: postSlice,
    insight: insightSlice,
    // web: webSlice,
    notification: notificationSlice,
    reset: resetReducers,
    chat:chatSlice,
    [addyApi.reducerPath]: addyApi.reducer,

})

const rootReducer = (state, action) => {
    // console.log("state====>",state)
    if (action.type === resetReducers.type) {
        const {sliceNames} = action.payload;
        let newState = {...state};

        Object.keys(newState).forEach(curKey => {
            Object.keys(newState[curKey]).forEach(curReducer => {
                if (sliceNames.includes(curReducer)) {
                    newState[curKey] = {
                        ...newState[curKey],
                        [curReducer]: {loading: false}
                    };
                }
            });
        });
        return newState;
    }

    return rootReducers(state, action);
};

const store = configureStore({
    reducer: rootReducer,
    // middleware: [logger, thunk]
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(addyApi.middleware)
        // getDefaultMiddleware().concat(addyApi.middleware).concat(logger).concat(thunk)
});


export default store;
