import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import "./aiHhashtag.css"

const AiHashTagModal=()=>{
const [showHashTag, setShowHashTag] = useState(false);
const handleClose = () => setShowHashTag(false);
const handleShow = () => setShowHashTag(true);

return(
    <>
    <div className='generate_ai_img_container'>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <Modal show={showHashTag} onHide={handleClose}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Generate Image with AI </Modal.Title> */}
          <Modal.Title>Generate Hashtag with AI  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='generate_image_wrapper_box'>
            <form>
                <div className='generate_image_outer'>
                    <input type='text' className='form-control' placeholder='Describe the image you want to generate'/>
                    <button className='generate_btn cmn_white_text'>Generate</button>
                  
                </div>
                <h6 className='cmn_white_text caption_heading'>Sure! Here are some hashtag suggestions for nature-related content:</h6>
                  <div className='hashtag_btn_outer'>
                    <button className='cmn_blue_bg cmn_white_text hashtab_btn'>#NatureLovers</button>
                    </div> 
           </form>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>

    </div>
    </>
)
}
export default AiHashTagModal