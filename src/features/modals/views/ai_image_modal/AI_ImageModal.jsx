import Modal from 'react-bootstrap/Modal';
import './AI_Image.css'
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {generateAIImageAction} from "../../../../app/actions/postActions/postActions.js";

const AI_ImageModal = ({aiGenerateImageModal, setAIGenerateImageModal}) => {

    const handleClose = () => setAIGenerateImageModal(false);
    const [imageName, setImageName] = useState("");
    const dispatch = useDispatch();
    const generateAIImageData = useSelector(state => state.post.generateAIImageReducer.data);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const imageRequestBody = {
            prompt: imageName,
            noOfImg: 3,
            imageSize: "256x256"
        }

        dispatch(generateAIImageAction(imageRequestBody))
    }

    console.log("generateAIImageData", generateAIImageData)


    return (
        <>
            <div className='generate_ai_img_container'>

                <Modal show={aiGenerateImageModal} onHide={handleClose}>

                    <Modal.Header closeButton>
                        <Modal.Title>Generate Image with AI</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleOnSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the image you want to generate'
                                           value={imageName}
                                           onChange={(e) => setImageName(e.target.value)}
                                    />
                                    <button className='generate_btn cmn_white_text'>Generate</button>
                                </div>

                                <div className='ai_images_outer'>
                                    {
                                        generateAIImageData?.data?.map((data) => (
                                            <img src={data.url} className="ai_genarted_img"/>
                                        ))
                                    }
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