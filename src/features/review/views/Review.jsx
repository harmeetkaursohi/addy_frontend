import SideBar from "../../sidebar/views/Layout"
import "./Review.css"
import jsondata from "../../../locales/data/initialdata.json"
import {SocialAccountProvider} from "../../../utils/contantData";
import {useCallback, useEffect, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";
import {computeImageURL, getInitialLetterCap} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png"
import CommonLoader from "../../common/components/CommonLoader";
import {useDispatch, useSelector} from "react-redux";
import {getPostPageInfoAction} from "../../../app/actions/postActions/postActions";

const Review = () => {

    const [baseSearchQuery, setBaseSearchQuery] = useState({pageNum: 0});
    const {isLoading=true, isError, error, results ,setResults, hasNextPage} = usePosts(baseSearchQuery?.pageNum, baseSearchQuery?.socialMediaType);
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const [resetData, isResetData] = useState(false);
    const dispatch = useDispatch();
    const postPageInfoData = useSelector((state) => state.post.getPostPageInfoReducer.data);


    const getPostByIdsResponse={
        results: {
            "urn:li:ugcPost:7143509116827713537": {
                isReshareDisabledByAuthor: false,
                createdAt: 1703145293570,
                lifecycleState: "PUBLISHED",
                lastModifiedAt: 1703145293645,
                visibility: "PUBLIC",
                publishedAt: 1703145293570,
                author: "urn:li:organization:100408588",
                id: "urn:li:ugcPost:7143509116827713537",
                distribution: {
                    feedDistribution: "MAIN_FEED",
                    thirdPartyDistributionChannels: []
                },
                content: {
                    multiImage: {
                        images: [
                            {
                                altText: "",
                                id: "urn:li:image:D4D10AQHz52KoxrP3jg"
                            },
                            {
                                altText: "",
                                id: "urn:li:image:D4D10AQG1MSGDSox03A"
                            }
                        ]
                    }
                },
                commentary: "Uploading multiple images\n",
                lifecycleStateInfo: {
                    isEditedByAuthor: false
                }
            },
            "urn:li:share:7143508217761890305": {
                isReshareDisabledByAuthor: false,
                lifecycleState: "PUBLISHED",
                createdAt: 1703145079180,
                lastModifiedAt: 1703145079235,
                visibility: "PUBLIC",
                publishedAt: 1703145079180,
                author: "urn:li:organization:100408588",
                id: "urn:li:share:7143508217761890305",
                distribution: {
                    feedDistribution: "MAIN_FEED",
                    thirdPartyDistributionChannels: []
                },
                commentary: "Only Posting Text\n",
                lifecycleStateInfo: {
                    isEditedByAuthor: false
                }
            }
        },
        statuses: {
            "urn:li:ugcPost:7143509116827713537": 200,
            "urn:li:share:7143508217761890305": 200
        },
        errors: {}
    }
    const getPostByIdResponse={
        isReshareDisabledByAuthor: false,
        createdAt: 1703145293570,
        lifecycleState: 'PUBLISHED',
        lastModifiedAt: 1703145293645,
        visibility: 'PUBLIC',
        publishedAt: 1703145293570,
        author: 'urn:li:organization:100408588',
        id: 'urn:li:ugcPost:7143509116827713537',
        distribution: {
            feedDistribution: 'MAIN_FEED',
            thirdPartyDistributionChannels: []
        },
        content: {
            multiImage: {
                images: [
                    {
                        altText: '',
                        id: 'urn:li:image:D4D10AQHz52KoxrP3jg'
                    },
                    {
                        altText: '',
                        id: 'urn:li:image:D4D10AQG1MSGDSox03A'
                    }
                ]
            }
        },
        commentary: 'Uploading multiple images\n',
        lifecycleStateInfo: {
            isEditedByAuthor: false
        }
    }



    useEffect(()=>{
        if(resetData){
            setResults([])
            setBaseSearchQuery({...baseSearchQuery,pageNum: 0,})
            isResetData(false)

        }
    },[resetData]);

    useEffect(() => {
        if (postData && postData !== undefined) {
            const requestBody = {
                postIds: [postData?.id],
                pageAccessToken: postData?.page?.access_token,
                socialMediaType:postData?.socialMediaType
            }
            dispatch(getPostPageInfoAction(requestBody));
        }
    }, [postData])


    const intObserver = useRef();
    const lastPostRef = useCallback(post => {
        if (isLoading) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                setBaseSearchQuery({...baseSearchQuery, pageNum: baseSearchQuery.pageNum + 1})
            }
        })

        if (post) intObserver.current.observe(post)
    }, [isLoading, hasNextPage]);


    if (isError) return <p className='center'>Error: {error.message}</p>

    return (
        <>
            <section>
                <SideBar/>
                <div className="comment_container">
                    <div className="cmn_wrapper_outer">
                        <div className="review_wrapper">
                            <div className="review_header">
                                <div className="review_heading">
                                    <h2 className="cmn_text_heading">{jsondata.likecomment}</h2>
                                    <h6 className="cmn_small_heading">Here you find all the upcoming Posts you
                                        scheduled.</h6>
                                </div>
                                <select className="filter_select_btn cmn_text_style"
                                        value={baseSearchQuery?.socialMediaType}
                                        onChange={(e) => {
                                            setBaseSearchQuery({
                                                ...baseSearchQuery,
                                                pageNum: 0,
                                                socialMediaType: e.target.value === "All" ? null : e.target.value
                                            });
                                        }}
                                >
                                    <option value={"All"}>All</option>
                                    {Object.keys(SocialAccountProvider).map((cur) => {
                                        return (<option value={cur}>{getInitialLetterCap(SocialAccountProvider[cur])}</option>)
                                    })}
                                </select>
                            </div>

                            <div className="post_review_wrapper ">

                                <table className={"review_data"}>

                                    <thead className="table-responsive position-sticky" style={{top: "0"}}>

                                    <tr>
                                        <th>{jsondata.post}</th>
                                        <th>{jsondata.socialmedia}</th>
                                        <th>{jsondata.likes}</th>
                                        <th>{jsondata.comments}</th>
                                        <th>{jsondata.share}</th>
                                        <th>{jsondata.action}</th>
                                    </tr>

                                    </thead>

                                    <tbody className="position-relative">
                                    {
                                        isLoading ?
                                            <div className={"w-100 position-absolute table_loader"}>
                                                <CommonLoader/>
                                            </div>
                                            :
                                            results?.map((post, index) => (

                                                <tr
                                                    key={index}
                                                    ref={index === results.length - 1 ? lastPostRef : null}
                                                >
                                                    <td>
                                                        <img src={post?.attachments[0]?.imageURL || noImageAvailable}
                                                             className="bg_img"/>
                                                    </td>
                                                    <td>
                                                        <img className={"me-2"} src={computeImageURL(post?.socialMediaType)}/>
                                                        <span>{post?.page?.name}</span>
                                                    </td>
                                                    <td>{post?.likes} Likes</td>
                                                    <td>{post?.comments} Comments</td>
                                                    <td>{post?.shares} Share</td>
                                                    <td>
                                                        <button
                                                            className="view_post_btn cmn_bg_btn"
                                                            onClick={(e) => {
                                                                setPostData(post);
                                                                setOpenCommentReviewsSectionModal(!isOpenCommentReviewsSectionModal)
                                                            }}>{jsondata.viewpost}</button>
                                                    </td>
                                                </tr>
                                            ))
                                    }


                                    </tbody>

                                </table>

                            </div>


                        </div>
                    </div>
                </div>

                {
                    isOpenCommentReviewsSectionModal &&
                    <CommentReviewsSectionModal isOpenCommentReviewsSectionModal={isOpenCommentReviewsSectionModal}
                                                setOpenCommentReviewsSectionModal={setOpenCommentReviewsSectionModal}
                                                postData={postData} postPageInfoData={postPageInfoData} isResetData={isResetData}  />
                }
            </section>
        </>
    )
}
export default Review