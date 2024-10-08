import './DraftComponent.css'
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {computeImageURL, handleSeparateCaptionHashtag} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    deletePostByBatchIdAction,
    publishedPostAction
} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import {getToken} from "../../../app/auth/auth";
import {useState} from "react";
import Swal from 'sweetalert2';
import delete_img from "../../../images/trash_img.svg"
import {RxCross2} from "react-icons/rx"
const DraftComponent = ({
                            batchIdData,
                            setDraftPost = null,
                            setDrafts = null,
                            reference = "",
                            deletedAndPublishedPostIds,
                            setDeletedAndPublishedPostIds,
                            setApiTrigger
                        }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = getToken();
    const publishedPostData = useSelector((state) => state.post.publishedPostReducer);
    const deletePostByBatchIdData = useSelector((state) => state.post.deletePostByBatchIdReducer);
    const [batchToDelete, setBatchToDelete] = useState(null);
    const [postToPublish, setPostToPublish] = useState(null);
    const [labels, setLabels] = useState("")
    const[showCaption,setShowCaption]=useState(false)
    const[showHastag,setShowHashtag]=useState(false)
    
    const handlePublishedPost = (e) => {
        setLabels("Post Now")
        e.preventDefault();
        setPostToPublish(batchIdData?.id)
        dispatch(publishedPostAction({postId: batchIdData?.id, token: token}))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    const allSuccess=response?.payload?.every(post=>post.success)
                    const allFailed=response?.payload?.every(post=>!post.success)
                    setBatchToDelete(null);
                      if (reference === "PLANNER") {
                        setDrafts !== null && setDrafts([]);
                        setDraftPost !== null && setDraftPost(false)
                    } else if(allSuccess) {
                        setDeletedAndPublishedPostIds({
                            ...deletedAndPublishedPostIds,
                            publishedPostIds: [...deletedAndPublishedPostIds?.publishedPostIds, batchIdData?.id]
                        })
                    }else if(!allSuccess && ! allFailed){
                        setApiTrigger(new Date().getMilliseconds());
                    }
                }
            }).catch((error) => {
            setBatchToDelete(null);
            showErrorToast(error.response.data.message);
        });

    }

    const handleDeletePost = (e) => {
        setLabels("Delete Post")
        e.preventDefault();
        setBatchToDelete(batchIdData?.id)
        Swal.fire({
            imageUrl:delete_img,
            title: `Delete Post`,
            text: `Are you sure you want to delete this draft post?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Delete',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons:true,
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (e?.target?.id !== null) {
                    setBatchToDelete(e?.target?.id);
                    dispatch(deletePostByBatchIdAction({postId: e?.target?.id, token: token}))
                        .then((response) => {
                            if (response.meta.requestStatus === "fulfilled") {
                                setBatchToDelete(null);
                                setDeletedAndPublishedPostIds({
                                    ...deletedAndPublishedPostIds,
                                    deletedPostIds: [...deletedAndPublishedPostIds?.deletedPostIds, batchIdData?.id]
                                })
                                showSuccessToast("Post has been deleted successfully");
                            }
                        }).catch((error) => {
                        setBatchToDelete(null);
                        showErrorToast(error.response.data.message);
                    });
                }
            }
        });


    }
  
    return (<>

        <div className="draft-outer draft_container mb-3">

            <div className={"draft-heading"}>
                <h4 className={"posted-on-txt"}>Posted On : </h4>

                <div className="page_tags">
                    {batchIdData?.postPages && Array.isArray(batchIdData?.postPages) &&
                        Array.from(new Set(batchIdData.postPages.map((item) => item.pageId)))
                            .map((id) => batchIdData.postPages.find((page) => page.pageId === id))
                            .map((curPage, key) => (
                                <div className="selected-option" key={"curPage" + key}>
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


                <div>
                    <span className={"post_caption"}>Post Caption:</span>
                    <h3 onClick={()=>{ handleSeparateCaptionHashtag(batchIdData?.message)?.caption.length>40? setShowCaption(!showCaption):""}} className={`caption ${handleSeparateCaptionHashtag(batchIdData?.message)?.caption.length>40?"cursor-pointer":""}  ${showCaption?"upcoming_post_content ":"cmn_text_overflow"}`}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h3>
                </div>

                <div className={"mt-2"}>
                    <h5>Hashtags: </h5>
                    <div className={`mb-2 ${handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag.length>40 ? "cursor-pointer":""}  ${showHastag?"hash_tags_outer_container":"cmn_text_overflow"}` }>
                        <span id='hash-tag'
                            className={"hash_tags "} onClick={()=>{handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag.length>40?setShowHashtag(!showHastag):""}}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
                    </div>

                </div>

                <div className={""}>
                    <h5>Draft Created On:</h5>
                    <div className={'mb-2'}>
                        <span className={"hash_tags"}>{formatDate(batchIdData?.createdAt)}</span>
                    </div>
                </div>

                <div className="mt-4 d-flex gap-2 justify-content-center align-items-center draft_button_outer">
                    <GenericButtonWithLoader className={"post_now cmn_bg_btn loading"} label={"Post Now"}
                                             isLoading={batchIdData?.id === postToPublish && publishedPostData?.loading}
                                             onClick={handlePublishedPost}
                                             isDisabled={labels !== "Post Now" && deletePostByBatchIdData?.loading}
                    />
                    <GenericButtonWithLoader className={"outline_btn  loading"} label={"Schedule Post"}
                                             onClick={() => {
                                                 setLabels("Schedule Post")
                                                 navigate("/post/" + batchIdData?.id)
                                             }}
                                             isDisabled={labels !== "Schedule Post" && deletePostByBatchIdData?.loading || publishedPostData?.loading}
                    />

                    <GenericButtonWithLoader className={"outline_btn  loading"}
                                             label={"Delete Post"}
                                             isLoading={batchIdData?.id === batchToDelete && deletePostByBatchIdData?.loading}
                                             onClick={handleDeletePost}
                                             id={batchIdData?.id}
                                             contentText={"Deleting..."}
                                             isDisabled={labels !== "Delete Post" && publishedPostData?.loading}
                    />
                </div>

            </div>


        </div>
    </>)
}

export default DraftComponent;
