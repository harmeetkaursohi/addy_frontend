import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "react-bootstrap/Card";
import calender_icon from "../../../images/calender_icon2.svg";
import "./slider.css";
import {
    concatenateString, getEmptyArrayOfSize,
    getFormattedPostTime, getValueOrDefault, isNullOrEmpty,
} from "../../../utils/commonUtils";
import {
    getFormattedPostDataForSlider,
} from "../../../utils/dataFormatterUtils";
import CommonSlider from "../../common/components/CommonSlider";
import {FaGreaterThan, FaLessThan} from "react-icons/fa";
import {ErrorFetchingPost, PostAlreadyDeleted, SocialAccountProvider} from "../../../utils/contantData";
import {useAppContext} from "../../common/components/AppProvider";
import {useGetPostByPageIdAndPostStatusQuery} from "../../../app/apis/postApi";
import {useGetPostDataWithInsightsQuery} from "../../../app/apis/insightApi";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";


const Carousel = ({selectedPage, postStackPageNumber, setPostStackPageNumber}) => {

    return (
        <div className="slider_outer_container ">
            <DisplayPosts
                postStackPageNumber={postStackPageNumber}
                setPostStackPageNumber={setPostStackPageNumber}
                selectedPage={selectedPage}
            />
        </div>
    );
}
export default Carousel;

const DisplayPosts = ({selectedPage, postStackPageNumber, setPostStackPageNumber}) => {

    const {sidebar, show_sidebar} = useAppContext();


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


    return (
        <>
            {
                !isNullOrEmpty(postByPageIdAndPostStatusApi?.data?.data?.[0]) &&
                <>
                    <button
                        disabled={postByPageIdAndPostStatusApi?.isLoading || postByPageIdAndPostStatusApi?.isFetching || postByPageIdAndPostStatusApi?.data?.pageNumber === 0}
                        className="slider_btn previousSliderButton"
                        onClick={() => {
                            setPostStackPageNumber(postStackPageNumber - 1)
                        }}
                    >
                        <FaLessThan/>
                    </button>
                    <button
                        disabled={postByPageIdAndPostStatusApi?.loading || postByPageIdAndPostStatusApi?.isFetching || postByPageIdAndPostStatusApi?.data?.isLast}
                        className="slider_btn  nextSliderButton"
                        onClick={() => {
                            setPostStackPageNumber(postStackPageNumber + 1)
                        }}
                    >
                        <FaGreaterThan/>
                    </button>
                </>
            }

            {
                (postDataWithInsightsApi?.isLoading || postDataWithInsightsApi?.isFetching || postByPageIdAndPostStatusApi?.isLoading || postByPageIdAndPostStatusApi?.isFetching) ?
                    <div className="row">
                        {
                            getEmptyArrayOfSize(3).map((_, i) => {
                                return <div key={i} className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}>
                                    <Card className="card_body_content">
                                        <Card.Body className="p-0">
                                            <div className="caresoul_inner_content_outer">
                                                <SkeletonEffect className={"post-stack-image-loader"} count={1}/>

                                            </div>
                                            <ul className="top_city_list acountReach_content_container mt-2">
                                                <li>
                                                    <h4 className="cmn_small_heading">
                                                        Account Reach
                                                    </h4>
                                                    <h3 className={"w-25"}><SkeletonEffect count={1}/></h3>
                                                </li>
                                                <li>
                                                    <h4 className="cmn_small_heading">Total Likes</h4>
                                                    <h3 className={"w-25"}><SkeletonEffect count={1}/></h3>
                                                </li>
                                                <li>
                                                    <h4 className="cmn_small_heading">
                                                        Total Comments
                                                    </h4>
                                                    <h3 className={"w-25"}><SkeletonEffect count={1}/></h3>
                                                </li>
                                                {
                                                    selectedPage?.socialMediaType === "PINTEREST" ?
                                                        <li>
                                                            <h4 className="cmn_small_heading">Total
                                                                Save</h4>
                                                            <h3 className={"w-25"}><SkeletonEffect count={1}/></h3>
                                                        </li>
                                                        :
                                                        <li>
                                                            <h4 className="cmn_small_heading">Total
                                                                Share</h4>
                                                            <h3 className={"w-25"}><SkeletonEffect count={1}/></h3>
                                                        </li>
                                                }
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

                                Object.keys(postDataWithInsightsApi?.data)?.length > 0 &&
                                Object.keys(postDataWithInsightsApi?.data || {})?.map(
                                    (key, index) => {
                                        const formattedData = getFormattedPostDataForSlider(
                                            postDataWithInsightsApi?.data?.[key],
                                            selectedPage?.socialMediaType
                                        );
                                        const deletedPostData = formattedData?.hasError ? postByPageIdAndPostStatusApi?.data?.data?.[0]?.[selectedPage?.pageId]?.filter(post => post?.postPageInfos[0]?.socialMediaPostId === key)[0] : {}
                                        return formattedData?.hasError ?
                                            <div
                                                className={sidebar ? "col-lg-4 col-md-6 col-sm-12" : "col-lg-4 col-md-12 col-sm-12"}
                                                key={key + "slide"}>
                                                <Card className="card_body_content deleted-post-from-socialMedia">
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
                                                                    <img src={calender_icon} className="me-1  ms-2"/>
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
                                                                <div className={"deleted-post-caption text-center "}>
                                                                    {concatenateString(getValueOrDefault(deletedPostData?.pinTitle, ""), 100)}
                                                                </div>
                                                            }
                                                            <div className={"deleted-post-caption text-center mt-1"}>
                                                                {concatenateString(getValueOrDefault(deletedPostData?.caption, "") + " " + getValueOrDefault(deletedPostData?.hashtag, ""), 100)}
                                                            </div>
                                                            <div
                                                                className={"deleted-post-error-message text-center mt-3"}>
                                                                {formattedData?.errorInfo?.isDeletedFromSocialMedia ? PostAlreadyDeleted : ErrorFetchingPost}
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div> :
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
                                                        <ul className="top_city_list acountReach_content_container">
                                                            <li>
                                                                <h4 className="cmn_small_heading">
                                                                    Account Reach
                                                                </h4>
                                                                <h3>{formattedData?.account_reach}</h3>
                                                            </li>
                                                            <li>
                                                                <h4 className="cmn_small_heading">Total Likes</h4>
                                                                <h3>{formattedData?.total_like}</h3>
                                                            </li>
                                                            <li>
                                                                <h4 className="cmn_small_heading">
                                                                    Total Comments
                                                                </h4>
                                                                <h3>{formattedData?.total_comment}</h3>
                                                            </li>
                                                            {
                                                                selectedPage?.socialMediaType === "PINTEREST" ?
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Total
                                                                            Save</h4>
                                                                        <h3>{formattedData?.total_save}</h3>
                                                                    </li>
                                                                    :
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Total
                                                                            Share</h4>
                                                                        <h3>{formattedData?.total_share}</h3>
                                                                    </li>
                                                            }
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            </div>

                                    }
                                )}
                        </div>
            }
        </>
    );
};
