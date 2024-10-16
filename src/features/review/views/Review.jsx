import "./Review.css";
import jsondata from "../../../locales/data/initialdata.json";
import {ErrorFetchingPost, NotConnected, PostAlreadyDeleted, SocialAccountProvider} from "../../../utils/contantData";
import {useCallback, useEffect, useRef, useState} from "react";
import {
    computeImageURL,
    concatenateString,
    createOptionListForSelectTag, formatMessage, getCommentCreationTime,
} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import CommonLoader from "../../common/components/CommonLoader";
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth";
import {RotatingLines} from "react-loader-spinner";
import Select from "react-select";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {MdDelete} from "react-icons/md";
import notConnected_img from "../../../images/no_acc_connect_img.svg";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {
    useDeletePostFromPagesByPageIdsMutation,
    useLazyGetPublishedPostsQuery
} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";

const Review = () => {

    const {sidebar} = useAppContext();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState({
        socialMediaType: null,
        pageSize: 5,
        offSet: -1,
        postStatus: ["PUBLISHED"],
        pageIds: [],
    });

    const [isDirty, setDirty] = useState({isDirty: false});
    const [postsList, setPostsList] = useState(null)
    const [removedPosts, setRemovedPosts] = useState([]);
    const [deletePostPageInfo, setDeletePostPageInfo] = useState(null);
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const [pageDropdown, setPageDropdown] = useState([]);
    const [selectedDropdownOptions, setSelectedDropDownOptions] = useState({
        socialMediaType: {label: "All", value: null},
        pages: [],
    });

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")
    const [getPosts,postApi] = useLazyGetPublishedPostsQuery()
    const [deletePostFromPagesByPageIds, deletePostFromPagesApi] = useDeletePostFromPagesByPageIdsMutation()


    useEffect(() => {
        if(searchQuery?.offSet>=0){
            getPosts(searchQuery)
        }
    }, [searchQuery]);

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0) {
            setSearchQuery({...searchQuery, offSet: 0});
        }
    }, [getConnectedSocialAccountApi, getAllConnectedPagesApi]);

    useEffect(() => {
        if (postApi?.data && !postApi?.isLoading ) {
            if (searchQuery?.offSet === 0) {
                setPostsList([...postApi?.data?.data])
            }
            if (searchQuery?.offSet > 0) {
                setPostsList([...postsList, ...postApi?.data?.data])
            }
        }
    }, [postApi?.data]);

    useEffect(() => {
        if (deletePostPageInfo !== null && deletePostPageInfo !== undefined) {
            handleDeletePostFromPage()
        }
    }, [deletePostPageInfo]);

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0) {
            if (searchQuery?.socialMediaType === null || searchQuery?.socialMediaType === undefined) {
                setPageDropdown(getAllConnectedPagesApi?.data);
            } else {
                setPageDropdown(getConnectedSocialAccountApi?.data?.filter((socialMediaAccount) => socialMediaAccount?.provider === searchQuery?.socialMediaType)[0]?.pageAccessToken);
            }
        }
    }, [getConnectedSocialAccountApi, getAllConnectedPagesApi, searchQuery]);

    useEffect(() => {
        if (isDirty?.isDirty) {
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "POST") {
                let updatedResults = [...postsList];
                let updatedObject = updatedResults[isDirty?.index];
                updatedObject = {
                    ...updatedObject,
                    comments: updatedObject?.comments + 1,
                };
                updatedResults[isDirty?.index] = updatedObject;
                setPostsList([...updatedResults]);
            }
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "DELETE") {
                let updatedResults = [...postsList];
                let updatedObject = updatedResults[isDirty?.index];
                updatedObject = {
                    ...updatedObject,
                    comments:
                        updatedObject?.comments - isDirty?.action?.reduceCommentCount,
                };
                updatedResults[isDirty?.index] = updatedObject;
                setPostsList([...updatedResults]);
            }
            setDirty({isDirty: false, index: isDirty?.index});
        }
    }, [isDirty]);

    useEffect(() => {
        return () => {
            if(removedPosts.length > 0){
                dispatch(addyApi.util.invalidateTags(["getPublishedPostsApi"]))
                setRemovedPosts([]);
            }

        };

    }, [removedPosts]);

    const handleDeletePostFromPage = async () => {
        await handleRTKQuery(
            async () => {
                return await deletePostFromPagesByPageIds({
                    postId: deletePostPageInfo?.id,
                    pageIds: [deletePostPageInfo?.page?.pageId],
                }).unwrap()
            },
            () => {
                setRemovedPosts([
                    ...removedPosts, {
                        postId: deletePostPageInfo?.id,
                        pageId: deletePostPageInfo?.page?.pageId,
                    },
                ]);
            },
            null,
            () => {
                setDeletePostPageInfo(null);
            });
    }

    const intObserver = useRef();
    const lastPostRef = useCallback(
        (post) => {
            if (postApi?.isLoading) return;
            if (intObserver.current) intObserver.current.disconnect();
            intObserver.current = new IntersectionObserver((posts) => {
                if (posts[0].isIntersecting && postApi?.data?.hasNext && !postApi?.isError) {
                    setSearchQuery({
                        ...searchQuery,
                        offSet: postsList?.length - removedPosts?.length,
                    });
                }
            });
            if (post) intObserver.current.observe(post);
        }, [postApi?.isLoading,  postApi?.data?.hasNext, postsList]);

    return (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding"}>

                    <div className="cmn_outer">
                        <div className="review_wrapper cmn_wrapper_outer  white_bg_color cmn_height_outer">
                            <div className="review_header align-items-center gap-3">
                                <div className="review_heading flex-grow-1">
                                    <h2 className="cmn_text_heading">Published Posts</h2>
                                    <h6 className="cmn_small_heading ">
                                        {jsondata.review_post_heading}
                                    </h6>
                                </div>
                                {
                                    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 &&
                                    <>
                                        <Select
                                            className={"review-pages-media-dropdown"}
                                            isMulti
                                            value={selectedDropdownOptions?.pages}
                                            isDisabled={ postApi?.isLoading || postApi?.isFetching}
                                            options={createOptionListForSelectTag(pageDropdown, "name", "pageId")}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({
                                                    ...selectedDropdownOptions,
                                                    pages: val,
                                                });
                                                setPostsList([]);
                                                setSearchQuery({
                                                    ...searchQuery,
                                                    offSet: 0,
                                                    pageIds: val?.map((cur) => cur?.value),
                                                })
                                            }}
                                        />

                                        <Select
                                            className={"review-social-media-dropdown"}
                                            options={createOptionListForSelectTag(SocialAccountProvider, null, null, [{
                                                label: "All",
                                                value: null,
                                            }])}
                                            value={selectedDropdownOptions?.socialMediaType}
                                            isDisabled={ postApi?.isLoading || postApi?.isFetching}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({
                                                    ...selectedDropdownOptions,
                                                    socialMediaType: val,
                                                    pages: [],
                                                });
                                                setPostsList([]);
                                                setSearchQuery({
                                                    ...searchQuery,
                                                    socialMediaType: val?.value?.toUpperCase(),
                                                    pageIds: [],
                                                    offSet: 0
                                                })
                                            }}
                                        />
                                    </>
                                }
                            </div>
                            {
                                (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching ||getAllConnectedPagesApi?.isFetching ||  getAllConnectedPagesApi?.isLoading) ?
                                    <CommonLoader classname={"cmn_loader_outer"}></CommonLoader>
                                    :
                                    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 &&
                                    <>
                                        <div className="review_outer">

                                            {
                                                !postApi?.isLoading && !postApi?.isFetching && postsList !== null && postsList?.length === 0 ?
                                                    <div>
                                                        <div className="W-100 text-center no_post_review_outer">
                                                            <div className={"no-post-review acc_not_connected_heading"}>
                                                                Oops! It seems there are no posts to display at the
                                                                moment.
                                                            </div>
                                                        </div>
                                                    </div> :
                                                    <ul className="review_list">
                                                        {
                                                            postsList?.map((post, index) => {
                                                                return removedPosts?.some((removedPost) => removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId) ?
                                                                    <></>
                                                                    : (post.errorInfo === undefined || post.errorInfo === null) ?
                                                                        <div
                                                                            key={index}
                                                                            ref={index === postsList?.length - 1 ? lastPostRef : null}
                                                                        >
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
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            post?.attachments[0]?.imageURL === null && post?.attachments[0]?.mediaType === "VIDEO" ?
                                                                                            <video
                                                                                                style={{objectFit: "fill"}}
                                                                                                className="bg_img"
                                                                                                src={post?.attachments[0]?.sourceURL || post?.attachments[0]?.imageURL}
                                                                                            />
                                                                                            :
                                                                                            <img src={post?.attachments[0]?.imageURL || noImageAvailable} className="bg_img"/>
                                                                                        }
                                                                                        <div
                                                                                            className="review_social_media_outer">
                                                                                            <img src={computeImageURL(post?.socialMediaType)}/>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="review_content">
                                                                                        <p className="nunito_font">
                                                                                            {/*{post?.page?.name}{" "}*/}
                                                                                            {
                                                                                                post?.message
                                                                                            }
                                                                                        </p>
                                                                                        <div
                                                                                            className="d-flex  review_likes_list">
                                                                                            <h3 className="nunito_font">
                                                                                                {post?.likes} Likes {post?.socialMediaType === "FACEBOOK" ? "/ Reactions" : ""}
                                                                                            </h3>
                                                                                            <h3 className="nunito_font">
                                                                                                {post?.comments} Comments
                                                                                            </h3>
                                                                                            <h3 className="nunito_font">
                                                                                                {post?.shares}{" "}{post?.socialMediaType === "PINTEREST" ? "Save" : "Share"}
                                                                                            </h3>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <h5 className="nunito_font"> {getCommentCreationTime(post?.feedPostDate)}</h5>
                                                                            </li>
                                                                        </div>
                                                                        :
                                                                        <div className="not_available_content_outer"
                                                                             key={index}
                                                                             ref={index === postsList?.length - 1 ? lastPostRef : null}>
                                                                            <div
                                                                                className="d-flex align-items-center gap-3 not_available_content_wrapper">
                                                                                <div
                                                                                    className={"disabled-table-grid"}
                                                                                    style={{position: "relative"}}>
                                                                                    <img
                                                                                        src={noImageAvailable}
                                                                                        className="bg_img"
                                                                                    />
                                                                                    <div
                                                                                        className="review_social_media_outer">
                                                                                        <img
                                                                                            className={"me-2 review-post-icon"}
                                                                                            src={computeImageURL(post?.socialMediaType)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className={"disabled-table-grid"}>
                                                                                    <p className="nunito_font">{post?.page?.name}</p>
                                                                                    <h3 className="nunito_font"> {concatenateString(post.message, 20)}</h3>
                                                                                </div>

                                                                            </div>


                                                                            <div
                                                                                className={"disabled-table-grid "}
                                                                                colSpan={post.errorInfo.isDeletedFromSocialMedia ? 2 : 3}
                                                                            >
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
                                                                                post.errorInfo.isDeletedFromSocialMedia &&
                                                                                <div
                                                                                    className={"disabled-table-grid "}>
                                                                                    <MdDelete
                                                                                        onClick={() => {
                                                                                            if (!postApi?.isFetching && !postApi?.isLoading) {
                                                                                                setDeletePostPageInfo(post);
                                                                                            }
                                                                                        }}
                                                                                        className={
                                                                                            "ms-2 cursor-pointer font-size-20"
                                                                                        }
                                                                                        title={"Delete From Addy"}
                                                                                    />
                                                                                </div>
                                                                            }
                                                                        </div>

                                                            })
                                                        }
                                                    </ul>
                                            }
                                        </div>


                                        {/*<div className="review_outer">*/}

                                        {/*    {*/}
                                        {/*        !isLoading && results !== null && results?.length === 0 ?*/}
                                        {/*            <div>*/}
                                        {/*                <div className="W-100 text-center no_post_review_outer">*/}
                                        {/*                    <div className={"no-post-review acc_not_connected_heading"}>*/}
                                        {/*                        Oops! It seems there are no posts to display at the*/}
                                        {/*                        moment.*/}
                                        {/*                    </div>*/}
                                        {/*                </div>*/}
                                        {/*            </div> :*/}
                                        {/*            <ul className="review_list">*/}
                                        {/*                {results?.map((post, index) => {*/}
                                        {/*                    return removedPosts?.some((removedPost) => removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId) ?*/}
                                        {/*                        <></>*/}
                                        {/*                        : post.errorInfo === undefined || post.errorInfo === null ? (*/}
                                        {/*                            <div*/}
                                        {/*                                key={index}*/}
                                        {/*                                ref={index === results?.length - 1 ? lastPostRef : null}*/}
                                        {/*                            >*/}
                                        {/*                                <li>*/}
                                        {/*                                    <div*/}
                                        {/*                                        className="d-flex gap-3 review_list_items_outer align-items-center">*/}
                                        {/*                                        <div*/}
                                        {/*                                            className="cursor-pointer"*/}
                                        {/*                                            style={{position: "relative"}}*/}
                                        {/*                                            onClick={(e) => {*/}
                                        {/*                                                setPostData(post);*/}
                                        {/*                                                setDirty({*/}
                                        {/*                                                    ...isDirty,*/}
                                        {/*                                                    index: index,*/}
                                        {/*                                                    socialMediaType: post?.socialMediaType,*/}
                                        {/*                                                });*/}
                                        {/*                                                setOpenCommentReviewsSectionModal(!isOpenCommentReviewsSectionModal);*/}
                                        {/*                                            }}*/}
                                        {/*                                        >*/}
                                        {/*                                            {post?.attachments[0]?.imageURL === null && post?.attachments[0]?.mediaType === "VIDEO" ?*/}
                                        {/*                                                <video*/}
                                        {/*                                                    style={{objectFit: "fill"}}*/}
                                        {/*                                                    className="bg_img"*/}
                                        {/*                                                    src={post?.attachments[0]?.sourceURL || post?.attachments[0]?.imageURL}*/}
                                        {/*                                                ></video>*/}
                                        {/*                                                :*/}
                                        {/*                                                <img*/}
                                        {/*                                                    src={*/}
                                        {/*                                                        post?.attachments[0]?.imageURL ||*/}
                                        {/*                                                        noImageAvailable*/}
                                        {/*                                                    }*/}
                                        {/*                                                    className="bg_img"*/}
                                        {/*                                                />*/}
                                        {/*                                            }*/}
                                        {/*                                            <div*/}
                                        {/*                                                className="review_social_media_outer">*/}
                                        {/*                                                <img*/}
                                        {/*                                                    src={computeImageURL(*/}
                                        {/*                                                        post?.socialMediaType*/}
                                        {/*                                                    )}*/}
                                        {/*                                                />*/}
                                        {/*                                            </div>*/}
                                        {/*                                        </div>*/}

                                        {/*                                        <div className="review_content">*/}
                                        {/*                                            <p className="nunito_font">*/}
                                        {/*                                                {post?.page?.name}{" "}*/}
                                        {/*                                            </p>*/}
                                        {/*                                            <div*/}
                                        {/*                                                className="d-flex  review_likes_list">*/}
                                        {/*                                                <h3 className="nunito_font">*/}
                                        {/*                                                    {post?.likes} Likes {post?.socialMediaType === "FACEBOOK" ? "/ Reactions" : ""}*/}
                                        {/*                                                </h3>*/}
                                        {/*                                                <h3 className="nunito_font">*/}
                                        {/*                                                    {post?.comments} Comments*/}
                                        {/*                                                </h3>*/}
                                        {/*                                                <h3 className="nunito_font">*/}
                                        {/*                                                    {post?.shares}{" "}{post?.socialMediaType === "PINTEREST" ? "Save" : "Share"}*/}
                                        {/*                                                </h3>*/}
                                        {/*                                            </div>*/}
                                        {/*                                        </div>*/}
                                        {/*                                    </div>*/}

                                        {/*                                    <h5 className="nunito_font"> {getCommentCreationTime(post?.feedPostDate)}</h5>*/}
                                        {/*                                </li>*/}
                                        {/*                            </div>*/}
                                        {/*                        ) : (*/}
                                        {/*                            <div className="not_available_content_outer"*/}
                                        {/*                                 key={index}*/}
                                        {/*                                 ref={index === results?.length - 1 ? lastPostRef : null}>*/}
                                        {/*                                <div*/}
                                        {/*                                    className="d-flex align-items-center gap-3 not_available_content_wrapper">*/}
                                        {/*                                    <div className={"disabled-table-grid"}*/}
                                        {/*                                         style={{position: "relative"}}>*/}
                                        {/*                                        <img*/}
                                        {/*                                            src={noImageAvailable}*/}
                                        {/*                                            className="bg_img"*/}
                                        {/*                                        />*/}
                                        {/*                                        <div*/}
                                        {/*                                            className="review_social_media_outer">*/}
                                        {/*                                            <img*/}
                                        {/*                                                className={"me-2 review-post-icon"}*/}
                                        {/*                                                src={computeImageURL(*/}
                                        {/*                                                    post?.socialMediaType*/}
                                        {/*                                                )}*/}
                                        {/*                                            />*/}
                                        {/*                                        </div>*/}
                                        {/*                                    </div>*/}
                                        {/*                                    <div className={"disabled-table-grid"}>*/}

                                        {/*                                        <p className="nunito_font">{post?.page?.name}</p>*/}
                                        {/*                                        <h3 className="nunito_font"> {concatenateString(post.message, 20)}</h3>*/}

                                        {/*                                    </div>*/}

                                        {/*                                </div>*/}


                                        {/*                                <div*/}
                                        {/*                                    className={"disabled-table-grid "}*/}
                                        {/*                                    colSpan={*/}
                                        {/*                                        post.errorInfo.isDeletedFromSocialMedia*/}
                                        {/*                                            ? 2*/}
                                        {/*                                            : 3*/}
                                        {/*                                    }*/}
                                        {/*                                >*/}
                                        {/*                                    {post.errorInfo.isDeletedFromSocialMedia ? (*/}
                                        {/*                                        <div*/}
                                        {/*                                            className={"review-errorMessage d-flex"}*/}
                                        {/*                                        >*/}
                                        {/*                                            {PostAlreadyDeleted}*/}
                                        {/*                                        </div>*/}
                                        {/*                                    ) : (*/}
                                        {/*                                        <div className={"review-errorMessage "}>*/}
                                        {/*                                            {ErrorFetchingPost}*/}
                                        {/*                                        </div>*/}
                                        {/*                                    )}*/}
                                        {/*                                </div>*/}
                                        {/*                                {post.errorInfo.isDeletedFromSocialMedia && (*/}
                                        {/*                                    <div className={"disabled-table-grid "}>*/}
                                        {/*                                        <MdDelete*/}
                                        {/*                                            onClick={() => {*/}
                                        {/*                                                !isLoading &&*/}
                                        {/*                                                setDeletePostPageInfo(post);*/}
                                        {/*                                            }}*/}
                                        {/*                                            className={*/}
                                        {/*                                                "ms-2 cursor-pointer font-size-20"*/}
                                        {/*                                            }*/}
                                        {/*                                            title={"Delete From Addy"}*/}
                                        {/*                                        />*/}
                                        {/*                                    </div>*/}
                                        {/*                                )}*/}
                                        {/*                            </div>*/}
                                        {/*                        );*/}
                                        {/*                })}*/}
                                        {/*            </ul>*/}
                                        {/*    }*/}
                                        {/*</div>*/}


                                        {
                                            (postApi?.isLoading || postApi?.isFetching) &&
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
                                getConnectedSocialAccountApi?.data?.length === 0 &&
                                <ConnectSocialMediaAccount image={notConnected_img}
                                                           message={formatMessage(NotConnected, ["posts", "social media"])}/>
                            }
                            {
                                getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 &&
                                <ConnectSocialMediaAccount image={notConnected_img}
                                                           message={formatMessage(NotConnected, ["posts", "social media pages"])}/>
                            }
                        </div>
                    </div>

                </div>

                {
                    isOpenCommentReviewsSectionModal &&
                    <CommentReviewsSectionModal
                        isOpenCommentReviewsSectionModal={isOpenCommentReviewsSectionModal}
                        setOpenCommentReviewsSectionModal={setOpenCommentReviewsSectionModal}
                        postData={postData}
                        setPostData={setPostData}
                        setDirty={setDirty}
                        isDirty={isDirty}
                        className={"comment_review_outer"}
                    />
                }

            </section>
        </>
    );
};
export default Review;
