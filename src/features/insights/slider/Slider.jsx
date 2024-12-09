import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "react-bootstrap/Card";
import calender_icon from "../../../images/calender_icon2.svg";
import Eye from "../../../images/eye.svg?react";
import Heart from "../../../images/heart.svg?react";
import Union from "../../../images/Union.svg?react";
import Save from "../../../images/Saveicon.svg?react";
import ShareIcon from "../../../images/ShareIcon.svg?react";

import "./slider.css";
import {
    concatenateString, getEmptyArrayOfSize,
    getFormattedPostTime, getValueOrDefault, isNullOrEmpty,
} from "../../../utils/commonUtils";
import {
    getFormattedPostDataForSlider,
} from "../../../utils/dataFormatterUtils";
import CommonSlider from "../../common/components/CommonSlider";
import {ErrorFetchingPost, PostAlreadyDeleted, SocialAccountProvider} from "../../../utils/contantData";
import {useAppContext} from "../../common/components/AppProvider";
import {useDeletePostPageInfoMutation, useGetPostByPageIdAndPostStatusQuery} from "../../../app/apis/postApi";
import {useGetPostDataWithInsightsQuery} from "../../../app/apis/insightApi";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {LuChevronLeft} from "react-icons/lu";
import {LuChevronRight} from "react-icons/lu";
import React, {useEffect} from "react";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";
import {useDispatch} from "react-redux";


