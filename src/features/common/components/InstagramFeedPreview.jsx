import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import {IoMdHeartEmpty} from "react-icons/io";
import { RiBookmarkLine } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import React from "react";
import { FaRegComment } from "react-icons/fa";

const InstagramFeedPreview = ({previewTitle, pageName, userData, files, selectedFileType, pageImage,caption, hashTag}) => {
    return (
        <>
            <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>{previewTitle}</h2>

            <div className='preview_wrapper'>
                <div className='user_profile_info'>
                    <img src={pageImage ? pageImage : default_user_icon}
                         height="36px"
                         width="36px"/>
                    <div>
                        <h3 className='create_post_text user_name boost_post_text'>{pageName}</h3>
                        <h6 className='status create_post_text'>just now
                            <img src={ellipse_img} className="ms-1" />
                        </h6>
                    </div>
                </div>

                <CommonSlider files={files} selectedFileType={selectedFileType} caption={caption} hashTag={hashTag}/>

                <div className='like_comment_outer instagram_like'>
                   <div className="flex-grow-1">
                       <IoMdHeartEmpty size={25}/>
                       <FaRegComment size={25} className="fb_cmt_icon ms-4 me-4" />
                      
                       <BsSend size={25}/>
                   </div>
                    <div>
                        <RiBookmarkLine size={25}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InstagramFeedPreview;