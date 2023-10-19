import './DraftComponent.css'
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {computeImageURL, handleSeparateCaptionHashtag, redirectToURL} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {publishedPostAction} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import {getToken} from "../../../app/auth/auth";
import {useState} from "react";


const DraftComponent = ({batchIdData,setDraftPost=null,setDrafts=null}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = getToken();
    const publishedPostData = useSelector((state) => state.post.publishedPostReducer);
    const [batchToDelete,setBatchToDelete]=useState(null);

    const handlePublishedPost = (e) => {
        e.preventDefault();
        console.log("batchIdData?.id-->",batchIdData?.id);
        setBatchToDelete(batchIdData?.id)
        dispatch(publishedPostAction({batchId: batchIdData?.id, token: token}))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    setBatchToDelete(null);
                    showSuccessToast("Post has been published successfully");
                    setDrafts!==null && setDrafts([]);
                    setDraftPost!==null && setDraftPost(false)

                }
            }).catch((error) => {
            setBatchToDelete(null);
            showErrorToast(error.response.data.message);
        });

    }

    return (<>

        <div className="draft-outer mb-3">

            <div className={"draft-heading"}>
                <h4 className={"posted-on-txt"}>Posted On : </h4>

                <div className="page_tags">
                    {  batchIdData?.postPages && Array.isArray(batchIdData?.postPages) &&
                        batchIdData?.postPages.map((curPage) => (
                            <div className="selected-option" onClick={() => {
                                redirectToURL(`https://www.facebook.com/${curPage?.id}`)
                            }}>
                                <div>
                                    <img className={"me-1 social-media-icon"}
                                         src={computeImageURL(curPage?.socialMediaType)}
                                         alt={"instagram"}/>
                                </div>
                                <p className={"social-media-page-name"}>{curPage?.pageName}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="post-image-outer">
                {batchIdData?.attachments &&
                    <CommonSlider files={batchIdData?.attachments} selectedFileType={null} caption={null} hashTag={null}
                                  viewSimilarToSocialMedia={false}/>}

            </div>


            <div className="card-body post_card">


                <div className={""}>
                    <span className={"post_caption"}>Post Caption:</span>
                    <h3 className={"caption"}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h3>
                </div>

                <div className={""}>
                    <h5>Hashtags: </h5>
                    <div className={'mb-2'}>
                        <span
                            className={"hash_tags"}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
                    </div>

                </div>

                <div className={""}>
                    <h5>Draft Created On:</h5>
                    <div className={'mb-2'}>
                        <span className={"hash_tags"}>{formatDate(batchIdData?.createdAt)}</span>
                    </div>
                </div>

                <div className="mt-4 ms-3 d-flex gap-2 justify-content-center align-items-center">
                    <GenericButtonWithLoader className={"post_now cmn_bg_btn loading"} label={"Post Now"}
                                             isLoading={batchIdData?.id===batchToDelete && publishedPostData?.loading}
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