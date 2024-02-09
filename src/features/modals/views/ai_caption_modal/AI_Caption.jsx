import Modal from 'react-bootstrap/Modal';
import './AI_Caption.css'
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {generateAICaptionAction} from "../../../../app/actions/postActions/postActions.js";
import {conventStringToArrayString} from "../../../../services/facebookService.js";
import {isNullOrEmpty} from "../../../../utils/commonUtils";
import Loader from "../../../loader/Loader";


const AiCaptionModal = ({aiGenerateCaptionModal, setAIGenerateCaptionModal, addCaption}) => {
    const handleClose = () => setAIGenerateCaptionModal(false);
    const dispatch = useDispatch();
    const [caption, setCaption] = useState("");
    const [captionSuggestionList, setCaptionSuggestionList] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");
    const generateAICaptionData = useSelector((state) => state.post.generateAICaptionReducer)

    const handleCaptionSubmit = (e) => {
        e.preventDefault();

        const requestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": "Provide 10 captions about " + caption
                }
            ]
        }

        !isNullOrEmpty(caption) && dispatch(generateAICaptionAction(requestBody))
    }
    useEffect(() => {
        if (generateAICaptionData?.data !== null && generateAICaptionData !== undefined) {
            setSelectedCaption("")
            setCaptionSuggestionList(conventStringToArrayString(generateAICaptionData?.data)?.slice(0, 10));
        }
    }, [generateAICaptionData])


    const handleAddCaptions = () => {
        addCaption(selectedCaption)
        setAIGenerateCaptionModal(false)
    }


    useEffect(() => {
        setCaptionSuggestionList([])
    }, [])


    return (
        <>
            <div className='generate_ai_img_container'>
                <Modal show={aiGenerateCaptionModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className='ai_caption'>Generate Caption with AI </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleCaptionSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the caption you want to generate'
                                           value={caption}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setCaption(e.target.value)
                                           }}
                                    />


                                    <button disabled={isNullOrEmpty(caption) || generateAICaptionData?.loading}
                                            className={'generate_btn cmn_white_text ' + (isNullOrEmpty(caption) ? " opacity-50" : "")}>
                                        {
                                            generateAICaptionData?.loading ?
                                                <div className={"loading_txt"}><Loader className={"me-2"}/> Loading
                                                </div> : captionSuggestionList?.length === 0 ? "Generate" : "Regenerate"
                                        }
                                    </button>
                                </div>
                                <div className='caption_outer'>
                                    {
                                        !generateAICaptionData?.loading && captionSuggestionList?.length > 0 &&
                                        <h6 className='cmn_white_text caption_heading'>Of course! Here are some captions
                                            for your post:</h6>
                                    }

                                    <ul className='captions_lists'>
                                        {
                                            captionSuggestionList?.map((caption, index) => (
                                                <li key={index}
                                                    onClick={() => {
                                                        setSelectedCaption(caption)
                                                    }}
                                                    className={selectedCaption.includes(caption) ? "cursor-pointer selectedCaption" : "cursor-pointer"}


                                                >{`${caption}`}</li>
                                            ))
                                        }
                                    </ul>
                                    <div className='add_regenerate_btn_outer'>
                                        <button onClick={handleAddCaptions} className='add_caption_btn cmn_bg_btn'>Add
                                        </button>
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