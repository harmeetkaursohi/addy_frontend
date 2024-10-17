import React, {useState} from "react";
import {RxCross2} from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import no_page_connect_img from "../../../images/facebook_authorized.png";
import {computeAndSocialAccountJSON} from "../../../utils/commonUtils";
import {commonConnectSocialAccountButtonStyle, SocialAccountProvider} from "../../../utils/contantData";
import {FacebookLoginButton} from "react-social-login-buttons";
import {LoginSocialFacebook} from "reactjs-social-login";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";
import NotFoundPopup from "./NotFoundPopup";
import { Image } from "react-bootstrap";
const FacebookAuthorizedModal = ({
                                     show,
                                     setShowModal,
                                     setShowInstagramGuideModal,
                                     connectSocialAccountApi,
                                     setFacebookDropDown,
                                     setInstagramDropDown,
                                     setPinterestDropDown,
                                     setLinkedinDropDown,
                                     connectSocialMediaAccountToCustomer
                                 }) => {

    const [showNoBusinessAccountModal, setShowNoBusinessAccountModal] = useState(false);

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("");

    const handleClose = () => setShowModal(false);
    const handleCloseInstagramGuideModal = () => setShowInstagramGuideModal(false);

    return (
        <section className="facebook_modal_outer">
            <Modal
                size="lg"
                show={show}
                onHide={handleCloseInstagramGuideModal}
                className="choose_page_outer notfound_popup instaGuide"
                centered
            >
                <div
                    className="pop_up_cross_icon_outer  cursor-pointer"
                    onClick={handleCloseInstagramGuideModal}
                >
                    <RxCross2 className="pop_up_cross_icon"/>
                </div>
                <Modal.Body className="pt-0 cmn_body">
                    <div className="">
                        <div className="">
                            <div className="text-center pt-3">
                                <Image src="/assets/facebook_authorized.svg" alt="facebook authorizes image"/>
                                <div className="facebook_content_outer">
                                    <h2 className="disconnect_title">
                                        Authorize on Facebook for Instagram
                                    </h2>
                                    <p className="disconnect_paragraph">
                                        Grant Addy permission from Facebook to access and post
                                        content to your Instagram Business Profile.
                                    </p>
                                </div>
                                <div className="confirm_btn ">
                                    <button
                                        onClick={handleClose}
                                        className="cmn_modal_cancelbtn"
                                    >
                                        Back
                                    </button>

                                    <LoginSocialFacebook
                                        isDisabled={connectSocialAccountApi?.isLoading || connectSocialAccountApi?.isFetching || getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching}
                                        appId={`${import.meta.env.VITE_APP_INSTAGRAM_CLIENT_ID}`}
                                        redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                        onResolve={(response) => {
                                            setInstagramDropDown(true)
                                            setFacebookDropDown(false)
                                            setPinterestDropDown(false)
                                            setLinkedinDropDown(false)
                                            connectSocialMediaAccountToCustomer(computeAndSocialAccountJSON(response, SocialAccountProvider.INSTAGRAM, setShowNoBusinessAccountModal), SocialAccountProvider.INSTAGRAM)
                                            handleCloseInstagramGuideModal()
                                        }}
                                        scope={`${import.meta.env.VITE_APP_INSTAGRAM_SCOPE}`}
                                        onReject={(error) => {
                                        }}>

                                        <FacebookLoginButton
                                            text={"Connect"} className={"facebook_connect cmn_btn_color cmn_connect_btn  yes_btn"}
                                            icon={() => null} preventActiveStyles={true}
                                            style={commonConnectSocialAccountButtonStyle}/>
                                    </LoginSocialFacebook>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {
                showNoBusinessAccountModal &&
                <NotFoundPopup
                    isInstagramGuideModal={true}
                    setShowInstagramGuideModal={setShowInstagramGuideModal}
                    show={showNoBusinessAccountModal}
                    setShow={setShowNoBusinessAccountModal}
                />

            }
        </section>
    );
};

export default FacebookAuthorizedModal;
