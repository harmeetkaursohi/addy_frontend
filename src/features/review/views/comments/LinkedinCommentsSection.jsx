import Skeleton from "../../../loader/skeletonEffect/Skeleton";
import img from "../../../../images/draft.png";
import {Dropdown} from "react-bootstrap";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import default_user_icon from "../../../../images/default_user_icon.svg"
import CommentText from "./CommentText";
import CommonSlider from "../../../common/components/CommonSlider";
import {
    extractCommentersProfileDataForLinkedin,
    extractMentionedUsernamesFromLinkedinComments, extractParameterFromUrl,
    getCommentCreationTime,
    handleShowCommentReplies,
    handleShowCommentReplyBox,
    isNullOrEmpty, isReplyCommentEmpty
} from "../../../../utils/commonUtils";
import {LiaThumbsUpSolid} from "react-icons/lia";
import {RotatingLines} from "react-loader-spinner";
import {BiSolidSend} from "react-icons/bi";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    deleteCommentsOnPostAction,
    getCommentsOnPostAction,
    getPostPageInfoAction
} from "../../../../app/actions/postActions/postActions";
import {getToken} from "../../../../app/auth/auth";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";
import CommonLoader from "../../../common/components/CommonLoader";

const LinkedinCommentsSection = ({postData}) => {
    const token = getToken();
    const dispatch = useDispatch();
    const getCommentsOnPostActionData = useSelector(state => state.post.getCommentsOnPostActionReducer)
    const addCommentOnPostData = useSelector(state => state.post.addCommentOnPostActionReducer)
    const [linkedinComments, setLinkedinComments] = useState(null);
    const [startFrom, setStartFrom] = useState(0);
    const [baseQuery, setBaseQuery] = useState({
        socialMediaType: postData?.socialMediaType,
        token: token
    })
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [getLinkedinComments, setGetLinkedinComments] = useState(null);
    const [deletedComments, setDeletedComments] = useState([]);
    const [updateComment, setUpdateComment] = useState({})
    const [showReplyComments, setShowReplyComments] = useState([])

    useEffect(() => {
        dispatch(getCommentsOnPostAction({
            ...baseQuery,
            id: postData?.id,
            pageSize: 3,
            start: startFrom
        })).then(response => {
            if (response.meta.requestStatus === "fulfilled") {
                if (response?.payload?.paging?.links?.filter(link => link.rel === "next")?.length === 0) {
                    setStartFrom(null);
                } else {
                    setStartFrom(parseInt(extractParameterFromUrl(`${import.meta.env.VITE_APP_LINKEDIN_BASE_URL}` + response?.payload.paging?.links?.filter(link => link.rel === "next")[0]?.href, "start")))
                }
            }
        })
        //Add Comment reducer is reset as we need to push the latest comment in array no need to hit new api
        dispatch(resetReducers({sliceNames: ["addCommentOnPostActionReducer"]}))
    }, [getLinkedinComments])


    useEffect(() => {
        if (getCommentsOnPostActionData?.data !== undefined && !getCommentsOnPostActionData?.loading) {
            if (linkedinComments === null) {
                setLinkedinComments(getCommentsOnPostActionData?.data)
            } else {
                const updatedComments = [...linkedinComments?.elements, ...getCommentsOnPostActionData?.data?.elements]
                const seen = new Set();
                const commentsWithoutDuplicates = updatedComments.filter(item => {
                    const value = item["id"];
                    if (!seen.has(value)) {
                        seen.add(value);
                        return true;
                    }
                    return false;
                });
                setLinkedinComments({
                    paging: getCommentsOnPostActionData?.data?.paging,
                    elements: commentsWithoutDuplicates
                })
            }
            dispatch(resetReducers({sliceNames: ["getCommentsOnPostActionReducer"]}))
        }
    }, [getCommentsOnPostActionData])

    useEffect(() => {
        if (commentToDelete !== null) {
            const requestBody = {
                ...baseQuery,
                commentId: commentToDelete?.id,
                parentObjectUrn: commentToDelete?.object,
                orgId: commentToDelete?.actor
            }
            dispatch(deleteCommentsOnPostAction(requestBody)).then(response => {
                if (response.meta.requestStatus === "fulfilled") {
                    setDeletedComments([...deletedComments, commentToDelete?.id])
                    dispatch(getPostPageInfoAction({
                        ...baseQuery,
                        postIds: [postData?.id]
                    }))
                }
                setCommentToDelete(null)
            })
        }
    }, [commentToDelete])

    useEffect(() => {
        if (addCommentOnPostData?.data !== undefined) {
            //Add Comment on the top of array
            let newComment = {
                ...addCommentOnPostData?.data,
                "actor~": {
                    localizedName: postData?.page?.name,
                    logoV2: {
                        "original~": {
                            elements: [
                                {
                                    identifiers: [
                                        {
                                            identifier: postData?.page?.imageUrl
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
            setStartFrom(startFrom + 1);
            setLinkedinComments({...linkedinComments, elements: [newComment, ...linkedinComments?.elements]})
            dispatch(resetReducers({sliceNames: ["addCommentOnPostActionReducer"]}))
        }
    }, [addCommentOnPostData])

    return (
        linkedinComments === null ?
            <CommonLoader/>
            :
            (linkedinComments?.elements && linkedinComments?.elements?.length === 0)
                ? <div className={"no-cmnt-txt"}>No comments yet!</div> :

                <>
                    {
                        linkedinComments?.elements?.map((comment, index) => {
                            console.log("comment==>", comment)
                            const commentorsProfile = extractCommentersProfileDataForLinkedin(comment)
                            return (

                                !deletedComments.includes(comment?.id) &&
                                <div key={index} className="comment_wrap">
                                    {
                                        commentToDelete?.id === comment?.id ?
                                            <div className={"mb-3"}>
                                                <Skeleton className={"mb-2"}></Skeleton>
                                            </div> :
                                            <div className="user_card">
                                                <div className="user_image">
                                                    <img
                                                        src={commentorsProfile?.profilePicUrl}
                                                        alt=""/>
                                                </div>
                                                <div className="user">
                                                    {
                                                        // updateComment?.id !== comment?.id ?
                                                        <>
                                                            <div className={"user_name_edit_btn_outer"}>
                                                                <p className="user_name">
                                                                    {commentorsProfile?.name}
                                                                </p>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle
                                                                        className={"comment-edit-del-button"}
                                                                        variant="success" id="dropdown-basic">
                                                                        <PiDotsThreeVerticalBold
                                                                            className={"comment-edit-del-icon"}/>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        {/*{*/}
                                                                        {/*    comment?.actor === postData?.page?.pageId &&*/}
                                                                        {/*    <Dropdown.Item onClick={() => {*/}
                                                                        {/*        // !updateCommentsOnPostActionData?.loading && setUpdateComment(comment)*/}
                                                                        {/*    }*/}
                                                                        {/*    }>Edit</Dropdown.Item>*/}
                                                                        {/*}*/}
                                                                        <Dropdown.Item href="#/action-2"
                                                                                       onClick={() => {
                                                                                           setCommentToDelete(comment)
                                                                                       }}>Delete</Dropdown.Item>

                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>


                                                            <div className={"comment_message"}>

                                                                <CommentText socialMediaType={"LINKEDIN"}
                                                                             comment={comment?.message?.text}
                                                                             className={"font-weight-bold cursor-pointer "}
                                                                             usernames={extractMentionedUsernamesFromLinkedinComments(comment?.message)}
                                                                >
                                                                </CommentText>
                                                            </div>
                                                            {
                                                                comment?.hasOwnProperty("content") &&
                                                                <div className={"comments_attachments"}>
                                                                    <CommonSlider
                                                                        height={"150px"}
                                                                        files={[{
                                                                            mediaType: comment?.content[0]?.type,
                                                                            imageURL: comment?.content[0]?.url,
                                                                        }]}
                                                                        selectedFileType={null} caption={null}
                                                                        hashTag={null}
                                                                        isPublished={true}
                                                                        viewSimilarToSocialMedia={false}/>
                                                                </div>


                                                            }
                                                            <div
                                                                className="user_impressions d-flex mt-2 mb-2">
                                                                <p>{getCommentCreationTime(comment?.created?.time)}</p>
                                                                {/*{*/}
                                                                {/*    true ?*/}
                                                                {/*        <p className={comment?.user_likes ? "cursor_pointer ms-3 color-blue" : "ms-3 cursor_pointer "}*/}
                                                                {/*           onClick={() => {*/}
                                                                {/*               // comment?.user_likes ? handleDisLikeComment(comment?.id) : handleLikeComment(comment?.id)*/}
                                                                {/*           }}*/}

                                                                {/*        >Like</p>*/}
                                                                {/*        : <p className={"ms-3 disable-reply-comment"}>Like</p>*/}

                                                                {/*}*/}

                                                                {/*{comment?.like_count > 0 &&*/}
                                                                {/*    <>*/}
                                                                {/*        <LiaThumbsUpSolid className={"ms-1 me-1"}*/}
                                                                {/*                          fill={"blue"}/>*/}
                                                                {/*        <p className={"me-3"}>{comment?.like_count}</p>*/}
                                                                {/*    </>*/}

                                                                {/*}*/}
                                                                <p className={comment?.can_comment ? "cursor-pointer ms-3" : "disable-reply-comment ms-3"}
                                                                   onClick={() => {
                                                                       if (comment?.can_comment) {
                                                                           // setReplyToCommentId(comment.id)
                                                                           // setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                                                           // setReplyComment({
                                                                           //     ...replyComment,
                                                                           //     mentionedPageId: comment?.from?.id,
                                                                           //     mentionedPageName: comment?.from?.name,
                                                                           //     message: comment?.from?.name + " "
                                                                           // })
                                                                       }
                                                                   }}>Reply</p>
                                                            </div>
                                                        </>
                                                        // :
                                                        // <>
                                                        //     <div className="reply_wrap">
                                                        //         <svg className="emoji-picker-icon cursor_pointer"
                                                        //              xmlns="http://www.w3.org/2000/svg" width="22"
                                                        //              height="22"
                                                        //              viewBox="0 0 22 22" fill="none" onClick={() => {
                                                        //             setShowEmojiPicker(!showEmojiPicker)
                                                        //         }}>
                                                        //             <path
                                                        //                 d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z"
                                                        //                 fill="#323232"/>
                                                        //             <path
                                                        //                 d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z"
                                                        //                 fill="#323232"/>
                                                        //             <path
                                                        //                 d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z"
                                                        //                 fill="#323232"/>
                                                        //         </svg>
                                                        //         <input type="text" placeholder="reply"
                                                        //                value={updateComment?.message}
                                                        //                onClick={() => {
                                                        //                    setShowEmojiPicker(false)
                                                        //                }}
                                                        //                className="form-control "
                                                        //                onChange={(e) => {
                                                        //                    setShowEmojiPicker(false)
                                                        //                    e.preventDefault();
                                                        //                    setUpdateComment({
                                                        //                        ...updateComment,
                                                        //                        message: e.target.value
                                                        //                    })
                                                        //                }}
                                                        //         />
                                                        //         <button
                                                        //             disabled={updateCommentsOnPostActionData?.loading || isNullOrEmpty(updateComment?.message)}
                                                        //             onClick={(e) => {
                                                        //                 !isNullOrEmpty(updateComment?.message) && handleUpdateComment()
                                                        //                 setShowEmojiPicker(false)
                                                        //             }}
                                                        //             className={isNullOrEmpty(updateComment?.message) || updateCommentsOnPostActionData?.loading ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                        //             {
                                                        //                 updateCommentsOnPostActionData?.loading ?
                                                        //                     <RotatingLines strokeColor="white"
                                                        //                                    strokeWidth="5"
                                                        //                                    animationDuration="0.75" width="20"
                                                        //                                    visible={true}></RotatingLines>
                                                        //                     : <BiSolidSend
                                                        //                         className={"cursor-pointer update_comment_icon"}/>
                                                        //             }
                                                        //
                                                        //
                                                        //         </button>
                                                        //
                                                        //         <div>
                                                        //             <div className={"reply-emoji-picker-outer"}>
                                                        //                 {
                                                        //                     showEmojiPicker && <EmojiPicker
                                                        //                         onEmojiClick={(value) => {
                                                        //                             handleOnEmojiClick(value)
                                                        //                         }}
                                                        //                         autoFocusSearch={false}
                                                        //                         emojiStyle={EmojiStyle.NATIVE}
                                                        //                         width={'100%'}
                                                        //                     />
                                                        //                 }
                                                        //             </div>
                                                        //         </div>
                                                        //     </div>
                                                        // </>
                                                    }

                                                    {
                                                        comment?.commentsSummary && comment?.commentsSummary?.aggregatedTotalComments > 0 &&
                                                        <p className="reply_toggle" onClick={() => {
                                                            setShowReplyComments(handleShowCommentReplies(showReplyComments,index))
                                                        }}>{!showReplyComments[index] ? "Show" : "Hide"} {comment?.commentsSummary?.aggregatedTotalComments} {comment?.commentsSummary?.aggregatedTotalComments > 1 ? "replies" : "reply"}</p>
                                                    }
                                                    {/*{*/}
                                                    {/*    showReplyComments[index] && <p className="reply_toggle">Load previous replies</p>*/}
                                                    {/*}*/}
                                                    {
                                                        showReplyComments[index] && <>
                                                            {
                                                                comment?.comments?.data?.map((childComment, i) => {
                                                                    return (
                                                                        <div key={i} className="comment_wrap">
                                                                            {
                                                                                commentToDeleteId === childComment?.id ?
                                                                                    <div className={"mb-3"}>
                                                                                        <Skeleton className={"mb-2"}></Skeleton>
                                                                                    </div> :
                                                                                    <div className="user_card">
                                                                                        <div className="user_image">
                                                                                            <img
                                                                                                src={childComment?.from?.picture?.data?.url}
                                                                                                alt=""/>
                                                                                        </div>
                                                                                        <div className="user">
                                                                                            {
                                                                                                updateComment?.id !== childComment?.id ?
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
                                                                                                                                !updateCommentsOnPostActionData?.loading && setUpdateComment(childComment)
                                                                                                                            }
                                                                                                                            }>Edit</Dropdown.Item>
                                                                                                                    }
                                                                                                                    {
                                                                                                                        childComment?.can_remove &&
                                                                                                                        <Dropdown.Item
                                                                                                                            href="#/action-2"
                                                                                                                            onClick={() => {
                                                                                                                                setCommentToDeleteId(childComment?.id)
                                                                                                                            }}>Delete</Dropdown.Item>
                                                                                                                    }
                                                                                                                </Dropdown.Menu>
                                                                                                            </Dropdown>
                                                                                                        </div>

                                                                                                        <p>
                                                                                                            <CommentText
                                                                                                                socialMediaType={"FACEBOOK"}
                                                                                                                comment={childComment?.message}
                                                                                                                className={"font-weight-bold cursor-pointer "}
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
                                                                                                                className={isNullOrEmpty(updateComment?.message) || updateCommentsOnPostActionData?.loading ? " update_comment_btn px-2 opacity-50" : " update_comment_btn px-2 "}>
                                                                                                                {
                                                                                                                    updateCommentsOnPostActionData?.loading ?
                                                                                                                        <RotatingLines
                                                                                                                            strokeColor="white"
                                                                                                                            strokeWidth="5"
                                                                                                                            animationDuration="0.75"
                                                                                                                            width="20"
                                                                                                                            visible={true}></RotatingLines>
                                                                                                                        : <BiSolidSend
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
                                                    {/*{*/}
                                                    {/*    showReplyBox[index] &&*/}
                                                    {/*    <div className="reply_wrap">*/}
                                                    {/*        <svg className="emoji-picker-icon cursor_pointer"*/}
                                                    {/*             xmlns="http://www.w3.org/2000/svg" width="22" height="22"*/}
                                                    {/*             viewBox="0 0 22 22" fill="none" onClick={() => {*/}
                                                    {/*            setShowEmojiPicker(!showEmojiPicker)*/}
                                                    {/*        }}>*/}
                                                    {/*            <path*/}
                                                    {/*                d="M14.8496 9.89961C15.7609 9.89961 16.4996 9.16088 16.4996 8.24961C16.4996 7.33834 15.7609 6.59961 14.8496 6.59961C13.9383 6.59961 13.1996 7.33834 13.1996 8.24961C13.1996 9.16088 13.9383 9.89961 14.8496 9.89961Z"*/}
                                                    {/*                fill="#323232"/>*/}
                                                    {/*            <path*/}
                                                    {/*                d="M7.15 9.89961C8.06127 9.89961 8.8 9.16088 8.8 8.24961C8.8 7.33834 8.06127 6.59961 7.15 6.59961C6.23873 6.59961 5.5 7.33834 5.5 8.24961C5.5 9.16088 6.23873 9.89961 7.15 9.89961Z"*/}
                                                    {/*                fill="#323232"/>*/}
                                                    {/*            <path*/}
                                                    {/*                d="M11 15.4C9.372 15.4 7.975 14.509 7.205 13.2H5.368C6.248 15.455 8.437 17.05 11 17.05C13.563 17.05 15.752 15.455 16.632 13.2H14.795C14.025 14.509 12.628 15.4 11 15.4ZM10.989 0C4.917 0 0 4.928 0 11C0 17.072 4.917 22 10.989 22C17.072 22 22 17.072 22 11C22 4.928 17.072 0 10.989 0ZM11 19.8C6.138 19.8 2.2 15.862 2.2 11C2.2 6.138 6.138 2.2 11 2.2C15.862 2.2 19.8 6.138 19.8 11C19.8 15.862 15.862 19.8 11 19.8Z"*/}
                                                    {/*                fill="#323232"/>*/}
                                                    {/*        </svg>*/}
                                                    {/*        <input type="text" placeholder="reply"*/}
                                                    {/*               value={replyComment?.message}*/}
                                                    {/*               onClick={() => {*/}
                                                    {/*                   setShowEmojiPicker(false)*/}
                                                    {/*               }}*/}
                                                    {/*               className="form-control "*/}
                                                    {/*               onChange={(e) => {*/}
                                                    {/*                   e.preventDefault();*/}
                                                    {/*                   setShowEmojiPicker(false)*/}
                                                    {/*                   setReplyComment({*/}
                                                    {/*                       ...replyComment,*/}
                                                    {/*                       message: e.target.value*/}
                                                    {/*                   })*/}
                                                    {/*               }}*/}
                                                    {/*        />*/}
                                                    {/*        <button*/}
                                                    {/*            disabled={addCommentOnPostActionData?.loading || isReplyCommentEmpty(replyComment)}*/}
                                                    {/*            onClick={(e) => {*/}
                                                    {/*                !isReplyCommentEmpty(replyComment) && handleAddCommentOnPost(e);*/}
                                                    {/*                setShowEmojiPicker(false)*/}
                                                    {/*            }}*/}
                                                    {/*            className={isReplyCommentEmpty(replyComment) || addCommentOnPostActionData?.loading ? "view_post_btn cmn_bg_btn px-2 opacity-50" : "view_post_btn cmn_bg_btn px-2"}>*/}

                                                    {/*            {*/}
                                                    {/*                (addCommentOnPostActionData?.loading && !isReplyCommentEmpty(replyComment)) ?*/}
                                                    {/*                    <RotatingLines strokeColor="white"*/}
                                                    {/*                                   strokeWidth="5"*/}
                                                    {/*                                   animationDuration="0.75" width="20"*/}
                                                    {/*                                   visible={true}></RotatingLines>*/}
                                                    {/*                    :*/}
                                                    {/*                    "Submit"*/}
                                                    {/*            }*/}

                                                    {/*        </button>*/}
                                                    {/*        <div>*/}
                                                    {/*            <div className={"reply-emoji-picker-outer"}>*/}
                                                    {/*                {*/}
                                                    {/*                    showEmojiPicker && <EmojiPicker*/}
                                                    {/*                        onEmojiClick={(value) => {*/}
                                                    {/*                            handleOnEmojiClick(value)*/}
                                                    {/*                        }}*/}
                                                    {/*                        autoFocusSearch={false}*/}
                                                    {/*                        emojiStyle={EmojiStyle.NATIVE}*/}
                                                    {/*                        width={'100%'}*/}
                                                    {/*                    />*/}
                                                    {/*                }*/}
                                                    {/*            </div>*/}
                                                    {/*        </div>*/}
                                                    {/*    </div>*/}

                                                    {/*}*/}

                                                </div>
                                            </div>
                                    }

                                </div>

                            );

                        })
                    }
                    {
                        (getCommentsOnPostActionData?.loading && linkedinComments) ?
                            <div className={" text-center z-index-1 mt-1"}><RotatingLines strokeColor="#F07C33"
                                                                                                 strokeWidth="5"
                                                                                                 animationDuration="0.75"
                                                                                                 width="30"
                                                                                                 visible={true}></RotatingLines>
                            </div> :
                            <>
                                {
                                    linkedinComments?.paging?.links?.filter(link=>link.rel==="next")?.length>0 &&
                                    <div className={"ms-2 mt-2 load-more-cmnt-txt cursor-pointer"} onClick={() => {
                                        setGetLinkedinComments(new Date().getMilliseconds())
                                    }}>Load more comments
                                    </div>
                                }
                            </>
                    }


                </>

    );
}
export default LinkedinCommentsSection;






