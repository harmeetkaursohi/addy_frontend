import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RiDeleteBin7Line } from "react-icons/ri";
import like_img from "../../../images/like.svg";
import comment_img from "../../../images/comment.svg";
import save_img from "../../../images/save.svg";
import send_img from "../../../images/send_img.svg";
import men_img from "../../../images/men.png";
import "./common.css";
import { RxCross2 } from "react-icons/rx";
import { FiThumbsUp } from "react-icons/fi";
import { FaRegComment, FaRegCommentDots } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import"./common.css"
import { BiRepost } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import { SlLike } from "react-icons/sl";
import repost_icon from "../../../images/repost.svg"
function LinkedinPostModal() {

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
          <Modal.Body className="individual_post_content linkedin_post_modal_container">
            <img src={men_img} className="individual_post_image"/>
            <div className="like_comment_outer">
            <div className="post_modal_like_outer">
                    <SlLike className="thumbsup_icon"/>
                        
                        <h3 className="cmn_text_style">Like</h3>
                    </div>
                    <div className="post_modal_like_outer">
                    <FaRegCommentDots />
                        <h3 className="cmn_text_style">Comment</h3>
                    </div>
                    <div className="post_modal_like_outer">
                        <img src={repost_icon} height="16px" width="16px"/>
                        <h3 className="cmn_text_style">Repost</h3>
                    </div>
                    <div className="post_modal_like_outer">                        
                        <IoIosSend size={20}/>
                        <h3 className="cmn_text_style">Send</h3>
                    </div>
              
            </div>
           
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default LinkedinPostModal;
