import "./DraftComponent.css";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import {
    formatMessage,
    handleSeparateCaptionHashtag,
    isNullOrEmpty, urlToBlob,
} from "../../../utils/commonUtils";
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
import default_user_icon from '../../../images/default_user_icon.svg'




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
        if (scheduledData?.data) {
            setScheduledPosts(Object.values(scheduledData?.data));
        }
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
                            showSuccessToast(formatMessage(DeletedSuccessfully, ["Post has been"]));
                            dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi", "getPostsForPlannerApi", "getPlannerPostsCountApi"]));
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
    };
    const formatYear = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if (date.getTime() >= tomorrow.getTime() && date.getTime() < tomorrow.getTime() + 86400000) {
            return "Tomorrow";
        }
        return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })}`;
    };

    return (
        <>
            {
                scheduledData?.data && Object.keys(scheduledData?.data).length > 0 &&
                <div className="cmn_outer pt-0">
                    <div className="">


                        <div className="upcoming_post_outer">
                                <h2>{jsondata.upcomingpost}</h2>                       
                           <div className="row row-gap-4 mb-5">
                           {
                                scheduledPosts && Array.isArray(scheduledPosts) &&
                                scheduledPosts.map((curBatch, index) => (
                                    <div
                                        className={sidebar ? "col-lg-4 col-md-6 col-sm-12 " : "col-lg-4 col-md-12 col-sm-12 "}
                                        key={index}
                                    >
                                        <div className="draft-outer">
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
                                                 <div className="upcoming_user_profile w-100 text-end">
                                                   <span className="schedule_date"><svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.0875 4.13281L5.8375 1.78906C6.24284 1.53573 6.75716 1.53573 7.1625 1.78906L10.9125 4.13281C11.278 4.36124 11.5 4.76182 11.5 5.19281V8.80719C11.5 9.23818 11.278 9.63877 10.9125 9.86719L7.1625 12.2109C6.75716 12.4643 6.24284 12.4643 5.8375 12.2109L2.0875 9.86719C1.72202 9.63877 1.5 9.23818 1.5 8.80719V5.19281C1.5 4.76182 1.72202 4.36124 2.0875 4.13281Z" stroke="white" stroke-width="1.33" stroke-linecap="round"/>
                                                    </svg>
                                                    {formatYear(curBatch?.feedPostDate)}</span>
                                                 </div>
                                            </div>

                                            <div className="card-body post_card">
                                                <div className={"mb-2 d-flex align-items-center"}>
                                                <span className="hash_tags flex-grow-1">
                                                {formatDate(curBatch?.createdAt)}                                               
                                            </span>
                                           <div className="d-flex">
                                           {curBatch?.postPages && curBatch?.postPages.map((curelem,index)=>{
                                                return(
                                                    <div className="pages_image" key={index}><img src={curelem?.imageURL || default_user_icon} alt="page image" /></div>
                                                )
                                             
                                            })}
                                           </div>
                                                </div>

                                                <div className="post_info_content">
                                                 <h3
                                                        onClick={handleSeparateCaptionHashtag(curBatch?.message)?.caption.length > 40 ? () => {
                                                            captionHandler(index);
                                                        } : ""}
                                                        className={`caption ${handleSeparateCaptionHashtag(curBatch?.message)?.caption.length > 40 ? "cursor-pointer" : ""} ${showCaptionIndex === index && showCaption ? "upcoming_post_content" : ""}`}
                                                    >
                                                        {
                                                            curBatch?.message !== null && curBatch?.message !== "" ? handleSeparateCaptionHashtag(curBatch?.message)?.caption || "---No Caption---" : "---No Caption---"
                                                        }
                                                    </h3>
                                                </div>

                                                {/* <h6 className="upcoming_post_heading">
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
                                                </h3> */}

                                                {/* <div className={"draft-heading"}>
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
                                                </div> */}
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
                                                    label={"Change Date"}
                                                    onClick={() => navigate('/planner/post/' + curBatch?.id)}
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
