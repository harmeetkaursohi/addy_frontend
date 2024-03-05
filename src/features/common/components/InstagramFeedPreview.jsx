import default_user_icon from "../../../images/default_user_icon.svg";
import ellipse_img from "../../../images/ellipse.svg";
import CommonSlider from "./CommonSlider";
import {IoMdHeartEmpty} from "react-icons/io";
import React, { useState } from "react";
import CommentText from "../../review/views/comments/CommentText";
import like_img from "../../../images/like.svg"
import comment_img from "../../../images/comment.svg"
import save_img from "../../../images/save.svg"
import send_img from "../../../images/send.svg"
import { BsThreeDotsVertical } from "react-icons/bs";


const InstagramFeedPreview = ({previewTitle, pageName, userData, files, selectedFileType, pageImage,caption, hashTag}) => {
   
const[showContent,setShowContent]=useState(false)
    return (
        <>
            <h2 className='cmn_white_text feed_preview facebookFeedpreview_text'>{previewTitle}</h2>

            <div className='preview_wrapper'>
                <div className='user_profile_info  align-items-center d-flex justify-content-between'>
                    <div className="d-flex align-items-center gap-2">
                    <img src={pageImage ? pageImage : default_user_icon}
                         height="36px"
                         width="36px"/>
                    <div>
                        <h3 className='create_post_text user_name boost_post_text mt-1'>{pageName}</h3>
                        <h6 className='status create_post_text'>just now
                            <img src={ellipse_img} className="ms-1" />
                        </h6>
                    </div>

                    </div>
                    <BsThreeDotsVertical />

                </div>

                <CommonSlider isrequired={true} files={files} selectedFileType={selectedFileType} caption={caption} hashTag={hashTag}/>
 
                <div className='like_comment_outer instagram_like'>
                   <div className="flex-grow-1">
                    <img src={like_img} />
                       <img src={comment_img} className=" ms-4 me-4" />
                       <img src={send_img} />
                      
                   </div>
                    <div>
                    <img src={save_img} />
                    </div>
                </div>
                <div className={`ms-2  ${showContent ?"feed_preview_Caption_outer":"Caption_outer instagram_caption_outer " }`}>
               
               <div className={showContent?"feed_preview_Caption_outer":"Caption_outer"}>
              {(caption.length > 0 || hashTag.length > 0) || (caption.length > 0 && hashTag.length > 0)   ? <h2 className=" mt-2">{pageName}</h2>:"" }  
                <CommentText isRequire={true} pageName={pageName} socialMediaType={"INSTAGRAM"} comment={`${caption} ${hashTag}`}
                  className={"highlight cursor-pointer"} setShowText={setShowContent} showText={showContent} />

               </div>

                    </div>
                   {/* {
                    caption.length!==0 ?<h6 className='status create_post_text ps-4 pb-2'>just now
                    <img src={ellipse_img} className="ms-1" /> </h6>:""
                   } */}
                     
                
            </div>
        </>
    )
}

export default InstagramFeedPreview;