import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bg_img from '../../../../images/bg_img.png'
import './AI_Image.css'

const AI_ImageModal = ({aiGenerateImageModel, setAIGenerateImageModel}) => {

    // const [show, setShow] = useState(false);
    const handleClose = () => setAIGenerateImageModel(false);
    // const handleShow = () => setShow(true);

    return (
        <>
            <div className='generate_ai_img_container'>

                {/*<Button variant="primary" onClick={handleShow}>*/}
                {/*    Launch demo modal*/}
                {/*</Button>*/}

                <Modal show={aiGenerateImageModel} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Generate Image with AI</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='generate_image_wrapper_box'>
                            <form>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the image you want to generate'/>
                                    <button className='generate_btn cmn_white_text'>Generate</button>

                                </div>

                                <div className='ai_images_outer'>
                                    <img src={bg_img} className="ai_genarted_img"/>
                                    <img src={bg_img} className="ai_genarted_img"/>
                                    <img src={bg_img} className="ai_genarted_img"/>
                                </div>


                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}
export default AI_ImageModal