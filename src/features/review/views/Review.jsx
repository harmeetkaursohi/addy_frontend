import SideBar from "../../sidebar/views/Layout"
import "./Review.css"
import jsondata from "../../../locales/data/initialdata.json"
import {SocialAccountProvider} from "../../../utils/contantData";
import {useCallback, useEffect, useRef, useState} from "react";
import usePosts from "../../common/hooks/usePosts";
import {computeImageURL} from "../../../utils/commonUtils";
import CommentReviewsSectionModal from "./modal/CommentReviewsSectionModal";
import noImageAvailable from "../../../images/no_img_posted.png"
import CommonLoader from "../../common/components/CommonLoader";
import {useDispatch, useSelector} from "react-redux";
import {getPostPageInfoAction} from "../../../app/actions/postActions/postActions";

const Review = () => {

    const [baseSearchQuery, setBaseSearchQuery] = useState({pageNum: 0});
    const {
        isLoading,
        isError,
        error,
        results,
        hasNextPage
    } = usePosts(baseSearchQuery?.pageNum, baseSearchQuery?.socialMediaType);
    const [isOpenCommentReviewsSectionModal, setOpenCommentReviewsSectionModal] = useState(false);
    const [postData, setPostData] = useState(null);
    const dispatch = useDispatch();
    const postPageInfoData = useSelector((state) => state.post.getPostPageInfoReducer.data);

    console.log("@@@ results ", results);


    useEffect(() => {
        if (postData && postData != undefined) {
            const requestBody = {
                postIds: [postData?.id],
                pageAccessToken: postData?.page?.access_token
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
                                        return (<option value={cur}>{SocialAccountProvider[cur]}</option>)
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

                                    <tbody>

                                    {results?.map((post, index) => (

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
                                    ))}

                                    </tbody>

                                </table>

                            </div>

                            <div className={"m-auto mt-5"}>
                                {isLoading && <CommonLoader/>}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    isOpenCommentReviewsSectionModal &&
                    <CommentReviewsSectionModal isOpenCommentReviewsSectionModal={isOpenCommentReviewsSectionModal}
                                                setOpenCommentReviewsSectionModal={setOpenCommentReviewsSectionModal}
                                                postData={postData} postPageInfoData={postPageInfoData}/>
                }
            </section>
        </>
    )
}
export default Review