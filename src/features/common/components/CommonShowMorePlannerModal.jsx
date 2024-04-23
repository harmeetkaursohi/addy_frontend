import Modal from 'react-bootstrap/Modal';
import './CommonShowMorePlannerModal.css'
import {
    computeImageURL,
    handleSeparateCaptionHashtag,
    isPlannerPostEditable,
    sortByKey
} from "../../../utils/commonUtils";
import CommonSlider from "./CommonSlider";
import CommonLoader from "./CommonLoader";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    deletePostByBatchIdAction, deletePostFromPage, getAllPostsForPlannerAction, getPlannerPostCountAction
} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "./Toast";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import Swal from "sweetalert2";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {RiDeleteBin7Line} from "react-icons/ri";


const CommonShowMorePlannerModal = ({
                                        commonShowMorePlannerModal = null,
                                        setCommonShowMorePlannerModal = null,
                                        plannerPosts,
                                        eventDate,
                                        baseSearchQuery
                                    }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = getToken();
    const getAllPlannerPostsDataLoading = useSelector(state => state.post.getAllPlannerPostReducer.loading);
    const deletePostFromPageData = useSelector(state => state.post.deletePostFromPageReducer);
    const [deleteBatchIdRef, setDeleteBatchIdRef] = useState(null);
    const [deletedPostsIds, setDeletedPostsIds] = useState([]);
    const [removedPostPagesRef, setRemovedPostPagesRef] = useState(null);
    const [removedPostPages, setRemovedPostPages] = useState([]);

    useEffect(() => {
        if (removedPostPagesRef !== null && removedPostPagesRef !== undefined) {
            dispatch(deletePostFromPage({
                token: token,
                postId: removedPostPagesRef?.postId,
                pageIds: [removedPostPagesRef?.pageId]
            })).then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    setRemovedPostPages([...removedPostPages, {
                        postId: removedPostPagesRef?.postId,
                        pageId: removedPostPagesRef?.pageId
                    }]);
                }
                setRemovedPostPagesRef(null)
            })
        }
    }, [removedPostPagesRef])


    const handleDeletePlannerPost = (e, postId) => {
        e.preventDefault();
        if (postId !== null) {
            Swal.fire({
                icon: 'warning',
                title: `Delete Post`,
                text: `Are you sure you want to delete this post?`,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                confirmButtonColor: "#F07C33",
                cancelButtonColor: "#E6E9EC",
                customClass: {
                    confirmButton: 'custom-confirm-button-class',
                    cancelButton: 'custom-cancel-button-class'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    setDeleteBatchIdRef(postId);
                    dispatch(deletePostByBatchIdAction({postId: postId, token: token}))
                        .then((response) => {
                            if (response.meta.requestStatus === "fulfilled") {
                                showSuccessToast("Posts has been deleted successfully");
                                setDeletedPostsIds([...deletedPostsIds, postId])
                                setDeleteBatchIdRef(null);
                                if (plannerPosts?.length === deletedPostsIds?.length + 1) {
                                    getUpdatedPlannerData();
                                    setCommonShowMorePlannerModal(false);
                                }

                            }
                        })
                        .catch((error) => {
                            setDeleteBatchIdRef(null);
                            showErrorToast(error.response.data.message);
                        });
                }
            });
        }
    }

    useEffect(() => {
        return () => {
            setDeletedPostsIds([])
            setRemovedPostPages([])
        }
    }, [])

    const getUpdatedPlannerData = () => {
        const decodeJwt = decodeJwtToken(token);
        const requestBody = {
            customerId: decodeJwt.customerId,
            token: token,
            query: baseSearchQuery
        }
        dispatch(getAllPostsForPlannerAction(requestBody));
        dispatch(getPlannerPostCountAction(requestBody));
    }

    const handleCloseModal = (e) => {
        e.preventDefault();
        deletedPostsIds.length > 0 && getUpdatedPlannerData();
        setCommonShowMorePlannerModal(false);
    }
    const handleClose = () => setCommonShowMorePlannerModal(false);


    return (
        <>
            <div className='generate_ai_img_container '>
                <Modal show={commonShowMorePlannerModal}
                       onHide={handleClose}
                       className={"alert_modal_body "}
                       dialogClassName='modal-lg plannner_modal'
                       backdrop="static"
                >
                    <i className="fa fa-times hide_modal" onClick={handleCloseModal}/>
                    <Modal.Body>

                        <div className=''>

                            <div className="more_plans">
                                <h2 className="text-center">{eventDate}</h2>
                                <div className={getAllPlannerPostsDataLoading ? "" : "more_plans_wrapper"}>
                                    {/*map starts here for gird*/}
                                    {
                                        getAllPlannerPostsDataLoading ? (
                                                <CommonLoader/>) :
                                            sortByKey(plannerPosts, "feedPostDate")?.map((plannerPost, index) => {

                                                return deletedPostsIds.includes(plannerPost?.id) ? <></> :

                                                    <div
                                                        className={"more_plans_grid mb-3 " + (deleteBatchIdRef === plannerPost?.id ? "disable_more_plans_grid" : "")}
                                                        key={index}>
                                                        <div className="plan_grid_img">
                                                            {plannerPost?.attachments &&
                                                                <CommonSlider files={plannerPost?.attachments}
                                                                              selectedFileType={null} caption={null}
                                                                              hashTag={null}
                                                                              showThumbnail={true}
                                                                              viewSimilarToSocialMedia={false}
                                                                              enableShowPlannerModel={true}
                                                                />
                                                            }
                                                        </div>
                                                        <div className="plan_grid_content">
                                                            <div className="plan_content_header justify-start ">

                                                                {/*tags map grid starts here*/}
                                                                <div className="plans_tags_wrapper ">

                                                                    <div className="d-flex page_tags position-absolute">
                                                                        {
                                                                            plannerPost?.postPages && Array.isArray(plannerPost?.postPages) &&
                                                                            plannerPost?.postPages.map((curPage, index) => {
                                                                                return removedPostPages?.some(removedPostPages => removedPostPages?.postId === plannerPost?.id && removedPostPages?.pageId === curPage?.pageId) ? <></> : (
                                                                                    (removedPostPagesRef?.postId === plannerPost.id && removedPostPagesRef?.pageId === curPage?.pageId) ?
                                                                                        <SkeletonEffect
                                                                                            count={1}></SkeletonEffect>
                                                                                        : <div key={index}
                                                                                               className={"planner_tag_container"}>
                                                                                            {
                                                                                                deleteBatchIdRef === plannerPost?.id ?
                                                                                                    <SkeletonEffect
                                                                                                        count={1}></SkeletonEffect> :
                                                                                                    <div
                                                                                                        className={`plan_tags ${curPage.socialMediaType.toLowerCase()}`}
                                                                                                    >
                                                                                                        <div
                                                                                                            className="plan_tag_img position-relative">
                                                                                                            <img
                                                                                                                className="plan_image"
                                                                                                                src={curPage?.imageURL}
                                                                                                                alt="fb"/>
                                                                                                            <img
                                                                                                                className="plan_social_img"
                                                                                                                src={computeImageURL(curPage?.socialMediaType)}
                                                                                                                alt="fb"/>

                                                                                                        </div>
                                                                                                        <p className="mb-0">{curPage?.pageName}</p>
                                                                                                    </div>
                                                                                            }
                                                                                            {
                                                                                                (deleteBatchIdRef !== plannerPost?.id && curPage?.errorInfo?.isDeletedFromSocialMedia) &&
                                                                                                <>
                                                                                                    <div
                                                                                                        className={"post-deleted-tag"}> Deleted
                                                                                                        {
                                                                                                            !plannerPost?.postPages?.every(postPage => postPage?.errorInfo?.isDeletedFromSocialMedia) &&
                                                                                                            <RiDeleteBin7Line
                                                                                                                onClick={() => {
                                                                                                                    !deletePostFromPageData?.loading && setRemovedPostPagesRef({
                                                                                                                        postId: plannerPost?.id,
                                                                                                                        pageId: curPage?.pageId
                                                                                                                    })
                                                                                                                }}
                                                                                                                title={"Delete From Addy"}
                                                                                                                className={"cursor-pointer delete-from-addy-icon"}/>
                                                                                                        }

                                                                                                    </div>
                                                                                                </>
                                                                                            }

                                                                                        </div>
                                                                                )

                                                                            })
                                                                        }
                                                                    </div>

                                                                </div>
                                                                <div className="plan_grid_navigations d-flex mt-2">
                                                                    <button
                                                                        className={isPlannerPostEditable("EDIT", plannerPost) ? "" : "disable_more_plans_grid"}
                                                                        disabled={!isPlannerPostEditable("EDIT", plannerPost)}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            navigate(`/post/${plannerPost?.id}`)
                                                                        }}>
                                                                        <i className="fa fa-pencil"
                                                                           aria-hidden="true"/>
                                                                    </button>
                                                                    <button
                                                                        className={isPlannerPostEditable("DELETE", plannerPost) ? "" : "disable_more_plans_grid"}
                                                                        disabled={!isPlannerPostEditable("DELETE", plannerPost)}
                                                                        onClick={(e) => {
                                                                            handleDeletePlannerPost(e, plannerPost?.id);
                                                                        }}>
                                                                        <i className="fa fa-trash"
                                                                           aria-hidden="true"/>
                                                                    </button>

                                                                </div>
                                                            </div>
                                                            {
                                                                deleteBatchIdRef === plannerPost?.id ?
                                                                    <SkeletonEffect count={1}></SkeletonEffect> :
                                                                    <>
                                                                        <p className="mt-2 mb-1">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.caption || "" : ""}</p>
                                                                        <p className="hasTags">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.hashtag || "" : ""}</p>
                                                                    </>
                                                            }

                                                        </div>
                                                    </div>


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