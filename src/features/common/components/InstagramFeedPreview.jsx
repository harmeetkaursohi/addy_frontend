import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import {IoMdHeartEmpty,IoIosSend} from "react-icons/io";
import { RiChat1Line } from "react-icons/ri";
import { RiBookmarkLine } from "react-icons/ri";


import React from "react";

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
                            <img src={ellipse_img}/>
                        </h6>
                    </div>
                </div>

                <CommonSlider files={files} selectedFileType={selectedFileType} caption={caption} hashTag={hashTag}/>

                <div className='like_comment_outer d-flex'>
                   <div className="flex-grow-1">
                       <IoMdHeartEmpty size={25}/>
                       <RiChat1Line size={25} className="ms-4 me-4"/>
                       <IoIosSend size={25}/>
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