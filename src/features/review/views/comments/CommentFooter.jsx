import {TbShare3} from "react-icons/tb";
import {FaRegSave} from "react-icons/fa";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {getFormattedDate, isNullOrEmpty} from "../../../../utils/commonUtils";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {
    addCommentOnPostAction,
    dislikePostAction, getCommentsOnPostAction,
    getPostPageInfoAction,
    likePostAction
} from "../../../../app/actions/postActions/postActions";
import {showErrorToast} from "../../../common/components/Toast";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {RotatingLines} from "react-loader-spinner";
import {getToken} from "../../../../app/auth/auth";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";

const CommentFooter = ({postData, postPageData,result,setResult,index,isDirty,setIsdirty}) => {
    const token = getToken();
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const [like, setLike] = useState(false);
    const likePostReducerData = useSelector(state => state.post.likePostReducer)
    const disLikePostReducerData = useSelector(state => state.post.dislikePostReducer)
    const [baseQueryForGetPostPageInfoAction, setBaseQueryForGetPostPageInfoAction] = useState(
        {
            token:token,
            postIds: null,
            pageAccessToken: null,
            socialMediaType: null
        }
    );
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const addCommentOnPostActionData = useSelector(state => state.post.addCommentOnPostActionReducer)
    const [commonFooterDataObject, setCommonFooterDataObject] = useState({
        total_likes: null,
        total_comments: null,
        total_shares: null,
        can_comment: null,

    })
    useEffect(() => {
        if (postData && postPageData) {
            // In case of facebook set data object
            switch (postData?.socialMediaType) {
                case "FACEBOOK": {
                    setCommonFooterDataObject({
                        total_likes: postPageData?.likes?.summary?.total_count || 0,
                        total_comments: postPageData?.comments?.summary?.total_count || 0,
                        total_shares: postPageData?.shares?.count || 0,
                        can_comment: postPageData?.comments?.summary?.can_comment
                    })
                    break;
                }
                case "INSTAGRAM": {
                    setCommonFooterDataObject({
                        total_likes: postPageData?.like_count || 0,
                        total_comments: postPageData?.comments_count || 0,
                        total_shares: 0,
                        can_comment: postPageData?.is_comment_enabled
                    })
                    break;
                }
                case "PINTEREST": {
                    const data = postPageData[postData?.id];
                    setCommonFooterDataObject({
                        total_likes: data?.pin_metrics?.all_time?.reaction || 0,
                        total_comments: data?.pin_metrics?.all_time?.comment || 0,
                        total_saves: data?.pin_metrics?.all_time?.save || 0,
                        can_comment: false
                    })
                }
                case "LINKEDIN": {
                    setCommonFooterDataObject({
                        total_likes: postPageData?.likesSummary?.totalLikes || 0,
                        total_comments: postPageData?.commentsSummary?.totalFirstLevelComments || 0,
                        total_shares: postData?.shares,
                        can_comment: postPageData?.commentsSummary?.commentsState === "OPEN"
                    })
                }
                default: {


                }
            }
        }
    }, [postData, postPageData])

    function handleOnEmojiClick(emojiData) {
        setComment(
            (prevInput) =>
                prevInput + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        );
    }

    useEffect(() => {
        if (postData && postPageData) {
            setBaseQueryForGetPostPageInfoAction({
                ...baseQueryForGetPostPageInfoAction,
                postIds: [postData?.id],
                pageAccessToken: postData?.page?.access_token,
                socialMediaType: postData?.socialMediaType
            })
            postData?.socialMediaType === "FACEBOOK" && setLike(postPageData?.likes?.summary?.has_liked)
        }
    }, [postData, postPageData])


    useEffect(() => {
        if (postPageData && postData?.socialMediaType === "INSTAGRAM") {
            // Get Insights of Post in case of Instagram and set data object


        }
    }, [postPageData])


    const handleAddLikesOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            postId: postData?.id,
            pageAccessToken: postData?.page?.access_token
        }

        dispatch(likePostAction(requestBody)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
                dispatch(getPostPageInfoAction(baseQueryForGetPostPageInfoAction)).then((response) => {
                    if (response.meta.requestStatus === "fulfilled") {
                        setLike(true);
                    }
                }).catch((error) => {
                    setLike(false);
                    showErrorToast(error.response.data.message);
                });
            }
        }).catch((error) => {
            setLike(false);
            showErrorToast(error.response.data.message);
        })
    }
    const handleAddDisLikesOnPost = (e) => {
        e.preventDefault();
        const requestBody = {
            postId: postData?.id,
            pageAccessToken: postData?.page?.access_token
        }

        dispatch(dislikePostAction(requestBody)).then((response) => {
            if (response.meta.requestStatus === "fulfilled") {
            
                dispatch(getPostPageInfoAction(baseQueryForGetPostPageInfoAction)).then((response) => {
                    if (response.meta.requestStatus === "fulfilled") {
                        setLike(false);
                    }
                }).catch((error) => {
                    setLike(true);
                    showErrorToast(error.response.data.message);
                });
            }
        }).catch((error) => {
            setLike(true);
            showErrorToast(error.response.data.message);
        })
    }
    const handleAddCommentOnPost = (e) => {
        setIsdirty(true)

        e.preventDefault();
        const requestBody = {
            socialMediaType: postData?.socialMediaType,
            id: postData?.id,
            data: {
                message: comment
            },
            token: token,
            pageId: postData?.page?.pageId,
            pageAccessToken: postData?.page?.access_token,
        }

        dispatch(addCommentOnPostAction(requestBody)).then(response => {
            
            if (response.meta.requestStatus === "fulfilled") {
                setComment("")
               
                if(postData?.socialMediaType==="FACEBOOK"){
                    dispatch(getCommentsOnPostAction(requestBody))
                }
                dispatch(getPostPageInfoAction(baseQueryForGetPostPageInfoAction))
               
            }
        });
    }
    useEffect(() => {
       
        if(isDirty){
            const updatedResult = [...result];
            const updatedItem = { ...updatedResult[index], comments: updatedResult[index].comments + 1 };
            updatedResult[index] = updatedItem;
            setResult(updatedResult);
            setIsdirty(false)
        }
    
          
      
      
  }, [index,isDirty]);
    
    

    return (
        <div className="comments_footer">

            <div className="padding-x-20 footer_media d-flex gap-3 ">
                <p title={"Likes"}>
                    <i className={"far fa-thumbs-up me-1 like-icon"}/>{commonFooterDataObject.total_likes}
                </p>
                <p title={"Comments"}><i
                    className={"far fa-comment me-1"}/>{commonFooterDataObject.total_comments}
                </p>
                {
                    postData?.socialMediaType === "FACEBOOK" || postData?.socialMediaType === "LINKEDIN" &&
                    <p title={"Shares"}><TbShare3 className={""}/> {commonFooterDataObject.total_shares} </p>
                }
                {
                    postData?.socialMediaType === "PINTEREST" &&
                    <p title={"Saves"}><FaRegSave className={"save-icon"}/> {commonFooterDataObject.total_saves} </p>
                }

            </div>
            <div className={"hr-line-2"}></div>

            {/*<ul className="d-flex">*/}
            {/*    {*/}
            {/*        !like  &&*/}
            {/*        <li className="w-100" onClick={(e) => {*/}
            {/*            !likePostReducerData?.loading && !disLikePostReducerData?.loading &&  setLike(true)*/}
            {/*            !likePostReducerData?.loading && !disLikePostReducerData?.loading &&  handleAddLikesOnPost(e);*/}
            {/*        }}>*/}
            {/*            <AiOutlineHeart className={"me-2 "}*/}
            {/*                            style={{color: "red", fontSize: "24px"}}/>Like*/}
            {/*        </li>*/}
            {/*    }*/}

            {/*    {*/}
            {/*        like  &&*/}
            {/*        <li className="w-100" onClick={(e) => {*/}
            {/*            !likePostReducerData?.loading && !disLikePostReducerData?.loading && setLike(false)*/}
            {/*            !likePostReducerData?.loading && !disLikePostReducerData?.loading &&  handleAddDisLikesOnPost(e);*/}
            {/*        }}>*/}
            {/*            <AiFillHeart className={"me-2 animated-icon"}*/}
            {/*                         style={{color: "red", fontSize: "24px"}}/>Dislike*/}
            {/*        </li>*/}
            {/*    }*/}

            {/*    <li className="w-100"><i className="fa fa-comment me-2"/>Comment</li>*/}
            {/*</ul>*/}

            <p className="liked_by padding-x-20 ">
                {
                    postData?.socialMediaType === "FACEBOOK" && <>
                        {
                            commonFooterDataObject.total_likes === 1 && <>
                                Liked
                                by <strong> {postPageData?.likes?.summary?.has_liked ? postData?.page?.name : postPageData?.likes?.data[0]?.name}</strong>
                            </>
                        }
                        {
                            commonFooterDataObject.total_likes > 1 && <>
                                Liked
                                by <strong>{postPageData?.likes?.data[0]?.name}</strong> and <strong> {JSON.stringify(postPageData?.likes?.summary?.total_count - 1)} Others</strong>
                            </>
                        }
                    </>
                }
                {
                    postData?.socialMediaType === "LINKEDIN" && <>
                        {
                            commonFooterDataObject.total_likes === 1 && <>
                                Liked
                                by <strong> {postPageData?.likesSummary?.likedByCurrentUser ? postData?.page?.name : commonFooterDataObject.total_likes + " Other"}</strong>
                            </>
                        }
                        {
                            commonFooterDataObject.total_likes > 1 && <>
                                Liked
                                by {postPageData?.likesSummary?.likedByCurrentUser ? postData?.page?.name + "and " + (commonFooterDataObject.total_likes - 1) + (commonFooterDataObject?.total_likes - 1 === 1 ? " other" : " others") : commonFooterDataObject.total_likes + " others"}
                            </>
                        }
                    </>
                }

            </p>
            <p className="comment_date padding-x-20">{getFormattedDate(postData?.feedPostDate)}</p>
            <div className="comment_msg ">
                {
                    addCommentOnPostActionData?.loading && comment &&
                    <div className={"post-comment-loader z-index-1 mt-1"}><RotatingLines strokeColor="#F07C33"
                                                                                         strokeWidth="5"
                                                                                         animationDuration="0.75"
                                                                                         width="30"
                                                                                         visible={true}></RotatingLines>
                    </div>
                }

                {
                    commonFooterDataObject?.can_comment ?
                        <>
                            <svg className="cursor_pointer" xmlns="http://www.w3.org/2000/svg"
                                 width="22" height="22"
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
                            <input value={comment} type="text"
                                   className={addCommentOnPostActionData?.loading && comment ? "form-control opacity-50" : "form-control"}
                                   onClick={() => {
                                       setShowEmojiPicker(false)
                                   }}
                                   onChange={(e) => {
                                       setShowEmojiPicker(false)
                                       e.preventDefault();
                                       setComment(e.target.value);
                                   }} placeholder="Add comment..."/>
                            <button className={isNullOrEmpty(comment) ? "opacity-50" : ""}
                                    disabled={addCommentOnPostActionData?.loading || isNullOrEmpty(comment)}
                                    onClick={(e) => {
                                        setShowEmojiPicker(false)

                                        !isNullOrEmpty(comment) && handleAddCommentOnPost(e);
                                    }}>Post
                            </button>
                        </>
                        : <>
                            <svg className="opacity-50" xmlns="http://www.w3.org/2000/svg"
                                 width="22" height="22"
                                 viewBox="0 0 22 22" fill="none">
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
                            <div className={"disable-comment opacity-50"}>Comments are disabled for this post...</div>
                            <button className={"opacity-50"}
                                    disabled={true}>Post
                            </button>

                        </>
                }

                <div className={"emoji-picker-outer"}>
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
    );
}
export default CommentFooter