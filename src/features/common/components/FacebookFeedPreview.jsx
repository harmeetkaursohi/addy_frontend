import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import {FiThumbsUp} from "react-icons/fi";
import {GoComment} from "react-icons/go";
import {PiShareFat} from "react-icons/pi";
import React from "react";

const FacebookFeedPreview = ({previewTitle, pageName, userData, files, selectedFileType, caption, pageImage,hashTag}) => {
    return (
        <>
            <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>{previewTitle}</h2>

            <div className='preview_wrapper'>
                <div className='user_profile_info'>
                    <img src={pageImage ?  pageImage : default_user_icon} height="36px" width="36px"/>
                    <div>
                        <h3 className='create_post_text user_name boost_post_text'>{pageName}</h3>
                        <h6 className='status create_post_text'>just now
                            <img src={ellipse_img}/>
                        </h6>
                    </div>
                </div>

                <CommonSlider files={files} selectedFileType={selectedFileType} caption={caption} hashTag={hashTag}/>

                <div className='like_comment_outer'>
                    <div className="fb_likes">
                        <FiThumbsUp/>
                        <h3 className="cmn_text_style">Likes</h3>
                    </div>
                    <div className="fb_likes">
                        <GoComment/>
                        <h3 className="cmn_text_style">Comment</h3>
                    </div>
                    <div className="fb_likes">
                        <PiShareFat/>
                        <h3 className="cmn_text_style">Share</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FacebookFeedPreview;