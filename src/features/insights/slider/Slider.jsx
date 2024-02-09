import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import nature_img from "../../../images/nature.png";
import calender_icon from "../../../images/calender_icon2.svg";
import Slider from "react-slick";
import "./slider.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFormattedPostDataForSlider,
  getFormattedPostTime,
} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";
import { useEffect, useRef, useState } from "react";
import CommonSlider from "../../common/components/CommonSlider";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import { getPostByPageIdAndPostStatus } from "../../../app/actions/postActions/postActions";
import { getToken } from "../../../app/auth/auth";
import Container from "react-bootstrap/Container";

/* function Carousel({selectedPage}) {
    const dispatch = useDispatch();
    const token = getToken();
    const getPostDataWithInsightsData = useSelector(state => state.insight.getPostDataWithInsightsReducer);
    const getPostByPageIdAndPostStatusData = useSelector(state => state.post.getPostByPageIdAndPostStatusReducer);
    const [hasPosts, setHasPosts] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(null)
    let sliderRef = useRef(null);

    const next = () => {
        console.log("sliderRef====>",sliderRef)

        sliderRef.slickGoTo(2);
        sliderRef.slickNext();
    };

    const previous = () => {
        console.log("sliderRef====>",sliderRef)
        sliderRef.slickPrev();
    };


    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        // slidesToShow: Object?.keys(getPostDataWithInsightsData?.data || {})?.length < 3 ? Object.keys(getPostDataWithInsightsData?.data || {})?.length : 3,
        slidesToShow:1,
        slidesToScroll: 1,
        afterChange: (current) => {setCurrentSlide(current)},
        arrows: false,
    };

    console.log("settings====>",settings)


    useEffect(() => {
        if (getPostByPageIdAndPostStatusData?.data !== null && getPostByPageIdAndPostStatusData?.data !== undefined) {
            if (Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length === 0) {
                setHasPosts(false)
            }
            if (Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length > 0) {
                setHasPosts(true)
                setCurrentSlide(0);
            }
        }
    }, [getPostByPageIdAndPostStatusData])

    useEffect(() => {
        if (currentSlide !== null) {
            console.log("hit the api", currentSlide)
        }

    }, [currentSlide])


    return (
        <div className="slider_outer_container content_outer">
            {
                getPostDataWithInsightsData?.loading ? <CommonLoader></CommonLoader> :
                    hasPosts === false ?
                        <div className={"text-center select-account-txt"}>No posts to display</div> :
                        <>
                            <button disabled={getPostByPageIdAndPostStatusData?.loading}
                                    className="slider_btn previousSliderButton" onClick={previous}>
                                <FaLessThan/>
                            </button>
                            <button disabled={getPostByPageIdAndPostStatusData?.loading}
                                    className="slider_btn  nextSliderButton" onClick={next}>
                                <FaGreaterThan/>
                            </button>
                            <Slider ref={slider => {
                                sliderRef = slider;
                            }} {...settings}>
                                {
                                    Object.keys(getPostDataWithInsightsData?.data || {})?.length > 0 && Object.keys(getPostDataWithInsightsData?.data)?.map((key, index) => {
                                        const formattedData = getFormattedPostDataForSlider(getPostDataWithInsightsData?.data[key], selectedPage?.socialMediaType)
                                        console.log("formattedData==>", formattedData, selectedPage?.socialMediaType)
                                        return (
                                            <div className="caresoul_wrapper_box" key={index}>
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
                                                                            <h4 className="cmn_small_heading">{index+1}. Account
                                                                                Reach</h4>
                                                                            <h3>{formattedData?.account_reach}</h3>
                                                                        </li>
                                                                        <li>
                                                                            <h4 className="cmn_small_heading">Total
                                                                                Likes</h4>
                                                                            <h3>{formattedData?.total_like}</h3>
                                                                        </li>
                                                                        <li>
                                                                            <h4 className="cmn_small_heading">Total
                                                                                Comments</h4>
                                                                            <h3>{formattedData?.total_comment}</h3>
                                                                        </li>
                                                                        {
                                                                            selectedPage?.socialMediaType === "PINTEREST" ?
                                                                                <li>
                                                                                    <h4 className="cmn_small_heading">Total
                                                                                        Save</h4>
                                                                                    <h3>{formattedData?.total_save}</h3>
                                                                                </li> :
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
                                                    </div>


                                                </div>
                                            </div>
                                        );
                                    })
                                }

                            </Slider>
                        </>
            }

        </div>
    );
} */

