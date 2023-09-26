import Modal from 'react-bootstrap/Modal';
import './ConfirmModal.css'


const ConfirmModal = ({
                          showConfirmModal = null,
                          setShowConfirmModal = null,
                          confirmModalAction = null,
                          icon = "",
                          title = "",
                          confirmMessage = ""
                      }) => {

    const handleClose = () => setShowConfirmModal(false);


    const handleConfirmModel = (e) => {
        e.preventDefault();
        confirmModalAction();
        setShowConfirmModal(false);
    }


    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={showConfirmModal} onHide={handleClose} className={"alert_modal_body"}>

                    <Modal.Body>

                        <div className='confirmWrapper'>

                            {
                                icon === "warning" && <i className="fa fa-warning" aria-hidden="true"
                                                         style={{fontSize: "48px", color: "#F07C33"}}/>
                            }

                            {
                                icon === "success" && <i className="fas fa-check-circle" aria-hidden="true"
                                                         style={{fontSize: "48px", color: "#F07C33"}}/>
                            }

                            <div className="confirm_container">
                                <h2 className="cmn_text_heading confirm_text">{title}</h2>
                                <p className="confirm_text">{confirmMessage}</p>
                            </div>

                            <div className="confirm_btn ">

                                <button className="cmn_btn_color cmn_connect_btn disconnect_btn"
                                        onClick={(e) => {
                                            handleClose()
                                        }}>Cancel
                                </button>

                                <button type="button" className="cmn_btn_color cmn_connect_btn connect_btn yes_btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleConfirmModel(e);
                                        }}>Yes
                                </button>
                            </div>

                        </div>

                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}
export default ConfirmModal