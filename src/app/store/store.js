import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice.js";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import facebookSlice from "../slices/facebookSlice/facebookSlice.js";


const rootReducers = combineReducers({
    user: userSlice,
    facebook: facebookSlice
})

const store = configureStore({
    reducer: rootReducers,
    middleware: [logger, thunk]
});

export default store;