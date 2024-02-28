import React, { useState } from 'react'

import Cropper from 'react-easy-crop'
import { FaMinus, FaPlus } from 'react-icons/fa'
import video from "../../../images/video2.webm"
import { Modal } from 'react-bootstrap'
import { getCroppedImg } from '../../../utils/commonUtils'

const CropVideoModal = ({videoInfo,showCropVideModal,setShowCropVideoModal,getBlob}) => {

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)


const handleClose=()=>{
  setShowCropVideoModal(false)
}


const handleZoomIn = () => {
  setZoom(prevZoom => Math.min(prevZoom + 0.1, 3)); 
};

const handleZoomOut = () => {
  setZoom(prevZoom => Math.max(prevZoom - 0.1, 1)); 
};
const onCropComplete = async (_, croppedAreaPixels) => {        
  const croppedImage = await getCroppedImg(
      videoInfo?.url,
      croppedAreaPixels
  )
  getBlob(croppedImage)
}

  return (
    <Modal className='facebook_modal_outer' size="lg" show={showCropVideModal} onHide={handleClose} backdrop="static">
    <Modal.Header closeButton>
        <Modal.Title className="CropImageModal_header">
            <div className='facebook_title'>
                <h2 className='cmn_text_style'>Edit video</h2>
            </div>
        </Modal.Title>
    </Modal.Header>
    <Modal.Body className='crop-image-parent'>                    
        <div className='crop-image-container crop-container'>   

        {videoInfo &&                                                      
        <Cropper
          video={videoInfo?.url}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          onImageLoaded={res => {
            console.log(res,"res--")
          }}/>
        }
        </div>                        
        <div className="controls">
        <button onClick={handleZoomOut}><FaMinus /></button>
        <input type="range" id="range" min="1" max="3"  value={zoom} step={0.1} onChange={function(e){ setZoom(e.target.value) }}/>                            
        <button onClick={handleZoomIn}><FaPlus/></button>

        </div>                              
    </Modal.Body>
    <Modal.Footer className='crop-image-footer'>                    
    <div className="confirm_btn ">
        <button className="cmn_btn_color cmn_connect_btn disconnect_btn" onClick={handleClose}> Cancel</button>
        <button type="button" className="cmn_btn_color cmn_connect_btn connect_btn yes_btn"
               > Save
        </button>
    </div>

    </Modal.Footer>
</Modal>

      

  
  )
}

export default CropVideoModal
