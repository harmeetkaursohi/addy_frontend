import Modal from 'react-bootstrap/Modal';
import './AI_Caption.css'
import {useEffect, useState} from "react";
import {isNullOrEmpty} from "../../../../utils/commonUtils";
import Loader from "../../../loader/Loader";
import robot_img from "../../../../images/ai_robot.svg"
import {RxCross2} from 'react-icons/rx';
import {useGenerateCaptionMutation} from "../../../../app/apis/aiApi";
const AiCaptionModal = ({aiGenerateCaptionModal, setAIGenerateCaptionModal, addCaption}) => {

    const handleClose = () => setAIGenerateCaptionModal(false);

    const [caption, setCaption] = useState("");
    const [captionSuggestionList, setCaptionSuggestionList] = useState([]);
    const [selectedCaption, setSelectedCaption] = useState("");

    const [generateCaption, generateCaptionApi] = useGenerateCaptionMutation();

    const handleCaptionSubmit = (e) => {
        e.preventDefault();
        const requestBody = {
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": "You are an expert at generating concise captions from research paper text. Return a structured response with a key 'captions' containing an array of captions."
                },
                {
                    "role": "user",
                    "content": "Provide 10 captions about " + caption
                },
            ]
        }

        !isNullOrEmpty(caption) && generateCaption(requestBody)
    }
    useEffect(() => {
        if (!generateCaptionApi?.isLoading && !generateCaptionApi?.isFetching && generateCaptionApi?.data !== null && generateCaptionApi?.data !== undefined) {
            setSelectedCaption("")
            setCaptionSuggestionList(generateCaptionApi?.data?.captions || []);
        }
    }, [generateCaptionApi])




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
                <Modal show={aiGenerateCaptionModal} onHide={handleClose} className='generate_ai_container'>

                    <Modal.Body className='pt-0'>
                        <div className='pop_up_cross_icon_outer text-end cursor-pointer mt-2' onClick={() => {
                            handleClose()
                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                        <div className='robot_img_outer text-center'>
                            <img src={robot_img}/>
                            <h3 className='cmn_heading_class mt-4'>Generate Caption with AI </h3>

                        </div>
                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleCaptionSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                        // placeholder='Describe the caption you want to generate'
                                           placeholder='Enter topic to generate caption'
                                           value={caption}
                                           onChange={(e) => {
                                               e.preventDefault();
                                               setCaption(e.target.value)
                                           }}
                                    />


                                    <button disabled={isNullOrEmpty(caption) || generateCaptionApi?.isLoading || generateCaptionApi?.isFetching}
                                            className={'generate_btn cmn_white_text ' + (isNullOrEmpty(caption) ? " opacity-50" : "")}>
                                        {
                                            (generateCaptionApi?.isLoading || generateCaptionApi?.isFetching) ?
                                                <div className={"loading_txt"}><Loader
                                                    className={"me-2 ai_caption_loading_btn"}/> Loading
                                                </div> : captionSuggestionList?.length === 0 ? "Generate" : "Regenerate"
                                        }
                                    </button>
                                </div>
                                <div className='caption_outer'>
                                    {
                                        !generateCaptionApi?.isLoading && !generateCaptionApi?.isFetching && captionSuggestionList?.length > 0 &&
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
                                        <button onClick={handleAddCaptions} disabled={isNullOrEmpty(selectedCaption)} className={`add_caption_btn cmn_bg_btn ${isNullOrEmpty(selectedCaption)? " opacity-50" :""}`}>Add
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