import Modal from 'react-bootstrap/Modal';
import "./AI_Hashtag.css"
import cross_icon from '../../../../images/cross_icon.svg'
import {useDispatch, useSelector} from "react-redux";
import {generateAIHashTagAction} from "../../../../app/actions/postActions/postActions.js";
import {useState} from "react";
import {conventStringToArrayString} from "../../../../services/facebookService.js";


const AiHashTagModal = ({aiGenerateHashTagModal, setAIGenerateHashTagModal}) => {

    const handleClose = () => setAIGenerateHashTagModal(false);
    const dispatch = useDispatch();
    const [hashTag, setHashTag] = useState();
    const hashTagData = useSelector((state) => state.post.generateAIHashTagReducer.data)


    const handleHashTagSubmit = (e) => {
        e.preventDefault();
        console.log("hashTag", hashTag)

        const requestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": hashTag
                }
            ]
        }

        dispatch(generateAIHashTagAction(requestBody))
    }

    console.log("hashTagData", conventStringToArrayString(hashTagData));

    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={aiGenerateHashTagModal} onHide={handleClose}>

                    <Modal.Header closeButton>
                        <Modal.Title>Generate Hashtag with AI </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleHashTagSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the image you want to generate'
                                           value={hashTag}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setHashTag(e.target.value);
                                           }}
                                    />

                                    <button className='generate_btn cmn_white_text'>Generate</button>
                                </div>
                                <div className='hashtag_outer '>
                                    <h6 className='cmn_white_text caption_heading'>Sure! Here are some hashtag
                                        suggestions for nature-related content:</h6>
                                    <div className='hashtag_btn_outer mt-3'>

                                        {
                                            conventStringToArrayString(hashTagData)?.slice(0, 10)?.map((hashTag, index) => (
                                                <button className='hashtag_btn unselected_hashtag'
                                                        key={index}>{hashTag}</button>
                                            ))
                                        }
                                        {/*<button className='hashtag_btn selected_hashtag_btn'>#NatureLovers</button>*/}

                                    </div>
                                    <div className='selected_hashtag_outer'>
                                        <button className=' hashtag_btn selected_hashtag_btn'>#NatureLovers <img
                                            src={cross_icon}/></button>
                                        <button className=' hashtag_btn selected_hashtag_btn'>#NatureInspires <img
                                            src={cross_icon}/></button>
                                        <button className=' hashtag_btn selected_hashtag_btn'>#NatureMagic <img
                                            src={cross_icon}/></button>
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
                </Modal>

            </div>
        </>
    )
}
export default AiHashTagModal