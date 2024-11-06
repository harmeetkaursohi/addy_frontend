import Modal from "react-bootstrap/Modal";
import Not_connected from "../../../images/pagenotConnect.svg?react"
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import './common.css'
import { RxCross2 } from "react-icons/rx";
import {
    useGetConnectedSocialAccountQuery,
} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import { Image } from "react-bootstrap";
const ConnectSocialAccountModal = ({showModal, setShowModal}) => {

    const navigate = useNavigate();
    const getConnectedSocialAccountApi=useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

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
                <Modal centered size="md" show={showModal} onHide={handleClose} backdrop="static" className="Account_not_connect_wrapper">
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
                                <Not_connected className={"acc-not-connected-error-svg mb-3 "}/>
                               
                                <div className='facebook_title'>


                         {
                             (getConnectedSocialAccountApi?.data === undefined || getConnectedSocialAccountApi?.data?.length === 0) ?
                                 <h2 className='swal2-title page_not_connected' id="swal2-title">Account Not
                                     Connected</h2> :
                                 <>
                                     {
                                         getAllConnectedPagesApi?.data !== undefined && getAllConnectedPagesApi?.data?.length === 0 ?
                                         <h2 class="swal2-title page_not_connected" id="swal2-title">Page Not
                                                 Connected</h2> : <></>
                                     }
                                 </>

                         }

                     </div>

                                {
                                    (getConnectedSocialAccountApi?.data === undefined || getConnectedSocialAccountApi?.data?.length === 0) ?
                                        <p className={"text-center mb-4 modal_heading"}>Currently, there are no active connections at
                                            the
                                            moment. Please connect
                                            an account before attempting to create a post.</p> :
                                        <>
                                            {
                                                getAllConnectedPagesApi?.data !== undefined && getAllConnectedPagesApi?.data?.length === 0 ?
                                                    <p
                                                        className={"text-center mb-4 modal_heading"}>
                                                        Currently, there are no active connections at the
                                                        moment. Please connect
                                                        a page before attempting to create a post.</p> :
                                                    <></>
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
