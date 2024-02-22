import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CropImageModal.css"
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../../utils/commonUtils';


const CropImageModal = ({imageUrl, showModal, setShowModal, UploadCroppedImage, getBlob }) => {
    const handleClose = () => setShowModal(false);                   
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)      
    const onCropComplete = async (_, croppedAreaPixels) => {        
        const croppedImage = await getCroppedImg(
            imageUrl,
            croppedAreaPixels
        )
        getBlob(croppedImage)
    }


    return (
        <>        
                <Modal className='facebook_modal_outer' size="md" show={showModal} onHide={handleClose} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title className="CropImageModal_header">
                            <div className='facebook_title'>
                                <h2 className='cmn_text_style'>Choose profile picture</h2>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='crop-image-parent'>                    
                        <div className='crop-image-container crop-container'>                                                          
                            <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            showGrid={false}
                            onCropComplete={onCropComplete}
                            onCropChange={setCrop}                            
                            onZoomChange={setZoom}
                            />
                        </div>                        
                        <div className="controls">
                            <input type="range" id="range" min="1" max="3"  value={zoom} step={0.1} onChange={function(e){ setZoom(e.target.value) }}/>                            
                        </div>                              
                    </Modal.Body>
                    <Modal.Footer className='crop-image-footer'>                    
                    <div className="confirm_btn ">
                        <button className="cmn_btn_color cmn_connect_btn disconnect_btn" onClick={handleClose}> Cancel</button>
                        <button type="button" className="cmn_btn_color cmn_connect_btn connect_btn yes_btn"
                                onClick={UploadCroppedImage}> Save
                        </button>
                    </div>

                    </Modal.Footer>
                </Modal>
                 
        </>
    );
}

export default CropImageModal;