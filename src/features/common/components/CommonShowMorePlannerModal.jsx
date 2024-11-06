import Modal from 'react-bootstrap/Modal';
import './CommonShowMorePlannerModal.css'
import {
    computeImageURL, formatMessage, getEmptyArrayOfSize,
    handleSeparateCaptionHashtag, isNullOrEmpty,
    isPlannerPostEditable,
    sortByKey
} from "../../../utils/commonUtils";
import CommonSlider from "./CommonSlider";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {showSuccessToast} from "./Toast";
import Swal from "sweetalert2";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import default_user_icon from "../../../images/default_user_icon.svg"
import {RiDeleteBin7Line} from "react-icons/ri";
import {
    useDeletePostByIdMutation,
    useDeletePostFromPagesByPageIdsMutation,
    useGetSocialMediaPostsByCriteriaQuery
} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {DeletedSuccessfully} from "../../../utils/contantData";
import {addyApi} from "../../../app/addyApi";
import {Image} from 'react-bootstrap';

const CommonShowMorePlannerModal = ({
                                        showCommonShowMorePlannerModal,
                                        setShowCommonShowMorePlannerModal,
                                        eventDate,
                                        showMorePlannerModalSearchQuery,
                                    }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [posts, setPosts] = useState([])

    const [postToDeleteId, setPostToDeleteId] = useState(null);
    const [deletedPostsIds, setDeletedPostsIds] = useState([]);
    const [postPageToRemove, setPostPageToRemove] = useState(null);
    const [removedPostPages, setRemovedPostPages] = useState([]);

    const [deletePostById, deletePostApi] = useDeletePostByIdMutation()
    const [deletePostFromPagesByPageIds, deletePostFromPagesApi] = useDeletePostFromPagesByPageIdsMutation()
    const postsApi = useGetSocialMediaPostsByCriteriaQuery(showMorePlannerModalSearchQuery, {skip: isNullOrEmpty(showMorePlannerModalSearchQuery?.batchIds) || isNullOrEmpty(showMorePlannerModalSearchQuery?.plannerCardDate)})

    useEffect(() => {
        if (!isNullOrEmpty(postsApi?.data)) {
            setPosts(Object.values(postsApi?.data))
        }
    }, [postsApi])

    useEffect(() => {
        if (postPageToRemove !== null && postPageToRemove !== undefined) {
            handleDeletePostFromPage()
        }
    }, [postPageToRemove])

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
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setPostToDeleteId(postId)
                    await handleRTKQuery(
                        async () => {
                            return await deletePostById(postId).unwrap()
                        },
                        () => {
                            showSuccessToast(formatMessage(DeletedSuccessfully, ["Post has been"]))
                            setDeletedPostsIds([...deletedPostsIds, postId])
                            // If all the posts are deleted then close the modal and reload planner data
                            if (posts?.length === deletedPostsIds?.length + 1) {
                                getUpdatedPlannerData();
                                setShowCommonShowMorePlannerModal(false);
                            }
                        },
                        null,
                        () => {
                            setPostToDeleteId(null);
                        });
                }
            });
        }
    }

    const handleDeletePostFromPage = async () => {
        await handleRTKQuery(
            async () => {
                return await deletePostFromPagesByPageIds({
                    postId: postPageToRemove?.postId,
                    pageIds: [postPageToRemove?.pageId]
                }).unwrap()
            },
            () => {
                setRemovedPostPages([...removedPostPages, {
                    postId: postPageToRemove?.postId,
                    pageId: postPageToRemove?.pageId
                }]);
            },
            null,
            () => {
                setPostPageToRemove(null)
            });

    }

    const getUpdatedPlannerData = () => {
        dispatch(addyApi.util.invalidateTags(["getPostsForPlannerApi", "getPlannerPostsCountApi", "getSocialMediaPostsByCriteriaApi"]))
    }

    const handleCloseModal = () => {
        if (deletedPostsIds.length > 0 || removedPostPages.length > 0) {
            getUpdatedPlannerData();
        }
        setShowCommonShowMorePlannerModal(false);
    }

    return (
        <>
            <div className='generate_ai_img_container '>
                <Modal show={showCommonShowMorePlannerModal}
                       onHide={handleCloseModal}
                       className={"alert_modal_body "}
                       dialogClassName='modal-lg plannner_modal'
                       backdrop="static"
                >
                    <i className="fa fa-times hide_modal" onClick={handleCloseModal}/>
                    <Modal.Body>

                        <div className=''>

                            <div className="more_plans">
                                <h2 className="text-center">{eventDate}</h2>
                                <div className={"more_plans_wrapper"}>
                                    {/*map starts here for gird*/}
                                    {
                                        postsApi?.isLoading || postsApi?.isFetching ?
                                            getEmptyArrayOfSize(3).map((_, i) => {
                                                return <div key={i} className={"more_plans_grid mb-3 "}>
                                                    <div className="plan_grid_img">
                                                        <SkeletonEffect count={1}
                                                                        className={"planner-show-more-img-skeleton"}/>

                                                    </div>

                                                    <div className="plan_grid_content">
                                                        <SkeletonEffect count={1} className={"mb-4 w-75"}/>
                                                        <div className="plan_content_header justify-start ">

                                                        </div>
                                                        <SkeletonEffect count={1} className={"mt-4 w-25"}/>
                                                        <SkeletonEffect count={1} className={"mt-1 w-25"}/>
                                                    </div>
                                                </div>
                                            })
                                            :
                                            sortByKey(posts, "feedPostDate")?.map((plannerPost, index) => {

                                                return deletedPostsIds.includes(plannerPost?.id) ? <></> :
                                                    <div
                                                        className={"more_plans_grid mb-3 " + (postToDeleteId === plannerPost?.id ? "disable_more_plans_grid" : "")}
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
                                                                                    (postPageToRemove?.postId === plannerPost.id && postPageToRemove?.pageId === curPage?.pageId) ?
                                                                                        <SkeletonEffect count={1}/>
                                                                                        : <div key={index}
                                                                                               className={"planner_tag_container"}>
                                                                                            {
                                                                                                // postToDeleteId === plannerPost?.id || true  ?
                                                                                                //     <SkeletonEffect count={1}/> :
                                                                                                <div
                                                                                                    className={`plan_tags ${curPage.socialMediaType.toLowerCase()}`}
                                                                                                >
                                                                                                    <div
                                                                                                        className="plan_tag_img position-relative">
                                                                                                        <Image
                                                                                                            className="plan_image"
                                                                                                            src={curPage?.imageURL || default_user_icon}
                                                                                                            alt="fb"/>
                                                                                                        <Image
                                                                                                            className="plan_social_img"
                                                                                                            src={computeImageURL(curPage?.socialMediaType)}
                                                                                                            alt="fb"/>

                                                                                                    </div>
                                                                                                    <p className="mb-0">{curPage?.pageName}</p>
                                                                                                </div>
                                                                                            }
                                                                                            {
                                                                                                (postToDeleteId !== plannerPost?.id && curPage?.errorInfo?.isDeletedFromSocialMedia) &&
                                                                                                <>
                                                                                                    <div
                                                                                                        className={"post-deleted-tag"}> Deleted
                                                                                                        {
                                                                                                            !plannerPost?.postPages?.every(postPage => postPage?.errorInfo?.isDeletedFromSocialMedia) &&
                                                                                                            <RiDeleteBin7Line
                                                                                                                onClick={() => {
                                                                                                                    !deletePostFromPagesApi?.isLoading && setPostPageToRemove({
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
                                                                            navigate(`/planner/post/${plannerPost?.id}`)
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

                                                            <p className="mt-2 mb-1">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.caption || "" : ""}</p>
                                                            <p className="hasTags">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.hashtag || "" : ""}</p>

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