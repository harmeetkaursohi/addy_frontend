import {useEffect, useState} from 'react';
import ReactDOMServer from 'react-dom/server';
import Modal from 'react-bootstrap/Modal';
import "./DraftComponent.css"
import {RxCross1} from "react-icons/rx";
import {formatDate} from "@fullcalendar/core";
import {
    computeImageURL, convertToUnixTimestamp,
    formatMessage,
    getFileFromAttachmentSource, getValueOrDefault, getVideoDurationById,
    handleSeparateCaptionHashtag,
    isNullOrEmpty, isUpdatePostRequestValid
} from "../../../utils/commonUtils";
import {useNavigate} from "react-router-dom";
import {useDispatch,} from "react-redux";
import {showSuccessToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import Delete_img from "../../../images/deletePost.svg?react";
import CommonSlider from "../../common/components/CommonSlider";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {useDeletePostByIdMutation, useGetPostsByIdQuery, usePublishedPostByIdMutation} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import {DeletedSuccessfully} from "../../../utils/contantData";


function DraftModal({
                        show,
                        setShow,
                        postData
                    }) {

    const handleClose = () => setShow(false);



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [deletePostById, deletePostByIdApi] = useDeletePostByIdMutation()
    const [publishedPostById, publishedPostByIdApi] = usePublishedPostByIdMutation()
    const postsByIdApi = useGetPostsByIdQuery(postData?.id, {skip: isNullOrEmpty(postData?.id)})

    const [postAttachments, setPostAttachments] = useState([])
    const [postToDelete, setPostToDelete] = useState(null);
    const [postToPublish, setPostToPublish] = useState(null);
    const [action, setAction] = useState("")
    const [showCaption, setShowCaption] = useState(false)
    const [showHastag, setShowHashtag] = useState(false)

    useEffect(() => {
        if (postsByIdApi?.data && Object.keys(postsByIdApi?.data || {}).length > 0 && postsByIdApi?.data?.attachments?.length > 0) {
            if (postsByIdApi?.data?.attachments[0]?.mediaType === "IMAGE") {
                Promise.all(postsByIdApi?.data?.attachments?.map(attachment => getFileFromAttachmentSource(attachment)))
                    .then((results) => {
                        setPostAttachments(results);
                    })

            }
            if (postsByIdApi?.data?.attachments[0]?.mediaType === "VIDEO") {
                getVideoDurationById(postsByIdApi?.data?.attachments[0]?.id).then(res => {
                    setPostAttachments([{
                        id: postsByIdApi?.data?.attachments[0]?.id,
                        mediaType: "VIDEO",
                        fileName: postsByIdApi?.data?.attachments[0]?.fileName,
                        duration: res.duration,
                        fileSize: postsByIdApi?.data?.attachments[0]?.fileSize
                    }]);
                });
            }
        }

    }, [postsByIdApi?.data]);

    const handlePublishedPost = async () => {
        setAction("POST")
        setPostToPublish(postData?.id)
        const requestBody = getRequestBodyToPost()
        if (isUpdatePostRequestValid(requestBody?.updatePostRequestDTO, postsByIdApi?.data?.attachments, postAttachments)) {
            await handleRTKQuery(
                async () => {
                    return await publishedPostById(postData?.id).unwrap()
                },
                (res) => {
                    if (res?.some(cur => cur.success)) {
                        dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi", "getPostsByIdApi"]))
                    }
                    handleClose()
                },
                null,
                () => {
                    setAction("")
                    setPostToPublish(null)
                }
            )
        }
    }

    const getRequestBodyToPost = () => {
        const postData=postsByIdApi?.data
        return {
            id: postData?.id,
            updatePostRequestDTO: {
                postPageInfos: postData?.postPageInfos?.map(cur=>{
                    return {
                        pageId: cur.pageId,
                        id: cur.id,
                        provider: cur.socialMediaType
                    }
                }),
                caption: getValueOrDefault(postData?.caption, ""),
                hashTag: getValueOrDefault(postData?.hashTag, ""),
                pinTitle: getValueOrDefault(postData?.pinTitle, ""),
                destinationUrl: getValueOrDefault(postData?.pinDestinationUrl, ""),
                attachments:postData?.attachments?.map((file) => ({
                    mediaType: file?.mediaType,
                    file: file?.file || null,
                    fileName: file.fileName,
                    id: file?.id || null,
                    gridFsId: file?.gridFsId || null
                })),
                postStatus: "PUBLISHED",
                boostPost: false,
                scheduledPostDate: null,
            },
        };
    }

    const handleDeletePost = () => {
        setAction("DELETE");
        setPostToDelete(postData?.id);

        const svgMarkup = ReactDOMServer.renderToStaticMarkup(<Delete_img/>);

        Swal.fire({
            html: `
                <div class="swal-content">
                    <div class="swal-images">
                        <img src="data:image/svg+xml;base64,${btoa(svgMarkup)}" alt="Delete Icon" class="delete-img" />
                    </div>
                    <h2 class="swal2-title" id="swal2-title">Delete Post</h2>
                    <p class="modal_heading">Are you sure you want to delete this draft post?</p>
                </div>
            `,
            // title: 'Delete Post',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Delete',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons: true,
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class',
                popup: "small_swal_popup cmnpopupWrapper",
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleRTKQuery(
                    async () => {
                        return await deletePostById(postData?.id).unwrap();
                    },
                    () => {
                        showSuccessToast(formatMessage(DeletedSuccessfully, ["Post has been"]));
                        dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi"]));
                        handleClose();
                    },
                    null,
                    () => {
                        setAction("");
                        setPostToDelete(null);
                    }
                );
            } else {
                setAction("");
                setPostToDelete(null);
            }
        });
    };
    return (
        <>
            <Modal show={show} onHide={handleClose} className={"draft_modal_Wrapper"}>

                <Modal.Body className={"postcaption_modal_content_wrapper"}>
                    <div className={"draft_post_view_box"}>
                        <div className={"draft_img_wrapper"}>
                            <div className={"posted_date_outer"}>
                                <h3>Posted on: <span>{formatDate(postData?.createdAt)}</span></h3>
                            </div>
                            <div className={"cross_btn_wrapper"} onClick={handleClose}>
                                <h3><RxCross1/></h3>
                            </div>
                            {
                                postData?.attachments &&
                                <CommonSlider files={postData?.attachments} selectedFileType={null} caption={null}
                                              hashTag={null}
                                              viewSimilarToSocialMedia={false}/>
                            }
                        </div>
                        <div className={"Post_caption_modal_content"}>
                            <h3 className={"small_font"}>Post Caption:</h3>
                            <h4
                                onClick={() => {
                                    handleSeparateCaptionHashtag(postData?.message)?.caption.length > 40 ? setShowCaption(!showCaption) : ""
                                }}
                                className={`caption ${handleSeparateCaptionHashtag(postData?.message)?.caption.length > 40 ? "cursor-pointer" : ""}  ${showCaption ? "upcoming_post_content " : "cmn_text_overflow"}`}>{postData?.message !== null && postData?.message !== "" && postData?.message !== " " ? handleSeparateCaptionHashtag(postData?.message)?.caption || "---No Caption---" : "---No Caption---"}</h4>

                            <div className={"draft_container_box"}>
                                <h3 className={"small_font"}>Hashtags: </h3>
                                <span id='hash-tag'
                                      className={"hash_tags "}
                                      onClick={() => {
                                          handleSeparateCaptionHashtag(postData?.message)?.hashtag.length > 40 ? setShowHashtag(!showHastag) : ""
                                      }}>
                                    {postData?.message !== null && postData?.message !== "" ? handleSeparateCaptionHashtag(postData?.message)?.hashtag || "---No Tags---" : "---No Tags---"}</span>
                            </div>
                            <div className={"draft_container_box"}>
                                <h3 className={"small_font"}>Platforms: </h3>
                                <div className={"social_media_page_outer ps-0"}>
                                    <div className="page_tags draft_page_tags">

                                        {
                                            postData?.postPages && Array.isArray(postData?.postPages) &&
                                            Array.from(new Set(postData.postPages.map((item) => item.pageId)))
                                                .map((id) => postData.postPages.find((page) => page.pageId === id))
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
                                <GenericButtonWithLoader className={`post_now cmn_bg_btn ${postsByIdApi?.isLoading  ? "pe-none":""}`}
                                                         label={"Post Now"}
                                                         isLoading={postData?.id === postToPublish && publishedPostByIdApi?.isLoading}
                                                         onClick={handlePublishedPost}
                                                         isDisabled={(action !== "POST" && deletePostByIdApi?.isLoading) }
                                />
                                <GenericButtonWithLoader className={"cmn_bg_btn edit_schedule_btn"}
                                                         label={"Schedule Post/Edit"}
                                                         onClick={() => {
                                                             setAction("SCHEDULE")
                                                             navigate("/planner/post/" + postData?.id)
                                                         }}
                                                         isDisabled={action !== "SCHEDULE" && deletePostByIdApi?.isLoading || publishedPostByIdApi?.isLoading}
                                />

                                <GenericButtonWithLoader className={"cmn_bg_btn edit_schedule_btn"}
                                                         label={"Delete Post"}
                                                         isLoading={postData?.id === postToDelete && deletePostByIdApi?.isLoading}
                                                         onClick={handleDeletePost}
                                                         id={postData?.id}
                                                         contentText={"Deleting..."}
                                                         isDisabled={action !== "DELETE" && publishedPostByIdApi?.isLoading}
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
