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
console.log( reference === "PLANNER" , postStatus , "ESCHDULED","reference")
    return (
        <div className="perview_outer">
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text"}>{previewTitle}</h2>
            <div className='preview_wrapper '>
                <div>
                    <div className='user_profile_info'>
                        <Image style={{background: "white"}} src={pageImage ? pageImage : default_user_icon}
                               alt="default image" height="30px" width="30px"/>
                        <div className="flex-grow-1">
                            <h3 className='create_post_text user_name boost_post_text'>{pageName} 
                                {/* <FaLinkedin
                                className="FaLinkedin_icon"/> */}
                                </h3>
                            <h6 className='status create_post_text'>just <Image src={ellipse_img} alt="ellipse image"
                                                                           className="ms-1"/>
                            </h6>
                            </div>
                            {
                                (reference === "PLANNER" && postStatus === "SCHEDULED") &&
                                <>
                                    <button 
                                    className="cmn_cta"
                                        disabled={!isPostEditable(feedPostDate)}
                                        onClick={() => {
                                            if (!isPostEditable(feedPostDate)) return
                                            navigate(`/planner/post/${postId}`)
                                        }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.13177 8.01601L3.98834 10.8696L0 12L1.13177 8.01601ZM7.70826 1.44722L10.5642 4.30021L4.27317 10.584L1.4166 7.73161L7.70826 1.44722ZM9.87895 0.208822L11.7585 2.08622C12.2682 2.59502 11.8128 3.05402 11.8128 3.05402L10.8522 4.01401L7.99499 1.15982L8.9556 0.200422L8.96823 0.189022C9.04339 0.121822 9.45769 -0.211777 9.87895 0.208822Z" fill="white"/>
                                        </svg>
                                        
                                    </button>
                                    <button 
                                    className="cmn_cta danger_bg me-2"
                                        disabled={isDeletePostLoading}
                                        onClick={() => {
                                            setDeletePostPageInfo({
                                                postId: postId,
                                                pageIds: [pageId]
                                            })
                                        }}
                                    ><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.42841 12.1853C1.42841 13.0002 2.11412 13.6668 2.95222 13.6668H9.04746C9.88555 13.6668 10.5713 13.0002 10.5713 12.1853V3.29646H1.42841V12.1853ZM11.3332 1.07424H8.6665L7.9046 0.333496H4.09508L3.33317 1.07424H0.666504V2.55572H11.3332V1.07424Z" fill="white"/>
                                    </svg>
                                    
                                    </button>
                                </>
                            }
                        
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