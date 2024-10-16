import {combineReducers, configureStore} from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import globalSlice from "../globalSlice/globalSlice";
import {resetReducers} from "../actions/commonActions/commonActions";
import chatSlice from "../slices/chatSlice/chatSlice";
import {addyApi} from "../addyApi";


const rootReducers = combineReducers({
    reset: resetReducers,
    chat:chatSlice,
    global:globalSlice,
    [addyApi.reducerPath]: addyApi.reducer,

})

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
    // middleware: [logger, thunk]
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(addyApi.middleware).concat(thunk)
        // getDefaultMiddleware().concat(addyApi.middleware).concat(logger).concat(thunk)
});


export default store;
