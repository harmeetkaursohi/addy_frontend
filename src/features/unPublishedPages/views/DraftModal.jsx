import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import "./DraftComponent.css"
import {RxCross1} from "react-icons/rx";
import {formatDate} from "@fullcalendar/core";
import {computeImageURL, handleSeparateCaptionHashtag} from "../../../utils/commonUtils";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../../app/auth/auth";
import {deletePostByBatchIdAction, publishedPostAction} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import delete_img from "../../../images/trash_img.svg";
import CommonSlider from "../../common/components/CommonSlider";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";


function DraftModal({show,
                        setShow,
                        batchIdData,
                        setDraftPost = null,
                        setDrafts = null,
                        reference = "",
                        deletedAndPublishedPostIds,
                        setDeletedAndPublishedPostIds,
                        setApiTrigger}) {

    const handleClose = () => setShow(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = getToken();
    const publishedPostData = useSelector((state) => state.post.publishedPostReducer);
    const deletePostByBatchIdData = useSelector((state) => state.post.deletePostByBatchIdReducer);
    const [batchToDelete, setBatchToDelete] = useState(null);
    const [postToPublish, setPostToPublish] = useState(null);
    const [labels, setLabels] = useState("")
    const [showCaption, setShowCaption] = useState(false)
    const [showHastag, setShowHashtag] = useState(false)

    const handlePublishedPost = (e) => {
        setLabels("Post Now")
        e.preventDefault();
        setPostToPublish(batchIdData?.id)
        dispatch(publishedPostAction({postId: batchIdData?.id, token: token}))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    const allSuccess = response?.payload?.every(post => post.success)
                    const allFailed = response?.payload?.every(post => !post.success)
                    setBatchToDelete(null);
                    if (reference === "PLANNER") {
                        setDrafts !== null && setDrafts([]);
                        setDraftPost !== null && setDraftPost(false)
                    } else if (allSuccess) {
                        setDeletedAndPublishedPostIds({
                            ...deletedAndPublishedPostIds,
                            publishedPostIds: [...deletedAndPublishedPostIds?.publishedPostIds, batchIdData?.id]
                        })
                    } else if (!allSuccess && !allFailed) {
                        setApiTrigger(new Date().getMilliseconds());
                    }
                    handleClose()
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
            imageUrl: delete_img,
            title: `Delete Post`,
            text: `Are you sure you want to delete this draft post?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Delete',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons: true,
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
                                handleClose()
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
    return (
        <>
            <Modal show={show} onHide={handleClose} className={"draft_modal_Wrapper"}>

                <Modal.Body className={"postcaption_modal_content_wrapper"}>
                    <div className={"draft_post_view_box"}>
                        <div className={"draft_img_wrapper"}>
                            <div className={"posted_date_outer"}>
                                <h3>Posted on: <span>{formatDate(batchIdData?.createdAt)}</span></h3>
                            </div>
                            <div className={"cross_btn_wrapper"} onClick={handleClose}>
                                <h3><RxCross1/></h3>
                            </div>
                            {
                                batchIdData?.attachments &&
                                <CommonSlider files={batchIdData?.attachments} selectedFileType={null} caption={null}
                                              hashTag={null}
                                              viewSimilarToSocialMedia={false}/>
                            }
                        </div>
                        <div className={"Post_caption_modal_content"}>
                            <h3 className={"small_font"}>Post Caption:</h3>
                            <h4
                                onClick={() => {
                                    handleSeparateCaptionHashtag(batchIdData?.message)?.caption.length > 40 ? setShowCaption(!showCaption) : ""
                                }}
                                className={`caption ${handleSeparateCaptionHashtag(batchIdData?.message)?.caption.length > 40 ? "cursor-pointer" : ""}  ${showCaption ? "upcoming_post_content " : "cmn_text_overflow"}`}>{batchIdData?.message !== null && batchIdData?.message !== "" && batchIdData?.message !== " " ? handleSeparateCaptionHashtag(batchIdData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h4>

                            <div className={"draft_container_box"}>
                                <h3 className={"small_font"}>Hashtags: </h3>
                                <span id='hash-tag'
                                      className={"hash_tags "}
                                      onClick={() => {
                                          handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag.length > 40 ? setShowHashtag(!showHastag) : ""
                                      }}>
                                    {batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
                            </div>
                            <div className={"draft_container_box"}>
                                <h3 className={"small_font"}>Platforms: </h3>
                                <div className={"social_media_page_outer"}>
                                    <div className="page_tags draft_page_tags">

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
                            </div>
                            <div className={"modal_post_btn_outer"}>
                                <GenericButtonWithLoader className={"post_now cmn_bg_btn"}
                                                         label={"Post Now"}
                                                         isLoading={batchIdData?.id === postToPublish && publishedPostData?.loading}
                                                         onClick={handlePublishedPost}
                                                         isDisabled={labels !== "Post Now" && deletePostByBatchIdData?.loading}
                                />
                                <GenericButtonWithLoader className={"cmn_bg_btn edit_schedule_btn"}
                                                         label={"Schedule Post/Edit"}
                                                         onClick={() => {
                                                             setLabels("Schedule Post")
                                                             navigate("/planner/post/" + batchIdData?.id)
                                                         }}
                                                         isDisabled={labels !== "Schedule Post" && deletePostByBatchIdData?.loading || publishedPostData?.loading}
                                />

                                <GenericButtonWithLoader className={"cmn_bg_btn edit_schedule_btn"}
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

                </Modal.Body>

            </Modal>
        </>
    );
}

export default DraftModal;
