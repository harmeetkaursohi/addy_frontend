import img from "../../../../images/draft.png";
import {
    getCommentCreationTime,
    getTagCommentsFormat, getUpdateCommentMessage,
    handleShowCommentReplies,
    handleShowCommentReplyBox, isNullOrEmpty, isReplyCommentEmpty
} from "../../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {
    addCommentOnPostAction, deleteCommentsOnPostAction, dislikePostAction,
    getCommentsOnPostAction, getPostPageInfoAction,
    likePostAction, updateCommentsOnPostAction
} from "../../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import CommonLoader from "../../../common/components/CommonLoader";
import CommonSlider from "../../../common/components/CommonSlider";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {showErrorToast} from "../../../common/components/Toast";
import {BiSolidSend} from "react-icons/bi";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {Dropdown} from "react-bootstrap";

const Comments = ({postData}) => {
    const dispatch = useDispatch();
    const getCommentsOnPostActionData = useSelector(state => state.post.getCommentsOnPostActionReducer)
    const addCommentOnPostActionData = useSelector(state => state.post.addCommentOnPostActionReducer)
    const updateCommentsOnPostActionData = useSelector(state => state.post.updateCommentsOnPostActionReducer)
    const [showReplyBox, setShowReplyBox] = useState([])
    const [showReplyComments, setShowReplyComments] = useState([])
    const [replyToCommentId, setReplyToCommentId] = useState("")
    const [replyComment, setReplyComment] = useState({
        mentionedPageId: "",
        mentionedPageName: "",
        message: ""
    })
    const [updateComment, setUpdateComment] = useState({})
    const [baseQuery, setBaseQuery] = useState({
        socialMediaType: postData?.socialMediaType,
        pageAccessToken: postData?.page?.access_token,
    })
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    useEffect(() => {
        handleGetComments(postData?.id)
    }, [])
    const handleGetComments = (objectId, isGetChildComments = false) => {
        const requestBody = {
            ...baseQuery,
            id: objectId,
            hasParentComment: isGetChildComments,
            ...(isGetChildComments ? {parentComments: getCommentsOnPostActionData?.data} : {}),

        }
        dispatch(getCommentsOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                !isGetChildComments && setShowReplyComments(new Array(response.payload.length).fill(false))
                // showReplyBox.length === 0 && setShowReplyComments(new Array(response.payload.length).fill(false))

            }
        })
    }
    const handleAddCommentOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            ...baseQuery,
            id: replyToCommentId,
            data: {
                message: getTagCommentsFormat(replyComment)
            },
        }
        dispatch(addCommentOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                setReplyComment("")
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

    function handleOnEmojiClick(emojiData) {
        setReplyComment({
            ...replyComment,
            message: replyComment.message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        })
    }

    const handleDeleteComment = (commentId) => {
        const requestBody = {
            ...baseQuery,
            id: commentId,
        }
        dispatch(deleteCommentsOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                handleGetComments(postData?.id)
                const requestBody = {
                    postIds: [postData?.id],
                    pageAccessToken: postData?.page?.access_token,
                    socialMediaType: postData?.socialMediaType
                }
                dispatch(getPostPageInfoAction(requestBody))
            }
        })
    }
    const handleUpdateComment = () => {

        const requestBody = {
            ...baseQuery,
            id: updateComment?.id,
            data: {
                message: getUpdateCommentMessage(updateComment)
            }
        }
        dispatch(updateCommentsOnPostAction(requestBody)).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                setUpdateComment({})
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
                                    {
                                        updateComment?.id !== comment?.id ?
                                            <>
                                                <div className={"user_name_edit_btn_outer"}>
                                                    <p className="user_name">
                                                        {comment?.from?.name}
                                                    </p>
                                                    <Dropdown>
                                                        <Dropdown.Toggle className={"comment-edit-del-button"}
                                                                         variant="success" id="dropdown-basic">
                                                            <PiDotsThreeVerticalBold
                                                                className={"comment-edit-del-icon"}/>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {
                                                                comment?.from?.id === postData?.page?.pageId &&
                                                                <Dropdown.Item onClick={() => {
                                                                    !updateCommentsOnPostActionData?.loading && setUpdateComment(comment)
                                                                }
                                                                }>Edit</Dropdown.Item>
                                                            }
                                                            {
                                                                comment?.can_remove &&
                                                                <Dropdown.Item href="#/action-2" onClick={() => {
                                                                    handleDeleteComment(comment?.id)
                                                                }}>Delete</Dropdown.Item>
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>


                                                <div className={"comment_message"}>
                                                    {comment?.message}
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
                                                            viewSimilarToSocialMedia={false}/>
                                                    </div>


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
                                                            <LiaThumbsUpSolid fill={"blue"}/>
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
                                            </> :
                                            <>
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
                                                           value={updateComment?.message}
                                                           onClick={() => {
                                                               setShowEmojiPicker(false)
                                                           }}
                                                           className="form-control "
                                                           onChange={(e) => {
                                                               setShowEmojiPicker(false)
                                                               e.preventDefault();
                                                               setUpdateComment({
                                                                   ...updateComment,
                                                                   message: e.target.value
                                                               })
                                                           }}
                                                    />
                                                    <button
                                                        disabled={updateCommentsOnPostActionData?.loading || isNullOrEmpty(updateComment?.message)}
                                                        onClick={(e) => {
                                                            !isNullOrEmpty(updateComment?.message) && handleUpdateComment()
                                                            setShowEmojiPicker(false)
                                                        }}
                                                        className={isNullOrEmpty(updateComment?.message) ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                        <BiSolidSend className={"cursor-pointer update_comment_icon"}/>
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
                                                    return (
                                                        <div key={i} className="comment_wrap">
                                                            <div className="user_card">
                                                                <div className="user_image">
                                                                    <img src={childComment?.from?.picture} alt=""/>
                                                                </div>
                                                                <div className="user">
                                                                    {
                                                                        updateComment?.id !== childComment?.id ?
                                                                            <>
                                                                                <div className={"user_name_edit_btn_outer"}>
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
                                                                                                        !updateCommentsOnPostActionData?.loading && setUpdateComment(childComment)
                                                                                                    }
                                                                                                    }>Edit</Dropdown.Item>
                                                                                            }
                                                                                            {
                                                                                                childComment?.can_remove &&
                                                                                                <Dropdown.Item
                                                                                                    href="#/action-2"
                                                                                                    onClick={() => {
                                                                                                        handleDeleteComment(childComment?.id)
                                                                                                    }}>Delete</Dropdown.Item>
                                                                                            }
                                                                                        </Dropdown.Menu>
                                                                                    </Dropdown>
                                                                                </div>

                                                                                <p>
                                                                                    {childComment?.message}
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
                                                                                            <LiaThumbsUpSolid
                                                                                                fill={"blue"}/>
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
                                                                            </>


                                                                            :


                                                                            <>
                                                                                <div className="reply_wrap">
                                                                                    <svg
                                                                                        className="emoji-picker-icon cursor_pointer"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="22" height="22"
                                                                                        viewBox="0 0 22 22" fill="none"
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
                                                                                    <input type="text" placeholder="reply"
                                                                                           value={updateComment?.message}
                                                                                           onClick={() => {
                                                                                               setShowEmojiPicker(false)
                                                                                           }}
                                                                                           className="form-control "
                                                                                           onChange={(e) => {
                                                                                               setShowEmojiPicker(false)
                                                                                               e.preventDefault();
                                                                                               setUpdateComment({
                                                                                                   ...updateComment,
                                                                                                   message: e.target.value
                                                                                               })
                                                                                           }}
                                                                                    />
                                                                                    <button
                                                                                        disabled={updateCommentsOnPostActionData?.loading || isNullOrEmpty(updateComment?.message)}
                                                                                        onClick={(e) => {
                                                                                            !isNullOrEmpty(updateComment?.message) && handleUpdateComment()
                                                                                            setShowEmojiPicker(false)
                                                                                        }}
                                                                                        className={isNullOrEmpty(updateComment?.message) ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                                        <BiSolidSend
                                                                                            className={"cursor-pointer update_comment_icon"}/>
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


                                                        </div>
                                                    );
                                                })
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
                                                       setReplyComment({...replyComment, message: e.target.value})
                                                   }}
                                            />
                                            <button
                                                disabled={addCommentOnPostActionData?.loading || isReplyCommentEmpty(replyComment)}
                                                onClick={(e) => {
                                                    !isReplyCommentEmpty(replyComment) && handleAddCommentOnPost(e);
                                                    setShowEmojiPicker(false)
                                                }}
                                                className={isReplyCommentEmpty(replyComment) ? "view_post_btn cmn_bg_btn px-2 opacity-50" : "view_post_btn cmn_bg_btn px-2"}>Submit
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


                        </div>
                    )
                        ;
                })


    )
        ;
}
export default Comments