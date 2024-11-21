import React, {useEffect, useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {RxCross2} from "react-icons/rx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {FaChevronLeft} from "react-icons/fa6";
import {FaChevronRight} from "react-icons/fa6";
import FacebookFeedPreview from "../../common/components/FacebookFeedPreview";
import {deleteElementFromArrayAtIndex, formatMessage, isNullOrEmpty} from "../../../utils/commonUtils";
import {useGetPostInsightsQuery} from "../../../app/apis/insightApi";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import Delete_img from "../../../images/deletePost.svg?react";
import InstagramFeedPreview from "../../common/components/InstagramFeedPreview";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {showSuccessToast} from "../../common/components/Toast";
import {
    DeletedSuccessfully,
    DeletePostConfirmationMessage,
    DeletePostFromPageConfirmationMessage, PageRemovedFromPostSuccessfully
} from "../../../utils/contantData";
import {addyApi} from "../../../app/addyApi";
import {useDeletePostFromPagesByPageIdsMutation} from "../../../app/apis/postApi";
import {useDispatch} from "react-redux";
import PinterestFeedPreview from "../../common/components/PinterestFeedPreview";
import LinkedinFeedpreview from "../../common/components/LinkedinFeedPreview";


function PostViewModal({setPosts, setShowPostPreview, showPostPreview, postToPreview, setPostToPreview}) {

    const dispatch = useDispatch()
    const sliderRef = useRef(null);

    const [insights, setInsights] = useState({})
    const [invalidateData, setInvalidateData] = useState(false)
    const [deletePostPageInfo, setDeletePostPageInfo] = useState(null)
    const [currentActivePostIndex, setCurrentActivePostIndex] = useState(0)
    const [fetchInsightsFor, setFetchInsightsFor] = useState(null)

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
    };

    const [deletePostFromPagesByPageIds, deletePostFromPagesByPageIdsApi] = useDeletePostFromPagesByPageIdsMutation()

    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const insightsApi = useGetPostInsightsQuery({
        socialMediaType: fetchInsightsFor?.socialMediaType,
        accessToken: fetchInsightsFor?.postPage?.accessToken,
        pageId: fetchInsightsFor?.postPage?.pageId,
        postIds: [fetchInsightsFor?.postPage?.socialMediaPostId]
    }, {skip: isNullOrEmpty(fetchInsightsFor)})

    useEffect(() => {
        if (Array.isArray(postToPreview) && !isNullOrEmpty(postToPreview)) {
            // When Loaded will get the insights for first post
            const getInsightsFor = postToPreview?.[0]
            getInsightsFor.postStatus === "PUBLISHED" && setFetchInsightsForPost(0, getInsightsFor)
        }
    }, [postToPreview]);

    useEffect(() => {
        if (insightsApi.data !== null && insightsApi.data !== undefined) {
            Object.keys(insightsApi.data || {})?.map(socialMediaPostId => {
                setInsights({
                    ...insights,
                    [socialMediaPostId]: {
                        isLoading: false,
                        data: insightsApi.data[socialMediaPostId]
                    }
                })
            })
        }
    }, [insightsApi.data]);

    useEffect(() => {
        if (!isNullOrEmpty(deletePostPageInfo)) {
            handleDeletePost()
        }
    }, [deletePostPageInfo]);

    useEffect(() => {
        return () => {
            if (invalidateData) {
                setPosts([])
                dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi", "getPostsForPlannerApi", "getPlannerPostsCountApi"]));
            }
        }
    }, [invalidateData])

    const nextSlide = () => {
        const activePostIndex = currentActivePostIndex + 1
        if (activePostIndex >= postToPreview?.length) return
        setCurrentActivePostIndex(activePostIndex)
        const getInsightsFor = postToPreview?.[activePostIndex]
        // When clicked on next button, for next post whose index is currentActivePostIndex + 1, insights will be fetched
        getInsightsFor?.postStatus === "PUBLISHED" && setFetchInsightsForPost(activePostIndex, getInsightsFor)
        sliderRef.current.slickNext();
    };
    const prevSlide = () => {
        if (currentActivePostIndex === 0) return
        const activePostIndex = currentActivePostIndex - 1
        setCurrentActivePostIndex(activePostIndex)
        const getInsightsFor = postToPreview?.[activePostIndex]
        // When clicked on previous button, for previous post whose index is fetchInsightsFor.indexForPost-1, insights will be fetched
        getInsightsFor?.postStatus === "PUBLISHED" && setFetchInsightsForPost(activePostIndex, getInsightsFor)
        sliderRef.current.slickPrev();
    };
    const setFetchInsightsForPost = (postIndex, getInsightsFor) => {
        const pageAccessToken = getAllConnectedPagesApi?.data?.find(cur => cur.pageId === getInsightsFor.postPage.pageId)
        setFetchInsightsFor({
            ...getInsightsFor,
            postPage: {...getInsightsFor.postPage, accessToken: pageAccessToken.access_token}
        })
        setInsights({
            ...insights,
            [getInsightsFor.postPage.socialMediaPostId]: {
                isLoading: true,
                data: null
            }
        })
    }
    const handleDeletePost = () => {
        const svgMarkup = ReactDOMServer.renderToStaticMarkup(<Delete_img/>);
        Swal.fire({
            html: `
                <div class="swal-content">
                    <div class="swal-images">
                        <img src="data:image/svg+xml;base64,${btoa(svgMarkup)}" alt="Delete Icon" class="delete-img" />
                    </div>
                    <h2 class="swal2-title" id="swal2-title">Delete Post</h2>
                    <p class="modal_heading">${postToPreview?.length === 1 ? DeletePostConfirmationMessage : formatMessage(DeletePostFromPageConfirmationMessage, [postToPreview?.[currentActivePostIndex]?.postPage?.pageName])} </p>
                </div>
            `,
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
                        return await deletePostFromPagesByPageIds(deletePostPageInfo).unwrap();
                    },
                    () => {
                        // If There is only one page in post and is removed then the whole post is removed
                        if (postToPreview?.length === 1) {
                            dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi", "getPostsForPlannerApi", "getPlannerPostsCountApi","getPostsByIdApi"]));
                            setPosts([])
                            showSuccessToast(formatMessage(DeletedSuccessfully, ["Post has been"]))
                            handleClose()
                        }
                        // If user has opened last postPage and deleted it , then one postPage backward is selected
                        if (currentActivePostIndex + 1 === postToPreview?.length && postToPreview?.length > 1) {
                            dispatch(addyApi.util.invalidateTags(["getPostsByIdApi"]));
                            showSuccessToast(PageRemovedFromPostSuccessfully)
                            const updatedPostToPreview = deleteElementFromArrayAtIndex(postToPreview, currentActivePostIndex)
                            prevSlide()
                            setPostToPreview(updatedPostToPreview)
                            setInvalidateData(true)

                        }
                        // If user has opened any postPage and deleted it , then one postPage next is selected
                        if (currentActivePostIndex + 1 < postToPreview?.length && postToPreview?.length > 1) {
                            dispatch(addyApi.util.invalidateTags(["getPostsByIdApi"]));
                            showSuccessToast(PageRemovedFromPostSuccessfully)                            // No Need to set fetchInsightsFor as delete is only available for scheduled posts and if post is still not posted, no insights will be there
                            const updatedPostToPreview = deleteElementFromArrayAtIndex(postToPreview, currentActivePostIndex)
                            setPostToPreview(updatedPostToPreview)
                            showSuccessToast(formatMessage(PageRemovedFromPostSuccessfully, []))
                            setInvalidateData(true)
                        }
                    }
                );
            }
            setDeletePostPageInfo(null)
        });
    };
    const handleClose = () => setShowPostPreview(false);

    return (
        <>
            <Modal
                size="md"
                show={showPostPreview}
                onHide={handleClose}
                className="viewPost"
                centered
            >
                <div
                    className="pop_up_cross_icon_outer  cursor-pointer"
                    onClick={handleClose}
                >
                    <RxCross2 className="pop_up_cross_icon"/>
                </div>
                <Modal.Body className="individual_post_content">
                    <div className="slider-container">
                        {/* Custom prev and next buttons */}
                        <FaChevronLeft
                            size={24}
                            className={postToPreview.length === 1 ? "slick_btn d-none" :"slick_btn"}
                            onClick={prevSlide}
                        />
                        <Slider {...settings} ref={sliderRef}>
                            {
                                postToPreview?.map(post => {
                                    const index = post.message.indexOf('#');
                                    const caption = index !== -1 ? post.message.slice(0, index).trim() : post.message;
                                    const hashtags = index !== -1 ? post.message.slice(index).trim() : '';
                                    return (
                                        <div className="post_perview_card">
                                            {
                                                post.socialMediaType === "FACEBOOK" &&
                                                <FacebookFeedPreview
                                                    reference={"PLANNER"}
                                                    previewTitle={"Facebook Post Preview"}
                                                    postId={post?.id}
                                                    pageId={post.postPage.pageId}
                                                    feedPostDate={post.feedPostDate}
                                                    pageName={post.postPage.pageName}
                                                    files={post?.attachments}
                                                    selectedFileType={post?.attachments?.[0]?.mediaType}
                                                    caption={caption}
                                                    postStatus={post?.postStatus}
                                                    pageImage={post.postPage.imageURL}
                                                    hashTag={hashtags}
                                                    postInsightsData={insights[post.postPage.socialMediaPostId]}
                                                    setDeletePostPageInfo={setDeletePostPageInfo}
                                                    isDeletePostLoading={deletePostFromPagesByPageIdsApi?.isLoading}
                                                />
                                            }
                                            {
                                                post.socialMediaType === "INSTAGRAM" &&
                                                <InstagramFeedPreview
                                                    reference={"PLANNER"}
                                                    previewTitle={"Instagram Post Preview"}
                                                    postId={post?.id}
                                                    pageId={post.postPage.pageId}
                                                    feedPostDate={post.feedPostDate}
                                                    postStatus={post?.postStatus}
                                                    pageName={post.postPage.pageName}
                                                    pageImage={post.postPage.imageURL}
                                                    files={post?.attachments}
                                                    selectedFileType={post?.attachments?.[0]?.mediaType}
                                                    caption={caption}
                                                    hashTag={hashtags}
                                                    setDeletePostPageInfo={setDeletePostPageInfo}
                                                    isDeletePostLoading={deletePostFromPagesByPageIdsApi?.isLoading}
                                                    postInsightsData={insights[post.postPage.socialMediaPostId]}
                                                />
                                            }
                                            {
                                                // If Pinterest has Published post status then filetype will only be IMAGE as for IMAGE it will be image and for video it will be image as no video link is given to us
                                                post.socialMediaType === "PINTEREST" &&
                                                <PinterestFeedPreview
                                                    reference={"PLANNER"}
                                                    previewTitle={"Pinterest Post Preview"}
                                                    postId={post?.id}
                                                    pageId={post.postPage.pageId}
                                                    feedPostDate={post.feedPostDate}
                                                    postStatus={post?.postStatus}
                                                    pageName={post.postPage.pageName}
                                                    pageImage={post.postPage.imageURL}
                                                    files={post?.attachments}
                                                    selectedFileType={post?.postStatus === "PUBLISHED" ? "IMAGE" : post?.attachments?.[0]?.mediaType}
                                                    caption={caption}
                                                    hashTag={hashtags}
                                                    destinationUrl={post?.pinDestinationUrl}
                                                    pinTitle={post?.pinTitle}
                                                    setDeletePostPageInfo={setDeletePostPageInfo}
                                                    isDeletePostLoading={deletePostFromPagesByPageIdsApi?.isLoading}
                                                    postInsightsData={insights[post.postPage.socialMediaPostId]}
                                                />
                                            }
                                            {
                                                post.socialMediaType === "LINKEDIN" &&
                                                <LinkedinFeedpreview
                                                    reference={"PLANNER"}
                                                    previewTitle={"Linkedin Post Preview"}
                                                    postId={post?.id}
                                                    pageId={post.postPage.pageId}
                                                    feedPostDate={post.feedPostDate}
                                                    postStatus={post?.postStatus}
                                                    pageName={post.postPage.pageName}
                                                    pageImage={post.postPage.imageURL}
                                                    files={post?.attachments}
                                                    selectedFileType={post?.attachments?.[0]?.mediaType}
                                                    caption={caption}
                                                    hashTag={hashtags}
                                                    setDeletePostPageInfo={setDeletePostPageInfo}
                                                    isDeletePostLoading={deletePostFromPagesByPageIdsApi?.isLoading}
                                                    postInsightsData={insights[post.postPage.socialMediaPostId]}

                                                />
                                            }


                                        </div>
                                    );
                                })
                            }
                        </Slider>

                        <FaChevronRight
                            className={ postToPreview.length === 1 ? "slick_btn next_slide d-none" : "slick_btn next_slide"}
                            size={24}
                            onClick={nextSlide}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostViewModal;
