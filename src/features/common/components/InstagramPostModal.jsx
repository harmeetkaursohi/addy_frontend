import {useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import like_img from "../../../images/like.svg";
import comment_img from "../../../images/comment.svg";
import save_img from "../../../images/save.svg";
import send_img from "../../../images/send_img.svg";
import men_img from "../../../images/men.png";
import "./common.css";
import {RxCross2} from "react-icons/rx";
import { Image } from "react-bootstrap";
function InstagramPostModal({show, setShow, data}) {
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
                            <RxCross2 onClick={handleClose}/>
                        </div>
                        <div className="individual_post_header">
                            <div className="individual_post_info_outer d-flex align-items-center gap-3">
                                <Image src={men_img} alt="men image" height={"40px"} width={"40px"}/>
                                <h3 className="cmn_text_style">Username</h3>
                            </div>

                        </div>
                    </div>
                    <Modal.Body className="individual_post_content">
                        <Image src={men_img} alt="men image" className="individual_post_image"/>
                        <div className="like_comment_outer instagram_like">
                            <div className="flex-grow-1">
                                <Image src={like_img} alt="like image"/>
                                <Image src={comment_img} alt="comment image" className=" ms-4 me-4"/>
                                <Image src={send_img} alt="send_image"/>
                            </div>
                            <div>
                                <Image src={save_img} alt="save image"/>
                            </div>
                        </div>
                        <div className={""}>
                            <h2 className="cmn_text_style">John Malik</h2>
                            <p>Lorem ipsum dolor sit amet consectetur. Proin dolor quam.</p>
                            <span className="highlight cursor-pointer"> #cool #new #post</span>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}

export default InstagramPostModal;
