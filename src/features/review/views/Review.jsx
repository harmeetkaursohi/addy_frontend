import SideBar from "../../sidebar/views/Layout"
import "./Review.css"
import jsondata from "../../../locales/data/initialdata.json"
import {
    ErrorFetchingPost,
    PostAlreadyDeleted,
    SocialAccountProvider,
    SomethingWentWrong,
    UpdatedSuccessfully
} from "../../../utils/contantData";
import {useCallback, useEffect, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";
import {
    computeImageURL,
    concatenateString,
    createOptionListForSelectTag,
} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import CommonLoader from "../../common/components/CommonLoader";
import {FaArrowCircleRight} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {deletePostFromPage, getPostPageInfoAction} from "../../../app/actions/postActions/postActions";
import {getToken} from "../../../app/auth/auth";
import {RotatingLines} from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import ConnectSocialMediaAccount from "../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../common/components/AppProvider";
import {MdDelete} from "react-icons/md";

const Review = () => {
    const {sidebar} = useAppContext();
    const [baseSearchQuery, setBaseSearchQuery] = useState({socialMediaType: null, pageSize: 5, offSet: -1});
    const [isDirty, setDirty] = useState({isDirty: false})
    const {
        isLoading = true,
        isError,
        error,
        results,
        setResults,
        hasNextPage,

    } = usePosts(baseSearchQuery);
    const token = getToken();
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const navigate = useNavigate();
    const [pageDropdown, setPageDropdown] = useState([])
    const [selectedDropdownOptions, setSelectedDropDownOptions] = useState({
        socialMediaType: {label: "All", value: null},
        pages: []

    })
    const dispatch = useDispatch();
    const [removedPosts, setRemovedPosts] = useState([])
    const [deletePostPageInfo, setDeletePostPageInfo] = useState(null)
    const postPageInfoData = useSelector((state) => state.post.getPostPageInfoReducer.data);
    const getPostsPageData = useSelector((state) => state.post.getPostsPageReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);


    useEffect(() => {
        if (deletePostPageInfo !== null && deletePostPageInfo !== undefined) {
            dispatch(deletePostFromPage({
                token: token,
                postId: deletePostPageInfo?.id,
                pageIds: [deletePostPageInfo?.page?.pageId]
            })).then(res => {

                if (res.meta.requestStatus === "fulfilled") {
                    setRemovedPosts([...removedPosts, {
                        postId: deletePostPageInfo?.id,
                        pageId: deletePostPageInfo?.page?.pageId
                    }]);
                }
                setDeletePostPageInfo(null)
            })
        }
    }, [deletePostPageInfo])


    useEffect(() => {
        return () => {
            removedPosts.length > 0 && setRemovedPosts([])
        }
    }, [])


    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            setBaseSearchQuery({...baseSearchQuery, offSet: 0})
        }
    }, [getAllConnectedSocialAccountData, connectedPagesData])


    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            if (baseSearchQuery?.socialMediaType === null || baseSearchQuery?.socialMediaType === undefined) {
                setPageDropdown(connectedPagesData?.facebookConnectedPages)
            } else {
                setPageDropdown(getAllConnectedSocialAccountData?.data?.filter(socialMediaAccount => socialMediaAccount?.provider === baseSearchQuery?.socialMediaType)[0]?.pageAccessToken)
            }
        }
    }, [getAllConnectedSocialAccountData, connectedPagesData, baseSearchQuery])

    useEffect(() => {
        if (postData && postData !== undefined) {
            const requestBody = {
                token: token,
                postIds: [postData?.id],
                pageAccessToken: postData?.page?.access_token,
                socialMediaType: postData?.socialMediaType
            }
            dispatch(getPostPageInfoAction(requestBody));
        }
    }, [postData])

    useEffect(() => {
        if (isDirty?.isDirty) {
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "POST") {
                let updatedResults = [...results]
                let updatedObject = updatedResults[isDirty?.index]
                updatedObject = {...updatedObject, comments: updatedObject?.comments + 1}
                updatedResults[isDirty?.index] = updatedObject
                setResults([...updatedResults])
            }
            if (isDirty?.action?.on === "COMMENT" && isDirty?.action?.type === "DELETE") {
                let updatedResults = [...results]
                let updatedObject = updatedResults[isDirty?.index]
                updatedObject = {
                    ...updatedObject,
                    comments: updatedObject?.comments - isDirty?.action?.reduceCommentCount
                }
                updatedResults[isDirty?.index] = updatedObject
                setResults([...updatedResults])
            }
            setDirty({isDirty: false, index: isDirty?.index})
        }
    }, [isDirty])

    const intObserver = useRef();
    const lastPostRef = useCallback(post => {
        if (isLoading) return
        if (intObserver.current) intObserver.current.disconnect()
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage && !isError) {
                setBaseSearchQuery({...baseSearchQuery, offSet: results?.length - removedPosts?.length})
            }
        })
        if (post) intObserver.current.observe(post)
    }, [isLoading, hasNextPage, removedPosts]);


    return (
        <>
            <section>
                <SideBar/>
                <div className={sidebar ? "comment_container" : "cmn_Padding bg_Color"}>
                    <div className="cmn_wrapper_outer">
                        <div className="review_wrapper">
                            <div className="review_header align-items-center gap-3">
                                <div className="review_heading flex-grow-1">
                                    <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                                    <h6 className="cmn_small_heading ">Here you find all the Posts you
                                        have
                                        posted.</h6>
                                </div>
                                {
                                    getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0 && <>
                                        <Select
                                            className={"review-pages-media-dropdown"}
                                            isMulti
                                            value={selectedDropdownOptions?.pages}
                                            isDisabled={getPostsPageData?.loading}
                                            options={createOptionListForSelectTag(pageDropdown, "name", "pageId")}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({...selectedDropdownOptions, pages: val})
                                                setResults([])
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    pageNum: 0,
                                                    pageIds: val?.map(cur => cur?.value)
                                                });
                                            }}
                                        />

                                        <Select
                                            className={"review-social-media-dropdown"}
                                            options={createOptionListForSelectTag(SocialAccountProvider, null, null, {
                                                label: "All",
                                                value: null
                                            })}
                                            value={selectedDropdownOptions?.socialMediaType}
                                            isDisabled={getPostsPageData?.loading}
                                            onChange={(val) => {
                                                setSelectedDropDownOptions({
                                                    ...selectedDropdownOptions,
                                                    socialMediaType: val,
                                                    pages: []
                                                })
                                                setResults([])
                                                setBaseSearchQuery({
                                                    ...baseSearchQuery,
                                                    pageNum: 0,
                                                    socialMediaType: val?.value?.toUpperCase(),
                                                    pageIds: []
                                                });
                                            }}
                                        />
                                    </>
                                }
                            </div>
                            {

                                (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                                    <CommonLoader classname={"cmn_loader_outer"}></CommonLoader> :
                                    getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0 &&
                                    <>
                                        <div className="post_review_wrapper  table-responsive">
                                            <table className={"review_data"}>

                                                <thead className="position-sticky" style={{top: "0"}}>

                                                <tr>
                                                    <th>{jsondata.post}</th>
                                                    <th>{jsondata.socialmedia}</th>
                                                    <th>{jsondata.likes}</th>
                                                    <th>{jsondata.comments}</th>
                                                    <th>{jsondata.share}/{jsondata.save}</th>
                                                    <th>{jsondata.action}</th>
                                                </tr>

                                                </thead>

                                                <tbody className="position-relative">


                                                {

                                                    (!isLoading && results !== null && results?.length === 0) ?
                                                        <tr>

                                                            <td className="W-100 text-center" colSpan={6}>
                                                                <div
                                                                    className={"no-post-review acc_not_connected_heading"}>Oops!
                                                                    It seems there are no posts to display at the
                                                                    moment.
                                                                </div>
                                                            </td>

                                                        </tr> :
                                                        results?.map((post, index) => {
                                                            return removedPosts?.some(removedPost => removedPost?.postId === post.id && removedPost?.pageId === post.page.pageId) ?
                                                                <></> :
                                                                (post.errorInfo === undefined || post.errorInfo === null) ?
                                                                    <tr
                                                                        key={index}
                                                                        ref={index === results?.length - 1 ? lastPostRef : null}>
                                                                        <td>
                                                                            <img
                                                                                src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                                                className="bg_img"/>
                                                                        </td>
                                                                        <td>
                                                                            <div
                                                                                className={"d-flex align-items-center"}>
                                                                                <img className={"me-2 review-post-icon"}
                                                                                     src={computeImageURL(post?.socialMediaType)}/>
                                                                                <span>{post?.page?.name}</span>
                                                                            </div>


                                                                        </td>
                                                                        <td>{post?.likes} Likes</td>
                                                                        <td>{post?.comments} Comments</td>
                                                                        <td>{post?.shares} {post?.socialMediaType === "PINTEREST" ? "Save" : "Share"} </td>
                                                                        <td>

                                                                            <div
                                                                                className={"view-post-txt cursor-pointer"}
                                                                                onClick={(e) => {
                                                                                    setPostData(post);
                                                                                    setDirty({
                                                                                        ...isDirty,
                                                                                        index: index,
                                                                                        socialMediaType: post?.socialMediaType
                                                                                    })
                                                                                    setOpenCommentReviewsSectionModal(!isOpenCommentReviewsSectionModal)
                                                                                }}
                                                                            >
                                                                                <span>View</span> <FaArrowCircleRight
                                                                                style={{color: "#F07C33"}}/>

                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    :

                                                                    <tr
                                                                        key={index}
                                                                        ref={index === results?.length - 1 ? lastPostRef : null}
                                                                    >
                                                                        <td className={"disabled-table-grid"}>
                                                                            <img
                                                                                src={noImageAvailable}
                                                                                className="bg_img"/>
                                                                        </td>
                                                                        <td className={"disabled-table-grid"}>
                                                                            <div
                                                                                className={"d-flex align-items-center"}>
                                                                                <img className={"me-2 review-post-icon"}
                                                                                     src={computeImageURL(post?.socialMediaType)}/>
                                                                                <span>{post?.page?.name}</span>
                                                                            </div>


                                                                        </td>
                                                                        <td className={"disabled-table-grid"}>
                                                                            {concatenateString(post.message, 20)}
                                                                        </td>

                                                                        <td className={"disabled-table-grid "}
                                                                            colSpan={post.errorInfo.isDeletedFromSocialMedia ? 2 : 3}>
                                                                            {
                                                                                post.errorInfo.isDeletedFromSocialMedia ?
                                                                                    <div
                                                                                        className={"review-errorMessage d-flex"}>
                                                                                        {PostAlreadyDeleted}

                                                                                    </div>
                                                                                    :
                                                                                    <div
                                                                                        className={"review-errorMessage "}>{ErrorFetchingPost}
                                                                                    </div>
                                                                            }
                                                                        </td>
                                                                        {
                                                                            post.errorInfo.isDeletedFromSocialMedia &&
                                                                            <td className={"disabled-table-grid "}>
                                                                                <MdDelete
                                                                                    onClick={() => {
                                                                                        !isLoading && setDeletePostPageInfo(post)
                                                                                    }}
                                                                                    className={"ms-2 cursor-pointer font-size-20"}
                                                                                    title={"Delete From Addy"}/>
                                                                            </td>
                                                                        }

                                                                    </tr>
                                                        })


                                                }


                                                </tbody>

                                            </table>


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
                    isOpenCommentReviewsSectionModal &&
                    <CommentReviewsSectionModal isOpenCommentReviewsSectionModal={isOpenCommentReviewsSectionModal}
                                                setOpenCommentReviewsSectionModal={setOpenCommentReviewsSectionModal}
                                                postData={postData} postPageInfoData={postPageInfoData}
                                                setDirty={setDirty}
                                                isDirty={isDirty}
                    />
                }
            </section>
        </>
    )
}
export default Review