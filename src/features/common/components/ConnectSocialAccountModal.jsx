import Modal from "react-bootstrap/Modal";
import not_connected from "../../../images/pagenot_connected.svg"
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import './common.css'
import { RxCross2 } from "react-icons/rx";
const ConnectSocialAccountModal = ({showModal, setShowModal}) => {
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
                    <Modal.Body>
                        <div className='facebook_content_outer'>
                            
                            <div className='text-center'>
                                <img className={"acc-not-connected-error-svg mb-3 "} src={not_connected}></img>
                               
                                <div className='facebook_title'>
                         
                         {
                             (getAllConnectedSocialAccountData?.data === undefined || getAllConnectedSocialAccountData?.data?.length === 0) ?
                                 <h1 className='cmn_text_style not_connect_heading'>Account Not
                                     Connected</h1> :
                                 <>
                                     {
                                         connectedPagesData?.facebookConnectedPages !== undefined && connectedPagesData?.facebookConnectedPages?.length === 0 ?
                                             <h1 className='cmn_text_style not_connect_heading'>Page Not
                                                 Connected</h1> : <></>
                                     }
                                 </>

                         }

                     </div>

                                {
                                    (getAllConnectedSocialAccountData?.data === undefined || getAllConnectedSocialAccountData?.data?.length === 0) ?
                                        <h6 className={"text-center mb-4 NotConncted_text"}>Currently, there are no active connections at
                                            the
                                            moment. Please connect
                                            an account before attempting to create a post.</h6> :
                                        <>
                                            {
                                                connectedPagesData?.facebookConnectedPages !== undefined && connectedPagesData?.facebookConnectedPages?.length === 0 ?
                                                    <h6 className={"text-center mb-4 "}>Currently, there are no active connections at the
                                                        moment. Please connect
                                                        a page before attempting to create a post.</h6> : <></>
                                            }
                                        </>
                                }
                               <button onClick={handleClose} className={"cmn_modal_cancelbtn me-3 Common_btn"}>Cancel</button>

                                <button onClick={handleConnectNow} className={"connection-error-close-btn connect_not_btn"}>Connect now</button>
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default ConnectSocialAccountModal