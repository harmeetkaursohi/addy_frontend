import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import nature_img from "../../../images/nature.png"
import calender_icon from "../../../images/calender_icon2.svg"
import Slider from "react-slick";
import "./slider.css"
import {useSelector} from "react-redux";
import {getFormattedPostDataForSlider, getFormattedPostTime} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import {useEffect, useState} from "react";
import CommonSlider from "../../common/components/CommonSlider";

function Carousel({selectedPage}) {
    const getPostDataWithInsightsData = useSelector(state => state.insight.getPostDataWithInsightsReducer);
    const getPostByPageIdAndPostStatusData = useSelector(state => state.post.getPostByPageIdAndPostStatusReducer);
    const [hasPosts, setHasPosts] = useState(null);

    console.log("getPostDataWithInsightsDatagetPostDataWithInsightsData", getPostDataWithInsightsData?.data)
    console.log("getPostByPageIdAndPostStatusDatagetPostByPageIdAndPostStatusData", getPostByPageIdAndPostStatusData?.data)
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: Object?.keys(getPostDataWithInsightsData?.data || {})?.length < 3 ? Object.keys(getPostDataWithInsightsData?.data || {})?.length : 3,
        slidesToScroll: 3,
        arrows: true
    };
    useEffect(() => {
        if (getPostByPageIdAndPostStatusData?.data !== null && getPostByPageIdAndPostStatusData?.data !== undefined) {
            if (Object.keys(getPostByPageIdAndPostStatusData?.data)?.length === 0) {
                setHasPosts(false)
            }
            if (Object.keys(getPostByPageIdAndPostStatusData?.data)?.length > 0) {
                setHasPosts(true)
            }

        }
    }, [getPostByPageIdAndPostStatusData])
    return (
        <div className="slider_outer_container content_outer">
            {
                getPostDataWithInsightsData?.loading ? <CommonLoader></CommonLoader> :
                    hasPosts === false ?
                        <div className={"text-center select-account-txt"}>No posts to display</div> :
                        <Slider {...settings}>
                            {
                                Object.keys(getPostDataWithInsightsData?.data || {})?.length > 0 && Object.keys(getPostDataWithInsightsData?.data)?.map(key => {
                                    const formattedData = getFormattedPostDataForSlider(getPostDataWithInsightsData?.data[key], selectedPage?.socialMediaType)
                                    return (
                                        <div className="caresoul_wrapper_box">
                                            <div className="">
                                                <div className="">
                                                    <div className="slider_innnerContent">


                                                        <Card className="card_body_content">

                                                            <Card.Body className="p-0">
                                                                <div className="caresoul_inner_content_outer">
                                                                    <CommonSlider files={formattedData?.attachments}
                                                                                  selectedFileType={null}
                                                                                  caption={null}
                                                                                  hashTag={null}
                                                                                  showThumbnail={false}
                                                                                  isPublished={true}
                                                                                  viewSimilarToSocialMedia={false}/>
                                                                    <div className="date_Time_container">
                                                                        <div className={"insights-post-date-outer"}>

                                                                            <img src={calender_icon}
                                                                                 className="me-1  ms-2"/>
                                                                            <div
                                                                                className={"post_date"}>{getFormattedPostTime(formattedData?.creation_time)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ul className="top_city_list acountReach_content_container">
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Account Reach</h4>
                                                                        <h3>{formattedData?.account_reach}</h3>
                                                                    </li>
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Total Likes</h4>
                                                                        <h3>{formattedData?.total_like}</h3>
                                                                    </li>
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Total
                                                                            Comments</h4>
                                                                        <h3>{formattedData?.total_comment}</h3>
                                                                    </li>
                                                                    <li>
                                                                        <h4 className="cmn_small_heading">Total Share</h4>
                                                                        <h3>{formattedData?.total_share}</h3>
                                                                    </li>
                                                                </ul>
                                                            </Card.Body>
                                                        </Card>

                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    );
                                })
                            }

                        </Slider>
            }

        </div>
    );
}

export default Carousel;
