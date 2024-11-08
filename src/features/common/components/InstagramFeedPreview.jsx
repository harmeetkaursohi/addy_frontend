import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import React, {useState} from "react";
import CommentText from "../../review/views/comments/CommentText";
import like_img from "../../../images/like.svg"
import comment_img from "../../../images/comment.svg"
import save_img from "../../../images/save.svg"
import send_img from "../../../images/send_img.svg"
import {BsThreeDotsVertical} from "react-icons/bs"
import {Image} from "react-bootstrap";
import "./common.css"
import {isNullOrEmpty, isPostEditable} from "../../../utils/commonUtils";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {useNavigate} from "react-router-dom";

const InstagramFeedPreview = ({
                                  reference,
                                  postId,
                                  pageId,
                                  previewTitle,
                                  pageName,
                                  files,
                                  selectedFileType,
                                  pageImage,
                                  caption,
                                  hashTag,
                                  feedPostDate,
                                  postStatus,
                                  postInsightsData,
                                  setDeletePostPageInfo,
                                  isDeletePostLoading
                              }) => {

    const [showContent, setShowContent] = useState(false)
    const navigate = useNavigate()
    return (
        <div className="perview_outer">
            <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>{previewTitle}</h2>

            <div className='preview_wrapper'>
                <div className='user_profile_info  align-items-center d-flex justify-content-between'>
                    <div className="d-flex align-items-center gap-2">
                        <Image src={pageImage ? pageImage : default_user_icon}
                               height="36px"
                               width="36px"
                               alt="user image"
                        />
                        <div>
                            <h3 className='create_post_text user_name boost_post_text mt-1'>{pageName}</h3>
                            <h6 className='status create_post_text'><Image src={ellipse_img} alt="ellipse image"
                                                                           className="ms-1"/> just now

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
                    <BsThreeDotsVertical/>

                </div>

                <CommonSlider isrequired={true} files={files} selectedFileType={selectedFileType} caption={caption}
                              hashTag={hashTag}/>
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
                <div className="comment_wrapper">
                    <div className='like_comment_outer instagram_like'>
                        <div className="flex-grow-1">
                            <Image src={like_img} alt="like image"/>
                            <Image src={comment_img} alt="comment image" className=" ms-4 me-4"/>
                            <Image src={send_img} alt="send image"/>

                        </div>
                        <div>
                            <Image src={save_img} alt="save image"/>
                        </div>
                    </div>
                    <div
                        className={`${showContent ? "feed_preview_Caption_outer" : "Caption_outer instagram_caption_outer "}`}>

                        <div className={showContent ? "feed_preview_Caption_outer" : "Caption_outer"}>
                            {(caption.length > 0 || hashTag.length > 0) || (caption.length > 0 && hashTag.length > 0) ?
                                <h2 className=" mt-2">{pageName}</h2> : ""}
                            <CommentText isRequire={true} pageName={pageName} socialMediaType={"INSTAGRAM"}
                                         comment={`${caption} ${hashTag}`}
                                         className={"highlight cursor-pointer"} setShowText={setShowContent}
                                         showText={showContent}/>

                        </div>

                    </div>
                </div>


            </div>
        </div>
    )
}

export default InstagramFeedPreview;