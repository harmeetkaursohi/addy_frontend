import img from "../../../images/draft.png";
import {
    getCommentCreationTime,
    getTagCommentsFormat,
    handleShowCommentReplies,
    handleShowCommentReplyBox
} from "../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {
    addCommentOnPostAction, dislikePostAction,
    getCommentsOnPostAction, getPostPageInfoAction,
    likePostAction
} from "../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import CommonLoader from "../../common/components/CommonLoader";
import CommonSlider from "../../common/components/CommonSlider";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {showErrorToast} from "../../common/components/Toast";

const Comments = ({postData}) => {
    const dispatch = useDispatch();
    const getCommentsOnPostActionData = useSelector(state => state.post.getCommentsOnPostActionReducer)
    const [showReplyBox, setShowReplyBox] = useState([])
    const [showReplyComments, setShowReplyComments] = useState([])
    const [replyToCommentId, setReplyToCommentId] = useState("")
    const [replyComment, setReplyComment] = useState({
        mentionedPageId: "",
        mentionedPageName: "",
        message: ""
    })
    useEffect(() => {
        // handleGetComments("126684520526450_122128482242030808")
        handleGetComments(postData?.id)
    }, [])
    const handleGetComments = (objectId, isGetChildComments = false) => {
        const requestBody = {
            socialMediaType: postData?.socialMediaType,
            // id: objectId,
            pageAccessToken: postData?.page?.access_token,
            id: objectId,
            hasParentComment: isGetChildComments,
            ...(isGetChildComments ? {parentComments: getCommentsOnPostActionData?.data} : {}),
            // pageAccessToken: "EAAIhoNvCxpwBO9LI6dgCq71CLIgu2mY1IfBHnQc3VsBHM5m53sVIOpOz5m7RfRe4VWgQVudVT3mrYAciyefyRWR6ZBdF61QMRE5BU8ML2UJeHvSWgT93P1neSjhlYZAqjRP8EhnWhywZBuGM8lZACAvEL9glz9HJBgoPwSFtiZBSaZCFu3yHHEH3NeAo2ViYoZD"

        }
        dispatch(getCommentsOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                // showReplyComments.length === 0 && setShowReplyComments(new Array(response.payload.length).fill(false))
                // showReplyBox.length === 0 && setShowReplyComments(new Array(response.payload.length).fill(false))

            }
        })
    }
    const handleAddCommentOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            socialMediaType: postData?.socialMediaType,
            id: replyToCommentId,
            data: {
                message: getTagCommentsFormat(replyComment)
            },
            pageAccessToken: postData?.page?.access_token,
            // pageAccessToken: "EAAIhoNvCxpwBO9LI6dgCq71CLIgu2mY1IfBHnQc3VsBHM5m53sVIOpOz5m7RfRe4VWgQVudVT3mrYAciyefyRWR6ZBdF61QMRE5BU8ML2UJeHvSWgT93P1neSjhlYZAqjRP8EhnWhywZBuGM8lZACAvEL9glz9HJBgoPwSFtiZBSaZCFu3yHHEH3NeAo2ViYoZD",
        }
        dispatch(addCommentOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                setReplyComment("")
                // handleGetComments("126684520526450_122128482242030808")
                handleGetComments(postData?.id)
            }
        });
    }
    const handleLikeComment = (commentId) => {
        const requestBody = {
            postId: commentId,
            pageAccessToken: postData?.page?.access_token
        }

        dispatch(likePostAction(requestBody)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
                handleGetComments(postData?.id)
            }
        })
    }
    const handleDisLikeComment = (commentId) => {
        const requestBody = {
            postId: commentId,
            pageAccessToken: postData?.page?.access_token
        }

        dispatch(dislikePostAction(requestBody)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
                handleGetComments(postData?.id)
            }
        })
    }

    return (
        getCommentsOnPostActionData?.loading ?
            <CommonLoader/>

            :
            getCommentsOnPostActionData?.data?.length === 0
                ? <div> No Comments</div> :

                getCommentsOnPostActionData?.data?.map((comment, index) => {
                    return (
                        <div key={index} className="comment_wrap">
                            <div className="user_card">
                                <div className="user_image">
                                    <img src={comment?.from?.picture} alt=""/>
                                </div>
                                <div className="user">
                                    <p className="user_name">
                                        {comment?.from?.name}
                                    </p>
                                    <p>
                                        {comment?.message}
                                    </p>
                                    {
                                        comment?.attachment && <CommonSlider
                                            files={[comment?.attachment?.media?.source ? {
                                                sourceURL: comment?.attachment?.media?.source

                                            } : {
                                                mediaType: "IMAGE",
                                                imageURL: comment?.attachment?.media?.image?.src
                                            }]}
                                            selectedFileType={null} caption={null}
                                            hashTag={null}
                                            viewSimilarToSocialMedia={false}/>

                                    }
                                    <div
                                        className="user_impressions d-flex gap-3 mt-2 mb-2">
                                        <p>{getCommentCreationTime(comment?.created_time)}</p>
                                        {
                                            comment?.can_like ?
                                                <p className={comment?.user_likes ? "cursor_pointer color-blue" : "cursor_pointer "}
                                                   onClick={() => {
                                                       comment?.user_likes ? handleDisLikeComment(comment?.id) : handleLikeComment(comment?.id)
                                                   }}

                                                >Like</p>
                                                : <p className={" disable-reply-comment"}>Like</p>

                                        }

                                        {comment?.like_count > 0 &&
                                            <>
                                                <LiaThumbsUpSolid/>
                                                <p>{comment?.like_count}</p>
                                            </>

                                        }
                                        <p className={comment?.can_comment ? "cursor-pointer" : "disable-reply-comment"}
                                           onClick={() => {
                                               if (comment?.can_comment) {
                                                   setReplyToCommentId(comment.id)
                                                   setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                                   setReplyComment({
                                                       ...replyComment,
                                                       mentionedPageId: comment?.from?.id,
                                                       mentionedPageName: comment?.from?.name,
                                                       message: comment?.from?.name + " "
                                                   })
                                               }
                                           }}>Reply</p>
                                    </div>
                                    {
                                        comment?.reply_count > 0 &&
                                        <p className="reply_toggle" onClick={() => {
                                            setShowReplyComments(handleShowCommentReplies(showReplyComments, index))
                                            !showReplyComments[index] && comment?.reply?.length === 0 && handleGetComments(comment?.id, true)
                                        }}>{!showReplyComments[index] ? "Show" : "Hide"} {comment?.reply_count} {comment?.reply_count > 1 ? "replies" : "reply"}</p>
                                    }
                                    {
                                        showReplyComments[index] && <>
                                            {
                                                comment?.reply?.map((childComment, i) => {
                                                    console.log("childComment", childComment)
                                                    return (
                                                        <div key={i} className="comment_wrap">
                                                            <div className="user_card">
                                                                <div className="user_image">
                                                                    <img src={childComment?.from?.picture} alt=""/>
                                                                </div>
                                                                <div className="user">
                                                                    <p className="user_name">
                                                                        {childComment?.from?.name}
                                                                    </p>
                                                                    <p>
                                                                        {childComment?.message}
                                                                    </p>
                                                                    {
                                                                        childComment?.attachment && <CommonSlider
                                                                            files={[childComment?.attachment?.media?.source ? {
                                                                                sourceURL: childComment?.attachment?.media?.source

                                                                            } : {
                                                                                mediaType: "IMAGE",
                                                                                imageURL: childComment?.attachment?.media?.image?.src
                                                                            }]}
                                                                            selectedFileType={null} caption={null}
                                                                            hashTag={null}
                                                                            viewSimilarToSocialMedia={false}/>

                                                                    }

                                                                    <div
                                                                        className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                                        <p>{getCommentCreationTime(childComment?.created_time)}</p>
                                                                        {
                                                                            childComment?.can_like ?
                                                                                <p className={childComment?.user_likes ? "cursor_pointer color-blue" : "cursor_pointer "}
                                                                                   onClick={() => {
                                                                                       childComment?.user_likes ? handleDisLikeComment(childComment?.id) : handleLikeComment(childComment?.id)
                                                                                   }}
                                                                                >Like</p>
                                                                                :
                                                                                <p className={" disable-reply-comment"}>Like</p>

                                                                        }

                                                                        {childComment?.like_count > 0 &&
                                                                            <>
                                                                                <LiaThumbsUpSolid/>
                                                                                <p>{childComment?.like_count}</p>
                                                                            </>

                                                                        }
                                                                        <p className={childComment?.can_comment ? "cursor-pointer" : "disable-reply-comment"}
                                                                           onClick={() => {
                                                                               if (comment?.can_comment) {
                                                                                   setReplyToCommentId(comment.id)
                                                                                   setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                                                                   setReplyComment({
                                                                                       ...replyComment,
                                                                                       mentionedPageId: childComment?.from?.id,
                                                                                       mentionedPageName: childComment?.from?.name,
                                                                                       message: childComment?.from?.name + " "
                                                                                   })
                                                                               }

                                                                           }}>Reply</p>


                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    );
                                                })
                                            }
                                        </>
                                    }
                                    {
                                        showReplyBox[index] &&
                                        <div className="reply_wrap">
                                            <input type="text" placeholder="reply"
                                                   value={replyComment?.message}
                                                   className="form-control"
                                                   onChange={(e) => {
                                                       e.preventDefault();
                                                       setReplyComment({...replyComment, message: e.target.value})
                                                   }}
                                            />
                                            <button onClick={handleAddCommentOnPost}
                                                    className="view_post_btn cmn_bg_btn">Submit
                                            </button>
                                        </div>
                                    }


                                    {/*<p className="reply_toggle">Hide replies</p>*/}
                                    {/*<div className="comment_wrap mt-2">*/}
                                    {/*    <div className="user_card">*/}
                                    {/*        <div className="user_image">*/}
                                    {/*            <img src={user} alt=""/>*/}

                                    {/*        </div>*/}
                                    {/*        <div className="user">*/}
                                    {/*            <p className="user_name">*/}
                                    {/*                Pento*/}
                                    {/*            </p>*/}
                                    {/*            <p>*/}
                                    {/*                yes*/}
                                    {/*            </p>*/}
                                    {/*            <div*/}
                                    {/*                className="user_impressions d-flex gap-3 mt-2 mb-2">*/}
                                    {/*                <p>20 min</p>*/}
                                    {/*                <p>1 Like</p>*/}
                                    {/*                <p>Reply</p>*/}
                                    {/*            </div>*/}
                                    {/*            <p className="reply_toggle">Hide replies</p>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            </div>


                        </div>
                    )
                        ;
                })


    )
        ;
}
export default Comments