import "./Review.css";
import jsondata from "../../../locales/data/initialdata.json";
import {
    ErrorFetchingPost,
    NotConnected,
    PostAlreadyDeleted,
    SocialAccountProvider,
} from "../../../utils/contantData";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    computeImageURL,
    createOptionListForSelectTag,
    formatMessage,
    getEmptyArrayOfSize,
    isNullOrEmpty,
} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import {useDispatch} from "react-redux";
import Select from "react-select";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {MdDelete} from "react-icons/md";
import notConnected_img from "../../../images/no_acc_connect_img.svg";
import NopostFound from "../../../images/nopostFound.svg?react";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {
    useDeletePostFromPagesByPageIdsMutation,
    useGetPublishedPostsQuery,
} from "../../../app/apis/postApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import GenericButtonWithLoader from "../../common/components/GenericButtonWithLoader";
import Table from "react-bootstrap/Table";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import Image from "react-bootstrap/Image";
import {useNavigate} from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import {CgChevronDown} from "react-icons/cg";
import {FormCheck} from "react-bootstrap";
import Default_user from '../../../images/default_user_icon.svg'
import fb from "../../../images/fb.svg";
import instagram_img from "../../../images/instagram_logo.svg";
import linkedin from "../../../images/linkedin.svg";
import Pinterest from "../../../images/pinterest_icon.svg";
import dropdown from "bootstrap/js/src/dropdown";


