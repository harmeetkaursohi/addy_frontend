import {Image} from "react-bootstrap";
import {FiThumbsUp} from "react-icons/fi";
import {FaRegComment} from "react-icons/fa";
import {PiShareFat} from "react-icons/pi";
import React from "react";
import {useGetUserInfoQuery} from "../../../app/apis/userApi";
import default_user_icon from "../../../images/default_user_icon.svg"
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import CommonSlider from "./CommonSlider";
import {isNullOrEmpty} from "../../../utils/commonUtils";

const DefaultFeedPreview = ({caption, hashTag, files, selectedFileType}) => {

    const getUserInfoApi = useGetUserInfoQuery("")

    return (
        <>
            <div className='blank_post'>
                <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>Post
                    Preview</h2>
                <div className='preview_wrapper'>
                    <div className='user_profile_info pb-0'>
                        {/* <Image src=""/> */}
                        <div className='w-100 '>
                            <div className={"d-flex align-items-center"}>
                                {
                                    (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching) ?
                                        <SkeletonEffect count={1}></SkeletonEffect> :
                                        <>
                                            < img className={"h-40 "}
                                                  src={getUserInfoApi?.data?.profilePic ? "data:image/jpeg; base64," + getUserInfoApi?.data?.profilePic : default_user_icon}
                                                  alt='blank_image'></img>
                                            <h3 className='create_post_text user_name boost_post_text ms-2'>Your
                                                Page Name</h3>
                                        </>
                                }

                            </div>
                            <div className={"mt-2"}>{caption}</div>
                            <p className="post_hashtags">{hashTag}</p>

                           <div className="no_data_img">
                           {
                                isNullOrEmpty(files) ?
                                    <div className='text-center'>
                                        <Image src="/assets/blank_image.png" className="rounded-0"
                                               alt='blank_image'/>
                                    </div> :
                                    <CommonSlider files={files} selectedFileType={selectedFileType} isrequired={true}/>
                            }
                           </div>
                        </div>
                    </div>

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
        </>
    );
}
export default DefaultFeedPreview