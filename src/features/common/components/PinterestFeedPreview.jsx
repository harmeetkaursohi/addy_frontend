import {FiArrowUpRight} from "react-icons/fi";
import default_user_icon from "../../../images/default_user_icon.svg"
import CommonSlider from "./CommonSlider";
import {FaRegHeart} from "react-icons/fa";
import {isNullOrEmpty, isPostEditable} from "../../../utils/commonUtils";
import React from "react";
import {useNavigate} from "react-router-dom";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";

const PinterestFeedPreview = ({
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
                                  pinTitle,
                                  hashTag,
                                  destinationUrl = null,
                                  setDeletePostPageInfo,
                                  isDeletePostLoading,
                                  postInsightsData
                              }) => {

    const mediatype = files.map((data) => data.mediaType)
    const navigate = useNavigate()
    return (

        <div className="perview_outer">
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text flex-grow-1"}>{previewTitle}</h2>
          
            <div className='preview_wrapper1 preview_img_container position-relative'>
            {
                reference === "PLANNER" && postStatus === "SCHEDULED" &&
                <div className="pint_cta">
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
                </div>
            }
                <div
                    className={`img_container w-100 ${selectedFileType === "VIDEO" || mediatype == 'VIDEO' ? "black_bg_color" : ""}`}>
                    {
                        files.length > 0 &&
                        <CommonSlider className={"pintereset_postpreview_container"} height="300px" files={files}
                                      selectedFileType={selectedFileType} caption={""} hashTag={""}></CommonSlider>
                    }
                </div>
                <div className="pintrest_footer">
                    <div className="user_caption_wrapper">
                        <img style={{background: "white"}} src={pageImage ? pageImage : default_user_icon} height="30px"
                             width="30px"/>
                        <h6>{pageName}</h6>
                    </div>
                        <div className="d-flex align-items-center">

                    <div className="flex-grow-1">
                    {
                        pinTitle && <h3 className={"pin-title"}>{pinTitle}</h3>
                    }
                 {(caption || hashTag) &&  <h3 className={"pin-url"}>{caption}<span className="post_hashtags ps-1">{hashTag}</span></h3>}
                    </div>
                   <span> <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 20C14.1667 20 13.4583 19.7083 12.875 19.125C12.2917 18.5417 12 17.8333 12 17C12 16.9 12.025 16.6667 12.075 16.3L5.05 12.2C4.78333 12.45 4.475 12.646 4.125 12.788C3.775 12.93 3.4 13.0007 3 13C2.16667 13 1.45833 12.7083 0.875 12.125C0.291667 11.5417 0 10.8333 0 10C0 9.16667 0.291667 8.45833 0.875 7.875C1.45833 7.29167 2.16667 7 3 7C3.4 7 3.775 7.071 4.125 7.213C4.475 7.355 4.78333 7.55067 5.05 7.8L12.075 3.7C12.0417 3.58333 12.021 3.471 12.013 3.363C12.005 3.255 12.0007 3.134 12 3C12 2.16667 12.2917 1.45833 12.875 0.875C13.4583 0.291667 14.1667 0 15 0C15.8333 0 16.5417 0.291667 17.125 0.875C17.7083 1.45833 18 2.16667 18 3C18 3.83333 17.7083 4.54167 17.125 5.125C16.5417 5.70833 15.8333 6 15 6C14.6 6 14.225 5.929 13.875 5.787C13.525 5.645 13.2167 5.44933 12.95 5.2L5.925 9.3C5.95833 9.41667 5.97933 9.52933 5.988 9.638C5.99667 9.74667 6.00067 9.86733 6 10C5.99933 10.1327 5.99533 10.2537 5.988 10.363C5.98067 10.4723 5.95967 10.5847 5.925 10.7L12.95 14.8C13.2167 14.55 13.525 14.3543 13.875 14.213C14.225 14.0717 14.6 14.0007 15 14C15.8333 14 16.5417 14.2917 17.125 14.875C17.7083 15.4583 18 16.1667 18 17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20Z" fill="black"/>
                    </svg></span>
                        </div>
                    {
                        // reference === "PLANNER" && !isNullOrEmpty(postInsightsData) &&
                        <>
                            {
                                postInsightsData?.isLoading ?
                                    <SkeletonEffect count={1}/> :
                                    <div className="pintrest_comments">
                                        <p><span className="me-2">{postInsightsData?.data?.comments}</span>comments</p>
                                        <p><span className="me-2">{postInsightsData?.data?.reactions} </span><FaRegHeart size={25}/></p>
                                    </div>
                            }

                        </>

                    }
                    {
                        (reference === "CREATE_POST" || reference === "UPDATE_POST") &&
                        <div className="pintrest_comments">
                        <p><span className="blur">12</span>comments</p>
                            <p><span className="blur">1245 </span><FaRegHeart size={25}/></p>
                        </div>
                    }
                </div>
            </div>


        </div>
    );
}
export default PinterestFeedPreview;