const Review = () => {

    const {sidebar} = useAppContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const socialMediaDropDownsOptions = createOptionListForSelectTag(SocialAccountProvider)?.map(cur => {
        return {
            ...cur,
            value: cur?.value?.toUpperCase()
        }
    })
    const [allPages, setAllPages] = useState([])

    const [searchQuery, setSearchQuery] = useState({
        // socialMediaType: null,
        socialMediaTypes: [],
        pageSize: 5,
        offSet: -1,
        postStatus: ["PUBLISHED"],
        pageIds: [],
    });

    const [isDirty, setDirty] = useState({isDirty: false});
    const [refresh, setRefresh] = useState(false);
    const [postsList, setPostsList] = useState(null);
    const [removedPosts, setRemovedPosts] = useState([]);
    const [deletePostPageInfo, setDeletePostPageInfo] = useState(null);
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const [pageDropdown, setPageDropdown] = useState([]);
    const [selectedDropdownOptions, setSelectedDropDownOptions] = useState({
        socialMediaTypes: [],
        pages: [],
    });


    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("");
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("");
    const postApi = useGetPublishedPostsQuery(searchQuery, {skip: searchQuery?.offSet < 0,});
    const [deletePostFromPagesByPageIds, deletePostFromPagesApi] = useDeletePostFromPagesByPageIdsMutation();

    const isAccountInfoLoading = getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.isLoading;

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length > 0) {
            let pagesData = [];
            getConnectedSocialAccountApi?.data?.forEach(account => {
                const pageAccessTokens = account?.pageAccessToken
                pageAccessTokens?.forEach(cur => {
                    pagesData = [...pagesData, {...cur, socialMediaType: account?.provider}]
                })
            })
            setAllPages(pagesData)
            setPageDropdown(pagesData)
            setSelectedDropDownOptions({
                ...selectedDropdownOptions,
                socialMediaTypes: socialMediaDropDownsOptions,
                pages: pagesData,
            })
            setSearchQuery({
                ...searchQuery,
                socialMediaTypes: socialMediaDropDownsOptions?.map(cur => cur?.value),
                pageIds: pagesData?.map(page => page?.pageId),
                offSet: 0
            });
        }
    }, [getConnectedSocialAccountApi, getAllConnectedPagesApi]);

    useEffect(() => {
        if (postApi?.data && !postApi?.isLoading && !postApi?.isFetching && !refresh) {
            if (searchQuery?.offSet === 0) {
                setPostsList([...postApi?.data?.data]);
            }
            if (searchQuery?.offSet > 0) {
                setPostsList([...postsList, ...postApi?.data?.data]);
            }
        }
    }, [postApi, refresh]);

    useEffect(() => {
        if (deletePostPageInfo !== null && deletePostPageInfo !== undefined) {
            handleDeletePostFromPage();
        }
    }, [deletePostPageInfo]);

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
                setRefresh(false);
                dispatch(addyApi.util.invalidateTags(["getPublishedPostsApi"]));
            }, 1000);
        }
    }, [refresh]);

    useEffect(() => {
        return () => {
            if (!isNullOrEmpty(removedPosts)) {
                dispatch(addyApi.util.invalidateTags(["getPublishedPostsApi"]));
            }
        };
    }, [removedPosts]);

    const handleSocialMediaFilters = (data) => {
        if (data?.type === "AllSocialMediaSelect") {
            //  If All socialMedia are unselected
            if (selectedDropdownOptions?.socialMediaTypes?.length === socialMediaDropDownsOptions?.length) {
                setPageDropdown([])
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    socialMediaTypes: [],
                    pages: [],
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    socialMediaTypes: [],
                    pageIds: [],
                })
            } else {
                //  If All socialMedia are selected
                setPageDropdown(allPages)
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    socialMediaTypes: socialMediaDropDownsOptions,
                    pages: allPages,
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    socialMediaTypes: socialMediaDropDownsOptions?.map(cur => cur?.value),
                    pageIds: allPages?.map(cur => cur?.pageId),
                })

            }
        }
        if (data?.type === "AllPagesSelect") {
            // If all the Pages are unselected
            if (selectedDropdownOptions?.pages?.length === pageDropdown?.length) {
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    pages: [],
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    pageIds: [],
                })

            } else {
                // If all the Pages are selected
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    pages: pageDropdown,
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    pageIds: pageDropdown?.map(cur => cur?.pageId),
                })
            }
        }
        if (data?.type === "SocialMediaSelect") {
            const socialMediaType = data?.socialMediaType
            // If SocialMedia Is Unselected
            if (selectedDropdownOptions?.socialMediaTypes?.some(cur => cur?.value === socialMediaType)) {
                const updatedPages = selectedDropdownOptions?.pages?.filter(cur => cur?.socialMediaType !== socialMediaType)
                const updatedSocialMediaTypes = selectedDropdownOptions?.socialMediaTypes?.filter(cur => cur?.value !== socialMediaType)
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    socialMediaTypes: updatedSocialMediaTypes,
                    pages: updatedPages,
                })
                setPageDropdown(updatedPages)
                setSearchQuery({
                    ...searchQuery,
                    socialMediaTypes: updatedSocialMediaTypes?.map(cur=>cur?.value),
                    offSet: 0,
                    pageIds: updatedPages?.map(cur => cur?.pageId),
                })

            }
            else {
                const newPagesToAdd=allPages?.filter(cur=>cur?.socialMediaType===socialMediaType)
                const updatedPages=[...selectedDropdownOptions.pages,...newPagesToAdd]

                const newSocialMediaToAdd=socialMediaDropDownsOptions?.filter(cur=>cur?.value===socialMediaType)
                const updatedSocialMediaTypes=[...selectedDropdownOptions?.socialMediaTypes,...newSocialMediaToAdd]

                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    socialMediaTypes: updatedSocialMediaTypes,
                    pages: updatedPages,
                })
                setPageDropdown(updatedPages)
                setSearchQuery({
                    ...searchQuery,
                    socialMediaTypes: updatedSocialMediaTypes?.map(cur=>cur?.value),
                    offSet: 0,
                    pageIds: updatedPages?.map(cur => cur?.pageId),
                })

            }
        }
        if (data?.type === "PageSelect") {
            const pageId = data?.pageId
            // If Page Is Unselected
            if (selectedDropdownOptions?.pages?.some(cur => cur?.pageId === pageId)) {
                const updatedPages = selectedDropdownOptions?.pages?.filter(cur => cur?.pageId !== pageId)
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    pages: updatedPages,
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    pageIds: updatedPages?.map(cur => cur?.pageId),
                })

            }
            else {
                // If Page Is Selected
                const newPagesToAdd=allPages?.filter(cur=>cur?.pageId===pageId)
                const updatedPages=[...selectedDropdownOptions.pages,...newPagesToAdd]
                setSelectedDropDownOptions({
                    ...selectedDropdownOptions,
                    pages: updatedPages,
                })
                setSearchQuery({
                    ...searchQuery,
                    offSet: 0,
                    pageIds: updatedPages?.map(cur => cur?.pageId),
                })

            }
        }
        setPostsList([]);
    }

    const handleDeletePostFromPage = async () => {
        await handleRTKQuery(
            async () => {
                return await deletePostFromPagesByPageIds({
                    postId: deletePostPageInfo?.id,
                    pageIds: [deletePostPageInfo?.page?.pageId],
                }).unwrap();
            },
            () => {
                setRemovedPosts([
                    ...removedPosts,
                    {
                        postId: deletePostPageInfo?.id,
                        pageId: deletePostPageInfo?.page?.pageId,
                    },
                ]);
            },
            null,
            () => {
                setDeletePostPageInfo(null);
            }
        );
    };

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
        },
        [postApi?.isLoading, postApi?.isFetching, removedPosts, postApi?.data?.hasNext, postsList,]
    );

    return (
        <>
            <section>
                <div className={sidebar ? "comment_container" : "cmn_Padding"}>
                    <div className="cmn_outer">
                        <div className="review_header align-items-center gap-3">
                            <div className="review_heading flex-grow-1">
                                {
                                    getConnectedSocialAccountApi?.data?.length === 0 || (getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0) ?
                                        <>
                                            {" "}
                                            <h2 className="cmn_text_heading">Published Posts</h2>
                                            <h6 className="cmn_small_heading ">Here’s a collection of all the posts
                                                you've already shared.</h6>
                                        </>
                                        :
                                        <>
                                            {" "}
                                            <h2 className="cmn_text_heading">Like/Comments</h2>
                                            <h6 className="cmn_small_heading ">
                                                {jsondata.review_post_heading}
                                            </h6>
                                        </>
                                }
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
                                                offSet: 0,
                                            });
                                            setRefresh(true);
                                            setRemovedPosts([]);
                                            setDeletePostPageInfo(null);
                                            setPostsList(null);
                                        }}
                                        className={"cmn_btn_color cmn_connect_btn yes_btn"}
                                    />
                                    {/* <Select
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
                                    /> */}


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

                                    <div className="calender_outer_wrapper publish_post_filter">
                                        <Dropdown className="cmn_dropdown position-relative end-0">
                                            <Dropdown.Toggle>
                                                Social Media
                                                <CgChevronDown/>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <li>
                                                    <h4>Select All</h4>
                                                    <input
                                                        className="privacy-policy-checkbox"
                                                        type={"checkbox"}
                                                        checked={socialMediaDropDownsOptions?.length === selectedDropdownOptions?.socialMediaTypes?.length}
                                                        onChange={(e) => {
                                                            handleSocialMediaFilters({type: "AllSocialMediaSelect"})
                                                        }}
                                                    />
                                                </li>
                                                {
                                                    socialMediaDropDownsOptions.map((option, index) => {
                                                        console.log("option=====>", option)
                                                        return <li
                                                            key={index}
                                                            onClick={() => {
                                                                handleSocialMediaFilters({
                                                                    type: "SocialMediaSelect",
                                                                    socialMediaType: option?.value
                                                                })
                                                            }}
                                                            className="d-flex"
                                                            // active={selectedDropdownOptions?.socialMediaTypes?.value === option.value}
                                                        >
                                                            <img src={computeImageURL(option?.label?.toUpperCase())}
                                                                 height="20px"
                                                                 width="20px"/>
                                                            <h4 className="flex-grow-1">{option.label}</h4>


                                                            <input
                                                                className="privacy-policy-checkbox"
                                                                type="checkbox"
                                                                checked={selectedDropdownOptions?.socialMediaTypes?.some(cur => cur?.value === option.value)}
                                                                readOnly
                                                            />
                                                        </li>
                                                    })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="calender_outer_wrapper publish_post_filter">
                                        <Dropdown className="cmn_dropdown position-relative end-0">
                                            <Dropdown.Toggle>
                                                Pages
                                                <CgChevronDown/>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {
                                                    pageDropdown.length > 0 &&
                                                    <li>
                                                        <h4>Select All</h4>
                                                        <input
                                                            className="privacy-policy-checkbox"
                                                            type={"checkbox"}
                                                            checked={pageDropdown?.length === selectedDropdownOptions?.pages?.length}
                                                            onChange={(e) => {
                                                                handleSocialMediaFilters({type: "AllPagesSelect"})
                                                            }}
                                                        />
                                                    </li>
                                                }

                                                {
                                                    pageDropdown.length > 0 ? pageDropdown.map((option, index) => {
                                                            return <li
                                                                key={index}
                                                                onClick={() => {
                                                                    handleSocialMediaFilters({type: "PageSelect",pageId:option?.pageId})
                                                                }}
                                                                className="d-flex align-items-center"
                                                                // active={selectedDropdownOptions?.pages?.pageId === option.pageId}
                                                            >
                                                                <img src={option?.imageUrl || Default_user} alt=""
                                                                     width={22} height={22} className="user_icon "/>
                                                                <h4 className="flex-grow-1"
                                                                    title={option?.name}>{option?.name}</h4>
                                                                <input
                                                                    className="privacy-policy-checkbox"
                                                                    type="checkbox"
                                                                    checked={selectedDropdownOptions?.pages?.some(cur => cur?.pageId === option.pageId)}
                                                                    readOnly
                                                                />
                                                            </li>
                                                        })
                                                        :
                                                        <li className="d-flex justify-content-center">
                                                            <h4>No Page available</h4>
                                                        </li>
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </>
                            }
                        </div>
                        <div
                            className={(getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0) || getConnectedSocialAccountApi?.data?.length === 0 ? "review_wrapper cmn_height_outer no_account_bg white_bg_color" : "review_wrapper cmn_height_outer"}
                        >
                            {
                                <div className="review_outer mt-0">
                                    {
                                        !postApi?.isLoading && !postApi?.isFetching && postsList !== null && postsList?.length === 0 ?
                                            <div>
                                                <div
                                                    className="W-100 text-center no_post_review_outer no_account_bg white_bg_color">
                                                    <div
                                                        className={"no-post-review acc_not_connected_heading"}
                                                    >
                                                        <NopostFound/>
                                                        <h3 className={"mb-3 mt-4"}>
                                                            Looks like there are no posts available yet. Get
                                                            started by posting on your social media accounts
                                                            with Addy!
                                                        </h3>
                                                        <GenericButtonWithLoader
                                                            label={"Create Post"}
                                                            onClick={() => {
                                                                navigate("/planner/post");
                                                            }}
                                                            className={"cmn_btn_color cmn_connect_btn yes_btn"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            :
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
                                                            return removedPosts?.some(
                                                                (removedPost) => removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId) ?
                                                                <></>
                                                                : post.errorInfo === undefined || post.errorInfo === null ?
                                                                    <tr
                                                                        key={index}
                                                                        ref={index === postsList?.length - 1 ? lastPostRef : null}
                                                                    >
                                                                        <td className="text-center">
                                                                            {post?.attachments[0]?.imageURL === null &&
                                                                            post?.attachments[0]?.mediaType ===
                                                                            "VIDEO" ? (
                                                                                <video
                                                                                    style={{objectFit: "fill"}}
                                                                                    className="bg_img"
                                                                                    src={
                                                                                        post?.attachments[0]?.sourceURL ||
                                                                                        post?.attachments[0]?.imageURL
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={
                                                                                        post?.attachments[0]?.imageURL ||
                                                                                        noImageAvailable
                                                                                    }
                                                                                    className="bg_img"
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <div className="">
                                                                                <img
                                                                                    src={computeImageURL(
                                                                                        post?.socialMediaType
                                                                                    )}
                                                                                    className="social_icons_review"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {" "}
                                                                            {post?.likes} Likes{" "}
                                                                            {post?.socialMediaType === "FACEBOOK"
                                                                                ? "/ Reactions"
                                                                                : ""}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {" "}
                                                                            {post?.comments} Comments
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {" "}
                                                                            {post?.shares}{" "}
                                                                            {post?.socialMediaType === "PINTEREST"
                                                                                ? "Save"
                                                                                : "Share"}
                                                                        </td>
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
                                                                                    setOpenCommentReviewsSectionModal(
                                                                                        !isOpenCommentReviewsSectionModal
                                                                                    );
                                                                                }}
                                                                            >
                                                                                View Post
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                    :
                                                                    <tr
                                                                        className="demo"
                                                                        key={index}
                                                                        ref={index === postsList?.length - 1 ? lastPostRef : null}
                                                                    >
                                                                        <td className="text-center">
                                                                            {post?.attachments[0]?.imageURL === null &&
                                                                            post?.attachments[0]?.mediaType ===
                                                                            "VIDEO" ? (
                                                                                <video
                                                                                    style={{objectFit: "fill"}}
                                                                                    className="bg_img"
                                                                                    src={
                                                                                        post?.attachments[0]?.sourceURL ||
                                                                                        post?.attachments[0]?.imageURL
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={
                                                                                        post?.attachments[0]?.imageURL ||
                                                                                        noImageAvailable
                                                                                    }
                                                                                    className="bg_img"
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <div className="">
                                                                                <img
                                                                                    src={computeImageURL(
                                                                                        post?.socialMediaType
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </td>

                                                                        <td colSpan={3}>
                                                                            {post.errorInfo.isDeletedFromSocialMedia ? (
                                                                                <div
                                                                                    className={"review-errorMessage d-flex"}
                                                                                >
                                                                                    {PostAlreadyDeleted}
                                                                                </div>
                                                                            ) : (
                                                                                <div className={"review-errorMessage "}>
                                                                                    {ErrorFetchingPost}
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {post.errorInfo.isDeletedFromSocialMedia && (
                                                                                <div className={"disabled-table-grid "}>
                                                                                    <MdDelete
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                !postApi?.isFetching &&
                                                                                                !postApi?.isLoading
                                                                                            ) {
                                                                                                setDeletePostPageInfo(post);
                                                                                            }
                                                                                        }}
                                                                                        className={
                                                                                            "ms-2 cursor-pointer font-size-20"
                                                                                        }
                                                                                        title={"Delete From Addy"}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    </tr>

                                                        })
                                                    }
                                                    {
                                                        (isAccountInfoLoading || postApi?.isLoading || postApi?.isFetching || refresh) &&
                                                        getEmptyArrayOfSize(4).map((_, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={
                                                                                "w-50 m-auto post-image-skeleton"
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={"w-50 m-auto"}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={"w-50 m-auto"}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={"w-50 m-auto"}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={"w-50 m-auto"}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <SkeletonEffect
                                                                            count={1}
                                                                            className={"w-50 m-auto"}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
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
                            }
                            <div className="no-post-review acc_not_connected_heading">
                                {
                                    getConnectedSocialAccountApi?.data?.length === 0 &&
                                    <ConnectSocialMediaAccount
                                        image={<><NopostFound className="acc_not_connected_img"/></>}
                                        message={<>Connect your social media <br/>to see what’s happening on your
                                            posts!</>}
                                    />
                                }
                                {
                                    getConnectedSocialAccountApi?.data?.length > 0 && getAllConnectedPagesApi?.data?.length === 0 &&
                                    <ConnectSocialMediaAccount
                                        image={<><NopostFound className="acc_not_connected_img"/></>}
                                        message={<>Connect your social media <br/>to see what’s happening on your
                                            posts!</>}
                                    />
                                }
                            </div>
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
