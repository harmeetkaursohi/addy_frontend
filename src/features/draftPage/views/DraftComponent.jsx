import './DraftComponent.css'
import React, {useEffect, useState} from "react";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {computeImageURL, redirectToURL} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {publishedPostAction} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import {getToken} from "../../../app/auth/auth";


const DraftComponent = ({batchIdData}) => {

    console.log("batchIdData-->", batchIdData);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token =getToken();
    const publishedPostData = useSelector((state) => state.post.publishedPostReducer);

    const handlePublishedPost = (e) => {
        console.log("@@@ handlePublishedPost")
        e.preventDefault();
        dispatch(publishedPostAction({batchId:batchIdData?.id , token:token}))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    showSuccessToast("Post has published successfully");
                    navigate("/planner");
                }
            }).catch((error) => {
            showErrorToast(error.response.data.message);
        });

    }


    return (<>

        <div className="draft-outer mb-5">

            <div className={"draft-heading"}>
                <h4 className={"posted-on-txt"}>Posted On : {formatDate(batchIdData?.createdAt)} </h4>

                {batchIdData?.postPages && Array.isArray(batchIdData?.postPages) &&
                    batchIdData?.postPages.map((curPage) => (
                        <div className="selected-option" onClick={() => {
                            redirectToURL(`https://www.facebook.com/${curPage?.id}`)
                        }}>
                            <img className={"me-1 social-media-icon"}
                                 src={computeImageURL(curPage?.socialAccountType)}
                                 alt={"instagram"}/>
                            <span className={"social-media-page-name"}>{curPage?.pageName}</span>
                        </div>
                    ))
                }
            </div>

            <div className="post-image-outer">
                {batchIdData?.attachments &&
                    <CommonSlider files={batchIdData?.attachments} selectedFileType={null} caption={null} hashTag={null}
                                  viewSimilarToSocialMedia={false}/>}

            </div>


            <div className="card-body post_card">


                <div className={""}>
                    <span className={"post_caption"}>Post Caption:</span>
                    <h3 className={"caption"}>{batchIdData?.message !== null && batchIdData?.message !== "" ? batchIdData?.message || "---No Caption---" : "---No Caption---"}</h3>
                </div>

                <div className={""}>
                    <h5>Hashtags: </h5>
                    <div className={'mb-2'}>
                        <span
                            className={"hash_tags"}>{batchIdData?.message !== null && batchIdData?.message !== "" ? batchIdData?.message || "---No Tags---" : "---No Tags---"}</span>
                    </div>

                </div>

                <div className={""}>
                    <h5>Posted On:</h5>
                    <GenericButtonWithLoader className={"un_selected loading"} label={"Not Selected"}/>
                </div>

                <div className="mt-4 ms-3 d-flex gap-2 justify-content-center align-items-center">
                    <GenericButtonWithLoader className={"post_now cmn_bg_btn loading"} label={"Post Now"}
                                             isLoading={publishedPostData.isLoading}
                                             onClick={handlePublishedPost}
                    />
                    <GenericButtonWithLoader className={"outline_btn schedule_btn loading"} label={"Schedule Post"}
                                             onClick={() => navigate("/post/" + batchIdData?.id)}/>
                </div>

            </div>


        </div>
    </>)
}

export default DraftComponent;