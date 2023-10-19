import img from "../../../images/draft.png";
import user from "../../../images/user.png";
import {getCommentCreationTime, handleShowCommentReplyBox} from "../../../utils/commonUtils";
import {useEffect, useState} from "react";
import {getCommentsOnPostAction} from "../../../app/actions/postActions/postActions";
import {useDispatch, useSelector} from "react-redux";
import CommonLoader from "../../common/components/CommonLoader";

const Comments = ({postData}) => {
    const dispatch = useDispatch();
    const getCommentsOnPostActionData = useSelector(state => state.post.getCommentsOnPostActionReducer)
    const [showReplyBox,setShowReplyBox]=useState([])
    useEffect(() => {
        const requestBody = {
            // postId: postData?.id,
            // pageAccessToken: postData?.page?.access_token
            postId: "126684520526450_122128482242030808",
            pageAccessToken: "EAAIhoNvCxpwBO9LI6dgCq71CLIgu2mY1IfBHnQc3VsBHM5m53sVIOpOz5m7RfRe4VWgQVudVT3mrYAciyefyRWR6ZBdF61QMRE5BU8ML2UJeHvSWgT93P1neSjhlYZAqjRP8EhnWhywZBuGM8lZACAvEL9glz9HJBgoPwSFtiZBSaZCFu3yHHEH3NeAo2ViYoZD"

        }
        dispatch(getCommentsOnPostAction(requestBody)).then(response=>{
            if (response.meta.requestStatus === "fulfilled") {
                const showReplyBox=new Array(response.payload.data.length).fill(false);
                setShowReplyBox(showReplyBox)
            }
        })
    }, [])

    return (
        getCommentsOnPostActionData?.loading ?
            <CommonLoader/>

            :
            getCommentsOnPostActionData?.data?.data?.length === 0
                ? <div> No Comments</div> :

                getCommentsOnPostActionData?.data?.data?.map((comment, index) => {
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
                                    <div
                                        className="user_impressions d-flex gap-3 mt-2 mb-2">
                                        <p>{getCommentCreationTime(comment?.created_time)}</p>
                                        <p>{comment?.like_count} {comment?.like_count > 1 ? "Likes" : "Like"}</p>
                                        <p className={"cursor-pointer"} onClick={()=>{
                                            setShowReplyBox(handleShowCommentReplyBox(showReplyBoxqw,index))
                                        }}>{showReplyBox[index] ?"Hide":"Reply"}</p>
                                    </div>
                                    {

                                    }
                                    {
                                        comment?.comments?.data?.length > 0 &&
                                        <p className="reply_toggle">Show {comment?.comments?.data?.length} {comment?.comments?.data?.length > 1 ? "replies" : "reply"}</p>
                                    }
                                    {
                                        showReplyBox[index] && <div className="reply_wrap">
                                            <input type="text" placeholder="reply"
                                                   className="form-control"/>
                                            <button className="view_post_btn cmn_bg_btn">Submit</button>
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