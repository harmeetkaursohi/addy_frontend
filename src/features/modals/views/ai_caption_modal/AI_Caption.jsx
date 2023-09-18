import Modal from 'react-bootstrap/Modal';
import './AI_Caption.css'
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {generateAICaptionAction} from "../../../../app/actions/postActions/postActions.js";
import {conventStringToArrayString} from "../../../../services/facebookService.js";


const AiCaptionModal = ({aiGenerateCaptionModal, setAIGenerateCaptionModal}) => {
    const handleClose = () => setAIGenerateCaptionModal(false);
    const dispatch = useDispatch();
    const [caption, setCaption] = useState("");
    const captionData = useSelector((state) => state.post.generateAICaptionReducer.data)

    const handleCaptionSubmit = (e) => {
        e.preventDefault();
        console.log("Caption", caption)

        const requestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": caption
                }
            ]
        }

        dispatch(generateAICaptionAction(requestBody))
    }


    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={aiGenerateCaptionModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Generate Caption with AI </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleCaptionSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the image you want to generate'
                                           value={caption}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setCaption(e.target.value)
                                           }}
                                    />
                                    <button className='generate_btn cmn_white_text'>Generate</button>
                                </div>
                                <div className='caption_outer'>
                                    <h6 className='cmn_white_text caption_heading'>Of course! Here are some
                                        nature-themed captions for your posts:</h6>
                                    <ul className='captions_lists'>
                                        {
                                            conventStringToArrayString(captionData)?.slice(0, 10)?.map((caption, index) => (
                                                <li key={index}>{`${index + 1}. ${caption}`}</li>
                                            ))
                                        }
                                    </ul>
                                    <div className='add_regenerate_btn_outer'>
                                        <button className='add_caption_btn cmn_bg_btn'>Add</button>
                                        <button className='regenerate_btn cmn_bg_btn'>Regenerate</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>

            </div>

        </>
    )
}
export default AiCaptionModal