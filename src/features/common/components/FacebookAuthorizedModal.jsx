import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-bootstrap/Modal";
import no_page_connect_img from "../../../images/facebook_authorized.png";
import { LoginSocialFacebook } from "reactjs-social-login";
const FacebookAuthorizedModal = ({ show, setShowModal }) => {
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  return (
    <section className="facebook_modal_outer">
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="choose_page_outer notfound_popup instaGuide"
      >
        <div
          className="pop_up_cross_icon_outer  cursor-pointer"
          onClick={(e) => {
            handleClose();
          }}
        >
          <RxCross2 className="pop_up_cross_icon" />
        </div>
        <Modal.Body className="pt-0 cmn_body">
          <div className="">
            <div className="">
              <div className="text-center pt-3">
                <img src={no_page_connect_img} />
                <div className="facebook_content_outer">
                  <h2 className="disconnect_title">
                    Authorize on Facebook for Instagram{" "}
                  </h2>
                  <p className="disconnect_paragraph">
                    Grant Addy permission from Facebook to access and post
                    content to your Instagram Business Profile.
                  </p>
                </div>
                <div className="confirm_btn ">
                  <button
                    onClick={(e) => {
                      handleClose();
                    }}
                    className="cmn_modal_cancelbtn"
                  >
                    Back
                  </button>
                  <button
                    onClick={(e) => {
                      handleClose();
                    }}
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
    </section>
  );
};

export default FacebookAuthorizedModal;
