import img from "../../../../images/draft.png";
import {Dropdown} from "react-bootstrap";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {
    getCommentCreationTime,
    handleShowCommentReplies,
    isNullOrEmpty,
} from "../../../../utils/commonUtils";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {BiSolidSend} from "react-icons/bi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {
    deleteCommentsOnPostAction,
    getPostPageInfoAction,
    replyCommentOnPostAction
} from "../../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import default_user_icon from "../../../../images/default_user_icon.svg"
import Skeleton from "../../../loader/skeletonEffect/Skeleton";
import {RotatingLines} from "react-loader-spinner";
import CommentText from "./CommentText";

const InstagramCommentsSection = ({postData, postPageData, isDirty, setDirty}) => {
    const dispatch = useDispatch();
    const [showReplies, setShowReplies] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [replyToComment, setReplyToComment] = useState(null);
    const [reply, setReply] = useState({parentId: null, message: null});
    const [baseQuery, setBaseQuery] = useState({
        socialMediaType: postData?.socialMediaType,
        pageAccessToken: postData?.page?.access_token,
    });
    const [commentToDelete, setCommentToDelete] = useState(null);
    const replyCommentOnPostData = useSelector(state => state.post.replyCommentOnPostActionReducer)


    useEffect(() => {
        if (postPageData) {
            setShowReplies(showReplies.length === 0 ? new Array(postPageData?.comments?.data?.length).fill(false) : [...showReplies])
        }
    }, [postPageData])

    useEffect(() => {
        if (commentToDelete) {
            const requestBody = {
                ...baseQuery,
                id: commentToDelete,
            }
            dispatch(deleteCommentsOnPostAction(requestBody)).then(response => {
                setCommentToDelete(null)
                if (response.meta.requestStatus === "fulfilled") {
                    setDirty({
                        ...isDirty,
                        isDirty: true,
                        action: {
                            ...isDirty?.action,
                            type: "DELETE",
                            on: "COMMENT"
                        }
                    })
                    const getPostPageRequestBody = {
                        ...baseQuery,
                        postIds: [postData?.id]
                    }
                    dispatch(getPostPageInfoAction(getPostPageRequestBody));
                }
            })

        }
    }, [commentToDelete])

    function handleOnEmojiClick(emojiData) {
        setReply({
            ...reply,
            message: reply.message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        })
    }


    const handleReplyCommentOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            ...baseQuery,
            id: reply.parentId,
            data: {
                message: reply.message
            },
        }
        dispatch(replyCommentOnPostAction(requestBody)).then(res => {
            if (res.meta.requestStatus === "fulfilled") {
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
                setReplyToComment(null)
                const getPostPageRequestBody = {
                    ...baseQuery,
                    postIds: [postData?.id]
                }
                dispatch(getPostPageInfoAction(getPostPageRequestBody));
            }
        })
    }
    return (

        postPageData?.comments === undefined ?
            <div className={"no-cmnt-txt"}>No comments yet!</div>
            :


            postPageData?.comments?.data?.map((comment, index) => {
                console.log("comment===>", comment)
                return (
                    <>
                        <div key={index} className="comment_wrap">
                            {
                                commentToDelete === comment.id ?
                                    <div className={"mb-3"}>
                                        <Skeleton className={"mb-2"}></Skeleton>
                                    </div>
                                    :
                                    <div className="user_card">
                                        <div className="user_image">
                                            <img
                                                src={postData?.page?.pageId === comment?.from?.id ? comment?.user?.profile_picture_url  || default_user_icon: default_user_icon}
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
                                                                className={"comment-edit-del-icon"}/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="#/action-2" onClick={() => {
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
                                                    <CommentText socialMediaType={"INSTAGRAM"} comment={comment?.text}
                                                                 className={"highlight cursor-pointer"}/>
                                                </div>
                                                <div
                                                    className="user_impressions d-flex gap-3 mt-2 mb-2">
                                                    <p>{getCommentCreationTime(comment?.timestamp)}</p>
                                                    {/*<p className={comment?.user_likes ? "cursor_pointer color-blue" : "cursor_pointer "}*/}
                                                    {/*   onClick={() => {*/}
                                                    {/*       // comment?.user_likes ? handleDisLikeComment(comment?.id) : handleLikeComment(comment?.id)*/}
                                                    {/*   }}*/}

                                                    {/*>Like</p>*/}


                                                    {comment?.like_count > 0 &&
                                                        <>
                                                            <LiaThumbsUpSolid fill={"blue"}/>
                                                            <p>{comment?.like_count}</p>
                                                        </>

                                                    }
                                                    <p className={"cursor-pointer"}
                                                       onClick={() => {
                                                           setReplyToComment(comment)
                                                           setReply({
                                                               parentId: comment.id,
                                                               message: "@" + comment.from.username + " "
                                                           })
                                                       }}>Reply</p>
                                                </div>
                                            </>

                                            {
                                                comment?.replies?.data?.length > 0 &&
                                                <p className="reply_toggle mb-2" onClick={() => {
                                                    setShowReplies(handleShowCommentReplies(showReplies, index))
                                                }}>{!showReplies[index] ? "Show" : "Hide"} {comment?.replies?.data?.length} {comment?.replies?.data?.length > 1 ? "replies" : "reply"}</p>
                                            }
                                            {
                                                showReplies[index] && <>
                                                    {
                                                        comment?.replies?.data?.map((childComment, i) => {
                                                            return (
                                                                <div key={i} className="comment_wrap">
                                                                    {
                                                                        commentToDelete === childComment.id ?
                                                                            <div className={"mb-3"}>
                                                                                <Skeleton className={"mb-2"}></Skeleton>
                                                                            </div> :
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
                                                                                                        className={"comment-edit-del-icon"}/>
                                                                                                </Dropdown.Toggle>
                                                                                                <Dropdown.Menu>
                                                                                                    <Dropdown.Item
                                                                                                        href="#/action-2"
                                                                                                        onClick={() => {
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
                                                                                                className={"highlight cursor-pointer"}/>
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
                                                                                                   setReplyToComment(childComment)
                                                                                                   setReply({
                                                                                                       parentId: childComment.parent_id,
                                                                                                       message: "@" + childComment.from.username + " "
                                                                                                   })

                                                                                               }}>Reply</p>


                                                                                        </div>
                                                                                    </>


                                                                                    {
                                                                                        replyToComment?.id === childComment.id && <>
                                                                                            <div className="reply_wrap">
                                                                                                <svg
                                                                                                    className="emoji-picker-icon cursor_pointer"
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    width="22" height="22"
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
                                                                                                       className={replyCommentOnPostData?.loading ? "form-control opacity-50" : "form-control "}
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
                                                                                                    disabled={replyCommentOnPostData?.loading || isNullOrEmpty(reply?.message)}
                                                                                                    onClick={(e) => {
                                                                                                        setShowEmojiPicker(false)
                                                                                                        !isNullOrEmpty(reply?.message) && handleReplyCommentOnPost(e)

                                                                                                    }}
                                                                                                    className={replyCommentOnPostData?.loading || isNullOrEmpty(reply?.message) ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                                                    {
                                                                                                        replyCommentOnPostData?.loading ?
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
                                                </>
                                            }
                                            {
                                                replyToComment?.id === comment.id &&
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
                                                           value={reply?.message}
                                                           onClick={() => {
                                                               setShowEmojiPicker(false)
                                                           }}
                                                           className={replyCommentOnPostData?.loading ? "form-control opacity-50" : "form-control "}
                                                           onChange={(e) => {
                                                               e.preventDefault();
                                                               setShowEmojiPicker(false)
                                                               setReply({...reply, message: e.target.value})
                                                           }}
                                                    />
                                                    <button
                                                        disabled={replyCommentOnPostData?.loading || isNullOrEmpty(reply.message)}
                                                        onClick={(e) => {
                                                            setShowEmojiPicker(false)
                                                            !isNullOrEmpty(reply.message) && handleReplyCommentOnPost(e);
                                                        }}
                                                        className={replyCommentOnPostData?.loading || isNullOrEmpty(reply.message) ? "view_post_btn cmn_bg_btn px-2 opacity-50" : "view_post_btn cmn_bg_btn px-2"}>{
                                                        replyCommentOnPostData?.loading ?
                                                            <RotatingLines strokeColor="white"
                                                                           strokeWidth="5"
                                                                           animationDuration="0.75" width="20"
                                                                           visible={true}></RotatingLines>
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
                    </>)
            })
    )

}
export default InstagramCommentsSection
