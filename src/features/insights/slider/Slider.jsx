import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import calender_icon from "../../../images/calender_icon2.svg";
import "./slider.css";
import {useDispatch, useSelector} from "react-redux";
import {
    getFormattedPostDataForSlider,
    getFormattedPostTime,
} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import {useEffect, useRef, useState} from "react";
import CommonSlider from "../../common/components/CommonSlider";
import {FaGreaterThan, FaLessThan} from "react-icons/fa";
import {getPostByPageIdAndPostStatus} from "../../../app/actions/postActions/postActions";
import {getToken} from "../../../app/auth/auth";


const Carousel = ({selectedPage, cacheData}) => {

    return (
        <div className="slider_outer_container content_outer">
            <DisplayPosts selectedPage={selectedPage} insightsCache={cacheData}/>
        </div>
    );
}
export default Carousel;

const DisplayPosts = ({selectedPage, insightsCache}) => {
    const dispatch = useDispatch();
    const token = getToken();
    const getPostDataWithInsightsData = useSelector(state => state.insight.getPostDataWithInsightsReducer);
    const getPostByPageIdAndPostStatusData = useSelector(state => state.post.getPostByPageIdAndPostStatusReducer);
    const [hasPosts, setHasPosts] = useState(true);
    useEffect(() => {
        if (getPostByPageIdAndPostStatusData?.data?.data !== null && getPostByPageIdAndPostStatusData?.data?.data !== undefined) {
            setHasPosts(Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length > 0);
        }
    }, [getPostByPageIdAndPostStatusData]);


    const previous = () => {
        const prevPageNumber = parseInt(getPostByPageIdAndPostStatusData?.data?.pageNumber) - 1;
        dispatch(
            getPostByPageIdAndPostStatus({
                token: token,
                insightPostsCache: insightsCache,
                requestBody: {
                    postStatuses: ["PUBLISHED"],
                    pageIds: [selectedPage?.pageId],
                    pageSize: 3,
                    pageNumber: prevPageNumber
                },
            })
        );
    };
    const next = () => {
        const nextPageNumber = parseInt(getPostByPageIdAndPostStatusData?.data?.pageNumber) + 1;
        dispatch(
            getPostByPageIdAndPostStatus({
                token: token,
                insightPostsCache: insightsCache,
                requestBody: {
                    postStatuses: ["PUBLISHED"],
                    pageIds: [selectedPage?.pageId],
                    pageSize: 3,
                    pageNumber: nextPageNumber,
                },
            })
        );
    };
    return (
        <>
            {
                hasPosts  && <>
                    <button
                        disabled={
                            getPostByPageIdAndPostStatusData?.loading ||
                            getPostByPageIdAndPostStatusData?.data?.pageNumber === 0
                        }
                        className="slider_btn previousSliderButton"
                        onClick={previous}
                    >
                        <FaLessThan/>
                    </button>
                    <button
                        disabled={
                            getPostByPageIdAndPostStatusData?.loading ||
                            getPostByPageIdAndPostStatusData?.data?.isLast
                        }
                        className="slider_btn  nextSliderButton"
                        onClick={next}
                    >
                        <FaGreaterThan/>
                    </button>
                </>
            }
            {
                (getPostDataWithInsightsData?.loading || getPostByPageIdAndPostStatusData?.loading) ?
                    <CommonLoader></CommonLoader> :
                    Object.keys(getPostDataWithInsightsData?.data || {})?.length > 0 ?
                        <Row className="">
                            {

                                Object.keys(getPostDataWithInsightsData?.data)?.map(
                                    (key, index) => {
                                        const formattedData = getFormattedPostDataForSlider(
                                            getPostDataWithInsightsData?.data[key],
                                            selectedPage?.socialMediaType
                                        );
                                        return (
                                            <Col lg="4" md="6" sm="12" xs="12" key={key + "slide"}>
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
                                                                    <img src={calender_icon} className="me-1  ms-2"/>
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
                                                            {selectedPage?.socialMediaType === "PINTEREST" ? (
                                                                <li>
                                                                    <h4 className="cmn_small_heading">Total Save</h4>
                                                                    <h3>{formattedData?.total_save}</h3>
                                                                </li>
                                                            ) : (
                                                                <li>
                                                                    <h4 className="cmn_small_heading">Total Share</h4>
                                                                    <h3>{formattedData?.total_share}</h3>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    }
                                )}
                        </Row> :
                        <div className={"text-center select-account-txt"}>
                            No posts to display
                        </div>
            }
        </>
    );
};