function Carousel({ selectedPage }) {
  const dispatch = useDispatch();
  const token = getToken();
  const getPostDataWithInsightsData = useSelector(
    (state) => state.insight.getPostDataWithInsightsReducer
  );
  const getPostByPageIdAndPostStatusData = useSelector(
    (state) => state.post.getPostByPageIdAndPostStatusReducer
  );
  const [hasPosts, setHasPosts] = useState(null);
  const [insightsCache, setInsightsCache] = useState({});


  useEffect(() => {
    if (
      getPostByPageIdAndPostStatusData?.data !== null &&
      getPostByPageIdAndPostStatusData?.data !== undefined
    ) {
      if (
        Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length === 0
      ) {
        setHasPosts(false);
      }
      if (
        Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length > 0
      ) {
        setHasPosts(true);
        setInsightsCache((prevCache) => ({
            ...prevCache,
            [getPostByPageIdAndPostStatusData?.data?.paging?.pageNumber]:
              getPostByPageIdAndPostStatusData.data,
        }));
      }
    }
  }, [getPostByPageIdAndPostStatusData]);  
 

  useEffect(function(){
    setInsightsCache({})
  },[selectedPage])
  const next = () => {
    const nextPageNumber = parseInt(getPostByPageIdAndPostStatusData?.data?.paging?.pageNumber) + 1;
    dispatch(
        getPostByPageIdAndPostStatus({
        token: token,
        insightPostsCache:insightsCache[nextPageNumber],
        requestBody: {
            postStatuses: ["PUBLISHED"],
            pageIds: [selectedPage?.pageId],
            pageSize: 1,
            pageNumber:nextPageNumber,
        },
        })
    );        
  };
  const previous = () => {
    const prevPageNumber = parseInt(getPostByPageIdAndPostStatusData?.data?.paging?.pageNumber) - 1;
    dispatch(
      getPostByPageIdAndPostStatus({
        token: token,
        insightPostsCache:insightsCache[prevPageNumber],
        requestBody: {
          postStatuses: ["PUBLISHED"],
          pageIds: [selectedPage?.pageId],
          pageSize: 1,
          pageNumber:prevPageNumber
        },
      })
    );
  };

  const DisplayPosts = function () {
    return (
      <>
        <button
          disabled={
            getPostByPageIdAndPostStatusData?.loading ||
            getPostByPageIdAndPostStatusData?.data?.paging?.pageNumber === 0
          }
          className="slider_btn previousSliderButton"
          onClick={previous}
        >
          <FaLessThan />
        </button>
        <button
          disabled={
            getPostByPageIdAndPostStatusData?.loading ||
            getPostByPageIdAndPostStatusData?.data?.paging?.lastPage
          }
          className="slider_btn  nextSliderButton"
          onClick={next}
        >
          <FaGreaterThan />
        </button>
        <Row className="justify-content-center">
          {Object.keys(getPostDataWithInsightsData?.data || {})?.length > 0 &&
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
                              <img src={calender_icon} className="me-1  ms-2" />
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
                              {index + 1}. Account Reach
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
        </Row>
      </>
    );
  };
  return (
    <div className="slider_outer_container content_outer">
      {getPostDataWithInsightsData?.loading ? (
        <CommonLoader></CommonLoader>
      ) : hasPosts === false ? (
        <div className={"text-center select-account-txt"}>
          No posts to display
        </div>
      ) : (
        <DisplayPosts />
      )}
    </div>
  );
}
export default Carousel;