const Carousel = ({selectedPage, postStackPageNumber, setPostStackPageNumber}) => {

    const {sidebar, show_sidebar} = useAppContext();
    const dispatch = useDispatch();

    const postByPageIdAndPostStatusApi = useGetPostByPageIdAndPostStatusQuery({
        postStatuses: ["PUBLISHED"],
        pageIds: [selectedPage?.pageId],
        pageSize: 3,
        pageNumber: postStackPageNumber
    }, {skip: isNullOrEmpty(selectedPage)})

    const postDataWithInsightsApi = useGetPostDataWithInsightsQuery({
        socialMediaType: selectedPage?.socialMediaType,
        pageAccessToken: selectedPage?.access_token,
        pageId: selectedPage?.pageId,
        postIds: postByPageIdAndPostStatusApi?.data?.data?.[0]?.[selectedPage?.pageId]?.map(post => post?.postPageInfos?.[0]?.socialMediaPostId)
    }, {skip: isNullOrEmpty(selectedPage) || isNullOrEmpty(postByPageIdAndPostStatusApi?.data) || postByPageIdAndPostStatusApi?.isLoading || postByPageIdAndPostStatusApi?.isFetching || isNullOrEmpty(postByPageIdAndPostStatusApi?.data?.data?.[0])})

    const [deletePostPageInfo, deletePostPageInfoApi] = useDeletePostPageInfoMutation();


    useEffect(() => {
        if (!postByPageIdAndPostStatusApi?.isLoading && !postByPageIdAndPostStatusApi?.isFetching && !postDataWithInsightsApi?.isLoading && !postDataWithInsightsApi?.isFetching && postDataWithInsightsApi?.data) {
            const posts = Object.values(postDataWithInsightsApi?.data || {})
            const deletedPostsSocialMediaPostIds = posts?.filter(post => post.hasOwnProperty("error") && post.error.isDeletedFromSocialMedia)?.map(cur => cur.id)
            if (!isNullOrEmpty(deletedPostsSocialMediaPostIds)) {
                let requestBody = {};
                postByPageIdAndPostStatusApi?.data?.data?.[0]?.[selectedPage?.pageId]?.forEach(post => {
                    if (deletedPostsSocialMediaPostIds.includes(post?.postPageInfos[0]?.socialMediaPostId)) {
                        requestBody = {
                            ...requestBody,
                            [post?.postPageInfos[0]?.postId]: [post?.postPageInfos[0]?.id]
                        }
                    }
                })
                handleDeletePostPageInfo(requestBody)
            }
        }


    }, [postDataWithInsightsApi])

    const handleDeletePostPageInfo = async (data) => {
        await handleRTKQuery(
            async () => {
                return await deletePostPageInfo(data).unwrap();
            },
            () => {
                dispatch(addyApi.util.invalidateTags(["getPostByPageIdAndPostStatusApi"]));
            }
        );
    }

    return (
        <div className="slider_outer_container mt-4">
            <div className={'d-flex justify-content-between'}>
                <div
                    className=" profile-visit-text"

                > Posts stacks
                </div>
                {
                    (isNullOrEmpty(postByPageIdAndPostStatusApi?.data?.data?.[0]) || Object?.keys(postByPageIdAndPostStatusApi?.data?.data?.[0] || {})?.length <4 ) && postByPageIdAndPostStatusApi?.data?.pageNumber === 0 ?
                        <></>
                        :
                        <div>
                            <button
                                disabled={postByPageIdAndPostStatusApi?.isLoading || postByPageIdAndPostStatusApi?.isFetching || deletePostPageInfoApi?.isLoading || postByPageIdAndPostStatusApi?.data?.pageNumber === 0}
                                className="slider_btn previousSliderButton"
                                onClick={() => {
                                    setPostStackPageNumber(postStackPageNumber - 1)
                                }}
                            >
                                <LuChevronLeft/>
                            </button>
                            <button
                                disabled={postByPageIdAndPostStatusApi?.loading || postByPageIdAndPostStatusApi?.isFetching || deletePostPageInfoApi?.isLoading || postByPageIdAndPostStatusApi?.data?.isLast}
                                className="slider_btn  nextSliderButton"
                                onClick={() => {
                                    setPostStackPageNumber(postStackPageNumber + 1)
                                }}
                            >
                                <LuChevronRight/>
                            </button>
                        </div>
                }
            </div>


            {
                ( postDataWithInsightsApi?.isLoading || postDataWithInsightsApi?.isFetching || postByPageIdAndPostStatusApi?.isLoading || postByPageIdAndPostStatusApi?.isFetching || deletePostPageInfoApi?.isLoading) ?
                    <div className="row">
                        {
                            getEmptyArrayOfSize(3).map((_, i) => {
                                return <div key={i}
                                            className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}>
                                    <Card className="card_body_content">
                                        <Card.Body className="p-0">
                                            <div className="caresoul_inner_content_outer">
                                                <SkeletonEffect className={"post-stack-image-loader"} count={1}/>

                                            </div>
                                            <ul className="top_city_list acountReach_content_container mt-2">
                                                <li>
                                                    <h3 className={"w-100"}><SkeletonEffect count={1}/></h3>
                                                </li>
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </div>
                            })
                        }
                    </div> :
                    isNullOrEmpty(postByPageIdAndPostStatusApi?.data?.data?.[0]) ?
                        <div className={"text-center select-account-txt mt-3"}>
                            No posts to display
                        </div> :
                        <div className="row">
                            {

                                Object.keys(postDataWithInsightsApi?.data || {})?.length > 0 && Object.keys(postDataWithInsightsApi?.data || {})?.map(
                                    (key, index) => {
                                        const formattedData = getFormattedPostDataForSlider(
                                            postDataWithInsightsApi?.data?.[key],
                                            selectedPage?.socialMediaType
                                        );
                                        const deletedPostData = formattedData?.hasError ? postByPageIdAndPostStatusApi?.data?.data?.[0]?.[selectedPage?.pageId]?.filter(post => post?.postPageInfos[0]?.socialMediaPostId === key)[0] : {}
                                        return <>
                                            {
                                                // Has Error but it is not deleted from social media
                                                formattedData?.hasError && !formattedData?.errorInfo?.isDeletedFromSocialMedia &&
                                                <div
                                                    className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}
                                                    key={key + "slide"}>
                                                    <Card
                                                        className="card_body_content deleted-post-from-socialMedia">
                                                        <Card.Body className="p-0">
                                                            <div className="caresoul_inner_content_outer">
                                                                <CommonSlider
                                                                    files={[]}
                                                                    selectedFileType={null}
                                                                    caption={null}
                                                                    hashTag={null}
                                                                    showThumbnail={false}
                                                                    isPublished={true}
                                                                    viewSimilarToSocialMedia={false}
                                                                />
                                                                <div className="date_Time_container">
                                                                    <div className={"insights-post-date-outer"}>
                                                                        <img src={calender_icon}
                                                                             className="me-1  ms-2"/>
                                                                        <div className={"post_date"}>
                                                                            {getFormattedPostTime(
                                                                                deletedPostData?.createdAt
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={"deleted-post-info-outer"}>
                                                                {
                                                                    deletedPostData?.postPageInfos?.[0]?.socialMediaType === SocialAccountProvider?.PINTEREST?.toUpperCase() &&
                                                                    <div
                                                                        className={"deleted-post-caption text-center "}>
                                                                        {concatenateString(getValueOrDefault(deletedPostData?.pinTitle, ""), 100)}
                                                                    </div>
                                                                }
                                                                <div
                                                                    className={"deleted-post-caption text-center mt-1"}>
                                                                    {concatenateString(getValueOrDefault(deletedPostData?.caption, "") + " " + getValueOrDefault(deletedPostData?.hashtag, ""), 100)}
                                                                </div>
                                                                <div
                                                                    className={"deleted-post-error-message text-center mt-3"}>
                                                                    {formattedData?.errorInfo?.isDeletedFromSocialMedia ? PostAlreadyDeleted : ErrorFetchingPost}
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            }
                                            {
                                                // Has no error
                                                !formattedData?.hasError &&
                                                <div
                                                    className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}
                                                    key={key + "slide"}>
                                                    <Card className="card_body_content">
                                                        <Card.Body className="p-0">
                                                            <div className="caresoul_inner_content_outer">
                                                                <CommonSlider
                                                                    files={formattedData?.attachments}
                                                                    selectedFileType={null}
                                                                    caption={null}
                                                                    hashTag={null}
                                                                    showThumbnail={false}
                                                                    isPublished={true}
                                                                    viewSimilarToSocialMedia={false}
                                                                />
                                                                <div className="date_Time_container">
                                                                    <div className={"insights-post-date-outer"}>
                                                                        <img src={calender_icon}
                                                                             className="me-1  ms-2"/>
                                                                        <div className={"post_date"}>
                                                                            {getFormattedPostTime(
                                                                                formattedData?.creation_time
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ul className="insights_data">
                                                                <li>
                                                                    <div className={"post-stack-data w-100 gap-2"}><Eye/>{formattedData?.account_reach}</div>
                                                                    <div className={"post-stack-data w-100 gap-2"}><Heart/>{formattedData?.total_like}</div>
                                                                    <div className={"post-stack-data w-100 gap-2"}><Union/>{formattedData?.total_comment}</div>
                                                                    {
                                                                        selectedPage?.socialMediaType === "PINTEREST" ?
                                                                            <div className={"post-stack-data w-100 gap-2"}><Save/>{formattedData?.total_save}
                                                                            </div> :
                                                                            <div className={"post-stack-data w-100 gap-2"}>
                                                                                <ShareIcon/>{formattedData?.total_share}
                                                                            </div>
                                                                    }

                                                                </li>
                                                            </ul>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            }


                                        </>

                                    }
                                )}
                        </div>
            }
        </div>
    );
}
export default Carousel;
