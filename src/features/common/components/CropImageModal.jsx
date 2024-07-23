import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CropImageModal.css"
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../../utils/commonUtils';
import "./common.css"
import { FaMinus, FaPlus } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

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
    const handleZoomIn = () => {
        setZoom(prevZoom => Math.min(prevZoom + 0.1, 3)); 
      };
    
      const handleZoomOut = () => {
        setZoom(prevZoom => Math.max(prevZoom - 0.1, 1)); 
      };

    return (
        <>        
                <Modal className='facebook_modal_outer crop_img_container' size="lg" show={showModal} onHide={handleClose} backdrop="static">
                    
                    <Modal.Body className='crop-image-parent'>
                    <div className='pop_up_cross_icon_outer text-end cursor-pointer pt-2' onClick={() => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>   
                     <div className='facebook_title pb-3'>
                                <h2 className='cmn_heading_class'>Choose profile picture</h2>
                        </div> 
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
                        <button onClick={handleZoomOut}><FaMinus /></button>
                        <input type="range" id="range" min="1" max="3"  value={zoom} step={0.1} onChange={function(e){ setZoom(e.target.value) }}/>                            
                        <button onClick={handleZoomIn}><FaPlus/></button>

                        </div>                              
                    </Modal.Body>
                    <Modal.Footer className='crop-image-footer'>                    
                    <div className="confirm_btn ">
                        <button className="cmn_modal_cancelbtn" onClick={handleClose}> Cancel</button>
                        <button type="button" className="cmn_btn_color cmn_connect_btn connect_btn yes_btn mt-0"
                                onClick={UploadCroppedImage}> Save
                        </button>
                    </div>

                    </Modal.Footer>
                </Modal>
                 
        </>
    );
}

export default CropImageModal;