import {FiArrowUpRight} from "react-icons/fi";
import default_user_icon from "../../../images/default_user_icon.svg"
import CommonSlider from "./CommonSlider";
import {FaRegHeart} from "react-icons/fa";

const PinterestFeedPreview = ({
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
    return (

        <>
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text"}>{previewTitle}</h2>
            <div className='preview_wrapper1 preview_img_container'>

                <div
                    className={`img_container w-100 ${selectedFileType === "VIDEO" || mediatype == 'VIDEO' ? "black_bg_color" : ""}`}>
                    {files.length > 0 &&
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

                    {pinTitle && <h3 className={"pin-title"}>{pinTitle}</h3>}
                    <div className="pintrest_comments">
                        <p><span className="blur">12</span>comments</p>
                        <p><span className="blur">1245 </span><FaRegHeart size={25}/></p>
                    </div>
                </div>
            </div>


        </>
    );
}
export default PinterestFeedPreview;