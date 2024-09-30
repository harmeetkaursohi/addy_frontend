import Modal from "react-bootstrap/Modal";
import not_connected from "../../../images/pagenotConnect.svg"
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import './common.css'
import { RxCross2 } from "react-icons/rx";
const ConnectSocialAccountModal = ({showModal, setShowModal}) => {
    // console.log("dshdsjadjksag")
    const navigate = useNavigate();
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const handleClose = () => {
        setShowModal(false)
    };
    const handleConnectNow = () => {
        navigate("/dashboard")
        setShowModal(false);
    };


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="md" show={showModal} onHide={handleClose} backdrop="static" className="Account_not_connect_wrapper">
                    <Modal.Header closeButton>
                        <Modal.Title className="commonmodal_header">
                        <div className='pop_up_cross_icon_outer text-end' onClick={(e) => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="Account_not_connect_body">
                        <div className='facebook_content_outer'>
                            
                            <div className='text-center'>
                                <img className={"acc-not-connected-error-svg mb-3 "} src={not_connected}></img>
                               
                                <div className='facebook_title'>
                               
                        
                         {
                             (getAllConnectedSocialAccountData?.data === undefined || getAllConnectedSocialAccountData?.data?.length === 0) ?
                             <h2 class="swal2-title page_not_connected" id="swal2-title">Account Not
                                     Connected</h2> :
                                 <>
                                     {
                                         connectedPagesData?.facebookConnectedPages !== undefined && connectedPagesData?.facebookConnectedPages?.length === 0 ?
                                         <h2 class="swal2-title page_not_connected" id="swal2-title">Page Not
                                                 Connected</h2> : <></>
                                     }
                                 </>

                         }

                     </div>

                                {
                                    (getAllConnectedSocialAccountData?.data === undefined || getAllConnectedSocialAccountData?.data?.length === 0) ?
                                        <p className={"text-center mb-4 modal_heading"}>Currently, there are no active connections at
                                            the
                                            moment. Please connect
                                            an account before attempting to create a post.</p> :
                                        <>
                                            {
                                                connectedPagesData?.facebookConnectedPages !== undefined && connectedPagesData?.facebookConnectedPages?.length === 0 ?
                                                    <p className={"text-center mb-4 modal_heading"}>Currently, there are no active connections at the
                                                        moment. Please connect
                                                        a page before attempting to create a post.</p> : <></>
                                            }
                                        </>
                                }

                                <button onClick={handleConnectNow} className={"connection-error-close-btn connect_not_btn"}>OK</button>
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default ConnectSocialAccountModal
