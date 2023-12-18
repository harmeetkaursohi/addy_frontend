import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice/userSlice.js";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import facebookSlice from "../slices/facebookSlice/facebookSlice.js";
import linkedinSlice from "../slices/linkedinSlice/linkedinSlice";
import socialAccountSlice from "../slices/socialAccountSlice/socialAccountSlice.js";
import postSlice from "../slices/postSlice/postSlice.js";
import {resetReducers} from "../actions/commonActions/commonActions";


const rootReducers = combineReducers({
    user: userSlice,
    facebook: facebookSlice,
    linkedin:linkedinSlice,
    socialAccount: socialAccountSlice,
    post: postSlice,
    reset: resetReducers

})


//reset reducer mechanism...
const rootReducer = (state, action) => {

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
    middleware: [logger, thunk]
});


export default store;