import {createSlice} from '@reduxjs/toolkit'
import {
    generateAIImageAction,
    generateAIHashTagAction,
    generateAICaptionAction,
    createFacebookPostAction,
    getAllPostsForPlannerAction,
    getPostsByIdAction,
    updatePostOnSocialMediaAction,
    getPlannerPostCountAction,
    deletePostByBatchIdAction,
    publishedPostAction,
    getAllPlannerPostAction,
    getPostsPageAction,
    getAllSocialMediaPostsByCriteria,
    getPostPageInfoAction,
    likePostAction,
    replyCommentOnPostAction,
    dislikePostAction,
    addCommentOnPostAction,
    getCommentsOnPostAction,
    deleteCommentsOnPostAction,
    updateCommentsOnPostAction,
    getPostByPageIdAndPostStatus,
    getRepliesOnComment
} from "../../actions/postActions/postActions.js";


const postSlice = createSlice({
    name: 'post',
    initialState: {
        generateAIImageReducer: {loading: false},
        generateAIHashTagReducer: {loading: false},
        generateAICaptionReducer: {loading: false},
        createFacebookPostActionReducer: {loading: false},
        getAllPostsForPlannerReducer: {loading: false},
        getPostsByIdReducer: {loading: false},
        updatePostOnSocialMediaReducer: {loading: false},
        getPlannerPostCountReportReducer: {loading: false},
        getAllDraftPostsByCustomerAndPeriodReducer: {loading: false},
        publishedPostReducer: {loading: false},
        deletePostByBatchIdReducer: {loading: false},
        getAllPlannerPostReducer: {loading: false},
        getPostsPageReducer: {loading: false},
        getPostPageInfoReducer: {loading: false},
        likePostReducer: {loading: false},
        dislikePostReducer: {loading: false},
        addCommentOnPostActionReducer: {loading: false},
        getCommentsOnPostActionReducer: {loading: false},
        deleteCommentsOnPostActionReducer: {loading: false},
        updateCommentsOnPostActionReducer:{loading: false},
        replyCommentOnPostActionReducer:{loading: false},
        getPostByPageIdAndPostStatusReducer:{loading: false},
        getRepliesOnCommentReducer:{loading: false},
    },

    reducers: {
        resetPublishedPostReducer: (state) => {
            state.publishedPostReducer = {loading: false, data: null}
        }
    },

    extraReducers: {

        // Start dis Likes
        [addCommentOnPostAction.pending]: (state) => {
            state.addCommentOnPostActionReducer = {loading: true}
        },
        [addCommentOnPostAction.fulfilled]: (state, action) => {
            state.addCommentOnPostActionReducer = {loading: false, data: action.payload}
        },
        [addCommentOnPostAction.rejected]: (state) => {
            state.addCommentOnPostActionReducer = {loading: false}
        },
        // Get Comments On Post Action Reducer
        [getCommentsOnPostAction.pending]: (state) => {
            state.getCommentsOnPostActionReducer = {loading: true}
        },
        [getCommentsOnPostAction.fulfilled]: (state, action) => {
            state.getCommentsOnPostActionReducer = {loading: false, data: action.payload}
        },
        [getCommentsOnPostAction.rejected]: (state) => {
            state.getCommentsOnPostActionReducer = {loading: false}
        },

        // Get Comments On Post Action Reducer
        [getRepliesOnComment.pending]: (state) => {
            state.getRepliesOnCommentReducer = {loading: true}
        },
        [getRepliesOnComment.fulfilled]: (state, action) => {
            state.getRepliesOnCommentReducer = {loading: false, data: action.payload}
        },
        [getRepliesOnComment.rejected]: (state) => {
            state.getRepliesOnCommentReducer = {loading: false}
        },

        // Delete Comments On Post Action Reducer
        [deleteCommentsOnPostAction.pending]: (state) => {
            state.deleteCommentsOnPostActionReducer = {loading: true}
        },
        [deleteCommentsOnPostAction.fulfilled]: (state, action) => {
            state.deleteCommentsOnPostActionReducer = {loading: false, data: action.payload}
        },
        [deleteCommentsOnPostAction.rejected]: (state) => {
            state.deleteCommentsOnPostActionReducer = {loading: false}
        },

        // Update Comments On Post Action Reducer
        [updateCommentsOnPostAction.pending]: (state) => {
            state.updateCommentsOnPostActionReducer = {loading: true}
        },
        [updateCommentsOnPostAction.fulfilled]: (state, action) => {
            state.updateCommentsOnPostActionReducer = {loading: false, data: action.payload}
        },
        [updateCommentsOnPostAction.rejected]: (state) => {
            state.updateCommentsOnPostActionReducer = {loading: false}
        },



        // Start dis Likes
        [dislikePostAction.pending]: (state) => {
            state.dislikePostReducer = {loading: true}
        },
        [dislikePostAction.fulfilled]: (state, action) => {
            state.dislikePostReducer = {loading: false, data: action.payload}
        },
        [dislikePostAction.rejected]: (state) => {
            state.dislikePostReducer = {loading: false}
        },


        [likePostAction.pending]: (state) => {
            state.likePostReducer = {loading: true}
        },
        [likePostAction.fulfilled]: (state, action) => {
            state.likePostReducer = {loading: false, data: action.payload}
        },
        [likePostAction.rejected]: (state) => {
            state.likePostReducer = {loading: false}
        },

        // Start Review
        [getPostPageInfoAction.pending]: (state) => {
            state.getPostPageInfoReducer = {loading: true}
        },
        [getPostPageInfoAction.fulfilled]: (state, action) => {
            state.getPostPageInfoReducer = {loading: false, data: action.payload}
        },
        [getPostPageInfoAction.rejected]: (state) => {
            state.getPostPageInfoReducer = {loading: false}
        },

        // Start Review
        [getPostsPageAction.pending]: (state) => {
            state.getPostsPageReducer = {loading: true}
        },
        [getPostsPageAction.fulfilled]: (state, action) => {
            state.getPostsPageReducer = {loading: false, data: action.payload}
        },
        [getPostsPageAction.rejected]: (state) => {
            state.getPostsPageReducer = {loading: false}
        },

        // End Review

        [getAllPlannerPostAction.pending]: (state) => {
            state.getAllPlannerPostReducer = {loading: true}
        },
        [getAllPlannerPostAction.fulfilled]: (state, action) => {
            state.getAllPlannerPostReducer = {loading: false, data: action.payload}
        },
        [getAllPlannerPostAction.rejected]: (state) => {
            state.getAllPlannerPostReducer = {loading: false}
        },

        [publishedPostAction.pending]: (state) => {
            state.publishedPostReducer = {loading: true}
        },
        [publishedPostAction.fulfilled]: (state, action) => {
            state.publishedPostReducer = {loading: false, data: action.payload}
        },
        [publishedPostAction.rejected]: (state) => {
            state.publishedPostReducer = {loading: false}
        },

        [deletePostByBatchIdAction.pending]: (state) => {
            state.deletePostByBatchIdReducer = {loading: true}
        },
        [deletePostByBatchIdAction.fulfilled]: (state) => {
            state.deletePostByBatchIdReducer = {loading: false, data: "success"}
        },
        [deletePostByBatchIdAction.rejected]: (state) => {
            state.deletePostByBatchIdReducer = {loading: false}
        },


        [updatePostOnSocialMediaAction.pending]: (state) => {
            state.updatePostOnSocialMediaReducer = {loading: true}
        },
        [updatePostOnSocialMediaAction.fulfilled]: (state, action) => {
            state.updatePostOnSocialMediaReducer = {loading: false, data: action.payload}
        },
        [updatePostOnSocialMediaAction.rejected]: (state) => {
            state.updatePostOnSocialMediaReducer = {loading: false}
        },

        //get all posts by batch id
        [getPostsByIdAction.pending]: (state) => {
            state.getPostsByIdReducer = {loading: true}
        },
        [getPostsByIdAction.fulfilled]: (state, action) => {
            state.getPostsByIdReducer = {loading: false, data: action.payload}
        },
        [getPostsByIdAction.rejected]: (state) => {
            state.getPostsByIdReducer = {loading: false}
        },

        //get all posts for planner
        [getAllPostsForPlannerAction.pending]: (state) => {
            state.getAllPostsForPlannerReducer = {loading: true}
        },
        [getAllPostsForPlannerAction.fulfilled]: (state, action) => {
            state.getAllPostsForPlannerReducer = {loading: false, data: action.payload}
        },
        [getAllPostsForPlannerAction.rejected]: (state) => {
            state.getAllPostsForPlannerReducer = {loading: false}
        },

        [getAllSocialMediaPostsByCriteria.pending]: (state) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: true}
        },
        [getAllSocialMediaPostsByCriteria.fulfilled]: (state, action) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: false, data: action.payload}
        },
        [getAllSocialMediaPostsByCriteria.rejected]: (state) => {
            state.getAllDraftPostsByCustomerAndPeriodReducer = {loading: false}
        },

        //get all posts for planner
        [getPlannerPostCountAction.pending]: (state) => {
            state.getPlannerPostCountReportReducer = {loading: true}
        },
        [getPlannerPostCountAction.fulfilled]: (state, action) => {
            state.getPlannerPostCountReportReducer = {loading: false, data: action.payload}
        },
        [getPlannerPostCountAction.rejected]: (state) => {
            state.getPlannerPostCountReportReducer = {loading: false}
        },

        //ai generate image
        [generateAIImageAction.pending]: (state) => {
            state.generateAIImageReducer = {loading: true}
        },
        [generateAIImageAction.fulfilled]: (state, action) => {
            state.generateAIImageReducer = {loading: false, data: action.payload}
        },
        [generateAIImageAction.rejected]: (state) => {
            state.generateAIImageReducer = {loading: false}
        },

        //  ai generate hash tag
        [generateAIHashTagAction.pending]: (state) => {
            state.generateAIHashTagReducer = {loading: true}
        },
        [generateAIHashTagAction.fulfilled]: (state, action) => {
            state.generateAIHashTagReducer = {loading: false, data: action.payload}
        },
        [generateAIHashTagAction.rejected]: (state) => {
            state.generateAIHashTagReducer = {loading: false}
        },

        //  ai generate caption
        [generateAICaptionAction.pending]: (state) => {
            state.generateAICaptionReducer = {loading: true}
        },
        [generateAICaptionAction.fulfilled]: (state, action) => {
            state.generateAICaptionReducer = {loading: false, data: action.payload}
        },
        [generateAICaptionAction.rejected]: (state) => {
            state.generateAICaptionReducer = {loading: false}
        },

        [createFacebookPostAction.pending]: (state) => {
            state.createFacebookPostActionReducer = {loading: true}
        },
        [createFacebookPostAction.fulfilled]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },
        [createFacebookPostAction.rejected]: (state) => {
            state.createFacebookPostActionReducer = {loading: false}
        },

        [replyCommentOnPostAction.pending]: (state) => {
            state.replyCommentOnPostActionReducer = {loading: true}
        },
        [replyCommentOnPostAction.fulfilled]: (state,action) => {
            state.replyCommentOnPostActionReducer = {loading: false,data: action.payload}
        },
        [replyCommentOnPostAction.rejected]: (state) => {
            state.replyCommentOnPostActionReducer = {loading: false}
        },
        [getPostByPageIdAndPostStatus.pending]: (state) => {
            state.getPostByPageIdAndPostStatusReducer = {loading: true}
        },
        [getPostByPageIdAndPostStatus.fulfilled]: (state,action) => {
            state.getPostByPageIdAndPostStatusReducer = {loading: false,data: action.payload}
        },
        [getPostByPageIdAndPostStatus.rejected]: (state) => {
            state.getPostByPageIdAndPostStatusReducer = {loading: false}
        },


    }
});

export const {resetPublishedPostReducer} = postSlice.actions;
export default postSlice.reducer;
