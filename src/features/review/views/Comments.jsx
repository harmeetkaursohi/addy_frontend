import img from "../../../images/draft.png";
import user from "../../../images/user.png";
import {getCommentCreationTime, handleShowCommentReplies, handleShowCommentReplyBox} from "../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {addCommentOnPostAction, getCommentsOnPostAction} from "../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import CommonLoader from "../../common/components/CommonLoader";
import CommonSlider from "../../common/components/CommonSlider";

const Comments = ({postData}) => {
    const dispatch = useDispatch();
    const getCommentsOnPostActionData = useSelector(state => state.post.getCommentsOnPostActionReducer)
    const [showReplyBox, setShowReplyBox] = useState([])
    const [showReplyComments, setShowReplyComments] = useState([])
    const [replyToCommentId,setReplyToCommentId]=useState("")
    const [replyComment,setReplyComment]=useState("")
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
            data:{
                message:replyComment
            },
            pageAccessToken: postData?.page?.access_token,
            // pageAccessToken: "EAAIhoNvCxpwBO9LI6dgCq71CLIgu2mY1IfBHnQc3VsBHM5m53sVIOpOz5m7RfRe4VWgQVudVT3mrYAciyefyRWR6ZBdF61QMRE5BU8ML2UJeHvSWgT93P1neSjhlYZAqjRP8EhnWhywZBuGM8lZACAvEL9glz9HJBgoPwSFtiZBSaZCFu3yHHEH3NeAo2ViYoZD",
        }
        dispatch(addCommentOnPostAction(requestBody)).then(response=>{
            if(response.meta.requestStatus==="fulfilled"){
                setReplyComment("")
                // handleGetComments("126684520526450_122128482242030808")
                handleGetComments(postData?.id)
            }
        });
    }

    return (
        getCommentsOnPostActionData?.loading ?
            <CommonLoader/>

            :
            getCommentsOnPostActionData?.data?.length === 0
                ? <div> No Comments</div> :

                getCommentsOnPostActionData?.data?.map((comment, index) => {
                    console.log("parent comment",comment)
                    return (
                        <div key={index} className="comment_wrap">
                            <div className="user_card">
                                <div className="user_image">
                                    <img src={user} alt=""/>
                                </div>
                                <div className="user">
                                    <p className="user_name">
                                        Eathan johnsan
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
                                        <p>{comment?.like_count} {comment?.like_count > 1 ? "Likes" : "Like"}</p>
                                        <p className={comment?.can_comment ? "cursor-pointer" : "disable-reply-comment"}
                                           onClick={() => {
                                               !showReplyBox[index] ?setReplyToCommentId(comment.id):setReplyToCommentId("")
                                               comment?.can_comment && setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                           }}>{showReplyBox[index] ? "Hide" : "Reply"}</p>
                                    </div>
                                    {
                                        comment?.reply_count > 0 &&
                                        <p className="reply_toggle" onClick={() => {
                                            console.log("handleShowCommentReplies(showReplyComments, index)",handleShowCommentReplies(showReplyComments, index))
                                            setShowReplyComments(handleShowCommentReplies(showReplyComments, index))
                                            handleGetComments(comment?.id, true)
                                        }}>{!showReplyComments[index] ? "Show" : "Hide"} {comment?.reply_count} {comment?.reply_count > 1 ? "replies" : "reply"}</p>
                                    }
                                    {
                                        showReplyComments[index] && <>
                                            {
                                                comment?.reply?.map((comment, i) => {
                                                    console.log("child",comment)
                                                    return (
                                                        <div key={i} className="comment_wrap">
                                                            <div className="user_card">
                                                                <div className="user_image">
                                                                    <img src={user} alt=""/>
                                                                </div>
                                                                <div className="user">
                                                                    <p className="user_name">
                                                                        Eathan johnsan
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
                                                                        <p>{comment?.like_count} {comment?.like_count > 1 ? "Likes" : "Like"}</p>

                                                                        <p className={comment?.can_comment ? "cursor-pointer" : "disable-reply-comment"}
                                                                           onClick={() => {
                                                                               !showReplyBox[index] ?setReplyToCommentId(comment.id):setReplyToCommentId("")
                                                                               comment?.can_comment && setShowReplyBox(handleShowCommentReplyBox(showReplyBox, index))
                                                                           }}>{showReplyBox[index] ? "Hide" : "Reply"}</p>


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
                                                   value={replyComment}
                                                   className="form-control"
                                                   onChange={(e)=>{
                                                       e.preventDefault();
                                                       setReplyComment(e.target.value)
                                                   }}
                                            />
                                            <button onClick={handleAddCommentOnPost} className="view_post_btn cmn_bg_btn">Submit</button>
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
                    );
                })


    );
}
export default Comments