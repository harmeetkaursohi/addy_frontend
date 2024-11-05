import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { RxCross2 } from "react-icons/rx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

import FacebookFeedPreview from "../../common/components/FacebookFeedPreview";
function PostViewModal({ setShowPostPerview, showPostPerview, userId }) {
  console.log(userId, "userId");
  const handleClose = () => setShowPostPerview(false);
  const sliderRef = useRef(null);
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
  };
  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };
  return (
    <>
      <Modal
        size="md"
        show={showPostPerview}
        onHide={handleClose}
        className="viewPost"
        centered
      >
        <div
          className="pop_up_cross_icon_outer  cursor-pointer"
          onClick={(e) => {
            handleClose();
          }}
        >
          <RxCross2 className="pop_up_cross_icon" />
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
              <div className="post_perview_card">
                <FacebookFeedPreview
                  previewTitle={"test"}
                  pageName={"test"}
                  userData={"test"}
                  files={[0]}
                  selectedFileType={"test"}
                  caption={"test"}
                  pageImage={"test"}
                  hashTag={"test"}
                />
              </div>
              <div className="post_perview_card">
                <FacebookFeedPreview
                  previewTitle={"test"}
                  pageName={"test"}
                  userData={"test"}
                  files={[0]}
                  selectedFileType={"test"}
                  caption={"test"}
                  pageImage={"test"}
                  hashTag={"test"}
                />
              </div>
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
