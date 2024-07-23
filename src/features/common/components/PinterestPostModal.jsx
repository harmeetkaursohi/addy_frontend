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
function PinterestPostModal() {

  const [show1, setShow1] = useState(false);

  const handleClose = () => setShow1(false);
  const handleShow = () => setShow1(true);

  return (
    <>
      <div className="individual_post_modal_wrapper pinterest_post_modal_container">
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
            
          
          </div>
          <Modal.Body className="pinterest_post_body_content">
            <img src={men_img} className="individual_post_image"/>
        
            <div className="pinterest_post_header">
              <div className="individual_post_info_outer d-flex align-items-center gap-3">
                <img src={men_img} height={"40px"} width={"40px"} />
                <h3 className="cmn_text_style">Username</h3>
              </div>
              <div className={"" }>
              <h4 className="cmn_text_style pinterest_post_heading">Lorem ipsum dolor sit amet consectetur. Proin dolor quam.</h4>
              </div>
           <div className="visit_btn_outer text-center">
            <button className="visit_btn me-4 mt-3">Visit</button>
            <button className="pinterest_save_btn">Save</button>

           </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default PinterestPostModal;
