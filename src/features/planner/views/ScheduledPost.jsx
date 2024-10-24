import React, {useEffect, useState} from 'react'
import './schedule.css'
import {GoChevronLeft} from "react-icons/go";
import {GoChevronRight} from "react-icons/go";
import {formatDate, getNextDate, getPreviousDate, isFirstDayOfMonth, isLastDayOfMonth} from "../../../utils/dateUtils";
import {
    computeImageURL,
    getEmptyArrayOfSize, handleSeparateCaptionHashtag,
    isNullOrEmpty,
    isPlannerPostEditable,
    sortByKey
} from "../../../utils/commonUtils";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {useGetSocialMediaPostsByCriteriaQuery} from "../../../app/apis/postApi";
import CommonSlider from "../../common/components/CommonSlider";
import {Image} from "react-bootstrap";
import default_user_icon from "../../../images/default_user_icon.svg";
import {RiDeleteBin7Line} from "react-icons/ri";

const ScheduledPost = ({selectedDate, setSelectedDate, selectedSocialMediaTypes, plannerPosts}) => {

    const [searchQuery, setSearchQuery] = useState({
        postStatus: ["PUBLISHED", "SCHEDULED"],
        batchIds: [],
        plannerCardDate: null,
        socialMediaTypes: [],
        period: "DAY"
    });
    const [posts, setPosts] = useState([]);
    const [forceRender, setForceRender] = useState(null);

    const postsApi = useGetSocialMediaPostsByCriteriaQuery(searchQuery, {skip: isNullOrEmpty(searchQuery?.batchIds) || isNullOrEmpty(searchQuery?.plannerCardDate)})

    useEffect(() => {
        setPosts([])
    }, [selectedDate,selectedSocialMediaTypes]);

    useEffect(() => {
        if (selectedDate && !plannerPosts?.isLoading && !plannerPosts?.isFetching && plannerPosts?.data && !postsApi?.isLoading && !postsApi?.isFetching) {
            const targetDate = formatDate(selectedDate, "ISOString");
            if (!isNullOrEmpty(plannerPosts?.data[targetDate])) {
                const plannerPostList = {};
                const batchIdList = [];

                Object.keys(plannerPosts?.data)?.filter((key) => {
                    const datePart = key.substring(0, 10);
                    if (datePart === targetDate.substring(0, 10)) {
                        plannerPostList.plannerPostData = plannerPosts.data[key]
                    }
                })
                Object.keys(plannerPostList.plannerPostData)?.map((batchId) => {
                    batchIdList.push(batchId);
                })
                setSearchQuery({
                    ...searchQuery,
                    batchIds: batchIdList,
                    plannerCardDate: targetDate,
                    socialMediaTypes: selectedSocialMediaTypes,
                })
                setForceRender(new Date().getMilliseconds())
            }
        }
    }, [selectedDate, plannerPosts])

    useEffect(() => {
        if (forceRender && postsApi?.data && !postsApi?.isLoading && !postsApi?.isFetching) {
            setPosts(Object.values(postsApi?.data ))
        }
    }, [postsApi,forceRender])

    const handlePreviousDay=()=>{
        if(plannerPosts?.isLoading || plannerPosts?.isFetching || postsApi?.isLoading || postsApi?.isFetching || isFirstDayOfMonth(selectedDate)) return
        setSelectedDate(getPreviousDate(selectedDate))
    }
    const handleNextDay=()=>{
        if(plannerPosts?.isLoading || plannerPosts?.isFetching || postsApi?.isLoading || postsApi?.isFetching || isLastDayOfMonth(selectedDate)) return
        setSelectedDate(getNextDate(selectedDate))
    }

    return (
        <div className='scduler_outer'>
            <div className='schedule_header d-flex align-items-center justify-content-center'>
                <GoChevronLeft
                    className={(plannerPosts?.isLoading || plannerPosts?.isFetching || postsApi?.isLoading || postsApi?.isFetching || isFirstDayOfMonth(selectedDate) ) ?" opacity-25":" cursor-pointer"}
                    onClick={handlePreviousDay}
                    size={24}
                />
                <span>{formatDate(selectedDate, "ddd, dd MMM")}</span>
                <GoChevronRight
                    size={24}
                    className={(plannerPosts?.isLoading || plannerPosts?.isFetching || postsApi?.isLoading || postsApi?.isFetching || isLastDayOfMonth(selectedDate) ) ?" opacity-25":" cursor-pointer"}
                    onClick={handleNextDay}
                />
            </div>
            <div className='mt-4'>
                {
                    (plannerPosts?.isLoading || plannerPosts?.isFetching || postsApi?.isLoading || postsApi?.isFetching) &&
                    getEmptyArrayOfSize(3).map((_, i) => {
                        return <div className={"posts-loader-outer d-flex  mb-3 "}>
                            <div className="w-50">
                                <SkeletonEffect count={1} className={"planner-img-skeleton"}/>
                            </div>
                            <div className="w-50">
                                <SkeletonEffect count={1} className={"mb-4 w-75"}/>
                                <SkeletonEffect count={1} className={"w-25"}/>
                                <SkeletonEffect count={1} className={"mt-1 w-25"}/>
                            </div>
                        </div>
                    })
                }
                {
                    !plannerPosts?.isLoading && !plannerPosts?.isFetching && !postsApi?.isLoading && !postsApi?.isFetching && plannerPosts?.data && isNullOrEmpty(plannerPosts?.data[formatDate(selectedDate, "ISOString")]) &&
                    <div> No Post Available</div>
                }
                {
                    sortByKey(posts, "feedPostDate")?.map((plannerPost, index) => {
                        return <div className={"more_plans_grid mb-3 "} key={index}>
                            <div className="plan_grid_img">
                                {
                                    plannerPost?.attachments &&
                                    <CommonSlider files={plannerPost?.attachments}
                                                  selectedFileType={null} caption={null}
                                                  hashTag={null}
                                                  showThumbnail={true}
                                                  viewSimilarToSocialMedia={false}
                                                  enableShowPlannerModel={true}
                                    />
                                }
                            </div>
                            <div className="plan_grid_content">
                                <div className="plan_content_header justify-start ">
                                    <div className="plans_tags_wrapper ">
                                        <div className="d-flex page_tags position-absolute">
                                            {
                                                plannerPost?.postPages && Array.isArray(plannerPost?.postPages) &&
                                                plannerPost?.postPages.map((curPage, index) => {
                                                    return <div key={index} className={"planner_tag_container"}>
                                                        {
                                                            <div
                                                                className={`plan_tags ${curPage.socialMediaType.toLowerCase()}`}>
                                                                <div
                                                                    className="plan_tag_img position-relative">
                                                                    <Image
                                                                        className="plan_image"
                                                                        src={curPage?.imageURL || default_user_icon}
                                                                        alt="fb"/>
                                                                    <Image
                                                                        className="plan_social_img"
                                                                        src={computeImageURL(curPage?.socialMediaType)}
                                                                        alt="fb"/>

                                                                </div>
                                                                <p className="mb-0">{curPage?.pageName}</p>
                                                            </div>
                                                        }
                                                        {
                                                            curPage?.errorInfo?.isDeletedFromSocialMedia &&
                                                            <>
                                                                <div
                                                                    className={"post-deleted-tag"}> Deleted
                                                                    {
                                                                        !plannerPost?.postPages?.every(postPage => postPage?.errorInfo?.isDeletedFromSocialMedia) &&
                                                                        <RiDeleteBin7Line
                                                                            title={"Delete From Addy"}
                                                                            className={"cursor-pointer delete-from-addy-icon"}/>
                                                                    }

                                                                </div>
                                                            </>
                                                        }

                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="plan_grid_navigations d-flex mt-2">
                                        <button
                                            className={isPlannerPostEditable("EDIT", plannerPost) ? "" : "disable_more_plans_grid"}
                                            disabled={!isPlannerPostEditable("EDIT", plannerPost)}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/planner/post/${plannerPost?.id}`)
                                            }}>
                                            <i className="fa fa-pencil"
                                               aria-hidden="true"/>
                                        </button>
                                        <button
                                            className={isPlannerPostEditable("DELETE", plannerPost) ? "" : "disable_more_plans_grid"}
                                            disabled={!isPlannerPostEditable("DELETE", plannerPost)}
                                            >
                                            <i className="fa fa-trash"
                                               aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 mb-1">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.caption || "" : ""}</p>
                                <p className="hasTags">{plannerPost?.message !== null && plannerPost?.message !== "" ? handleSeparateCaptionHashtag(plannerPost?.message)?.hashtag || "" : ""}</p>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default ScheduledPost