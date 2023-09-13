import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice.js";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import facebookSlice from "../slices/facebookSlice/facebookSlice.js";
import socialAccountSlice from "../slices/socialAccountSlice/socialAccountSlice.js";
import postSlice from "../slices/postSlice/postSlice.js";


const rootReducers = combineReducers({
    user: userSlice,
    facebook: facebookSlice,
    socialAccount: socialAccountSlice,
    post: postSlice
})

const store = configureStore({
    reducer: rootReducers,
    middleware: [logger, thunk]
});

export default store;