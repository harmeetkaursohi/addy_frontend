import img from "../../../../images/draft.png";
import {
    getCommentCreationTime,
    getUpdateCommentMessage,
    getMentionedUserCommentFormat,
    handleShowCommentReplies,
    handleShowCommentReplyBox,
    isNullOrEmpty,
    isReplyCommentEmpty,
    getValueOrDefault,
    removeDuplicatesObjectsFromArray,
} from "../../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {
    deleteCommentsOnPostAction, dislikePostAction,
    getCommentsOnPostAction, getPostPageInfoAction, getRepliesOnComment,
    likePostAction, replyCommentOnPostAction, updateCommentsOnPostAction
} from "../../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import CommonSlider from "../../../common/components/CommonSlider";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {BiSolidSend} from "react-icons/bi";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {Dropdown} from "react-bootstrap";
import Skeleton from "../../../loader/skeletonEffect/Skeleton";
import {RotatingLines} from "react-loader-spinner";
import CommentText from "./CommentText";
import default_user_icon from "../../../../images/default_user_icon.svg";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";
import CommonLoader from "../../../common/components/CommonLoader";
import {useLazyGetCommentsQuery, useLazyGetRepliesOnCommentsQuery} from "../../../../app/apis/commentApi";

const Comments = ({postData, isDirty, setDirty, postPageData, postSocioData}) => {

    const dispatch = useDispatch();
    const updateCommentsOnPostActionData = useSelector(state => state.post.updateCommentsOnPostActionReducer)
    const addCommentOnPostData = useSelector(state => state.post.addCommentOnPostActionReducer)
    const replyCommentOnPostData = useSelector(state => state.post.replyCommentOnPostActionReducer)

    const [triggerGetCommentsApi, setTriggerGetCommentsApi] = useState(false);
    const [facebookComments, setFacebookComments] = useState({
        data: null,
        nextCursor: null
    })
    const [showReplyBox, setShowReplyBox] = useState([])
    const [commentToDelete, setCommentToDelete] = useState(null)
    const [deletedCommentIds, setDeletedCommentIds] = useState([])
    const [showReplyComments, setShowReplyComments] = useState([])
    const [replyToComment, setReplyToComment] = useState(null)
    const [replyComment, setReplyComment] = useState({
        mentionedPageId: "",
        mentionedPageName: "",
        message: ""
    })
    const [getReplyForComment, setGetReplyForComment] = useState({})
    const [getReplies, setGetReplies] = useState(false);


    const [updateComment, setUpdateComment] = useState({})
    const [baseQuery, setBaseQuery] = useState({
        socialMediaType: postData?.socialMediaType,
        pageAccessToken: postData?.page?.access_token,
    })
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [getComments, getCommentsApi] = useLazyGetCommentsQuery()
    const [getRepliesOnComment, getRepliesOnCommentApi] = useLazyGetRepliesOnCommentsQuery()

    console.log("getCommentsApi=====>", getCommentsApi)


    // TODO:Comments this useEffect
    // useEffect(() => {
    //     if (postData && postPageData && postPageData?.comments?.summary?.total_count > 0 && facebookComments?.data === null) {
    //         setGetFacebookComments(new Date().getMilliseconds())
    //     }
    // }, [postData, postPageData])

    useEffect(() => {
        if (postData && postSocioData && postSocioData?.comments?.summary?.total_count > 0 && facebookComments?.data === null) {
            setTriggerGetCommentsApi(true)
        }
    }, [postData, postSocioData])

    // TODO:Comments this useEffect
    // useEffect(() => {
    //     if (getFacebookComments !== null) {
    //         setGetFacebookComments(null);
    //         dispatch(getCommentsOnPostAction({
    //             ...baseQuery,
    //             id: postPageData?.id,
    //             limit: 3,
    //             next: facebookComments?.nextCursor
    //         }))
    //         setShowReplyBox([])
    //         //Add Comment reducer is reset as we need to push the latest comment in array no need to hit new api
    //         dispatch(resetReducers({sliceNames: ["addCommentOnPostActionReducer"]}))
    //     }
    // }, [getFacebookComments])

    useEffect(() => {
        if (triggerGetCommentsApi) {
            setTriggerGetCommentsApi(false);
            getComments({
                ...baseQuery,
                id: postSocioData?.id,
                limit: 3,
                next: facebookComments?.nextCursor
            })
            setShowReplyBox([])
            //Add Comment reducer is reset as we need to push the latest comment in array no need to hit new api
            // dispatch(resetReducers({sliceNames: ["addCommentOnPostActionReducer"]}))
        }
    }, [triggerGetCommentsApi])

    // TODO:Comments this useEffect
    // useEffect(() => {
    //     if (getCommentsOnPostActionData?.data !== undefined && !getCommentsOnPostActionData?.loading) {
    //         const cursorToNextData = getCommentsOnPostActionData.data?.paging?.next === undefined ? null : getCommentsOnPostActionData.data?.paging?.cursors?.after
    //         if (facebookComments?.data === null) {
    //             setFacebookComments({
    //                 data: getCommentsOnPostActionData?.data?.data,
    //                 nextCursor: cursorToNextData
    //             })
    //         } else {
    //             const updatedComments = [...facebookComments?.data, ...getCommentsOnPostActionData?.data?.data]
    //             // const commentsWithoutDuplicates = removeDuplicatesObjectsFromArray(updatedComments, "id")
    //             setFacebookComments({
    //                 data: updatedComments,
    //                 nextCursor: cursorToNextData
    //             })
    //         }
    //         dispatch(resetReducers({sliceNames: ["getCommentsOnPostActionReducer"]}))
    //     }
    // }, [getCommentsOnPostActionData])

    useEffect(() => {
        if (getCommentsApi?.data !== undefined && !getCommentsApi?.isLoading && !getCommentsApi?.isFetching) {
            const cursorToNextData = getCommentsApi.data?.paging?.next === undefined ? null : getCommentsApi.data?.paging?.cursors?.after
            if (facebookComments?.data === null) {
                setFacebookComments({
                    data: getCommentsApi?.data?.data,
                    nextCursor: cursorToNextData
                })
            } else {
                const updatedComments = [...facebookComments?.data, ...getCommentsApi?.data?.data]
                // const commentsWithoutDuplicates = removeDuplicatesObjectsFromArray(updatedComments, "id")
                setFacebookComments({
                    data: updatedComments,
                    nextCursor: cursorToNextData
                })
            }
            // dispatch(resetReducers({sliceNames: ["getCommentsOnPostActionReducer"]}))
        }
    }, [getCommentsApi])

    useEffect(() => {
        if (getReplies  && ((getReplyForComment?.reference === "SHOW_MORE_REPLIES" && getReplyForComment?.comment?.replyData === undefined) || (getReplyForComment?.reference === "LOAD_MORE"))) {
            setGetReplies(false);
            getRepliesOnComment({
                ...baseQuery,
                id: getReplyForComment?.comment?.id,
                limit: 1,
                next: getReplyForComment?.comment?.replyData?.nextCursor === undefined ? null : getReplyForComment?.comment?.replyData?.nextCursor
            })
        }
    }, [getReplies])

    useEffect(() => {
        if (getRepliesOnCommentApi?.data !== undefined && !getRepliesOnCommentApi?.isLoading && !getRepliesOnCommentApi?.isFetching && getReplyForComment !== null && Object.keys(getReplyForComment)?.length > 0) {
            const cursorToNext = getRepliesOnCommentApi?.data?.paging?.next === undefined ? null : getRepliesOnCommentApi?.data?.paging?.cursors?.after
            let previousData = getValueOrDefault(getReplyForComment?.comment?.replyData?.data, []);
            let updatedComments = removeDuplicatesObjectsFromArray([...previousData, ...getRepliesOnCommentApi?.data?.data], "id")
            const updatedComment = {
                ...getReplyForComment?.comment,
                replyData: {
                    ...getReplyForComment?.comment?.replyData,
                    nextCursor: cursorToNext,
                    data: updatedComments
                }
            }
            let updatedFacebookComments = [...facebookComments?.data]
            updatedFacebookComments[getReplyForComment?.index] = updatedComment
            setFacebookComments({
                ...facebookComments,
                data: [...updatedFacebookComments]
            })
            setGetReplyForComment({})
            dispatch(resetReducers({sliceNames: ["getRepliesOnCommentReducer"]}))
        }
    }, [getRepliesOnCommentApi])

    useEffect(() => {
        if (addCommentOnPostData?.data !== undefined) {
            //Add Comment on the top of array
            let newComment = addCommentOnPostData?.data;
            const previousData = getValueOrDefault(facebookComments.data, []);
            setFacebookComments({
                ...facebookComments,
                data: [newComment, ...previousData]
            })
            dispatch(resetReducers({sliceNames: ["addCommentOnPostActionReducer"]}))
        }
    }, [addCommentOnPostData])

    useEffect(() => {
        if (replyCommentOnPostData?.data !== undefined) {
            let updatedCommentsList = [...facebookComments?.data]
            let updatedComment = updatedCommentsList[replyToComment?.index]
            updatedComment = {
                ...updatedComment,
                comment_count: updatedComment.comment_count + 1,
                replyData: {
                    ...updatedComment?.replyData,
                    data: replyToComment?.parentCommentLevel === "FIRST" ? [{...replyCommentOnPostData?.data}, ...getValueOrDefault(updatedComment?.replyData?.data, [])] : [...getValueOrDefault(updatedComment?.replyData?.data, []), {...replyCommentOnPostData?.data}],
                    nextCursor: updatedComment?.replyData?.nextCursor === undefined ? null : updatedComment?.replyData?.nextCursor
                }
            }
            updatedCommentsList[replyToComment?.index] = updatedComment;
            setFacebookComments({
                ...facebookComments,
                data: updatedCommentsList
            })
            setShowReplyBox([])
            let showReply = [...showReplyComments]
            showReply[replyToComment?.index] = true
            setShowReplyComments(showReply)
            setReplyToComment(null)
            setReplyComment("")
            dispatch(resetReducers({sliceNames: ["replyCommentOnPostActionReducer"]}))
        }
    }, [replyCommentOnPostData])

    useEffect(() => {
        if (commentToDelete) {
            const requestBody = {
                ...baseQuery,
                id: commentToDelete?.comment?.id,
            }
            dispatch(deleteCommentsOnPostAction(requestBody)).then(response => {
                if (response.meta.requestStatus === "fulfilled") {
                    if (commentToDelete?.commentLevel === "SECOND") {
                        let updatedFacebookComments = [...facebookComments?.data]
                        updatedFacebookComments[commentToDelete?.index] = {
                            ...updatedFacebookComments[commentToDelete?.index],
                            comment_count: updatedFacebookComments[commentToDelete?.index].comment_count - 1
                        }
                        setFacebookComments({
                            ...facebookComments,
                            data: updatedFacebookComments
                        })
                    }
                    setDeletedCommentIds([...deletedCommentIds, commentToDelete?.comment?.id])
                    setDirty({
                        ...isDirty,
                        isDirty: true,
                        action: {
                            ...isDirty?.action,
                            type: "DELETE",
                            on: "COMMENT",
                        }
                    })
                    setCommentToDelete(null)
                    dispatch(getPostPageInfoAction({
                        ...baseQuery,
                        postIds: [postData?.id]
                    }))
                }
            })
        }
    }, [commentToDelete])

    useEffect(() => {
        if (updateCommentsOnPostActionData?.data !== undefined && !updateCommentsOnPostActionData?.loading) {
            let updatedFacebookComments = [...facebookComments?.data]
            if (updateComment?.commentLevel === "FIRST") {
                let updatedComment = updatedFacebookComments[updateComment?.index]
                updatedComment = {
                    ...updateCommentsOnPostActionData?.data,
                    comment_count: updatedComment?.comment_count,
                    replyData: updatedComment?.replyData

                }
                updatedFacebookComments[updateComment?.index] = updatedComment
            }
            if (updateComment?.commentLevel === "SECOND") {
                let parentComment = updatedFacebookComments[updateComment?.parentCommentIndex]
                parentComment.replyData.data[updateComment?.index] = {
                    ...updateCommentsOnPostActionData?.data
                }
                updatedFacebookComments[updateComment?.parentCommentIndex] = parentComment
            }
            setFacebookComments({
                ...facebookComments,
                data: updatedFacebookComments
            });
            setUpdateComment({})
            dispatch(resetReducers({sliceNames: ["updateCommentsOnPostActionReducer"]}))
        }
    }, [updateCommentsOnPostActionData])

    const handleUpdateComment = () => {
        const requestBody = {
            ...baseQuery,
            id: updateComment?.comment?.id,
            data: {
                message: getUpdateCommentMessage(updateComment?.comment, postData?.socialMediaType)
            }
        }
        dispatch(updateCommentsOnPostAction(requestBody))

    }

    const handleReplyCommentOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            ...baseQuery,
            id: replyToComment?.id,
            data: {
                message: getMentionedUserCommentFormat(replyComment, postData?.socialMediaType)
            },
        }
        dispatch(replyCommentOnPostAction(requestBody))
    }

    const handleGetComments = (objectId) => {
        const requestBody = {
            ...baseQuery,
            id: objectId,
        }
        dispatch(getCommentsOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                setShowReplyBox([])
                // !isGetChildComments && setShowReplyComments(new Array(response.payload.length).fill(false))
                // showReplyBox.length === 0 && setShowReplyComments(new Array(response.payload.length).fill(false))
            }
        })
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

    function handleOnEmojiClick(emojiData) {
        setReplyComment({
            ...replyComment,
            message: replyComment.message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        })
    }


    return (
        <>
            {
                postPageData?.comments?.summary?.total_count === 0 &&
                <div className={"no-cmnt-txt"}>No comments yet!</div>
            }
            {
                postPageData?.comments?.summary?.total_count > 0 && facebookComments?.data === null ? <CommonLoader/> :
                    facebookComments?.data?.map((comment, index) => {
                        return (
                            <div key={index} className="comment_wrap">
                                {
                                    commentToDelete?.comment?.id === comment?.id ?
                                        <div className={"mb-3"}>
                                            <Skeleton className={"mb-2"}/>
                                        </div> :
                                        !deletedCommentIds?.includes(comment?.id) && <div className="user_card">
                                            <div className="user_image">
                                                <img src={comment?.from?.picture?.data?.url || default_user_icon}
                                                     alt=""/>
                                            </div>
                                            <div className="user">
                                                {
                                                    updateComment?.comment?.id !== comment?.id ?
                                                        <>
                                                            <div className={"user_name_edit_btn_outer"}>
                                                                <p className="user_name">
                                                                    {comment?.from?.name}
                                                                </p>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle
                                                                        className={"comment-edit-del-button"}
                                                                        variant="success" id="dropdown-basic">
                                                                        <PiDotsThreeVerticalBold
                                                                            className={"comment-edit-del-icon"}/>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        {
                                                                            comment?.from?.id === postData?.page?.pageId &&
                                                                            <Dropdown.Item onClick={() => {
                                                                                !updateCommentsOnPostActionData?.loading && setUpdateComment({
                                                                                    comment: comment,
                                                                                    index: index,
                                                                                    commentLevel: "FIRST"
                                                                                })
                                                                            }
                                                                            }>Edit</Dropdown.Item>
                                                                        }
                                                                        {
                                                                            comment?.can_remove &&
                                                                            <Dropdown.Item href="#/action-2"
                                                                                           onClick={() => {
                                                                                               setCommentToDelete({
                                                                                                   comment: comment,
                                                                                                   commentLevel: "FIRST",
                                                                                                   index: index
                                                                                               })
                                                                                               setDirty({
                                                                                                   ...isDirty,
                                                                                                   action: {
                                                                                                       ...isDirty?.action,
                                                                                                       reduceCommentCount: 1,
                                                                                                   }
                                                                                               })
                                                                                           }}>Delete</Dropdown.Item>
                                                                        }
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>


                                                            <div className={"comment_message"}>
                                                                <CommentText socialMediaType={"FACEBOOK"}
                                                                             comment={comment?.message}
                                                                             className={""}
                                                                             usernames={comment?.message_tags?.filter(tags => tags?.type === "user")?.map(userTag => userTag?.name)}>
                                                                </CommentText>
                                                            </div>
                                                            {
                                                                comment?.attachment &&
                                                                <div className={"comments_attachments"}>
                                                                    <CommonSlider
                                                                        height={"150px"}
                                                                        files={[comment?.attachment?.media?.source ? {
                                                                            sourceURL: comment?.attachment?.media?.source

                                                                        } : {
                                                                            mediaType: "IMAGE",
                                                                            imageURL: comment?.attachment?.media?.image?.src
                                                                        }]}
                                                                        selectedFileType={null} caption={null}
                                                                        hashTag={null}
                                                                        isPublished={true}
                                                                        viewSimilarToSocialMedia={false}/>
                                                                </div>


                                                            }
                                                            <div
                                                                className="user_impressions align-items-center d-flex mt-2 mb-2">
                                                                <p>{getCommentCreationTime(comment?.created_time)}</p>
                                                                {/*{*/}
                                                                {/*    comment?.can_like ?*/}
                                                                {/*        <p className={comment?.user_likes ? "cursor_pointer ms-3 like_text_color" : "ms-3 cursor_pointer "}*/}
                                                                {/*           onClick={() => {*/}
                                                                {/*               comment?.user_likes ? handleDisLikeComment(comment?.id) : handleLikeComment(comment?.id)*/}
                                                                {/*           }}*/}

                                                                {/*        >Like</p>*/}
                                                                {/*        :*/}
                                                                {/*        <p className={"ms-3 disable-reply-comment"}>Like</p>*/}

                                                                {/*}*/}

                                                                {comment?.like_count > 0 &&
                                                                    <>
                                                                        <LiaThumbsUpSolid
                                                                            className={"ms-1 me-1 LiaThumbsUpSolid"}
                                                                        />
                                                                        <p className={"me-3"}>{comment?.like_count}</p>
                                                                    </>

                                                                }
                                                                <p className={comment?.can_comment ? "cursor-pointer ms-3" : "disable-reply-comment ms-3"}
                                                                   onClick={() => {
                                                                       if (comment?.can_comment) {
                                                                           setReplyToComment({
                                                                               id: comment.id,
                                                                               index: index,
                                                                               comment: comment,
                                                                               parentCommentLevel: "FIRST"
                                                                           })
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
                                                        </> :
                                                        <>
                                                            <div className="reply_wrap">
                                                                <svg className="emoji-picker-icon cursor_pointer"
                                                                     xmlns="http://www.w3.org/2000/svg" width="22"
                                                                     height="22"
                                                                     viewBox="0 0 22 22" fill="none" onClick={() => {
                                                                    setShowEmojiPicker(!showEmojiPicker)
                                                                }}>
                                                                    <path
                                                                        d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z"
                                                                        fill="#323232"/>
                                                                    <path
                                                                        d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z"
                                                                        fill="#323232"/>
                                                                    <path
                                                                        d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z"
                                                                        fill="#323232"/>
                                                                </svg>
                                                                <input type="text" placeholder="reply"
                                                                       value={updateComment?.comment?.message}
                                                                       onClick={() => {
                                                                           setShowEmojiPicker(false)
                                                                       }}
                                                                       className="form-control "
                                                                       onChange={(e) => {
                                                                           setShowEmojiPicker(false)
                                                                           e.preventDefault();
                                                                           setUpdateComment({
                                                                               ...updateComment,
                                                                               comment: {
                                                                                   ...updateComment.comment,
                                                                                   message: e.target.value
                                                                               }
                                                                           })
                                                                       }}
                                                                />
                                                                <button
                                                                    disabled={updateCommentsOnPostActionData?.loading || isNullOrEmpty(updateComment?.comment?.message)}
                                                                    onClick={(e) => {
                                                                        !isNullOrEmpty(updateComment?.comment?.message) && handleUpdateComment()
                                                                        setShowEmojiPicker(false)
                                                                    }}
                                                                    className={isNullOrEmpty(updateComment?.comment?.message) || updateCommentsOnPostActionData?.loading ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                    {
                                                                        updateCommentsOnPostActionData?.loading ?
                                                                            <RotatingLines strokeColor="white"
                                                                                           strokeWidth="5"
                                                                                           animationDuration="0.75"
                                                                                           width="20"
                                                                                           visible={true}/>
                                                                            : <BiSolidSend
                                                                                className={"cursor-pointer update_comment_icon"}/>
                                                                    }


                                                                </button>

                                                                <div>
                                                                    <div className={"reply-emoji-picker-outer"}>
                                                                        {
                                                                            showEmojiPicker && <EmojiPicker
                                                                                onEmojiClick={(value) => {
                                                                                    handleOnEmojiClick(value)
                                                                                }}
                                                                                autoFocusSearch={false}
                                                                                emojiStyle={EmojiStyle.NATIVE}
                                                                                width={'100%'}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                }

                                                {
                                                    comment?.comment_count > 0 &&
                                                    <p
                                                        className="reply_toggle"
                                                        onClick={() => {
                                                        if (!showReplyComments[index]) {
                                                            setGetReplyForComment({
                                                                index: index,
                                                                comment: comment,
                                                                reference: "SHOW_MORE_REPLIES",
                                                            });
                                                            setGetReplies(true);
                                                        }
                                                        setShowReplyComments(handleShowCommentReplies(showReplyComments, index))
                                                    }}>
                                                        {!showReplyComments[index] ? "Show" : "Hide"} {comment?.comment_count} {comment?.comment_count > 1 ? "replies" : "reply"}
                                                    </p>
                                                }
                                                {
                                                    showReplyComments[index] && <>
                                                        {
                                                            comment?.replyData?.data?.map((childComment, i) => {
                                                                return (
                                                                    <div key={i} className="comment_wrap">
                                                                        {
                                                                            commentToDelete?.comment?.id === childComment?.id ?
                                                                                <div className={"mb-3"}>
                                                                                    <Skeleton className={"h-20"}/>
                                                                                </div> :
                                                                                !deletedCommentIds?.includes(childComment?.id) &&
                                                                                <div className="user_card">
                                                                                    <div className="user_image">
                                                                                        <img
                                                                                            src={childComment?.from?.picture?.data?.url || default_user_icon}
                                                                                            alt=""/>
                                                                                    </div>
                                                                                    <div className="user">
                                                                                        {
                                                                                            updateComment?.comment?.id !== childComment?.id ?
                                                                                                <>
                                                                                                    <div
                                                                                                        className={"user_name_edit_btn_outer"}>
                                                                                                        <p className="user_name">
                                                                                                            {childComment?.from?.name}
                                                                                                        </p>
                                                                                                        <Dropdown>
                                                                                                            <Dropdown.Toggle
                                                                                                                className={"comment-edit-del-button"}
                                                                                                                variant="success"
                                                                                                                id="dropdown-basic">
                                                                                                                <PiDotsThreeVerticalBold
                                                                                                                    className={"comment-edit-del-icon"}/>
                                                                                                            </Dropdown.Toggle>
                                                                                                            <Dropdown.Menu>
                                                                                                                {
                                                                                                                    childComment?.from?.id === postData?.page?.pageId &&
                                                                                                                    <Dropdown.Item
                                                                                                                        onClick={() => {
                                                                                                                            !updateCommentsOnPostActionData?.loading && setUpdateComment({
                                                                                                                                comment: childComment,
                                                                                                                                parentCommentIndex: index,
                                                                                                                                index: i,
                                                                                                                                commentLevel: "SECOND"
                                                                                                                            })
                                                                                                                        }
                                                                                                                        }>Edit</Dropdown.Item>
                                                                                                                }
                                                                                                                {
                                                                                                                    childComment?.can_remove &&
                                                                                                                    <Dropdown.Item
                                                                                                                        href="#/action-2"
                                                                                                                        onClick={() => {
                                                                                                                            setCommentToDelete({
                                                                                                                                comment: childComment,
                                                                                                                                commentLevel: "SECOND",
                                                                                                                                index: index
                                                                                                                            })
                                                                                                                            setDirty({
                                                                                                                                ...isDirty,
                                                                                                                                action: {
                                                                                                                                    ...isDirty?.action,
                                                                                                                                    reduceCommentCount: 0,
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }}>Delete</Dropdown.Item>
                                                                                                                }
                                                                                                            </Dropdown.Menu>
                                                                                                        </Dropdown>
                                                                                                    </div>

                                                                                                    <p>
                                                                                                        <CommentText
                                                                                                            socialMediaType={"FACEBOOK"}
                                                                                                            comment={childComment?.message}
                                                                                                            className={" "}
                                                                                                            usernames={childComment?.message_tags?.filter(tags => tags?.type === "user")?.map(userTag => userTag?.name)}>
                                                                                                        </CommentText>
                                                                                                    </p>
                                                                                                    {
                                                                                                        childComment?.attachment &&
                                                                                                        <CommonSlider
                                                                                                            files={[childComment?.attachment?.media?.source ? {
                                                                                                                sourceURL: childComment?.attachment?.media?.source

                                                                                                            } : {
                                                                                                                mediaType: "IMAGE",
                                                                                                                imageURL: childComment?.attachment?.media?.image?.src
                                                                                                            }]}
                                                                                                            selectedFileType={null}
                                                                                                            caption={null}
                                                                                                            hashTag={null}
                                                                                                            isPublished={true}
                                                                                                            viewSimilarToSocialMedia={false}/>

                                                                                                    }

                                                                                                    <div
                                                                                                        className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                                                                        <p>{getCommentCreationTime(childComment?.created_time)}</p>
                                                                                                        {/*{*/}
                                                                                                        {/*    childComment?.can_like ?*/}
                                                                                                        {/*        <p className={childComment?.user_likes ? "cursor_pointer color-blue" : "cursor_pointer "}*/}
                                                                                                        {/*           onClick={() => {*/}
                                                                                                        {/*               childComment?.user_likes ? handleDisLikeComment(childComment?.id) : handleLikeComment(childComment?.id)*/}
                                                                                                        {/*           }}*/}
                                                                                                        {/*        >Like</p>*/}
                                                                                                        {/*        :*/}
                                                                                                        {/*        <p className={" disable-reply-comment"}>Like</p>*/}

                                                                                                        {/*}*/}

                                                                                                        {childComment?.like_count > 0 &&
                                                                                                            <>
                                                                                                                <LiaThumbsUpSolid
                                                                                                                    fill={"blue"}/>
                                                                                                                <p>{childComment?.like_count}</p>
                                                                                                            </>

                                                                                                        }
                                                                                                        <p className={childComment?.can_comment ? "cursor-pointer" : "disable-reply-comment"}
                                                                                                           onClick={() => {
                                                                                                               if (comment?.can_comment) {
                                                                                                                   setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                                                                                                   setReplyToComment({
                                                                                                                       id: comment.id,
                                                                                                                       index: index,
                                                                                                                       comment: childComment,
                                                                                                                       parentCommentLevel: "SECOND"
                                                                                                                   })
                                                                                                                   setReplyComment({
                                                                                                                       ...replyComment,
                                                                                                                       mentionedPageId: childComment?.from?.id,
                                                                                                                       mentionedPageName: childComment?.from?.name,
                                                                                                                       message: childComment?.from?.name + " "
                                                                                                                   })
                                                                                                               }

                                                                                                           }}>Reply</p>


                                                                                                    </div>
                                                                                                </>


                                                                                                :


                                                                                                <>
                                                                                                    <div
                                                                                                        className="reply_wrap">
                                                                                                        <svg
                                                                                                            className="emoji-picker-icon cursor_pointer"
                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                            width="22"
                                                                                                            height="22"
                                                                                                            viewBox="0 0 22 22"
                                                                                                            fill="none"
                                                                                                            onClick={() => {
                                                                                                                setShowEmojiPicker(!showEmojiPicker)
                                                                                                            }}>
                                                                                                            <path
                                                                                                                d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z"
                                                                                                                fill="#323232"/>
                                                                                                            <path
                                                                                                                d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z"
                                                                                                                fill="#323232"/>
                                                                                                            <path
                                                                                                                d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z"
                                                                                                                fill="#323232"/>
                                                                                                        </svg>
                                                                                                        <input type="text"
                                                                                                               placeholder="reply"
                                                                                                               value={updateComment?.comment?.message}
                                                                                                               onClick={() => {
                                                                                                                   setShowEmojiPicker(false)
                                                                                                               }}
                                                                                                               className="form-control "
                                                                                                               onChange={(e) => {
                                                                                                                   setShowEmojiPicker(false)
                                                                                                                   e.preventDefault();
                                                                                                                   setUpdateComment({
                                                                                                                       ...updateComment,
                                                                                                                       comment: {
                                                                                                                           ...updateComment.comment,
                                                                                                                           message: e.target.value
                                                                                                                       }
                                                                                                                   })
                                                                                                               }}
                                                                                                        />
                                                                                                        <button
                                                                                                            disabled={updateCommentsOnPostActionData?.loading || isNullOrEmpty(updateComment?.comment?.message)}
                                                                                                            onClick={(e) => {
                                                                                                                !isNullOrEmpty(updateComment?.comment?.message) && handleUpdateComment()
                                                                                                                setShowEmojiPicker(false)
                                                                                                            }}
                                                                                                            className={isNullOrEmpty(updateComment?.comment?.message) || updateCommentsOnPostActionData?.loading ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                                                            {
                                                                                                                updateCommentsOnPostActionData?.loading ?
                                                                                                                    <RotatingLines
                                                                                                                        strokeColor="white"
                                                                                                                        strokeWidth="5"
                                                                                                                        animationDuration="0.75"
                                                                                                                        width="20"
                                                                                                                        visible={true}/>
                                                                                                                    :
                                                                                                                    <BiSolidSend
                                                                                                                        className={"cursor-pointer update_comment_icon"}/>
                                                                                                            }
                                                                                                        </button>

                                                                                                        <div>
                                                                                                            <div
                                                                                                                className={"reply-emoji-picker-outer"}>
                                                                                                                {
                                                                                                                    showEmojiPicker &&
                                                                                                                    <EmojiPicker
                                                                                                                        onEmojiClick={(value) => {
                                                                                                                            handleOnEmojiClick(value)
                                                                                                                        }}
                                                                                                                        autoFocusSearch={false}
                                                                                                                        emojiStyle={EmojiStyle.NATIVE}
                                                                                                                        width={'100%'}
                                                                                                                    />
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                        }


                                                                                    </div>
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                        {
                                                            ((getRepliesOnCommentApi?.isLoading || getRepliesOnCommentApi?.isFetching) && comment?.id === getReplyForComment?.comment?.id) ?
                                                                <div className={" text-center z-index-1 mt-1"}>
                                                                    <RotatingLines strokeColor="#F07C33"
                                                                                   strokeWidth="5"
                                                                                   animationDuration="0.75"
                                                                                   width="30"
                                                                                   visible={true}/>
                                                                </div> : <>
                                                                    {
                                                                        (comment?.comment_count > 0 && comment?.replyData?.nextCursor !== null) &&
                                                                        <div
                                                                            className={" mb-1 load-more-replies-txt cursor-pointer"}
                                                                            onClick={() => {
                                                                                setGetReplyForComment({
                                                                                    index: index,
                                                                                    comment: comment,
                                                                                    reference: "LOAD_MORE",
                                                                                });
                                                                                setGetReplies(true)
                                                                            }}>Load more
                                                                        </div>
                                                                    }
                                                                </>

                                                        }
                                                    </>
                                                }
                                                {
                                                    showReplyBox[index] &&
                                                    <div className="reply_wrap">
                                                        <svg className="emoji-picker-icon cursor_pointer"
                                                             xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                                             viewBox="0 0 22 22" fill="none" onClick={() => {
                                                            setShowEmojiPicker(!showEmojiPicker)
                                                        }}>
                                                            <path
                                                                d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z"
                                                                fill="#323232"/>
                                                            <path
                                                                d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z"
                                                                fill="#323232"/>
                                                            <path
                                                                d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z"
                                                                fill="#323232"/>
                                                        </svg>
                                                        <input type="text" placeholder="reply"
                                                               value={replyComment?.message}
                                                               onClick={() => {
                                                                   setShowEmojiPicker(false)
                                                               }}
                                                               className="form-control "
                                                               onChange={(e) => {
                                                                   e.preventDefault();
                                                                   setShowEmojiPicker(false)
                                                                   setReplyComment({
                                                                       ...replyComment,
                                                                       message: e.target.value
                                                                   })
                                                               }}
                                                        />
                                                        <button
                                                            disabled={replyCommentOnPostData?.loading || isReplyCommentEmpty(replyComment)}
                                                            onClick={(e) => {
                                                                !isReplyCommentEmpty(replyComment) && handleReplyCommentOnPost(e);
                                                                setShowEmojiPicker(false)
                                                            }}
                                                            className={isReplyCommentEmpty(replyComment) || replyCommentOnPostData?.loading ? "view_post_btn cmn_bg_btn px-2 opacity-50" : "view_post_btn cmn_bg_btn px-2"}>

                                                            {
                                                                (replyCommentOnPostData?.loading && !isReplyCommentEmpty(replyComment)) ?
                                                                    <RotatingLines strokeColor="white"
                                                                                   strokeWidth="5"
                                                                                   animationDuration="0.75" width="20"
                                                                                   visible={true}/>
                                                                    :
                                                                    "Submit"
                                                            }

                                                        </button>
                                                        <div>
                                                            <div className={"reply-emoji-picker-outer"}>
                                                                {
                                                                    showEmojiPicker && <EmojiPicker
                                                                        onEmojiClick={(value) => {
                                                                            handleOnEmojiClick(value)
                                                                        }}
                                                                        autoFocusSearch={false}
                                                                        emojiStyle={EmojiStyle.NATIVE}
                                                                        width={'100%'}
                                                                    />
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                }

                                            </div>
                                        </div>
                                }


                            </div>
                        )
                            ;
                    })
            }
            {
                ((getCommentsApi?.isLoading || getCommentsApi?.isFetching) && Array.isArray(facebookComments?.data)) ?
                    <div className={" text-center z-index-1 mt-1"}>
                        <RotatingLines
                            strokeColor="#F07C33"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="30"
                            visible={true}/>
                    </div> :
                    <>
                        {
                            facebookComments?.nextCursor !== null &&
                            <div
                                className={"ms-2 mt-2 load-more-cmnt-txt cursor-pointer"}
                                onClick={() => {
                                    setTriggerGetCommentsApi(true)
                                }}>Load more comments
                            </div>
                        }
                    </>
            }

        </>


    );
}
export default Comments
