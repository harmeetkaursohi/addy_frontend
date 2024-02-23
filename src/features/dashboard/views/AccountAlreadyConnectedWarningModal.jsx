import Modal from "react-bootstrap/Modal";
import Connection_error from "../../../images/Connection_error.svg"
import React from "react";

const AccountAlreadyConnectedWarningModal = ({accountAlreadyConnectedWarningModal, setAccountAlreadyConnectedWarningModal}) => {
    const handleClose = () => setAccountAlreadyConnectedWarningModal({socialMediaType:null,showModal:false});

    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="lg" show={accountAlreadyConnectedWarningModal?.showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="commonmodal_header">
                            <div className='facebook_title'>
                                <h1 className='cmn_text_style not_connect_heading'>Account Already Linked</h1>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='facebook_content_outer'>
                            <div className='text-center'>
                                <img className={"connection-error-svg"} src={Connection_error}></img>
                                <h6 className={"text-center mb-4"}>Oops,It appears that this {accountAlreadyConnectedWarningModal?.socialMediaType} account is already
                                    linked. To proceed, kindly disconnect from the existing connection and try
                                    again.</h6>
                                <button onClick={handleClose} className={"connection-error-close-btn"}>Close</button>
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default AccountAlreadyConnectedWarningModal