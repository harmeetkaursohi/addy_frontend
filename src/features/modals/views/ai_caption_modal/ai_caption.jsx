import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ai_caption.css'
import AiHashTagModal from '../ai_hashtag_modal/aiHashtag';
const AiCaptionModal=()=>{
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

return(
    <>
    <div className='generate_ai_img_container'>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Caption with AI  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='generate_image_wrapper_box'>
            <form>
                <div className='generate_image_outer'>
                    <input type='text' className='form-control' placeholder='Describe the image you want to generate'/>
                    <button className='generate_btn cmn_white_text'>Generate</button>
                  
                </div>
           <div className='caption_outer'>
            <h6 className='cmn_white_text caption_heading'>Of course! Here are some nature-themed captions for your posts:</h6>
            <ul className='captions_lists'>
              <li>1."Nature's masterpiece, a canvas of wonder."</li>
              <li>2."Embracing the beauty of the natural world."</li>
              <li>3."In the presence of nature, we find tranquility."</li>
              <li>4."Where the earth's symphony plays its soothing melody."</li>
              <li>5."Discovering serenity in the arms of Mother Nature."</li>
              <li>6."A glimpse of paradise in the heart of nature."</li>
              <li>7."Life's truest colors can be found in nature's embrace."</li>
              <li>8."Cherishing the small wonders that nature unveils."</li>
              <li>9."Nature's magic, a timeless enchantment."</li>
              <li>10."Breathing in the essence of the great outdoors."</li>
            </ul>
            <div className='add_regenerate_btn_outer'>
             <button className='add_caption_btn cmn_bg_btn'>Add</button>
             <button className='regenerate_btn cmn_bg_btn'>Regenerate</button>
            </div>
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
export default AiCaptionModal