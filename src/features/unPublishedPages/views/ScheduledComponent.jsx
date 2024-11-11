import "./DraftComponent.css";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {
    computeImageURL,
    formatMessage,
    handleSeparateCaptionHashtag,
    isNullOrEmpty,
} from "../../../utils/commonUtils";
import {formatDate} from "@fullcalendar/core";
import CommonSlider from "../../common/components/CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import jsondata from "../../../locales/data/initialdata.json";
import {useEffect, useState} from "react";
import {showSuccessToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import {useAppContext} from "../../common/components/AppProvider";
import Delete_img from "../../../images/deletePost.svg?react";
import {useDeletePostByIdMutation} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import {DeletedSuccessfully} from "../../../utils/contantData";
import ReactDOMServer from 'react-dom/server'; 
const ScheduledComponent = ({scheduledData}) => {
    const {sidebar} = useAppContext();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [postToDeleteId, setPostToDeleteId] = useState(null);

    const [showCaption, setShowCaption] = useState(false);
    const [showHashTag, setShowHashTag] = useState(false);

    const [showCaptionIndex, setCaptionIndex] = useState();
    const [showHashTagIndex, setHashTagIndex] = useState();

    const [deletePostById, deletePostApi] = useDeletePostByIdMutation();

    useEffect(() => {
        scheduledData?.data && setScheduledPosts(Object.values(scheduledData?.data));
    }, [scheduledData]);

    useEffect(() => {
        if (!isNullOrEmpty(postToDeleteId)) {
            const svgMarkup = ReactDOMServer.renderToStaticMarkup(<Delete_img />);
            Swal.fire({
                html: `
                <div class="swal-content">
                    <div class="swal-images mt-3">
                        <img src="data:image/svg+xml;base64,${btoa(svgMarkup)}" alt="Delete Icon" class="delete-img" />
                    </div>
                    <h2 class="swal2-title" id="swal2-title">Delete Post</h2>
                    <p class="modal_heading">Are you sure you want to delete this draft post?</p>
                </div>
            `,
                showCancelButton: true,
                cancelButtonText: "Cancel",
                confirmButtonText: "Delete",
                confirmButtonColor: "#F07C33",
                cancelButtonColor: "#E6E9EC",
                reverseButtons: true,
                customClass: {
                    confirmButton: "custom-confirm-button-class",
                    cancelButton: "custom-cancel-button-class",
                },
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await handleRTKQuery(
                        async () => {
                            return await deletePostById(postToDeleteId).unwrap();
                        },
                        () => {
                            showSuccessToast(
                                formatMessage(DeletedSuccessfully, ["Post has been"])
                            );
                            dispatch(
                                addyApi.util.invalidateTags([
                                    "getSocialMediaPostsByCriteriaApi",
                                ])
                            );
                        },
                        null,
                        () => {
                            setPostToDeleteId(null);
                        }
                    );
                } else {
                    setPostToDeleteId(null);
                }
            });
        }
    }, [postToDeleteId]);

    const captionHandler = (index) => {
        setCaptionIndex(index);
        setShowCaption(!showCaption);
    };

    const hashTagHandler = (index) => {
        setHashTagIndex(index);
        setShowHashTag(!showHashTag);
    };

    return (
        <>
            {
                scheduledData?.data && Object.keys(scheduledData?.data).length > 0 &&
                <div className="cmn_outer pt-0">
                    <div className="">


                        <div className="upcoming_post_outer">
                            <div className="">
                                <h2>{jsondata.upcomingpost}</h2>
                            </div>
                           <div className="row">
                           {
                                scheduledPosts && Array.isArray(scheduledPosts) &&
                                scheduledPosts.map((curBatch, index) => (
                                    <div
                                        className={sidebar ? "col-lg-4 col-md-6 col-sm-12 " : "col-lg-4 col-md-12 col-sm-12 "}
                                        key={index}
                                    >
                                        <div className="draft-outer ">
                                            <div className="post-image-outer">
                                                {
                                                    curBatch?.attachments &&
                                                    <CommonSlider
                                                        files={curBatch?.attachments}
                                                        selectedFileType={null}
                                                        caption={null}
                                                        hashTag={null}
                                                        viewSimilarToSocialMedia={false}
                                                    />
                                                }
                                            </div>

                                            <div className="card-body post_card">
                                                <div className={"mb-2"}>
                                                                    <span
                                                                        className={"hash_tags"}>{formatDate(curBatch?.feedPostDate)}</span>
                                                </div>

                                                <div>
                                                    <h6 className="upcoming_post_heading">
                                                        Post Captions
                                                    </h6>
                                                    <h3
                                                        onClick={handleSeparateCaptionHashtag(curBatch?.message)?.caption.length > 40 ? () => {
                                                            captionHandler(index);
                                                        } : ""}
                                                        className={` mb-2 caption ${handleSeparateCaptionHashtag(curBatch?.message)?.caption.length > 40 ? "cursor-pointer" : ""} ${showCaptionIndex === index && showCaption ? "upcoming_post_content" : "cmn_text_overflow"}`}
                                                    >
                                                        {
                                                            curBatch?.message !== null && curBatch?.message !== "" ? handleSeparateCaptionHashtag(curBatch?.message)?.caption || "---No Caption---" : "---No Caption---"
                                                        }
                                                    </h3>
                                                </div>

                                                <h6 className="upcoming_post_heading">
                                                    Hashtags:{" "}
                                                </h6>

                                                <h3
                                                    onClick={handleSeparateCaptionHashtag(curBatch?.message)?.hashtag.length > 40 ? () => {
                                                        hashTagHandler(index);
                                                    } : ""}
                                                    className={`mb-2 ${handleSeparateCaptionHashtag(curBatch?.message)?.hashtag.length > 40 ? "cursor-pointer" : ""} ${showHashTagIndex === index && showHashTag ? "hash_tags_outer_container" : "cmn_text_overflow d-flex"}`}
                                                >
                                                                     <span className={"hash_tags "}>
                                                                         {
                                                                             curBatch?.message !== null && curBatch?.message !== "" ? handleSeparateCaptionHashtag(curBatch?.message)?.hashtag || "---No Tags---" : "---No Tags---"
                                                                         }
                                                                     </span>
                                                </h3>

                                                <div className={"draft-heading"}>
                                                    <h4 className={"posted-on-txt"}>Posted On : </h4>

                                                    <div className="page_tags">
                                                        {
                                                            curBatch?.postPages && Array.isArray(curBatch?.postPages) &&
                                                            curBatch?.postPages.map((curPage, index) => (
                                                                <div
                                                                    className="selected-option"
                                                                    key={index}
                                                                >
                                                                    <div>
                                                                        <img
                                                                            className={"me-1 social-media-icon"}
                                                                            src={computeImageURL(
                                                                                curPage?.socialMediaType
                                                                            )}
                                                                            alt={"instagram"}
                                                                        />
                                                                    </div>
                                                                    <p className={"social-media-page-name"}>
                                                                        {curPage?.pageName}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="upcomingPostBtn_Outer ">
                                                <GenericButtonWithLoader
                                                    className={
                                                        "outline_btn nunito_font schedule_btn loading"
                                                    }
                                                    label={"Delete Post"}
                                                    isLoading={
                                                        postToDeleteId === curBatch?.id &&
                                                        deletePostApi?.isLoading
                                                    }
                                                    onClick={(e) => {
                                                        setPostToDeleteId(e.target.id);
                                                    }}
                                                    id={curBatch?.id}
                                                    contentText={"Deleting..."}
                                                    isDisabled={false}
                                                />
                                                <GenericButtonWithLoader
                                                    className={
                                                        "post_now nunito_font cmn_bg_btn loading"
                                                    }
                                                    label={"Change Post"}
                                                    onClick={() => navigate("/planner/post/" + curBatch?.id)}
                                                    isDisabled={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                           </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ScheduledComponent;
