import {addyApi} from "../addyApi";
import {
    handleQueryError
} from "../../utils/RTKQueryUtils";
import {
    deleteFacebookComment,
    getFacebookComments,
    getFacebookRepliesOnComments,
    postFacebookComment,
    postFacebookReplyOnComment, updateFacebookComment
} from "../../services/facebookService";
import {
    getInstagramComments,
    getInstagramRepliesOnComments,
    postInstagramComment, postInstagramReplyOnComment
} from "../../services/instagramService";
import {
    deleteLinkedinComment,
    getLinkedinComments,
    getLinkedinRepliesOnComments,
    postLinkedinComment,
    postLinkedinReplyOnComment, updateLinkedinComment
} from "../../services/linkedinService";


export const commentApi = addyApi.injectEndpoints({
    endpoints: (build) => ({
        getComments: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookComments(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramComments(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinComments(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getRepliesOnComments: build.query({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await getFacebookRepliesOnComments(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await getInstagramRepliesOnComments(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await getLinkedinRepliesOnComments(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        postComment: build.mutation({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await postFacebookComment(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await postInstagramComment(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await postLinkedinComment(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        postReply: build.mutation({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await postFacebookReplyOnComment(data)
                        break;
                    }
                    case  "INSTAGRAM": {
                        result = await postInstagramReplyOnComment(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await postLinkedinReplyOnComment(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        deleteComment: build.mutation({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case  "INSTAGRAM":
                    case "FACEBOOK": {
                        result = await deleteFacebookComment(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await deleteLinkedinComment(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
        updateComment: build.mutation({
            async queryFn(data) {
                let result;
                switch (data?.socialMediaType) {
                    case "FACEBOOK": {
                        result = await updateFacebookComment(data)
                        break;
                    }
                    case  "LINKEDIN": {
                        result = await updateLinkedinComment(data)
                        break;
                    }
                    default : {
                    }
                }
                return {data: result};
            },
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
});




export const {
    useLazyGetCommentsQuery,
    useLazyGetRepliesOnCommentsQuery,
    usePostCommentMutation,
    usePostReplyMutation,
    useDeleteCommentMutation,
    useUpdateCommentMutation,
} = commentApi