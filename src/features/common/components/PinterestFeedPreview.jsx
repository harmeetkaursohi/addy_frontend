import {FiArrowUpRight} from "react-icons/fi";
import {CgSoftwareUpload} from "react-icons/cg";
import {BsThreeDots} from "react-icons/bs";
import noImageAvailable from "../../../images/no_img_posted.png"
import default_user_icon from "../../../images/default_user_icon.svg"
import CommonSlider from "./CommonSlider";

const PinterestFeedPreview = ({
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
    console.log("previewTitle", previewTitle)
    console.log("pageName", pageName)
    console.log("userData", userData)
    console.log("files", files)
    console.log("selectedFileType", selectedFileType)
    console.log("pageImage", pageImage)
    console.log("caption", caption)
    console.log("previewTitle", previewTitle)
    console.log("destinationUrl", destinationUrl)
    return (
        <>
            <h2 className={"cmn_white_text feed_preview facebookFeedpreview_text"}>{previewTitle}</h2>
            <div className='preview_wrapper1 preview_img_container'>
                <div>
                    <div className='img_container mt-2 ms-2'>
                        <div className='select_options_container z-index-2'>
                            <select disabled={true}>
                                <option>{pageName}</option>
                            </select>

                        </div>
                        <button className='save_button z-index-2'>Save</button>
                        <CommonSlider files={files} selectedFileType={selectedFileType} caption={""} hashTag={""} ></CommonSlider>
                        {/*<img src={noImageAvailable} width="100%"/>*/}
                        <div className='img_footer'>
                            <div className="FiArrowUpRight">

                                <>
                                      <span>
                                <FiArrowUpRight/>
                                </span>
                                    <h4 className=' user_caption_heading'>

                                        {destinationUrl || "Destination Url"}
                                    </h4>

                                </>


                            </div>
                            <div className="img_footer_wrapper">
                                <div className='cmn_download_outer'>
                                    <CgSoftwareUpload/>
                                </div>
                                <div className='cmn_download_outer'>
                                    <BsThreeDots/>
                                </div>
                            </div>

                        </div>

                    </div>
                    <h3 className={" pin-title"}>{pinTitle}</h3>
                    <div className="user_caption_wrapper">
                        <img style={{background:"white"}} src={userData?.profilePic?userData?.profilePic:default_user_icon} height="30px" width="30px"/>
                        <h6>{userData.fullName}</h6>
                    </div>
                </div>
            </div>

        </>
    );
}
export default PinterestFeedPreview;