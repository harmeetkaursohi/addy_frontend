import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "../slices/authSlice"
const rootreducers=combineReducers({login: loginSlice})
const store = configureStore({
    reducer :rootreducers
})

export default store;