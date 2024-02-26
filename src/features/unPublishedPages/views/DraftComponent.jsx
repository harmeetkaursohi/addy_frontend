import './DraftComponent.css'
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {computeImageURL, handleSeparateCaptionHashtag, redirectToURL} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deletePostByBatchIdAction, getAllSocialMediaPostsByCriteria, publishedPostAction} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "../../common/components/Toast";
import {getToken} from "../../../app/auth/auth";
import {useState} from "react";
import Swal from 'sweetalert2';


const DraftComponent = ({batchIdData,setDraftPost=null,setDrafts=null,reference="",resetData=null}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = getToken();
    const publishedPostData = useSelector((state) => state.post.publishedPostReducer);
    const [batchToDelete,setBatchToDelete]=useState(null);

    const handlePublishedPost = (e) => {
        e.preventDefault();
        setBatchToDelete(batchIdData?.id)
        dispatch(publishedPostAction({postId: batchIdData?.id, token: token}))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    setBatchToDelete(null);
                    showSuccessToast("Post has been published successfully");
                    if(reference==="PLANNER"){
                        setDrafts!==null && setDrafts([]);
                        setDraftPost!==null && setDraftPost(false)
                    }else{
                        resetData(new Date().getTime())
                    }
                }
            }).catch((error) => {
            setBatchToDelete(null);
            showErrorToast(error.response.data.message);
        });

    }

    const handleDeletePost = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: `Delete Post`,
            text: `Are you sure you want to delete this draft post?`,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
        }).then((result) => {
            if (result.isConfirmed) {
                if (e?.target?.id !== null) {
                    setBatchToDelete(e?.target?.id);
                    dispatch(deletePostByBatchIdAction({postId: e?.target?.id, token: token}))
                        .then((response) => {
                            if (response.meta.requestStatus === "fulfilled") {
                                setBatchToDelete(null);
                                showSuccessToast("Post has been deleted successfully");
                                dispatch(getAllSocialMediaPostsByCriteria({
                                    token: token,
                                    query: {limit: 1000, postStatus: ["DRAFT"]}
                                }));
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

        <div className="draft-outer mb-3">

            <div className={"draft-heading"}>
                <h4 className={"posted-on-txt"}>Posted On : </h4>

                <div className="page_tags">
                    {  batchIdData?.postPages && Array.isArray(batchIdData?.postPages) &&
                        Array.from(new Set(batchIdData.postPages.map((item) => item.pageId)))
                            .map((id) => batchIdData.postPages.find((page) => page.pageId === id))
                            .map((curPage,key) => (
                            <div className="selected-option" key={"curPage"+key}>
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
                    <h3 className={"caption upcoming_post_content"}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h3>
                </div>

                <div className={""}>
                    <h5>Hashtags: </h5>
                    <div className=' mb-2 hash_tags_outer_container'>
                        <span
                            className={"hash_tags "}>{batchIdData?.message !== null && batchIdData?.message !== "" ? handleSeparateCaptionHashtag(batchIdData?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
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
                                             isLoading={batchIdData?.id===batchToDelete && publishedPostData?.loading}
                                             onClick={handlePublishedPost}
                                             isDisabled={false}
                    />
                    <GenericButtonWithLoader className={"outline_btn schedule_btn loading"} label={"Schedule Post"}
                                             onClick={() => navigate("/post/" + batchIdData?.id)} isDisabled={false}/>

                    <GenericButtonWithLoader className={"outline_btn schedule_btn loading"}
                            label={"Delete Post"}
                            isLoading={batchIdData?.id===batchToDelete && publishedPostData?.loading}
                            onClick={handleDeletePost}
                            id={batchIdData?.id}
                            contentText={"Deleting..."}
                            isDisabled={false}
                    />
                </div>

            </div>


        </div>
    </>)
}

export default DraftComponent;