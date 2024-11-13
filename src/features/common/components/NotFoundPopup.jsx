import React  from "react";
import {RxCross2} from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import No_page_connect_img from "../../../images/no_business_account.svg?react";

const NotFoundPopup = ({show, setShow,isInstagramGuideModal=false,setShowInstagramGuideModal}) => {

    const handleClose = () => {
        setShow(false);
        isInstagramGuideModal && setShowInstagramGuideModal(false);
    }

    return (
        <section className="facebook_modal_outer">
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                className="choose_page_outer notfound_popup"
                centered
            >
                <div
                    className="pop_up_cross_icon_outer  cursor-pointer"
                    onClick={handleClose}
                >
                    <RxCross2 className="pop_up_cross_icon"/>
                </div>
                <Modal.Body className="pt-0 cmn_body">
                    <div className="facebook_content_outer">
                        <div className="">
                            <div className="text-center pt-5">
                                <No_page_connect_img
                                    className="no_page_connect_img"
                                />
                                <h2 className="disconnect_title">
                                    Business Page/Account not found.
                                </h2>
                                <p className="disconnect_paragraph">
                                    It looks like there's no business account yet. Kindly create
                                    one or connect an existing account.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="cmn_connect_btn connect_btn connect_btn disconected_btn mt-4"
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default NotFoundPopup;
