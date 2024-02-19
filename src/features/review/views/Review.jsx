import SideBar from "../../sidebar/views/Layout"
import "./Review.css"
import jsondata from "../../../locales/data/initialdata.json"
import {SocialAccountProvider} from "../../../utils/contantData";
import {useCallback, useEffect, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";
import {computeImageURL, createOptionListForSelectTag, getInitialLetterCap} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png";
import CommonLoader from "../../common/components/CommonLoader";
import {FaArrowCircleRight} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {getPostPageInfoAction} from "../../../app/actions/postActions/postActions";
import {getToken} from "../../../app/auth/auth";
import notConnected_img from "../../../images/not_connected_img.svg"
import {RotatingLines} from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
const Review = () => {

    const [baseSearchQuery, setBaseSearchQuery] = useState({pageNum: -1, socialMediaType: null});
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
        socialMediaType:{label: "All", value: null},
        pages:[]

    })
    const dispatch = useDispatch();
    const postPageInfoData = useSelector((state) => state.post.getPostPageInfoReducer.data);
    const getPostsPageData = useSelector((state) => state.post.getPostsPageReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);


    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            setBaseSearchQuery({...baseSearchQuery, pageNum: 0})
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
                setBaseSearchQuery({...baseSearchQuery, pageNum: baseSearchQuery.pageNum + 1})
            }
        })
        if (post) intObserver.current.observe(post)
    }, [isLoading, hasNextPage]);


    return (
        <>
            <section>
                <SideBar/>
                <div className="comment_container">
                    <div className="cmn_wrapper_outer">
                        <div className="review_wrapper">
                            <div className="review_header align-items-center gap-3">
                                <div className="review_heading flex-grow-1">
                                    <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                                    <h6 className="cmn_small_heading white-space-nowrap">Here you find all the Posts you
                                        have
                                        posted.</h6>
                                </div>
                                <Select
                                    className={"review-pages-media-dropdown"}
                                    isMulti
                                    value={selectedDropdownOptions?.pages}
                                    isDisabled={getPostsPageData?.loading}
                                    options={createOptionListForSelectTag(pageDropdown, "name", "pageId")}
                                    onChange={(val) => {
                                        setSelectedDropDownOptions({...selectedDropdownOptions,pages: val})
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
                                        setSelectedDropDownOptions({...selectedDropdownOptions,socialMediaType: val,pages: []})
                                        setResults([])
                                        setBaseSearchQuery({
                                            ...baseSearchQuery,
                                            pageNum: 0,
                                            socialMediaType: val?.value?.toUpperCase(),
                                            pageIds:[]
                                        });
                                    }}
                                />
                            </div>
                            {
                                (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                                    <CommonLoader></CommonLoader> :
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
                                                        results?.map((post, index) => (

                                                            <tr
                                                                key={index}
                                                                ref={index === results?.length - 1 ? lastPostRef : null}
                                                            >
                                                                <td>
                                                                    <img
                                                                        src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                                        className="bg_img"/>
                                                                </td>
                                                                <td>
                                                                    <div className={"d-flex align-items-center"}>
                                                                        <img className={"me-2 review-post-icon"}
                                                                             src={computeImageURL(post?.socialMediaType)}/>
                                                                        <span>{post?.page?.name}</span>
                                                                    </div>


                                                                </td>
                                                                <td>{post?.likes} Likes</td>
                                                                <td>{post?.comments} Comments</td>
                                                                <td>{post?.shares} {post?.socialMediaType === "PINTEREST" ? "Save" : "Share"} </td>
                                                                <td>

                                                                    <div className={"view-post-txt cursor-pointer"}
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
                                                        ))
                                                }


                                                </tbody>

                                            </table>


                                        </div>
                                        {
                                            isLoading &&
                                            <div className="d-flex justify-content-center mt-4">
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
                                <div className="acc_not_connected_outer text-center">
                                    <img className={"acc_not_connected_img"} src={notConnected_img}
                                         alt="notConnected_img"/>
                                    <h2 className="acc_not_connected_heading">No Account is connected Yet! Please
                                        connect an account.</h2>
                                    <button onClick={() => {
                                        navigate("/dashboard")
                                    }} className={"connection-error-close-btn mt-3"}>Connect Now
                                    </button>
                                </div>
                            }
                            {
                                getAllConnectedSocialAccountData?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length === 0 &&
                                <div className="acc_not_connected_outer text-center">
                                    <img className={"acc_not_connected_img"} src={notConnected_img}
                                         alt="notConnected_img"/>
                                    <h2 className="acc_not_connected_heading">No Page is connected Yet! Please
                                        connect an page.</h2>
                                    <button onClick={() => {
                                        navigate("/dashboard")
                                    }} className={"connection-error-close-btn mt-3"}>Connect Now
                                    </button>
                                </div>
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