import {FiThumbsUp} from "react-icons/fi";
import ellipse_img from "../../../images/ellipse.svg"
import default_user_icon from "../../../images/default_user_icon.svg"
import CommonSlider from "./CommonSlider";
import { FaRegCommentDots  } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import nature from "../../../images/nature.png"
import "./common.css"
const LinkedinFeedpreview = ({
                                  previewTitle,
                                  pageName,
                                  userData,
                                  files,
                                  selectedFileType,
                                  pageImage,
                                  caption,
                                  pinTitle,
                                  hashTag,
                                  destinationUrl = null
                              }) => {
console.log(pageName,"pageName")
    return (
        <>
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text"}>{previewTitle}</h2>
            <div className='preview_wrapper '>
                <div>
                <div className='user_profile_info'>
                <img style={{background:"white"}} src={userData?.profilePic?userData?.profilePic:default_user_icon} height="30px" width="30px"/>
                    <div>
                        <h3 className='create_post_text user_name boost_post_text'>{pageName}</h3>
                        <h6 className='status create_post_text'>just now
                            <img src={ellipse_img}/>
                        </h6>
                    </div>
                </div>
                

                    <div className='linkedInimg_container '>
                        
                    
                        <CommonSlider files={files} selectedFileType={selectedFileType} caption={""} hashTag={""} ></CommonSlider>
                        {/*<img src={noImageAvailable} width="100%"/>*/}
                        <div className=' linkedin_post_likes'>
                        <div className="linkedin_dropdown">
                            <img src={nature} height="30px" width="30px"/>
                        <IoMdArrowDropdown />
                    </div>
                    <div className="linkedin_likes">
                        <FiThumbsUp/>
                        <h3 className="cmn_text_style">Likes</h3>
                    </div>
                    <div className="linkedin_likes">
                    <FaRegCommentDots />
                        <h3 className="cmn_text_style">Comment</h3>
                    </div>
                    <div className="linkedin_likes">
                    <BiRepost className="repost__icon"/>
                        <h3 className="cmn_text_style">Share</h3>
                    </div>
                </div>

                    </div>
                    
                </div>
            </div>

        </>
    );
}
export default LinkedinFeedpreview;