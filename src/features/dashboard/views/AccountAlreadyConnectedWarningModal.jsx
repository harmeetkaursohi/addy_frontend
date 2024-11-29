import Modal from "react-bootstrap/Modal";
import Connection_error from "../../../images/connection_err_img.svg?react"
import React from "react";
import "../../common/components/CommonModal.css"
import { RxCross2 } from "react-icons/rx";
const AccountAlreadyConnectedWarningModal = ({accountAlreadyConnectedWarningModal, setAccountAlreadyConnectedWarningModal}) => {
    const handleClose = () => setAccountAlreadyConnectedWarningModal({socialMediaType:null,showModal:false});

    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal centered size="md" show={accountAlreadyConnectedWarningModal?.showModal} onHide={handleClose} className="acc_already_connect_wrapper">
               
                    <Modal.Body>
                        <div className='facebook_content_outer'>
                        <div className='pop_up_cross_icon_outer text-end' onClick={() => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                            <div className='text-center'>
                             <Connection_error className={"connection-error-svg"} />
                                <div className='facebook_title'>
                                <h2 className='disconnect_title'>Account Already Linked</h2>
                            </div>
                                <p className="disconnect_paragraph ">Oops,It appears that this {accountAlreadyConnectedWarningModal?.socialMediaType} account is already
                                    linked. To proceed, kindly disconnect from the existing connection and try
                                    again.</p>
                                <div className={"confirm_btn mt-3"}>
                                    <button onClick={handleClose}
                                            className={"cmn_btn_color cmn_connect_btn  yes_btn mb-2"}>Close
                                    </button>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default AccountAlreadyConnectedWarningModal
