import ellipse_img from "../../../images/ellipse.svg"
import default_user_icon from "../../../images/default_user_icon.svg"
import CommonSlider from "./CommonSlider";
import {FaRegCommentDots} from "react-icons/fa";
import {BiRepost} from "react-icons/bi";
import {IoIosSend, IoMdArrowDropdown} from "react-icons/io";
import nature from "../../../images/nature.png"
import {FaLinkedin} from "react-icons/fa"
import {FaRegHeart} from "react-icons/fa";
import {SlLike} from "react-icons/sl";
import "./common.css"
import {TiWorld} from "react-icons/ti"
import {Image} from "react-bootstrap";
import {isNullOrEmpty, isPostEditable} from "../../../utils/commonUtils";
import React from "react";
import {useNavigate} from "react-router-dom";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";

const LinkedinFeedpreview = ({
                                 reference,
                                 previewTitle,
                                 postId,
                                 pageId,
                                 feedPostDate,
                                 postStatus,
                                 pageName,
                                 files,
                                 selectedFileType,
                                 pageImage,
                                 caption,
                                 hashTag,
                                 setDeletePostPageInfo,
                                 isDeletePostLoading,
                                 postInsightsData,
                             }) => {

    const navigate=useNavigate();

    return (
        <div className="perview_outer">
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text"}>{previewTitle}</h2>
            <div className='preview_wrapper '>
                <div>
                    <div className='user_profile_info'>
                        <Image style={{background: "white"}} src={pageImage ? pageImage : default_user_icon}
                               alt="default image" height="30px" width="30px"/>
                        <div>
                            <h3 className='create_post_text user_name boost_post_text'>{pageName} <FaLinkedin
                                className="FaLinkedin_icon"/></h3>
                            <h6 className='status create_post_text'><Image src={ellipse_img} alt="ellipse image"
                                                                           className="ms-1"/> just now

                                <TiWorld className="world_icon ms-1"/>
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


                    <div className='linkedInimg_container '>


                        <CommonSlider files={files} selectedFileType={selectedFileType} caption={caption}
                                      hashTag={hashTag}></CommonSlider>
                        {/*<Image src={noImageAvailable} width="100%"/>*/}
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
                          <div className="d-flex p-3 align-items-center">
                            <p className="flex-grow-1"><FaRegHeart size={25}/><span className="blur ms-2">1245 </span></p>
                        <p className="bold_text"><span className="blur">12</span>comments</p> <span className="dot_disc ms-2 me-2"></span>
                        <p className="bold_text"><span className="blur">12</span>reposts</p>
                        </div>
                        {/* <div className=' linkedin_post_likes'>
                            <div className="linkedin_dropdown">
                                <Image src={pageImage ? pageImage : default_user_icon} alt="social icon" height="30px"
                                       width="30px"/>
                                <IoMdArrowDropdown/>
                            </div>
                            <div className="linkedin_likes">
                                <SlLike className="thumbsup_icon"/>

                                <h3 className="cmn_text_style">Like</h3>
                            </div>
                            <div className="linkedin_likes">
                                <FaRegCommentDots/>
                                <h3 className="cmn_text_style">Comment</h3>
                            </div>
                            <div className="linkedin_likes">
                                <BiRepost className="repost__icon"/>
                                <h3 className="cmn_text_style">Repost</h3>
                            </div>
                            <div className="linkedin_likes">
                                <IoIosSend size={20}/>
                                <h3 className="cmn_text_style">Send</h3>
                            </div>
                        </div> */}

                    </div>

                </div>
            </div>

        </div>
    );
}
export default LinkedinFeedpreview;