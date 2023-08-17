import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./aiHashtag.css"
import cross_icon from '../../../../images/cross_icon.svg'
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
          
          <Modal.Title>Generate Hashtag with AI  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='generate_image_wrapper_box'>
            <form>
                <div className='generate_image_outer'>
                    <input type='text' className='form-control' placeholder='Describe the image you want to generate'/>
                    <button className='generate_btn cmn_white_text'>Generate</button>
                  
                </div>
                <div className='hashtag_outer '>
                <h6 className='cmn_white_text caption_heading'>Sure! Here are some hashtag suggestions for nature-related content:</h6>
                  <div className='hashtag_btn_outer mt-3'>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureLovers</button>
                    <button className='hashtag_btn unselected_hashtag' >#ExploreNature</button>
                    <button className=' hashtag_btn unselected_hashtag'>#WildlifeWonder</button>
                    <button className=' hashtag_btn unselected_hashtag'>#NaturePhotography</button>
                    <button className=' hashtag_btn unselected_hashtag'>#IntoTheWild</button>
                    <button className=' hashtag_btn unselected_hashtag'>#NatureEscape</button>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureInspires</button>
                    <button className=' hashtag_btn unselected_hashtag'>#NatureTrail</button>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureMagic</button>

                    </div> 
                    <div className='selected_hashtag_outer'>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureLovers <img src={cross_icon}/></button>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureInspires <img src={cross_icon}/></button>
                    <button className=' hashtag_btn selected_hashtag_btn'>#NatureMagic <img src={cross_icon}/></button>
                    </div>
                    <div className='regenerate_btn_outer mt-4'>
                    <button className='add_caption_btn cmn_bg_btn'>Add</button>
                      <button className='regenerate_btn cmn_bg_btn'>Regenerate</button>
                      <button className='regenerate_btn cmn_bg_btn'>Remove All</button>
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
export default AiHashTagModal