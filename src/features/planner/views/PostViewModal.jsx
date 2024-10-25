import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RxCross2 } from "react-icons/rx";
import CommonFeedPreview from "../../common/components/CommonFeedPreview";
function PostViewModal({ setShowPostPerview, showPostPerview }) {
  const handleClose = () => setShowPostPerview(false);

  return (
    <>
    
        <Modal
          size="lg"
          show={showPostPerview}
          onHide={handleClose}
          className="alert_modal_body"
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
            {/* <CommonFeedPreview/> */}
          </Modal.Body>
        </Modal>
    
    </>
  );
}

export default PostViewModal;
