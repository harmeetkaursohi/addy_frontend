import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import {FiThumbsUp} from "react-icons/fi";

import {PiShareFat} from "react-icons/pi";
import React from "react";
import {FaRegComment} from "react-icons/fa";
import {TiWorld} from "react-icons/ti";
import {Image} from "react-bootstrap";
import {getCommentCreationTime, isNullOrEmpty, isPostEditable} from "../../../utils/commonUtils";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {useNavigate} from "react-router-dom";
import {useDeletePostFromPagesByPageIdsMutation} from "../../../app/apis/postApi";


const FacebookFeedPreview = ({
                                 postId,
                                 pageId,
                                 reference,
                                 previewTitle,
                                 pageName,
                                 files,
                                 selectedFileType,
                                 caption,
                                 pageImage,
                                 hashTag,
                                 postStatus,
                                 feedPostDate,
                                 postInsightsData,
                                 setDeletePostPageInfo,
                                 isDeletePostLoading,
                             }) => {

    const navigate = useNavigate();
    return (
        <div className="perview_outer">
            <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>{previewTitle}</h2>

            <div className='preview_wrapper'>
                <div className='user_profile_info'>
                    <Image src={pageImage ? pageImage : default_user_icon} alt="user image" height="36px" width="36px"/>
                    <div>
                        <h3 className='create_post_text user_name boost_post_text'>{pageName}</h3>
                        <h6 className='status create_post_text'>
                            {
                                reference === "PLANNER" ? getCommentCreationTime(feedPostDate) : "just now"
                            }
                            <Image src={ellipse_img} alt="ellipse image" className="ms-1"/>
                            {/* <TiWorld className="world_icon ms-1"/> */}
                        </h6>
                        {
                            reference === "PLANNER" && postStatus === "SCHEDULED" &&
                            <>
                                <button
                                    disabled={!isPostEditable(feedPostDate)}
                                    onClick={() => {
                                        if (!isPostEditable(feedPostDate)) return
                                        navigate(`/planner/post/${postId}`)
                                    }}>Edit
                                </button>
                                <button
                                    disabled={isDeletePostLoading}
                                    onClick={() => {
                                        setDeletePostPageInfo({
                                            postId: postId,
                                            pageIds: [pageId]
                                        })
                                    }}
                                >Delete
                                </button>
                            </>
                        }
                    </div>
                </div>

                <CommonSlider files={files} selectedFileType={selectedFileType} caption={caption} hashTag={hashTag}/>
                {
                    reference === "PLANNER" && !isNullOrEmpty(postInsightsData) &&
                    <>
                        {
                            postInsightsData?.isLoading ?
                                <SkeletonEffect count={1}/> :
                                <>
                                    <>like {postInsightsData?.data?.reactions}</>
                                    <>Comment {postInsightsData?.data?.comments}</>
                                    <>shares {postInsightsData?.data?.shares}</>
                                </>
                        }
                    </>
                }

                <div className='like_comment_outer'>
                    <div className="fb_likes">
                        <FiThumbsUp/>
                        <h3 className="cmn_text_style">Likes</h3>
                    </div>
                    <div className="fb_likes">
                        <FaRegComment className="fb_cmt_icon"/>
                        <h3 className="cmn_text_style">Comment</h3>
                    </div>
                    <div className="fb_likes">
                        <PiShareFat/>
                        <h3 className="cmn_text_style">Share</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FacebookFeedPreview;