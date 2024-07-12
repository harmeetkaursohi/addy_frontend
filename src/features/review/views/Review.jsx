import "./Review.css";
import jsondata from "../../../locales/data/initialdata.json";
import {
    ErrorFetchingPost, FailedToDeletePostOn,
    PostAlreadyDeleted,
    SocialAccountProvider
} from "../../../utils/contantData";
import React, {useCallback, useEffect, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";
import {
    computeImageURL,
    concatenateString,
    createOptionListForSelectTag, formatMessage, getCommentCreationTime, handleApiResponse,
} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import CommonLoader from "../../common/components/CommonLoader";
import {useDispatch, useSelector} from "react-redux";
import {
    deletePostFromPage, deletePostOnSocialMedia,
    getPostPageInfoAction,
} from "../../../app/actions/postActions/postActions";
import {getToken} from "../../../app/auth/auth";
import {RotatingLines} from "react-loader-spinner";
import Select from "react-select";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {MdDelete} from "react-icons/md";
import ConfirmModal from "../../common/components/ConfirmModal";
import {showErrorToast} from "../../common/components/Toast";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";

const Review = () => {
    const {sidebar} = useAppContext();
    const [baseSearchQuery, setBaseSearchQuery] = useState({
        socialMediaType: null,
        pageSize: 5,
        offSet: -1,
    });
    const [isDirty, setDirty] = useState({isDirty: false});
    const {
        isLoading = true,
        isError,
        error,
        results,
        setResults,
        hasNextPage,
    } = usePosts(baseSearchQuery);

    const token = getToken();
    const [showDeletePostConfirmationModal, setShowDeletePostConfirmationModal] = useState(false);
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const [pageDropdown, setPageDropdown] = useState([]);
    const [selectedDropdownOptions, setSelectedDropDownOptions] = useState({
        socialMediaType: {label: "All", value: null},
        pages: [],
    });
    const dispatch = useDispatch();
    const [removedPosts, setRemovedPosts] = useState([]);
    const [deletePostPageInfo, setDeletePostPageInfo] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);
    const postPageInfoData = useSelector((state) => state.post.getPostPageInfoReducer.data);
    const getPostsPageData = useSelector((state) => state.post.getPostsPageReducer);
    const deletePostOnSocialMediaData = useSelector((state) => state.post.deletePostOnSocialMediaReducer);
    const getAllConnectedSocialAccountData = useSelector((state) => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector((state) => state.facebook.getFacebookConnectedPagesReducer);

    useEffect(() => {
        if (deletePostPageInfo !== null && deletePostPageInfo !== undefined) {
            dispatch(deletePostFromPage({
                token: token,
                postId: deletePostPageInfo?.id,
                pageIds: [deletePostPageInfo?.page?.pageId],
            })).then((res) => {
                const onSuccess = () => {
                    setRemovedPosts([
                        ...removedPosts,
                        {
                            postId: deletePostPageInfo?.id,
                            pageId: deletePostPageInfo?.page?.pageId,
                        },
                    ]);
                }
                const onComplete = () => {
                    setDeletePostPageInfo(null);
                }
                handleApiResponse(res, onSuccess, null, onComplete)
            });
        }
    }, [deletePostPageInfo]);
    useEffect(() => {
        if (postToDelete !== null && postToDelete !== undefined && postToDelete?.deletePost) {
            dispatch(deletePostOnSocialMedia({
                token: token,
                postId: postToDelete?.postInfo?.localPostId,
                pageIds: [postToDelete?.postInfo?.page?.pageId],
            })).then((res) => {
                const onSuccess = () => {
                    if (Object?.keys(res?.payload)?.filter(c => !res?.payload[c]?.isSuccess)?.length === 0) {
                        setRemovedPosts([
                            ...removedPosts,
                            {
                                postId: postToDelete?.postInfo?.id,
                                pageId: postToDelete?.postInfo?.page?.pageId,
                            },
                        ]);
                    } else {
                        showErrorToast(formatMessage(FailedToDeletePostOn, [postToDelete?.postInfo?.page?.name]));
                    }
                }
                const onComplete = () => {
                    setPostToDelete(null);
                }
                handleApiResponse(res, onSuccess, null, onComplete);
            });
        }
    }, [postToDelete]);

    useEffect(() => {
        return () => {
            removedPosts.length > 0 && setRemovedPosts([]);
        };
    }, []);

    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            setBaseSearchQuery({...baseSearchQuery, offSet: 0});
        }
    }, [getAllConnectedSocialAccountData, connectedPagesData]);

    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            if (baseSearchQuery?.socialMediaType === null || baseSearchQuery?.socialMediaType === undefined) {
                setPageDropdown(connectedPagesData?.facebookConnectedPages);
            } else {
                setPageDropdown(
                    getAllConnectedSocialAccountData?.data?.filter((socialMediaAccount) => socialMediaAccount?.provider === baseSearchQuery?.socialMediaType)[0]?.pageAccessToken
                );
            }
        }
    }, [getAllConnectedSocialAccountData, connectedPagesData, baseSearchQuery]);

    useEffect(() => {
        if (postData) {
            const requestBody = {
                token: token,
                postIds: [postData?.id],
                pageAccessToken: postData?.page?.access_token,
                socialMediaType: postData?.socialMediaType,
            };
            dispatch(getPostPageInfoAction(requestBody));
        }
    }, [postData]);

    useEffect(() => {
        if (isDirty?.isDirty) {
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "POST") {
                let updatedResults = [...results];
                let updatedObject = updatedResults[isDirty?.index];
                updatedObject = {
                    ...updatedObject,
                    comments: updatedObject?.comments + 1,
                };
                updatedResults[isDirty?.index] = updatedObject;
                setResults([...updatedResults]);
            }
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "DELETE") {
                let updatedResults = [...results];
                let updatedObject = updatedResults[isDirty?.index];
                updatedObject = {
                    ...updatedObject,
                    comments:
                        updatedObject?.comments - isDirty?.action?.reduceCommentCount,
                };
                updatedResults[isDirty?.index] = updatedObject;
                setResults([...updatedResults]);
            }
            setDirty({isDirty: false, index: isDirty?.index});
        }
    }, [isDirty]);

    const intObserver = useRef();
    const lastPostRef = useCallback(
        (post) => {
            if (isLoading) return;
            if (intObserver.current) intObserver.current.disconnect();
            intObserver.current = new IntersectionObserver((posts) => {
                if (posts[0].isIntersecting && hasNextPage && !isError) {
                    setBaseSearchQuery({
                        ...baseSearchQuery,
                        offSet: results?.length - removedPosts?.length,
                    });
                }
            });
            if (post) intObserver.current.observe(post);
        },
        [isLoading, hasNextPage, removedPosts]
    );
    return (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding"}>

                    <div className="cmn_outer">
                        <div className="review_wrapper cmn_wrapper_outer  white_bg_color cmn_height_outer">
                            <div className="review_header align-items-center gap-3">
                                <div className="review_heading flex-grow-1">
                                    <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                                    <h6 className="cmn_small_heading ">
                                        {jsondata.review_post_heading}
                                    </h6>
                                </div>
                                {
                                    getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0 &&
                                    <>
                                        <Select
                                            className={"review-pages-media-dropdown"}
                                            isMulti
                                            value={selectedDropdownOptions?.pages}
                                            isDisabled={getPostsPageData?.loading}
                                            options={createOptionListForSelectTag(pageDropdown, "name", "pageId")}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({
                                                    ...selectedDropdownOptions,
                                                    pages: val,
                                                });
                                                setResults([]);
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    pageNum: 0,
                                                    pageIds: val?.map((cur) => cur?.value),
                                                    offSet: 0
                                                });
                                            }}
                                        />

                                        <Select
                                            className={"review-social-media-dropdown"}
                                            options={createOptionListForSelectTag(SocialAccountProvider, null, null, [{
                                                label: "All",
                                                value: null,
                                            }])}
                                            value={selectedDropdownOptions?.socialMediaType}
                                            isDisabled={getPostsPageData?.loading}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({
                                                    ...selectedDropdownOptions,
                                                    socialMediaType: val,
                                                    pages: [],
                                                });
                                                setResults([]);
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    pageNum: 0,
                                                    socialMediaType: val?.value?.toUpperCase(),
                                                    pageIds: [],
                                                    offSet: 0
                                                });
                                            }}
                                        />
                                    </>
                                }
                            </div>
                            {
                                (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                                    <CommonLoader classname={"cmn_loader_outer"}></CommonLoader>
                                    :
                                    getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0 &&
                                    <>
                                        <div className="review_outer">
                                            {
                                                !isLoading && results !== null && results?.length === 0 ?
                                                    <div>
                                                        <div className="W-100 text-center no_post_review_outer">
                                                            <div className={"no-post-review acc_not_connected_heading"}>
                                                                Oops! It seems there are no posts to display at the
                                                                moment.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <ul className="review_list">
                                                        {
                                                            results?.map((post, index) => {

                                                                return removedPosts?.some((removedPost) => removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId) ?
                                                                    <></>
                                                                    :
                                                                    post.errorInfo === undefined || post.errorInfo === null ?
                                                                        <div key={index}
                                                                             className={(deletePostOnSocialMediaData?.loading && postToDelete?.postInfo?.page?.pageId === post.page.pageId)  ? "opacity-6" : ""}
                                                                             ref={index === results?.length - 1 ? lastPostRef : null}>
                                                                            <li>
                                                                                <div
                                                                                    className="d-flex gap-3 review_list_items_outer align-items-center">
                                                                                    <div
                                                                                        className="cursor-pointer"
                                                                                        style={{position: "relative"}}
                                                                                        onClick={(e) => {
                                                                                            setPostData(post);
                                                                                            setDirty({
                                                                                                ...isDirty,
                                                                                                index: index,
                                                                                                socialMediaType: post?.socialMediaType,
                                                                                            });
                                                                                            setOpenCommentReviewsSectionModal(!isOpenCommentReviewsSectionModal);
                                                                                        }}>
                                                                                        {
                                                                                            post?.attachments[0]?.imageURL === null && post?.attachments[0]?.mediaType === "VIDEO" ?
                                                                                                <video
                                                                                                    style={{objectFit: "fill"}}
                                                                                                    className="bg_img"
                                                                                                    src={post?.attachments[0]?.sourceURL || post?.attachments[0]?.imageURL}></video>
                                                                                                :
                                                                                                <img
                                                                                                    src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                                                                    className="bg_img"/>
                                                                                        }
                                                                                        <div
                                                                                            className="review_social_media_outer">
                                                                                            <img
                                                                                                src={computeImageURL(post?.socialMediaType)}/>
                                                                                        </div>
                                                                                    </div>


                                                                                    <div className="review_content">
                                                                                        <p className="nunito_font">
                                                                                            {post?.page?.name}{" "}
                                                                                        </p>
                                                                                        {
                                                                                            (deletePostOnSocialMediaData?.loading && postToDelete?.postInfo?.page?.pageId === post.page.pageId)  ?
                                                                                                <SkeletonEffect
                                                                                                    count={1}
                                                                                                    className={"h-20px w-80"}></SkeletonEffect> :
                                                                                                <div
                                                                                                    className="d-flex  review_likes_list">
                                                                                                    <h3 className="nunito_font">
                                                                                                        {post?.likes} Likes
                                                                                                    </h3>
                                                                                                    <h3 className="nunito_font">
                                                                                                        {post?.comments} Comments
                                                                                                    </h3>
                                                                                                    <h3 className="nunito_font">
                                                                                                        {post?.shares}{" "}{post?.socialMediaType === "PINTEREST" ? "Save" : "Share"}
                                                                                                    </h3>
                                                                                                </div>
                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                                <div className={"d-flex"}>
                                                                                    <h5 className="nunito_font"> {getCommentCreationTime(post?.feedPostDate)}</h5>
                                                                                    {
                                                                                        post?.socialMediaType !== "INSTAGRAM" &&
                                                                                        <div
                                                                                            className={"d-flex align-item-end"}>
                                                                                            <MdDelete
                                                                                                onClick={() => {
                                                                                                    if (!isLoading) {
                                                                                                        setShowDeletePostConfirmationModal(true);
                                                                                                        setPostToDelete({
                                                                                                            deletePost: false,
                                                                                                            postInfo: post
                                                                                                        });
                                                                                                    }
                                                                                                }}
                                                                                                className={
                                                                                                    "ms-2 cursor-pointer font-size-20 "
                                                                                                }
                                                                                                title={`Delete
                                                                                                        From ${post?.page?.name}`}
                                                                                            />
                                                                                        </div>
                                                                                    }
                                                                                </div>

                                                                            </li>
                                                                        </div>
                                                                        :
                                                                        <div className="not_available_content_outer"
                                                                             key={index}
                                                                             ref={index === results?.length - 1 ? lastPostRef : null}>
                                                                            <div
                                                                                className="d-flex align-items-center gap-3 not_available_content_wrapper">
                                                                                <div className={"disabled-table-grid"}
                                                                                     style={{position: "relative"}}>
                                                                                    <img src={noImageAvailable}
                                                                                         className="bg_img"/>
                                                                                    <div
                                                                                        className="review_social_media_outer">
                                                                                        <img
                                                                                            className={"me-2 review-post-icon"}
                                                                                            src={computeImageURL(
                                                                                                post?.socialMediaType
                                                                                            )}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className={"disabled-table-grid"}>

                                                                                    <p className="nunito_font">{post?.page?.name}</p>
                                                                                    <h3 className="nunito_font"> {concatenateString(post.message, 20)}</h3>

                                                                                </div>

                                                                            </div>


                                                                            <div className={"disabled-table-grid "}
                                                                                 colSpan={post.errorInfo.isDeletedFromSocialMedia ? 2 : 3}>
                                                                                {
                                                                                    post.errorInfo.isDeletedFromSocialMedia ?
                                                                                        <div
                                                                                            className={"review-errorMessage d-flex"}>
                                                                                            {PostAlreadyDeleted}
                                                                                        </div>
                                                                                        :
                                                                                        <div
                                                                                            className={"review-errorMessage "}>
                                                                                            {ErrorFetchingPost}
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                            {
                                                                                post.errorInfo.isDeletedFromSocialMedia && (
                                                                                    <div className={"disabled-table-grid "}>
                                                                                        <MdDelete
                                                                                            onClick={() => {
                                                                                                !isLoading &&
                                                                                                setDeletePostPageInfo(post);
                                                                                            }}
                                                                                            className={
                                                                                                "ms-2 cursor-pointer font-size-20"
                                                                                            }
                                                                                            title={"Delete From Addy"}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        </div>


                                                            })
                                                        }

                                                    </ul>
                                            }
                                        </div>


                                        {
                                            isLoading &&
                                            <div className="d-flex justify-content-center RotatingLines-loader mt-4">
                                                <RotatingLines
                                                    strokeColor="#F07C33"
                                                    strokeWidth="5"
                                                    animationDuration="0.75"
                                                    width="96"
                                                    visible={true}
                                                />
                                            </div>
                                        }
                                    </>
                            }
                            {
                                getAllConnectedSocialAccountData?.data?.length === 0 &&
                                <ConnectSocialMediaAccount messageFor={"ACCOUNT"}/>
                            }
                            {
                                getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length === 0 &&
                                <ConnectSocialMediaAccount messageFor={"PAGE"}/>
                            }
                        </div>
                    </div>

                </div>

                {
                    isOpenCommentReviewsSectionModal && <CommentReviewsSectionModal
                        isOpenCommentReviewsSectionModal={isOpenCommentReviewsSectionModal}
                        setOpenCommentReviewsSectionModal={setOpenCommentReviewsSectionModal}
                        postData={postData}
                        setPostData={setPostData}
                        postPageInfoData={postPageInfoData}
                        setDirty={setDirty}
                        isDirty={isDirty}
                        className={"comment_review_outer"}
                    />
                }
                {
                    showDeletePostConfirmationModal &&
                    <ConfirmModal
                        confirmModalAction={() => {
                            setPostToDelete({
                                ...postToDelete,
                                deletePost: true
                            })
                        }}
                        isLoading={deletePostOnSocialMediaData?.loading}
                        setShowConfirmModal={setShowDeletePostConfirmationModal}
                        showConfirmModal={showDeletePostConfirmationModal}
                        icon={"warning"}
                        title={"Are you sure ?"}
                        confirmMessage={`Are you sure you want to delete this post from ${postToDelete?.postInfo?.page?.name}. This action is irreversible`}
                    />
                }

            </section>
        </>
    );
};
export default Review;
