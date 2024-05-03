import Modal from 'react-bootstrap/Modal';
import './ConfirmModal.css'
import success_img from "../../../images/success_img.svg"
import {RxCross2} from "react-icons/rx"
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
                    <div className='pop_up_cross_icon_outer text-end' onClick={(e) => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                        <div className='confirmWrapper'>
                       

                            {
                                icon === "warning" && <img src={success_img} className='success_img'/>
                            }

                            {
                                icon === "success" && <img src={success_img} className='success_img'/>
                            }

                            <div className="confirm_container">
                                <h2 className="cmn_text_heading confirm_text">{title}</h2>
                                <p className="confirm_text">{confirmMessage}</p>
                            </div>

                            <div className="confirm_btn ">

                                <button className="cmn_modal_cancelbtn"
                                        onClick={(e) => {
                                            handleClose()
                                        }}>Cancel
                                </button>

                                <button type="button" className="cmn_btn_color cmn_connect_btn  yes_btn"
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