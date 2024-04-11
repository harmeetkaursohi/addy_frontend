import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import men_img from "../../../images/men.png";
import "./common.css";
import { RxCross2 } from "react-icons/rx";
import { FiThumbsUp } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import"./common.css"
function FacebookPostModal() {

  const [show1, setShow1] = useState(false);

  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);

  return (
    <>
      <div className="individual_post_modal_wrapper">
        <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button>

        <Modal
          show={show1}
          onHide={handleClose}
          className="individual_post_modal_wrapper"
          centered 
          size="md"
        >
          <div className="position-relative">
            <div className="RxCross2_icon">
            <RxCross2 onClick={handleClose} />
            </div>
            
            <div className="individual_post_header">
              <div className="individual_post_info_outer d-flex align-items-center gap-3">
                <img src={men_img} height={"40px"} width={"40px"} />
                <h3 className="cmn_text_style">Username</h3>
              </div>
              <div className={"" }>
              <p>Lorem ipsum dolor sit amet consectetur. Proin dolor quam.</p>
               <span className="highlight cursor-pointer"> #cool #new #post</span>
              </div>
            </div>
          </div>
          <Modal.Body className="individual_post_content">
            <img src={men_img} className="individual_post_image"/>
            <div className="like_comment_outer">
                    <div className="d-flex align-items-center gap-2 facebook_post_modal_outer">
                        <FiThumbsUp/>
                        <h4 className="cmn_text_style">Likes</h4>
                    </div>
                    <div className="d-flex align-items-center gap-2 facebook_post_modal_outer">
                    <FaRegComment className="fb_cmt_icon"/>
                        <h4 className="cmn_text_style">Comment</h4>
                    </div>
                    <div className="d-flex align-items-center gap-2 facebook_post_modal_outer">
                        <PiShareFat/>
                        <h4 className="cmn_text_style">Share</h4>
                    </div>
              
              
            </div>
           
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default FacebookPostModal;
