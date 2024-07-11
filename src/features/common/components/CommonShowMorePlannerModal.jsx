import Modal from 'react-bootstrap/Modal';
import './CommonShowMorePlannerModal.css'
import {
    computeImageURL, formatMessage, handleApiResponse,
    handleSeparateCaptionHashtag,
    isPlannerPostEditable,
    sortByKey
} from "../../../utils/commonUtils";
import CommonSlider from "./CommonSlider";
import CommonLoader from "./CommonLoader";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    deletePostByBatchIdAction,
    deletePostFromPage,
    deletePostOnSocialMedia,
    getAllPostsForPlannerAction,
    getPlannerPostCountAction
} from "../../../app/actions/postActions/postActions";
import {showErrorToast, showSuccessToast} from "./Toast";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import Swal from "sweetalert2";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import default_user_icon from "../../../images/default_user_icon.svg"
import {RiDeleteBin7Line} from "react-icons/ri";
import DeletePostFromSocialMediaModal from "./DeletePostFromSocialMediaModal";
import {FailedToDeletePostOn} from "../../../utils/contantData";
import Skeleton from "../../loader/skeletonEffect/Skeleton";


const CommonShowMorePlannerModal = ({
                                        commonShowMorePlannerModal = null,
                                        setCommonShowMorePlannerModal = null,
                                        plannerPosts,
                                        eventDate,
                                        baseSearchQuery,
                                        setBaseSearchQuery,
                                        setGetUpdatedShowMorePlannerModalData
                                    }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = getToken();
    const getAllPlannerPostsDataLoading = useSelector(state => state.post.getAllPlannerPostReducer.loading);
    const deletePostOnSocialMediaData = useSelector((state) => state.post.deletePostOnSocialMediaReducer);
    const deletePostFromPageData = useSelector(state => state.post.deletePostFromPageReducer);
    const [showDeletePostFromSocialMediaModal, setShowDeletePostFromSocialMediaModal] = useState(false);
    const [postToDeleteFromSocialMedia, setPostToDeleteFromSocialMedia] = useState(null);
    const [selectedPagesToDeletePost, setSelectedPagesToDeletePost] = useState([]);
    const [deleteBatchIdRef, setDeleteBatchIdRef] = useState(null);
    const [deletedPostsIds, setDeletedPostsIds] = useState([]);
    const [removedPostPagesRef, setRemovedPostPagesRef] = useState(null);
    const [removedPostPages, setRemovedPostPages] = useState([]);

    console.log("postToDeleteFromSocialMedia======>",postToDeleteFromSocialMedia)

    useEffect(() => {
        if (selectedPagesToDeletePost?.length > 0) {
            setShowDeletePostFromSocialMediaModal(false)
            dispatch(deletePostOnSocialMedia({
                token: token,
                postId: postToDeleteFromSocialMedia?.id,
                pageIds: selectedPagesToDeletePost,
            })).then((res) => {
                const onSuccess = () => {
                    const failedToDeleteOnPageIds = Object?.keys(res?.payload)?.filter(c => !res?.payload[c]?.isSuccess)
                    const successfullyDeletedOnPageIds = Object?.keys(res?.payload)?.filter(c => res?.payload[c]?.isSuccess)
                    if (failedToDeleteOnPageIds?.length > 0) {
                        showErrorToast(formatMessage(FailedToDeletePostOn, [failedToDeleteOnPageIds?.map(cur => res?.payload[cur]?.pageName)?.join(",")]));
                    }
                    if (successfullyDeletedOnPageIds?.length>0) {
                        setBaseSearchQuery({
                            ...baseSearchQuery
                        })
                        setGetUpdatedShowMorePlannerModalData(true)
                    }
                }
                const onComplete = () => {
                    setSelectedPagesToDeletePost([])
                    setPostToDeleteFromSocialMedia(null)
                }
                handleApiResponse(res, onSuccess, null, onComplete);
            });
        }
    }, [selectedPagesToDeletePost])
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
                reverseButtons: true,
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
                            const onSuccess = () => {
                                showSuccessToast("Posts has been deleted successfully");
                                setDeletedPostsIds([...deletedPostsIds, postId])
                                if (plannerPosts?.length === deletedPostsIds?.length + 1) {
                                    getUpdatedPlannerData();
                                    setCommonShowMorePlannerModal(false);
                                }
                            }
                            const onComplete = () => {
                                setDeleteBatchIdRef(null);
                            }
                            handleApiResponse(response, onSuccess, null, onComplete)
                        })
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
                                        getAllPlannerPostsDataLoading ? <CommonLoader/> :
                                            sortByKey(plannerPosts, "feedPostDate")?.map((plannerPost, index) => {
                                                return deletedPostsIds.includes(plannerPost?.id) ? <></> :
                                                    <div
                                                        className={"more_plans_grid mb-3 " + ((deleteBatchIdRef === plannerPost?.id || (deletePostOnSocialMediaData?.loading && postToDeleteFromSocialMedia?.id===plannerPost?.id))  ? "disable_more_plans_grid" : "")}
                                                        key={index}>
                                                        <div className="plan_grid_img">
                                                            {
                                                                plannerPost?.attachments &&
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
                                                                                    (removedPostPagesRef?.postId === plannerPost.id && removedPostPagesRef?.pageId === curPage?.pageId) || (selectedPagesToDeletePost?.includes(curPage?.pageId)) ?
                                                                                        <SkeletonEffect className={"h-20px w-120px"} count={1}></SkeletonEffect>
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
                                                                                                                src={curPage?.imageURL || default_user_icon}
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
                                                                            if (isPlannerPostEditable("DELETE", plannerPost)) {
                                                                                if (plannerPost?.postStatus === "SCHEDULED" || plannerPost?.postPages?.every(postPage => postPage?.errorInfo?.isDeletedFromSocialMedia)) {
                                                                                    handleDeletePlannerPost(e, plannerPost?.id);
                                                                                } else {
                                                                                    setPostToDeleteFromSocialMedia(plannerPost)
                                                                                    setShowDeletePostFromSocialMediaModal(true)
                                                                                }
                                                                            }

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
            {
                showDeletePostFromSocialMediaModal &&
                <DeletePostFromSocialMediaModal
                    show={showDeletePostFromSocialMediaModal}
                    setShow={setShowDeletePostFromSocialMediaModal}
                    pageList={postToDeleteFromSocialMedia?.postPages?.map(cur => {
                        return {
                            pageId: cur.pageId,
                            pageName: cur?.pageName,
                            socialMediaType: cur?.socialMediaType,
                        }
                    })}
                    setSelectedPagesToDeletePost={setSelectedPagesToDeletePost}
                />
            }
        </>
    )
}
export default CommonShowMorePlannerModal;