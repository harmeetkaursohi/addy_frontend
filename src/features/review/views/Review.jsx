import "./Review.css";
import jsondata from "../../../locales/data/initialdata.json";
import {ErrorFetchingPost, NotConnected, PostAlreadyDeleted, SocialAccountProvider} from "../../../utils/contantData";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    computeImageURL,
    createOptionListForSelectTag, formatMessage, getEmptyArrayOfSize, isNullOrEmpty
} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import {useDispatch} from "react-redux";
import Select from "react-select";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {MdDelete} from "react-icons/md";
import notConnected_img from "../../../images/no_acc_connect_img.svg";
import NopostFound from "../../../images/nopostFound.svg";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {
    useDeletePostFromPagesByPageIdsMutation, useGetPublishedPostsQuery,
} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import Table from 'react-bootstrap/Table';
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import Image from 'react-bootstrap/Image';
import {useNavigate} from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import {CgChevronDown} from "react-icons/cg";

const Review = () => {

    const {sidebar} = useAppContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState({
        socialMediaType: null,
        pageSize: 5,
        offSet: -1,
        postStatus: ["PUBLISHED"],
        pageIds: [],
    });

    const [isDirty, setDirty] = useState({isDirty: false});
    const [refresh, setRefresh] = useState(false);
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
    const postApi = useGetPublishedPostsQuery(searchQuery, {skip: searchQuery?.offSet < 0})
    const [deletePostFromPagesByPageIds, deletePostFromPagesApi] = useDeletePostFromPagesByPageIdsMutation()

    const isAccountInfoLoading = getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.isLoading

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0) {
            setSearchQuery({...searchQuery, offSet: 0});
        }
    }, [getConnectedSocialAccountApi, getAllConnectedPagesApi]);

    useEffect(() => {
        if (postApi?.data && !postApi?.isLoading && !postApi?.isFetching && !refresh) {
            if (searchQuery?.offSet === 0) {
                setPostsList([...postApi?.data?.data])
            }
            if (searchQuery?.offSet > 0) {
                setPostsList([...postsList, ...postApi?.data?.data])
            }
        }
    }, [postApi, refresh]);

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
        if (refresh) {
            setTimeout(() => {
                setRefresh(false)
                dispatch(addyApi.util.invalidateTags(['getPublishedPostsApi']));
            }, 1000);
        }
    }, [refresh]);

    useEffect(() => {
        return () => {
            if (!isNullOrEmpty(removedPosts)) {
                dispatch(addyApi.util.invalidateTags(['getPublishedPostsApi']));
            }
        }
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
            if (postApi?.isLoading || postApi?.isFetching) return;
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
        }, [postApi?.isLoading, postApi?.isFetching, removedPosts, postApi?.data?.hasNext, postsList]);

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
                                            <GenericButtonWithLoader
                                                label={"Refresh"}
                                                isDisabled={postApi?.isLoading || postApi?.isFetching || refresh}
                                                onClick={() => {
                                                    setSearchQuery({
                                                        ...searchQuery,
                                                        offSet: 0
                                                    })
                                                    setRefresh(true)
                                                    setRemovedPosts([])
                                                    setDeletePostPageInfo(null)
                                                    setPostsList(null)

                                                }}
                                                className={"cmn_btn_color cmn_connect_btn yes_btn"}
                                            />
                                            <Select
                                                className={"review-pages-media-dropdown"}
                                                isMulti
                                                value={selectedDropdownOptions?.pages}
                                                isDisabled={postApi?.isLoading || postApi?.isFetching || refresh}
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
                                            {/*

                                            <Select
                                                className={"review-social-media-dropdown"}
                                                options={createOptionListForSelectTag(SocialAccountProvider, null, null, [{
                                                    label: "All",
                                                    value: null,
                                                }])}
                                                value={selectedDropdownOptions?.socialMediaType}
                                                isDisabled={postApi?.isLoading || postApi?.isFetching || refresh}
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
                                            /> */}

                                            <Dropdown className="cmn_dropdown">
                                                <Dropdown.Toggle>
                                                    {selectedDropdownOptions?.socialMediaType?.label || 'Filter'}
                                                    <CgChevronDown/>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {/* Assuming createOptionListForSelectTag generates an array of options */}
                                                    {
                                                        createOptionListForSelectTag(SocialAccountProvider, null, null, [{
                                                            label: "All",
                                                            value: null,
                                                        }]).map((option, index) => (
                                                            <Dropdown.Item
                                                                key={index}
                                                                onClick={() => {
                                                                    setSelectedDropDownOptions({
                                                                        ...selectedDropdownOptions,
                                                                        socialMediaType: option,
                                                                        pages: [],
                                                                    });
                                                                    setPostsList([]);
                                                                    setSearchQuery({
                                                                        ...searchQuery,
                                                                        socialMediaType: option.value?.toUpperCase(),
                                                                        pageIds: [],
                                                                        offSet: 0,
                                                                    });
                                                                }}
                                                                active={selectedDropdownOptions?.socialMediaType?.value === option.value}
                                                            >
                                                                {option.label}
                                                            </Dropdown.Item>
                                                        ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </>
                                    }
                                </div>
                                <>
                                    <div className="review_outer mt-0">

                                        {
                                            !postApi?.isLoading && !postApi?.isFetching && postsList !== null && postsList?.length === 0 ?
                                                <div>
                                                    <div className="W-100 text-center no_post_review_outer">
                                                        <div className={"no-post-review acc_not_connected_heading"}>
                                                            <Image src={NopostFound} alt={"No Post Found"}/>
                                                            <h3 className={"mb-3 mt-4"}>
                                                                Oops! It seems there are no posts to display at the
                                                                moment.
                                                            </h3>
                                                            <GenericButtonWithLoader
                                                                label={"Create Post"}
                                                                onClick={() => {
                                                                    navigate("/planner/post")
                                                                }}
                                                                className={"cmn_btn_color cmn_connect_btn yes_btn"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div> :

                                                <ul className="review_list">
                                                    <Table>
                                                        <thead>
                                                        {
                                                            (isAccountInfoLoading || (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0)) &&
                                                            <tr>
                                                                <th className="text-center">Post</th>
                                                                <th className="text-center">Social Media</th>
                                                                <th className="text-center">Likes</th>
                                                                <th className="text-center">Comments</th>
                                                                <th className="text-center">Share</th>
                                                                <th className="text-center">Actions</th>
                                                            </tr>
                                                        }
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            postsList?.map((post, index) => {
                                                                return removedPosts?.some((removedPost) =>
                                                                    removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId
                                                                ) ? <></>
                                                                    : (post.errorInfo === undefined || post.errorInfo === null) ?
                                                                        <tr key={index}
                                                                            ref={index === postsList?.length - 1 ? lastPostRef : null}>
                                                                            <td className="text-center">
                                                                                {
                                                                                    post?.attachments[0]?.imageURL === null && post?.attachments[0]?.mediaType === "VIDEO" ?
                                                                                        <video
                                                                                            style={{objectFit: "fill"}}
                                                                                            className="bg_img"
                                                                                            src={post?.attachments[0]?.sourceURL || post?.attachments[0]?.imageURL}
                                                                                        />
                                                                                        :
                                                                                        <img
                                                                                            src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                                                            className="bg_img"/>
                                                                                }

                                                                            </td>
                                                                            <td className="text-center">
                                                                                <div
                                                                                    className="">
                                                                                    <img
                                                                                        src={computeImageURL(post?.socialMediaType)}
                                                                                        className="social_icons_review"/>
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-center">  {post?.likes} Likes {post?.socialMediaType === "FACEBOOK" ? "/ Reactions" : ""}</td>
                                                                            <td className="text-center">  {post?.comments} Comments</td>
                                                                            <td className="text-center">   {post?.shares}{" "}{post?.socialMediaType === "PINTEREST" ? "Save" : "Share"}</td>
                                                                            <td className="text-center">
                                                                                <button
                                                                                    className="cmn_btn_color cmn_connect_btn yes_btn"
                                                                                    onClick={(e) => {
                                                                                        setPostData(post);
                                                                                        setDirty({
                                                                                            ...isDirty,
                                                                                            index: index,
                                                                                            socialMediaType: post?.socialMediaType,
                                                                                        });
                                                                                        setOpenCommentReviewsSectionModal(!isOpenCommentReviewsSectionModal);
                                                                                    }}>View Post
                                                                                </button>
                                                                            </td>
                                                                        </tr>

                                                                        :
                                                                        <tr class="demo" key={index}
                                                                            ref={index === postsList?.length - 1 ? lastPostRef : null}>
                                                                            <td className="text-center">
                                                                                {
                                                                                    post?.attachments[0]?.imageURL === null && post?.attachments[0]?.mediaType === "VIDEO" ?
                                                                                        <video
                                                                                            style={{objectFit: "fill"}}
                                                                                            className="bg_img"
                                                                                            src={post?.attachments[0]?.sourceURL || post?.attachments[0]?.imageURL}
                                                                                        />
                                                                                        :
                                                                                        <img
                                                                                            src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                                                            className="bg_img"/>
                                                                                }

                                                                            </td>
                                                                            <td className="text-center">
                                                                                <div
                                                                                    className="">
                                                                                    <img
                                                                                        src={computeImageURL(post?.socialMediaType)}/>
                                                                                </div>
                                                                            </td>

                                                                            <td colSpan={3}>
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
                                                                            </td>
                                                                            <td className="text-center">
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
                                                                            </td>
                                                                        </tr>;
                                                            })
                                                        }
                                                        {
                                                            ( isAccountInfoLoading ||postApi?.isLoading || postApi?.isFetching || refresh) &&
                                                            getEmptyArrayOfSize(4).map((_, i) => {
                                                                return <tr key={i}>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1}
                                                                        className={"w-50 m-auto post-image-skeleton"}/>
                                                                    </td>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1} className={"w-50 m-auto"}/></td>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1} className={"w-50 m-auto"}/></td>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1} className={"w-50 m-auto"}/></td>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1} className={"w-50 m-auto"}/></td>
                                                                    <td className="text-center"><SkeletonEffect
                                                                        count={1} className={"w-50 m-auto"}/></td>
                                                                </tr>
                                                            })
                                                        }
                                                        </tbody>
                                                    </Table>
                                                    {/* {
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
                                                        } */}
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

                                </>
                                {/*{*/}
                                {/*    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0 &&*/}


                                {/*}*/}
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
