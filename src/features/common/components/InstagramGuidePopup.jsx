import React, {useState} from "react";
import {RxCross2} from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import instaGuid from "../../../images/instaguid.png";
import FacebookAuthorizedModal from "./FacebookAuthorizedModal";
import { Image } from "react-bootstrap";
import SVGComponent from "../../allImages";
const InstagramGuidePopup = ({
                                 show,
                                 setShow,
                                 connectSocialAccountApi,
                                 setFacebookDropDown,
                                 setInstagramDropDown,
                                 setPinterestDropDown,
                                 setLinkedinDropDown,
                                 connectSocialMediaAccountToCustomer,
                                 props
                             }) => {

    const [showFacebookAuthorizedModal, setShowFacebookAuthorizedModal] = useState(false);


    const handleFacebookAuthorizedModal = () => {
        setShowFacebookAuthorizedModal(true);
    };
    const handleClose = () => {
        setShow(false);
    };


    return (
        <section className="facebook_modal_outer">
            {
                showFacebookAuthorizedModal &&
                <FacebookAuthorizedModal
                    setFacebookDropDown={setFacebookDropDown}
                    setInstagramDropDown={setInstagramDropDown}
                    setPinterestDropDown={setPinterestDropDown}
                    setLinkedinDropDown={setLinkedinDropDown}
                    connectSocialMediaAccountToCustomer={connectSocialMediaAccountToCustomer}
                    connectSocialAccountApi={connectSocialAccountApi}
                    show={showFacebookAuthorizedModal}
                    setShowModal={setShowFacebookAuthorizedModal}
                    setShowInstagramGuideModal={setShow}
                />
            }
            {
                !showFacebookAuthorizedModal &&
                <Modal
                    size="lg"
                    show={show}
                    onHide={handleClose}
                    className="choose_page_outer notfound_popup instaGuide"
                    centered
                >
                    <div
                        className="pop_up_cross_icon_outer  cursor-pointer"
                        onClick={(e) => {
                            handleClose();
                        }}
                    >
                        <RxCross2 className="pop_up_cross_icon"/>
                    </div>
                    <Modal.Body className="pt-0 cmn_body">
                        <div className="">
                            <div className="">
                                <div className="text-center pt-3">
                                   <div className="facebook_content_outer">
                                        <h2 className="disconnect_title">Connect Instagram Page</h2>
                                        <p className="disconnect_paragraph">
                                            Please confirm that you've completed the steps below to
                                            connect with Instagram:
                                        </p>
                                    </div>
                                    <ol className="guid_instagram" start="1">
                                        <li>
                                            Change your profile to a Business Profile in the Instagram
                                            app to proceed.
                                        </li>
                                        <li>Grant yourself Admin access on your Facebook page.</li>
                                        <li>
                                            Link your Facebook Page to your Instagram Business Profile.
                                        </li>
                                    </ol>
                                    <div>
                                        <SVGComponent/>
                                        {/* <Image  loading="auto" src="/assets/instaguid.svg" alt="Instagram Guide image" className="img-fluid"/> */}
                                    </div>
                                    <div className="confirm_btn mt-2">
                                        <button
                                            onClick={(e) => {
                                                handleClose();
                                            }}
                                            className="cmn_modal_cancelbtn"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleFacebookAuthorizedModal}
                                            className="cmn_btn_color cmn_connect_btn  yes_btn"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </section>
    );
};

export default InstagramGuidePopup;
