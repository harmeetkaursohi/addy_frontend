import img from "../../../../images/draft.png";
import {Dropdown} from "react-bootstrap";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {
    countCommonElementsFromArray,
    getCommentCreationTime, getValueOrDefault,
    handleShowCommentReplies,
    isNullOrEmpty, removeDuplicatesObjectsFromArray,
} from "../../../../utils/commonUtils";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {BiSolidSend} from "react-icons/bi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import default_user_icon from "../../../../images/default_user_icon.svg"
import Skeleton from "../../../loader/skeletonEffect/Skeleton";
import {RotatingLines} from "react-loader-spinner";
import CommentText from "./CommentText";
import CommonLoader from "../../../common/components/CommonLoader";
import {
    useDeleteCommentMutation,
    useLazyGetCommentsQuery,
    useLazyGetRepliesOnCommentsQuery
} from "../../../../app/apis/commentApi";
import {handleRTKQuery} from "../../../../utils/RTKQueryUtils";
import {addyApi} from "../../../../app/addyApi";

const InstagramCommentsSection = ({
                                      postData,
                                      isDirty,
                                      setDirty,
                                      postSocioData,
                                      postCommentApi,
                                      onReply,
                                      postReplyApi
                                  }) => {

    const dispatch = useDispatch();
    const [baseQuery, setBaseQuery] = useState({
        socialMediaType: postData?.socialMediaType,
        pageAccessToken: postData?.page?.access_token,
    });
    const [instagramComments, setInstagramComments] = useState({
        data: null,
        nextCursor: null
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReplies, setShowReplies] = useState([]);
    const [triggerGetCommentsApi, setTriggerGetCommentsApi] = useState(false);


    const [replyToComment, setReplyToComment] = useState(null);
    const [reply, setReply] = useState({parentId: null, message: null});
    const [getReplyForComment, setGetReplyForComment] = useState({})
    const [getReplies, setGetReplies] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [deletedCommentIds, setDeletedCommentIds] = useState([]);

    const [getComments, getCommentsApi] = useLazyGetCommentsQuery()
    const [getRepliesOnComment, getRepliesOnCommentApi] = useLazyGetRepliesOnCommentsQuery()
    const [deleteComment, deleteCommentApi] = useDeleteCommentMutation()

    useEffect(() => {
        if (postSocioData) {
            setShowReplies(showReplies.length === 0 ? new Array(postSocioData?.comments?.data?.length).fill(false) : [...showReplies])
        }
    }, [postSocioData])

    useEffect(() => {
        if (postData && postSocioData && postSocioData?.comments_count > 0 && instagramComments?.data === null) {
            setTriggerGetCommentsApi(true)
        }
    }, [postData, postSocioData])

    useEffect(() => {
        if (triggerGetCommentsApi) {
            setTriggerGetCommentsApi(false);
            const requestBody = {
                ...baseQuery,
                id: postSocioData?.id,
                limit: 6,
                next: instagramComments?.nextCursor
            }
            getComments(requestBody)
        }
    }, [triggerGetCommentsApi])

    useEffect(() => {
        if (getCommentsApi?.data !== undefined && !getCommentsApi?.isLoading && !getCommentsApi?.isFetching) {
            const cursorToNextData = getCommentsApi.data?.paging?.cursors?.after === undefined ? null : getCommentsApi.data?.paging?.cursors?.after
            if (instagramComments?.data === null) {
                setInstagramComments({
                    data: getCommentsApi?.data?.data,
                    nextCursor: cursorToNextData
                })
            } else {
                const updatedComments = [...instagramComments?.data, ...getCommentsApi?.data?.data]
                // const commentsWithoutDuplicates = removeDuplicatesObjectsFromArray(updatedComments, "id")
                setInstagramComments({
                    data: updatedComments,
                    nextCursor: cursorToNextData
                })
            }
        }
    }, [getCommentsApi])

    useEffect(() => {
        if (getReplies && ((getReplyForComment?.reference === "SHOW_MORE_REPLIES" && getReplyForComment?.comment?.replyData === undefined) || (getReplyForComment?.reference === "LOAD_MORE"))) {
            setGetReplies(false);
            const requestBody = {
                ...baseQuery,
                id: getReplyForComment?.comment?.id,
                limit: 6,
                next: getReplyForComment?.comment?.replyData?.nextCursor === undefined ? null : getReplyForComment?.comment?.replyData?.nextCursor
            }
            getRepliesOnComment(requestBody)
        }
    }, [getReplies])

    useEffect(() => {
        if (getRepliesOnCommentApi?.data !== undefined && !getRepliesOnCommentApi?.isLoading && !getRepliesOnCommentApi?.isFetching && getReplyForComment !== null && Object.keys(getReplyForComment)?.length > 0) {
            const cursorToNext = getRepliesOnCommentApi?.data?.paging?.cursors?.after === undefined ? null : getRepliesOnCommentApi?.data?.paging?.cursors?.after
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
            let updatedInstagramComments = [...instagramComments?.data]
            updatedInstagramComments[getReplyForComment?.index] = updatedComment
            setInstagramComments({
                ...instagramComments,
                data: [...updatedInstagramComments]
            })
            setGetReplyForComment({})
        }
    }, [getRepliesOnCommentApi])

    useEffect(() => {
        if (postCommentApi?.data && !postCommentApi?.isLoading) {
            //Add Comment on the top of array
            let newComment = postCommentApi?.data;
            const previousData = getValueOrDefault(instagramComments.data, []);
            setInstagramComments({
                ...instagramComments,
                data: [newComment, ...previousData]
            })
        }
    }, [postCommentApi])

    useEffect(() => {
        if (postReplyApi?.data) {
            let updatedCommentsList = [...instagramComments?.data]
            let updatedComment = updatedCommentsList[replyToComment?.index]
            updatedComment = {
                ...updatedComment,
                replies: {
                    ...updatedComment?.replies,
                    data: [{id: postReplyApi?.data?.id}, ...getValueOrDefault(updatedComment?.replies?.data, [])]
                },
                replyData: {
                    ...updatedComment?.replyData,
                    data: replyToComment?.parentCommentLevel === "FIRST" ? [{...postReplyApi?.data}, ...getValueOrDefault(updatedComment?.replyData?.data, [])] : [...getValueOrDefault(updatedComment?.replyData?.data, []), {...postReplyApi?.data}],
                    nextCursor: updatedComment?.replyData?.nextCursor === undefined ? null : updatedComment?.replyData?.nextCursor
                }
            }
            updatedCommentsList[replyToComment?.index] = updatedComment;
            setInstagramComments({
                ...instagramComments,
                data: updatedCommentsList
            })
            let showReply = [...showReplies]
            showReply[replyToComment?.index] = true
            setShowReplies(showReply)
            setReplyToComment(null)
        }
    }, [postReplyApi])

    useEffect(() => {
        if (commentToDelete) {
            handleDeleteComment()
        }
    }, [commentToDelete])

    function handleOnEmojiClick(emojiData) {
        setReply({
            ...reply,
            message: reply.message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        })
    }

    const handleDeleteComment = async () => {
        const requestBody = {
            ...baseQuery,
            id: commentToDelete,
        }
        await handleRTKQuery(
            async () => {
                return await deleteComment(requestBody).unwrap();
            },
            () => {
                setDirty({
                    ...isDirty,
                    isDirty: true,
                    action: {
                        ...isDirty?.action,
                        type: "DELETE",
                        on: "COMMENT"
                    }
                });
                setDeletedCommentIds([...deletedCommentIds, commentToDelete]);
                dispatch(addyApi.util.invalidateTags(["getPostSocioDataApi"]));
            },
            null,
            ()=>{
                setCommentToDelete(null)
            }
        );



    }
    const handleReplyCommentOnPost = async (e) => {
        e.preventDefault();
        const requestBody = {
            ...baseQuery,
            id: reply.parentId,
            data: {
                message: reply.message
            },
        }
        await handleRTKQuery(
            async () => {
                return await onReply(requestBody).unwrap();
            },
            () => {
                setDirty({
                    ...isDirty,
                    isDirty: true,
                    action: {
                        type: "POST",
                        on: "COMMENT",
                        commentLevel: "SECOND",
                    }
                })
                setReply({
                    parentId: null,
                    message: ""
                })
                dispatch(addyApi.util.invalidateTags(["getPostSocioDataApi"]));
            }
        );
    }


    return (
        <>
            {
                postSocioData?.comments_count === 0 && <div className={"no-cmnt-txt"}>No comments yet!</div>
            }
            {
                postSocioData?.comments_count > 0 && instagramComments?.data === null ? <CommonLoader/> :
                    instagramComments?.data?.map((comment, index) => {
                        return (
                            <>
                                <div key={index} className="comment_wrap">
                                    {
                                        commentToDelete === comment.id ?
                                            <div className={"mb-3"}>
                                                <Skeleton className={"h-20"}/>
                                            </div>
                                            :
                                            !deletedCommentIds.includes(comment.id) && <div className="user_card">
                                                <div className="user_image">
                                                    <img
                                                        src={postData?.page?.pageId === comment?.from?.id ? comment?.user?.profile_picture_url || default_user_icon : default_user_icon}
                                                        alt=""/>
                                                </div>
                                                <div className="user">
                                                    <>
                                                        <div className={"user_name_edit_btn_outer"}>
                                                            <p className="user_name">
                                                                {comment?.from?.username}
                                                            </p>
                                                            <Dropdown>
                                                                <Dropdown.Toggle className={"comment-edit-del-button"}
                                                                                 variant="success" id="dropdown-basic">
                                                                    <PiDotsThreeVerticalBold
                                                                        onClick={()=>{
                                                                            setReplyToComment(null)
                                                                            setReply({
                                                                                parentId: null,
                                                                                message: ""
                                                                            })
                                                                        }}
                                                                        className={"comment-edit-del-icon"}/>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        href="#/action-2"
                                                                        onClick={() => {
                                                                            if (deleteCommentApi?.isLoading) return;
                                                                            setCommentToDelete(comment?.id)
                                                                            setDirty({
                                                                                ...isDirty,
                                                                                action: {
                                                                                    ...isDirty?.action,
                                                                                    reduceCommentCount: 1 + (comment?.hasOwnProperty("replies") ? comment?.replies?.data?.length : 0),
                                                                                }
                                                                            })
                                                                        }}>Delete</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>


                                                        <div className={"comment_message"}>
                                                            <CommentText socialMediaType={"INSTAGRAM"}
                                                                         comment={comment?.text}
                                                                         className={""}/>
                                                        </div>
                                                        <div
                                                            className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                            <p>{getCommentCreationTime(comment?.timestamp)}</p>
                                                            {comment?.like_count > 0 &&
                                                                <>
                                                                    <LiaThumbsUpSolid fill={"blue"}/>
                                                                    <p>{comment?.like_count}</p>
                                                                </>

                                                            }
                                                            <p className={"cursor-pointer"}
                                                               onClick={() => {
                                                                   setReplyToComment({
                                                                       index: index,
                                                                       comment: comment,
                                                                       parentCommentLevel: "FIRST"
                                                                   })
                                                                   setReply({
                                                                       parentId: comment.id,
                                                                       message: "@" + comment.from.username + " "
                                                                   })
                                                               }}>Reply</p>
                                                        </div>
                                                    </>
                                                    {
                                                        comment?.replies?.data?.length > 0 && comment?.replies?.data?.length > countCommonElementsFromArray(deletedCommentIds, comment?.replies?.data?.map(c => c.id)) &&
                                                        <p className="reply_toggle mb-2" onClick={() => {
                                                            if (!showReplies[index]) {
                                                                setGetReplyForComment({
                                                                    index: index,
                                                                    comment: comment,
                                                                    reference: "SHOW_MORE_REPLIES",
                                                                });
                                                                setGetReplies(true);
                                                            }
                                                            setShowReplies(handleShowCommentReplies(showReplies, index))
                                                        }}>{!showReplies[index] ? "Show" : "Hide"} {comment?.replies?.data?.length - countCommonElementsFromArray(deletedCommentIds, comment?.replies?.data?.map(c => c.id))} {comment?.replies?.data?.length - countCommonElementsFromArray(deletedCommentIds, comment?.replies?.data?.map(c => c.id)) > 1 ? "replies" : "reply"}</p>
                                                    }
                                                    {
                                                        showReplies[index] && <>
                                                            {
                                                                comment?.replyData?.data?.map((childComment, i) => {
                                                                    return (
                                                                        <div key={i} className="comment_wrap">
                                                                            {
                                                                                commentToDelete === childComment.id ?
                                                                                    <div className={"mb-3"}>
                                                                                        <Skeleton
                                                                                            className={"h-20"}/>
                                                                                    </div> :
                                                                                    !deletedCommentIds.includes(childComment.id) &&
                                                                                    <div className="user_card">
                                                                                        <div className="user_image">
                                                                                            <img
                                                                                                src={postData?.page?.pageId === childComment?.from?.id ? postData?.page?.imageUrl || default_user_icon : default_user_icon}
                                                                                                alt=""/>
                                                                                        </div>
                                                                                        <div className="user">
                                                                                            <>
                                                                                                <div
                                                                                                    className={"user_name_edit_btn_outer"}>
                                                                                                    <p className="user_name">
                                                                                                        {childComment?.from?.username}
                                                                                                    </p>
                                                                                                    <Dropdown>
                                                                                                        <Dropdown.Toggle
                                                                                                            className={"comment-edit-del-button"}
                                                                                                            variant="success"
                                                                                                            id="dropdown-basic">
                                                                                                            <PiDotsThreeVerticalBold
                                                                                                                onClick={()=>{
                                                                                                                    setReplyToComment(null)
                                                                                                                    setReply({
                                                                                                                        parentId: null,
                                                                                                                        message: ""
                                                                                                                    })
                                                                                                                }}
                                                                                                                className={"comment-edit-del-icon"}/>
                                                                                                        </Dropdown.Toggle>
                                                                                                        <Dropdown.Menu>
                                                                                                            <Dropdown.Item
                                                                                                                href="#/action-2"
                                                                                                                onClick={() => {
                                                                                                                    if (deleteCommentApi?.isLoading) return;
                                                                                                                    setCommentToDelete(childComment?.id)
                                                                                                                    setDirty({
                                                                                                                        ...isDirty,
                                                                                                                        action: {
                                                                                                                            ...isDirty?.action,
                                                                                                                            reduceCommentCount: 1,
                                                                                                                        }
                                                                                                                    })
                                                                                                                }}>Delete</Dropdown.Item>
                                                                                                        </Dropdown.Menu>
                                                                                                    </Dropdown>
                                                                                                </div>

                                                                                                <p>
                                                                                                    <CommentText
                                                                                                        socialMediaType={"INSTAGRAM"}
                                                                                                        comment={childComment?.text}
                                                                                                        className={""}/>
                                                                                                </p>

                                                                                                <div
                                                                                                    className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                                                                    <p>{getCommentCreationTime(childComment?.timestamp)}</p>
                                                                                                    {/*<p className={"cursor_pointer "}*/}
                                                                                                    {/*   onClick={() => {*/}
                                                                                                    {/*   }}*/}
                                                                                                    {/*>Like</p>*/}


                                                                                                    {childComment?.like_count > 0 &&
                                                                                                        <>
                                                                                                            <LiaThumbsUpSolid
                                                                                                                fill={"blue"}/>
                                                                                                            <p>{childComment?.like_count}</p>
                                                                                                        </>

                                                                                                    }
                                                                                                    <p className={"cursor-pointer"}
                                                                                                       onClick={() => {
                                                                                                           setReplyToComment({
                                                                                                               index: index,
                                                                                                               comment: childComment,
                                                                                                               parentCommentLevel: "SECOND"
                                                                                                           })
                                                                                                           setReply({
                                                                                                               parentId: childComment.parent_id,
                                                                                                               message: "@" + childComment.from.username + " "
                                                                                                           })

                                                                                                       }}>Reply</p>


                                                                                                </div>
                                                                                            </>


                                                                                            {
                                                                                                replyToComment?.comment?.id === childComment.id && <>
                                                                                                    <div className="reply_wrap">
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
                                                                                                               value={reply?.message}
                                                                                                               onClick={() => {
                                                                                                                   setShowEmojiPicker(false)
                                                                                                               }}
                                                                                                               onKeyPress={(event) => {
                                                                                                                   if (event.key === 'Enter') {
                                                                                                                       const element = document.getElementById('post-reply-to-parent-btn');
                                                                                                                       if (element) {
                                                                                                                           element.click();
                                                                                                                       }
                                                                                                                   }
                                                                                                               }}
                                                                                                               className={postReplyApi?.isLoading ? "form-control opacity-50" : "form-control "}
                                                                                                               onChange={(e) => {
                                                                                                                   setShowEmojiPicker(false)
                                                                                                                   e.preventDefault();
                                                                                                                   setReply({
                                                                                                                       ...reply,
                                                                                                                       message: e.target.value
                                                                                                                   })
                                                                                                               }}
                                                                                                        />
                                                                                                        <button
                                                                                                            id={"post-reply-to-parent-btn"}
                                                                                                            disabled={postReplyApi?.isLoading || isNullOrEmpty(reply?.message)}
                                                                                                            onClick={(e) => {
                                                                                                                setShowEmojiPicker(false)
                                                                                                                !isNullOrEmpty(reply?.message) && handleReplyCommentOnPost(e)

                                                                                                            }}
                                                                                                            className={postReplyApi?.isLoading || isNullOrEmpty(reply?.message) ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                                                            {
                                                                                                                postReplyApi?.isLoading ?
                                                                                                                    <RotatingLines
                                                                                                                        strokeColor="white"
                                                                                                                        strokeWidth="5"
                                                                                                                        animationDuration="0.75"
                                                                                                                        width="20"
                                                                                                                        visible={true}></RotatingLines> :
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
                                                                            (comment?.replies?.data?.length > comment?.replyData?.data?.length) &&
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
                                                        replyToComment?.comment?.id === comment.id &&
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
                                                                   value={reply?.message}
                                                                   onClick={() => {
                                                                       setShowEmojiPicker(false)
                                                                   }}
                                                                   className={postReplyApi?.isLoading ? "form-control opacity-50" : "form-control "}
                                                                   onChange={(e) => {
                                                                       e.preventDefault();
                                                                       setShowEmojiPicker(false)
                                                                       setReply({...reply, message: e.target.value})
                                                                   }}
                                                                   onKeyPress={(event) => {
                                                                       if (event.key === 'Enter') {
                                                                           const element = document.getElementById('post-reply-to-child-btn');
                                                                           if (element) {
                                                                               element.click();
                                                                           }
                                                                       }
                                                                   }}
                                                            />
                                                            <button
                                                                id={"post-reply-to-child-btn"}
                                                                disabled={postReplyApi?.isLoading || isNullOrEmpty(reply.message)}
                                                                onClick={(e) => {
                                                                    setShowEmojiPicker(false)
                                                                    !isNullOrEmpty(reply.message) && handleReplyCommentOnPost(e);
                                                                }}
                                                                className={postReplyApi?.isLoading || isNullOrEmpty(reply.message) ? "view_post_btn cmn_bg_btn px-2 opacity-50" : "view_post_btn cmn_bg_btn px-2"}>{
                                                                postReplyApi?.isLoading ?
                                                                    <RotatingLines strokeColor="white"
                                                                                   strokeWidth="5"
                                                                                   animationDuration="0.75" width="20"
                                                                                   visible={true}/>
                                                                    : "Submit"
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
                            </>


                        )
                    })
            }
            {
                ((getCommentsApi?.isLoading || getCommentsApi?.isFetching) && Array.isArray(instagramComments?.data)) ?
                    <div className={" text-center z-index-1 mt-1"}><RotatingLines strokeColor="#F07C33"
                                                                                  strokeWidth="5"
                                                                                  animationDuration="0.75"
                                                                                  width="30"
                                                                                  visible={true}/>
                    </div> :
                    <>
                        {
                            instagramComments?.nextCursor !== null &&
                            <div className={"ms-2 mt-2 load-more-cmnt-txt cursor-pointer"} onClick={() => {
                                setTriggerGetCommentsApi(true)
                            }}>Load more comments
                            </div>
                        }
                    </>
            }
        </>
    )

}
export default InstagramCommentsSection
