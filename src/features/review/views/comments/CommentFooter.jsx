import {TbShare3} from "react-icons/tb";
import {FaRegSave} from "react-icons/fa";
import {getFormattedDate, isNullOrEmpty} from "../../../../utils/commonUtils";
import EmojiPicker, {EmojiStyle} from "emoji-picker-react";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {RotatingLines} from "react-loader-spinner";
import {handleRTKQuery} from "../../../../utils/RTKQueryUtils";
import {addyApi} from "../../../../app/addyApi";

const CommentFooter = ({postData, isDirty, setDirty, postSocioData, onPostComment, postCommentApi}) => {

    const dispatch = useDispatch();

    const [comment, setComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [commonFooterDataObject, setCommonFooterDataObject] = useState({
        total_likes: null,
        total_comments: null,
        total_shares: null,
        can_comment: null,
    })


    useEffect(() => {
        if (postData && postSocioData) {
            switch (postData?.socialMediaType) {
                case "FACEBOOK": {
                    setCommonFooterDataObject({
                        total_likes: postSocioData?.reactions?.summary?.total_count || 0,
                        total_comments: postSocioData?.comments?.summary?.total_count || 0,
                        total_shares: postSocioData?.shares?.count || 0,
                        can_comment: postSocioData?.comments?.summary?.can_comment
                    })
                    break;
                }
                case "INSTAGRAM": {
                    setCommonFooterDataObject({
                        total_likes: postSocioData?.like_count || 0,
                        total_comments: postSocioData?.comments_count || 0,
                        total_shares: 0,
                        can_comment: postSocioData?.is_comment_enabled
                    })
                    break;
                }
                case "PINTEREST": {
                    const data = postSocioData[postData?.id];
                    setCommonFooterDataObject({
                        total_likes: data?.pin_metrics?.all_time?.reaction || 0,
                        total_comments: data?.pin_metrics?.all_time?.comment || 0,
                        total_saves: data?.pin_metrics?.all_time?.save || 0,
                        can_comment: false
                    })
                    break;
                }
                case "LINKEDIN": {
                    setCommonFooterDataObject({
                        total_likes: postSocioData?.likesSummary?.totalLikes || 0,
                        total_comments: postSocioData?.commentsSummary?.totalFirstLevelComments || 0,
                        total_shares: postSocioData?.shares,
                        can_comment: postSocioData?.commentsSummary?.commentsState === "OPEN"
                    })
                    break;
                }
                default: {


                }
            }
        }
    }, [postData, postSocioData])

    function handleOnEmojiClick(emojiData) {
        setComment(
            (prevInput) =>
                prevInput + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
        );
    }

    const handleAddCommentOnPost = async (e) => {
        e.preventDefault();
        const requestBody = {
            socialMediaType: postData?.socialMediaType,
            id: postData?.id,
            data: {
                message: comment
            },
            pageId: postData?.page?.pageId,
            pageAccessToken: postData?.page?.access_token,
        }
        await handleRTKQuery(
            async () => {
                return await onPostComment(requestBody).unwrap();
            },
            () => {
                setDirty({
                    ...isDirty,
                    isDirty: true,
                    action: {
                        type: "POST",
                        on: "COMMENT",
                        commentLevel: "FIRST",
                    }
                })
                setComment("")
                dispatch(addyApi.util.invalidateTags(["getPostSocioDataApi"]));
            }
        );
    }


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

            <p className="liked_by padding-x-20 ">
                {
                    postData?.socialMediaType === "FACEBOOK" && <>
                        {
                            commonFooterDataObject.total_likes === 1 && <>
                                Liked / Reacted
                                by <strong> {postSocioData?.likes?.summary?.has_liked ? postData?.page?.name : postSocioData?.reactions?.data[0]?.name}</strong>
                            </>
                        }
                        {
                            commonFooterDataObject.total_likes > 1 && <>
                                Liked / Reacted
                                by <strong>{postSocioData?.reactions?.data[0]?.name}</strong> and <strong> {JSON.stringify(postSocioData?.reactions?.summary?.total_count - 1)} Others</strong>
                            </>
                        }
                    </>
                }
                {
                    postData?.socialMediaType === "LINKEDIN" && <>
                        {
                            commonFooterDataObject.total_likes === 1 && <>
                                Liked
                                by <strong> {postSocioData?.likesSummary?.likedByCurrentUser ? postData?.page?.name : commonFooterDataObject.total_likes + " Other"}</strong>
                            </>
                        }
                        {
                            commonFooterDataObject.total_likes > 1 && <>
                                Liked
                                by {postSocioData?.likesSummary?.likedByCurrentUser ? postData?.page?.name + " and " + (commonFooterDataObject.total_likes - 1) + (commonFooterDataObject?.total_likes - 1 === 1 ? " other" : " others") : commonFooterDataObject.total_likes + " others"}
                            </>
                        }
                    </>
                }

            </p>
            <p className="comment_date p-1 ps-3">{getFormattedDate(postData?.feedPostDate)}</p>
            <div className="comment_msg ">
                {
                    postCommentApi?.isLoading && comment &&
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
                            <input
                                value={comment}
                                type="text"
                                className={postCommentApi?.isLoading && comment ? "form-control opacity-50" : "form-control"}
                                onClick={() => {
                                    setShowEmojiPicker(false)
                                }}
                                onChange={(e) => {
                                    setShowEmojiPicker(false)
                                    e.preventDefault();
                                    setComment(e.target.value);
                                }}
                                placeholder="Add comment..."
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        const element = document.getElementById('post-cmnt-btn');
                                        if (element) {
                                            element.click();
                                        }
                                    }
                                }}
                            />
                            <button
                                id={"post-cmnt-btn"}
                                className={isNullOrEmpty(comment) ? "opacity-50" : ""}
                                disabled={postCommentApi?.isLoading || isNullOrEmpty(comment)}
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
    );
}
export default CommentFooter