import {useEffect, useRef, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {RxCross2} from "react-icons/rx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {FaChevronLeft} from "react-icons/fa6";
import {FaChevronRight} from "react-icons/fa6";
import FacebookFeedPreview from "../../common/components/FacebookFeedPreview";
import { isNullOrEmpty} from "../../../utils/commonUtils";
import {useGetPostDataWithInsightsQuery, useGetPostInsightsQuery} from "../../../app/apis/insightApi";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";


function PostViewModal({setShowPostPreview, showPostPreview, postToPreview}) {

    const [insights, setInsights] = useState(null)
    const [fetchInsightsFor, setFetchInsightsFor] = useState(null)
    const sliderRef = useRef(null);
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
    };

    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const insightsApi2 = useGetPostDataWithInsightsQuery({
        socialMediaType: fetchInsightsFor?.socialMediaType,
        pageAccessToken: fetchInsightsFor?.postPage?.accessToken,
        pageId: fetchInsightsFor?.postPage?.pageId,
        postIds: [fetchInsightsFor?.postPage?.socialMediaPostId]
    }, {skip: isNullOrEmpty(fetchInsightsFor)})
    const insightsApi = useGetPostInsightsQuery({
        socialMediaType: fetchInsightsFor?.socialMediaType,
        pageAccessToken: fetchInsightsFor?.postPage?.accessToken,
        pageId: fetchInsightsFor?.postPage?.pageId,
        postIds: [fetchInsightsFor?.postPage?.socialMediaPostId]
    }, {skip: isNullOrEmpty(fetchInsightsFor)})

    useEffect(() => {
        if (Array.isArray(postToPreview) && !isNullOrEmpty(postToPreview)) {
            const getInsightsFor = postToPreview?.[0]
            const pageAccessToken = getAllConnectedPagesApi?.data?.find(cur => cur.pageId === getInsightsFor.postPage.pageId)
            setFetchInsightsFor({
                ...getInsightsFor,
                postPage: {...getInsightsFor.postPage, accessToken: pageAccessToken.access_token}
            })
        }
    }, [postToPreview]);

    const nextSlide = () => {
        sliderRef.current.slickNext();
    };
    const prevSlide = () => {
        sliderRef.current.slickPrev();
    };
    const handleClose = () => setShowPostPreview(false);

    console.log("postToPreview=====>", postToPreview)
    console.log("fetchInsightsFor====>", fetchInsightsFor)
    console.log("getAllConnectedPagesApi====>", getAllConnectedPagesApi)
    console.log("insightsApi====>", insightsApi)

    return (
        <>
            <Modal
                size="md"
                show={showPostPreview}
                onHide={handleClose}
                className="viewPost"
                centered
            >
                <div
                    className="pop_up_cross_icon_outer  cursor-pointer"
                    onClick={handleClose}
                >
                    <RxCross2 className="pop_up_cross_icon"/>
                </div>
                <Modal.Body className="individual_post_content">
                    <div className="slider-container">
                        {/* Custom prev and next buttons */}
                        <FaChevronLeft
                            size={24}
                            className="slick_btn"
                            onClick={prevSlide}
                        />
                        <Slider {...settings} ref={sliderRef}>
                            {
                                postToPreview?.map(post => {
                                    const index = post.message.indexOf('#');
                                    const caption = index !== -1 ? post.message.slice(0, index).trim() : post.message;
                                    const hashtags = index !== -1 ? post.message.slice(index).trim() : '';
                                    return (
                                        <div className="post_perview_card">
                                            {
                                                post.socialMediaType === "FACEBOOK" &&
                                                <FacebookFeedPreview
                                                    feedPostDate={post.feedPostDate}
                                                    previewTitle={"Facebook Post Preview"}
                                                    pageName={post.postPage.pageName}
                                                    files={post?.attachments}
                                                    selectedFileType={post?.attachments?.[0]?.mediaType}
                                                    caption={caption}
                                                    pageImage={post.postPage.imageURL}
                                                    hashTag={hashtags}
                                                />
                                            }
                                            {
                                                post.socialMediaType === "INSTAGRAM" &&
                                                <FacebookFeedPreview
                                                    previewTitle={"Instagram Post Preview"}
                                                    pageName={"test"}
                                                    userData={"test"}
                                                    files={[0]}
                                                    selectedFileType={"test"}
                                                    caption={"test"}
                                                    pageImage={"test"}
                                                    hashTag={"test"}
                                                />
                                            }
                                            {
                                                post.socialMediaType === "PINTEREST" &&
                                                <FacebookFeedPreview
                                                    previewTitle={"Pinterest Post Preview"}
                                                    pageName={"test"}
                                                    userData={"test"}
                                                    files={[0]}
                                                    selectedFileType={"test"}
                                                    caption={"test"}
                                                    pageImage={"test"}
                                                    hashTag={"test"}
                                                />
                                            }
                                            {
                                                post.socialMediaType === "LINKEDIN" &&
                                                <FacebookFeedPreview
                                                    previewTitle={"Linkedin Post Preview"}
                                                    pageName={"test"}
                                                    userData={"test"}
                                                    files={[0]}
                                                    selectedFileType={"test"}
                                                    caption={"test"}
                                                    pageImage={"test"}
                                                    hashTag={"test"}
                                                />
                                            }


                                        </div>
                                    );
                                })
                            }
                        </Slider>

                        <FaChevronRight
                            className="slick_btn next_slide"
                            size={24}
                            onClick={nextSlide}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PostViewModal;
