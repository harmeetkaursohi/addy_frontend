import Modal from 'react-bootstrap/Modal';
import './AI_Image.css'
import {useEffect, useState} from "react";
import {base64StringToFile, checkDimensions, isNullOrEmpty} from "../../../../utils/commonUtils";
import Loader from "../../../loader/Loader";
import { RxCross2 } from 'react-icons/rx';
import robot_img from "../../../../images/ai_robot.svg"
import { IoIosCheckmarkCircle } from 'react-icons/io';
import {useGenerateImageMutation} from "../../../../app/apis/aiApi";
const AI_ImageModal = ({aiGenerateImageModal, setAIGenerateImageModal, files, setFiles}) => {

    const handleClose = () => setAIGenerateImageModal(false);
    const [imageName, setImageName] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [generatedImagesMultipart, setGeneratedImagesMultipart] = useState([]);

    const [generateImage,generateImageApi]=useGenerateImageMutation();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const imageRequestBody = {
            prompt: imageName,
            noOfImg: 3,
            imageSize: "256x256",
            response_format: "b64_json"
        }

        !isNullOrEmpty(imageName) && generateImage(imageRequestBody)
    }


    useEffect(() => {
        if (generateImageApi?.data !== null && generateImageApi?.data !== undefined) {
            let images = generateImageApi?.data?.data?.map((imageUrl, index) => {
                return base64StringToFile(imageUrl?.b64_json, imageName + index + new Date().getTime() + ".jpg", "image/jpeg");
            })
            const dimensionPromises = images?.map((file) => checkDimensions(file));

            Promise.all(dimensionPromises)
                .then((results) => {
                    setGeneratedImagesMultipart([...generatedImagesMultipart, ...results]);
                })
                .catch((error) => {
                    console.error("Error checking dimensions:", error);
                });

        }
    }, [generateImageApi])

    const handleSelectImage = (data) => {
        if (selectedImages.includes(data)) {
            const selectedImagesData = [...selectedImages];
            const updatedData = selectedImagesData?.filter(imageData => {
                return imageData !== data
            });
            setSelectedImages(updatedData);

        } else {
            setSelectedImages([...selectedImages, data])
        }
    }


    return (
        <>
            <div className='generate_ai_img_container'>

                <Modal show={aiGenerateImageModal} onHide={handleClose} className='generate_ai_container'>

                    <Modal.Body className='pt-0'>
                    <div className='pop_up_cross_icon_outer text-end cursor-pointer mt-2' onClick={() => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                        <div className='robot_img_outer text-center'>
                        <img src={robot_img}/>
                        <h3 className='cmn_heading_class mt-4'>Generate Image with AI </h3>

                        </div>

                        <div className='generate_image_wrapper_box'>
                            <form onSubmit={handleOnSubmit}>
                                <div className='generate_image_outer'>
                                    <input type='text' className='form-control'
                                           placeholder='Describe the image you want to generate'
                                           value={imageName}
                                           onChange={(e) => setImageName(e.target.value)}
                                    />
                                    <button disabled={generateImageApi?.isLoading || isNullOrEmpty(imageName)}
                                            className={'generate_btn cmn_white_text' + (isNullOrEmpty(imageName) ? " opacity-50 " : "")}>
                                        {
                                            generateImageApi?.isLoading ?
                                                <div className={"loading_txt"}><Loader
                                                    className={"me-2 ai_caption_loading_btn"}/> Loading
                                                </div> :
                                                (generateImageApi?.data === null || generateImageApi?.data === undefined) ?

                                                    "Generate" : "Regenerate"

                                        }
                                    </button>
                                </div>

                                <div className='ai_images_outer'>
                                    {
                                        generatedImagesMultipart?.map((data, index) => (
                                            <div className='position-relative'>
                                                 <IoIosCheckmarkCircle style={{color:"#F07C33"}} className={`checkmarkcircle ${selectedImages.includes(data)?"":"d-none"}`}/>
                                            <img onClick={() => {
                                                handleSelectImage(data);
                                            }} key={index} src={data.url}
                                                 className={selectedImages.includes(data) ? "ai_genarted_img cursor-pointer  selectedImg" : "cursor-pointer ai_genarted_img"}/>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='add_regenerate_btn_outer mt-4'>
                                    <button disabled={isNullOrEmpty(selectedImages)}
                                            className={'add_caption_btn cmn_bg_btn' + (isNullOrEmpty(selectedImages) ? " opacity-50" : "")}
                                            onClick={() => {
                                                setFiles([...files, ...selectedImages])
                                                setAIGenerateImageModal(false)

                                            }}>Add
                                    </button>
                                    <button disabled={isNullOrEmpty(generatedImagesMultipart)}
                                            className={'add_caption_btn cmn_bg_btn' + (isNullOrEmpty(generatedImagesMultipart) ? " opacity-50" : "")}
                                            onClick={() => {
                                                setFiles([...files, ...generatedImagesMultipart])
                                                setAIGenerateImageModal(false)

                                            }}
                                    >Add All
                                    </button>
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