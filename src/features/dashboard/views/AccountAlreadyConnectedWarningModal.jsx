import Modal from "react-bootstrap/Modal";
import Connection_error from "../../../images/connection_err_img.svg"
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
                                <img className={"connection-error-svg"} src={Connection_error}></img>
                                <div className='facebook_title'>
                                <h2 className='disconnect_title'>Account Already Linked</h2>
                            </div>
                                <p className="disconnect_paragraph">Oops,It appears that this {accountAlreadyConnectedWarningModal?.socialMediaType} account is already
                                    linked. To proceed, kindly disconnect from the existing connection and try
                                    again.</p>
                                <button onClick={handleClose} className={"cmn_modal_cancelbtn"}>Close</button>
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default AccountAlreadyConnectedWarningModal