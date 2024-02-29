import React from 'react'
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from 'react';
import {useRef} from 'react';
import "./common.css"

const EditImageModal = ({showEditImageModal, setShowEditImageModal, file, setFileSize, setCropImgUrl}) => {
    const [crop, setCrop] = useState({unit: "%", width: 50, aspect: 1 / 1, height: 50,  x: 25, y: 25});
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const imageRef = useRef(null);

    const handleClose = () => {
        setShowEditImageModal(false)
    }

    const onImageLoaded = (image) => {
        imageRef.current = image.target;
        if (imageRef.current && crop.width && crop.height) {
            makeClientCrop(crop);
        }
    };

    const onCropComplete = crop => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const makeClientCrop = async crop => {
        if (imageRef.current && crop.width && crop.height) {
            const croppedImageBlob = await getCroppedImg(
                imageRef.current,
                crop,
                "newFile.jpeg"
            );
            setCroppedImageUrl(URL.createObjectURL(croppedImageBlob.blob));
            setFileSize(croppedImageBlob.blob)
        }
    };

    const getCroppedImg = (image, crop, fileName) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            );

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    reject(new Error("Canvas is empty"));
                    return;
                }
                blob.name = fileName;

                resolve({blob});

            }, "image/jpeg", 1);

        });
    };

    const saveHandler = () => {
        setCropImgUrl(croppedImageUrl)
        setShowEditImageModal(false)
    }


    return (
        <div className='edit_imag_modal_outer'>


            <Modal show={showEditImageModal} onHide={handleClose}  backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Edit picture</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    {
                        (file?.attachmentSource || file.url) &&
                        <ReactCrop
                            src={file.url ? file.url : "data:image/jpeg; base64," + file?.attachmentSource}
                            crop={crop}
                            onComplete={onCropComplete}
                            onChange={onCropChange}>

                            <img src={file.url ? file.url : "data:image/jpeg; base64," + file?.attachmentSource}
                                 alt="Selected" height="400px" width="400px" onLoad={onImageLoaded}/>
                        </ReactCrop>
                    }


                </Modal.Body>
                <Modal.Footer>

                <button className="cmn_btn_color cmn_connect_btn disconnect_btn" onClick={handleClose}> Cancel</button>
        <button type="button" disabled ={crop?.unit==="%"} onClick={saveHandler} className={`cmn_btn_color cmn_connect_btn connect_btn yes_btn ${crop?.unit==="%" ? "disabled-button":""}`}
               > Save
        </button>
                

                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default EditImageModal





