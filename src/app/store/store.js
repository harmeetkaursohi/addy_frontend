import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice.js";
import thunk from 'redux-thunk';
import logger from 'redux-logger';


const rootReducers = combineReducers({
    users: userSlice,
})

const store = configureStore({
    reducer: rootReducers,
    middleware: [logger, thunk]
});

export default store;