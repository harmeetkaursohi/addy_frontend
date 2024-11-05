import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RxCross2 } from "react-icons/rx";
import { BsPencil } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import FacebookFeedPreview from "../../common/components/FacebookFeedPreview";
function PostViewModal({ setShowPostPerview, showPostPerview,userId }) {
    console.log(userId,"userId")
  const handleClose = () => setShowPostPerview(false);

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
            <FacebookFeedPreview
            previewTitle={"test"} pageName={"test"} 
            userData={"test"} files={[0,1]} selectedFileType={"test"} caption={"test"} pageImage={"test"}hashTag={"test"}
            
            />
          {/* <div className="social_media_card">
            <h2>Instagram Post Preview</h2>
            <div className="social_header">
              <div className="user_image">
                <img src="" alt="" />
              </div>
              <div className="social_info">
                <h4>Team Musafirrr</h4>
                <p>
                  just now <span className="status_media"></span>
                </p>
              </div>
              <button className="social_nav_btn">
                <BsPencil />
              </button>
              <button className="social_nav_btn">
                <FaTrash />
              </button>
            </div>
            <div className="post_image_perview">
              <img src="" alt="" />
            </div>
            <div className="like_comment_outer">
              <div className="fb_likes">
                <FiThumbsUp />
                <h3 className="cmn_text_style">Likes</h3>
              </div>
              <div className="fb_likes">
                <FaRegComment className="fb_cmt_icon" />
                <h3 className="cmn_text_style">Comment</h3>
              </div>
              <div className="fb_likes">
                <PiShareFat />
                <h3 className="cmn_text_style">Share</h3>
              </div>
            </div>
          </div> */}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PostViewModal;
