import Modal from 'react-bootstrap/Modal';
import './CommonShowMorePlannerModal.css'
import {computeImageURL, handleSeparateCaptionHashtag, redirectToURL} from "../../../utils/commonUtils";
import CommonSlider from "./CommonSlider";
import CommonLoader from "./CommonLoader";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {deletePostByBatchIdAction, getAllPostsForPlannerAction, getPlannerPostCountAction
} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "./Toast";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";


const CommonShowMorePlannerModal = ({
                                        commonShowMorePlannerModal = null,
                                        setCommonShowMorePlannerModal = null,
                                        plannerPosts,
                                        setPlannerPosts,
                                        eventDate,
                                        baseSearchQuery
                                    }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = getToken();
    const getAllPlannerPostsDataLoading = useSelector(state => state.post.getAllPlannerPostReducer.loading);
    const [deleteBatchIdRef, setDeleteBatchIdRef] = useState(null);

    const handleClose = () => setCommonShowMorePlannerModal(false);

    const handleDeletePlannerPost = (e, batchId) => {
        e.preventDefault();
        if (batchId !== null) {
            setDeleteBatchIdRef(batchId);
            dispatch(deletePostByBatchIdAction({batchId: batchId, token: token}))
                .then((response) => {
                    if (response.meta.requestStatus === "fulfilled") {
                        showSuccessToast("Posts has been deleted successfully");
                        setDeleteBatchIdRef(null);
                        const decodeJwt = decodeJwtToken(token);
                        dispatch(getAllPostsForPlannerAction({customerId: decodeJwt.customerId, token: token, query: baseSearchQuery}));
                        dispatch(getPlannerPostCountAction({customerId: decodeJwt.customerId, token: token, query: baseSearchQuery}));
                        setCommonShowMorePlannerModal(false);
                    }
                })
                .catch((error) => {
                    setCommonShowMorePlannerModal(false);
                    setDeleteBatchIdRef(null);
                    showErrorToast(error.response.data.message);
                });
        }
    }

    const handleCloseModal = (e) => {
        e.preventDefault();
        setCommonShowMorePlannerModal(false);
    }

    return (
        <>
            <div className='generate_ai_img_container '>
                <Modal show={commonShowMorePlannerModal}
                       onHide={handleClose}
                       className={"alert_modal_body "}
                       dialogClassName='modal-lg plannner_modal'
                >
                    <i className="fa fa-times hide_modal" onClick={handleCloseModal}/>
                    <Modal.Body>

                        <div className=''>

                            <div className="more_plans">
                                <h2 className="text-center">{eventDate}</h2>
                                <div className="more_plans_wrapper">
                                    {/*map starts here for gird*/}
                                    {
                                        getAllPlannerPostsDataLoading ? (
                                                <CommonLoader/>) :
                                            plannerPosts?.map((plannerPost, index) => {
                                                return (
                                                    <div className="more_plans_grid mb-3" key={index}>
                                                        <div className="plan_grid_img">
                                                            {plannerPost?.attachments &&
                                                                <CommonSlider files={plannerPost?.attachments}
                                                                              selectedFileType={null} caption={null}
                                                                              hashTag={null}
                                                                              viewSimilarToSocialMedia={false}/>
                                                            }
                                                        </div>
                                                        <div className="plan_grid_content">
                                                            <div className="plan_content_header">

                                                                {/*tags map grid starts here*/}
                                                                <div className="plans_tags_wrapper ">

                                                                    <div className="d-flex page_tags">
                                                                        {plannerPost?.postPages && Array.isArray(plannerPost?.postPages) &&
                                                                            plannerPost?.postPages.map((curPage, index) => (

                                                                                <div className={`plan_tags ${curPage.socialMediaType.toLowerCase()}`}
                                                                                     onClick={() => {
                                                                                         redirectToURL(`https://www.facebook.com/${curPage?.id}`)
                                                                                     }}
                                                                                     key={index}
                                                                                >
                                                                                    <div  className="plan_tag_img position-relative">
                                                                                        <img className="plan_image"
                                                                                             src={curPage?.imageURL}
                                                                                             alt="fb"/>
                                                                                        <img
                                                                                            className="plan_social_img"
                                                                                            src={computeImageURL(curPage?.socialMediaType)}
                                                                                            alt="fb"/>

                                                                                    </div>
                                                                                    <p className="mb-0">{curPage?.pageName}</p>
                                                                                </div>

                                                                            ))
                                                                        }
                                                                    </div>

                                                                </div>
                                                                <div className="plan_grid_navigations">
                                                                    <button onClick={(e) => {
                                                                        e.preventDefault();
                                                                        navigate(`/post/${plannerPost?.id}`)
                                                                    }}>
                                                                        <i className="fa fa-pencil"
                                                                           aria-hidden="true"/>
                                                                    </button>

                                                                    {
                                                                        deleteBatchIdRef === plannerPost?.id ?
                                                                            <i className="fa fa-spinner fa-spin"/> :
                                                                            <button onClick={(e) => {
                                                                                handleDeletePlannerPost(e, plannerPost?.id);
                                                                            }}>
                                                                                <i className="fa fa-trash"
                                                                                   aria-hidden="true"/>
                                                                            </button>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <p className="mt-2 mb-1">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.caption || "" : ""}</p>
                                                            <p className="hasTags">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.hashtag || "#Good Friday" : ""}</p>
                                                        </div>
                                                    </div>
                                                )

                                            })
                                    }

                                </div>
                            </div>

                        </div>

                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}
export default CommonShowMorePlannerModal;