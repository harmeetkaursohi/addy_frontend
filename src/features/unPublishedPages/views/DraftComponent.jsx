import './DraftComponent.css'
import {computeImageURL, handleSeparateCaptionHashtag, isNullOrEmpty, urlToBlob} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useEffect, useState} from "react";
import DraftModal from "./DraftModal";

const DraftComponent = ({postData}) => {

    const [showCaption, setShowCaption] = useState(false)
    const [draftModal, setDraftModal] = useState(false);


    return (<>

        <div className={"col-lg-3 col-sm-12 col-md-12"}>
            <div
                className={"draft_wrapper_box"}
                onClick={() => {
                    setDraftModal(true)
                }}>
                <div className={"draft_img_wrapper cursor-pointer"}>
                    <div className={"posted_date_outer"}>
                        <h3>Posted on: <span>{formatDate(postData?.createdAt)}</span></h3>
                    </div>
                    <CommonSlider files={postData?.attachments} selectedFileType={null} caption={null} hashTag={null}
                                  viewSimilarToSocialMedia={false}/>
                </div>

                <div className={"draft_page_outer"}>
                    <div className={"caption_outer_containter"}>
                        <h3>Caption:</h3>
                        <h4
                            onClick={() => {
                                handleSeparateCaptionHashtag(postData?.message)?.caption.length > 40 ? setShowCaption(!showCaption) : ""
                            }}
                            className={`caption ${handleSeparateCaptionHashtag(postData?.message)?.caption.length > 40 ? "cursor-pointer" : ""}  ${showCaption ? "upcoming_post_content " : "cmn_text_overflow"}`}>{postData?.message !== null && postData?.message !== "" && postData?.message !== " " ? handleSeparateCaptionHashtag(postData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h4>
                    </div>
                    <div className="social_media_page_outer">
                        {
                            postData?.postPages && Array.isArray(postData?.postPages) &&
                            (() => {
                                const uniqueSocialMedia = Array.from(new Set(postData.postPages.map(item => item.socialMediaType)));
                                const uniquePageIds = Array.from(new Set(postData.postPages.map(item => item.pageId)));
                                const count = uniquePageIds.length;
                                return (
                                    <>
                                        <div>
                                            {
                                                uniqueSocialMedia.map((curPage, key) => (
                                                    <img key={key} className={"social-media-icon"}
                                                         src={computeImageURL(curPage)}
                                                         alt={"social media icon"}/>

                                                ))
                                            }
                                        </div>
                                        {console.log("uniqueSocialMedia===>",uniqueSocialMedia.length)}
                                        <h4>Posting on {count} page{uniqueSocialMedia.length > 1 && "s"}.</h4>
                                    </>
                                );
                            })()
                        }
                    </div>
                </div>
            </div>
        </div>
        {
            draftModal &&
            <DraftModal
                show={draftModal}
                setShow={setDraftModal}
                postData={postData}
            />

        }
    </>)
}

export default DraftComponent;
