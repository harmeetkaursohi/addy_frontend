import React from "react";
import {RxCross2} from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import attention from "../../../images/attention.svg";
import {Image} from "react-bootstrap";
import GenericButtonWithLoader from "./GenericButtonWithLoader";
import jsondata from "../../../locales/data/initialdata.json";

const PostNowModal = ({
                          show,
                          setShow,
                          onSubmit,
                          isOnSubmitRunning
                      }) => {


    const handleClose = () => setShow(false);

    return (
        <section className="facebook_modal_outer">
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                className="choose_page_outer notfound_popup instaGuide"
                centered
            >
                <div
                    className="pop_up_cross_icon_outer  cursor-pointer"
                    onClick={handleClose}
                >
                    <RxCross2 className="pop_up_cross_icon"/>
                </div>
                <Modal.Body className="pt-0 cmn_body">
                    <div className="">
                        <div className="">
                            <div className="text-center pt-3">
                                <Image src={attention} alt="facebook authorizes image"/>
                                <div className="facebook_content_outer">
                                    <h2 className="disconnect_title">
                                        Are you sure?
                                    </h2>
                                    <p className="disconnect_paragraph">
                                        You want to publish this post now?
                                    </p>
                                </div>
                                <div className="confirm_btn ">

                                    <GenericButtonWithLoader
                                        label={"Back"}
                                        onClick={handleClose}
                                        className={"cmn_modal_cancelbtn"}
                                    />

                                    <GenericButtonWithLoader
                                        label={"Yes"}
                                        onClick={onSubmit }
                                        isDisabled={isOnSubmitRunning }
                                        className={"cmn_btn_color cmn_connect_btn yes_btn"}
                                        isLoading={isOnSubmitRunning}
                                    />


                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default PostNowModal;
