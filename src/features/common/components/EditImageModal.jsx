import React, {useEffect} from 'react'
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {IoSquareOutline} from "react-icons/io5";
import {LuRectangleHorizontal} from "react-icons/lu";
import Modal from 'react-bootstrap/Modal';
import {TbRectangleVertical} from "react-icons/tb";
import {BiRectangle} from "react-icons/bi";
import {MdOutlinePhoto} from "react-icons/md";
import {useState} from 'react';
import {useRef} from 'react';
import "./common.css"
import { RxCross2 } from 'react-icons/rx';
import { Image } from 'react-bootstrap';

const EditImageModal = ({ showEditImageModal, setShowEditImageModal, file, setFileSize, setCropImgUrl }) => {
    const [crop, setCrop] = useState({ unit: "px", width: 210, aspect: 1 / 1, height: 210, x: 105, y: 105 });
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [aspectData, setAspectData] = useState([]);
    const [index, setIndex] = useState(0);
    const imageRef = useRef(null);

    useEffect(() => {
        if (crop) {
            makeClientCrop(crop);
        }
    }, [crop]);

    const handleClose = () => {
        setShowEditImageModal(false);
    };

    const onImageLoaded = (event) => {
        const image = event.target;
        imageRef.current = image;

        // Update aspectData dynamically based on the selected image's dimensions
        const { naturalWidth, naturalHeight } = image;
        const dynamicAspectData = [
            { icon: <MdOutlinePhoto />, title: "Original", aspectRatio: naturalWidth / naturalHeight },
            { icon: <IoSquareOutline />, title: "Square", aspectRatio: 1 / 1 },
            { icon: <LuRectangleHorizontal />, title: "2:3", aspectRatio: 2 / 3 },
            { icon: <TbRectangleVertical />, title: "4:5", aspectRatio: 4 / 5 },
            { icon: <LuRectangleHorizontal />, title: "5:4", aspectRatio: 5 / 4 },
            { icon: <BiRectangle />, title: "7:5", aspectRatio: 7 / 5 },
            { icon: <LuRectangleHorizontal />, title: "16:9", aspectRatio: 16 / 9 },
        ];

        setAspectData(dynamicAspectData);
        setCrop({
            unit: "px",
            width: Math.min(300, naturalWidth),
            aspect: dynamicAspectData[0].aspectRatio,
            x: 0,
            y: 0
        });
    };

    const onCropComplete = (crop) => {
        makeClientCrop(crop);
    };

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const makeClientCrop = async (crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const croppedImageBlob = await getCroppedImg(
                imageRef.current,
                crop,
                file?.file?.name
            );
            setCroppedImageUrl(URL.createObjectURL(croppedImageBlob.blob));
            setFileSize(croppedImageBlob.blob);
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
                crop.height
            );

            canvas.toBlob(blob => {
                if (!blob) {
                    console.error("Canvas is empty");
                    reject(new Error("Canvas is empty"));
                    return;
                }
                blob.name = fileName;
                resolve({ blob });
            }, file?.file?.type, 1);
        });
    };

    const handleAspectChange = (aspect, i) => {
        const { naturalWidth, naturalHeight } = imageRef.current;
        const width = Math.min(naturalWidth, 300); // Limit the cropper size
        const height = width / aspect;

        setCrop({ ...crop, aspect, width, height, x: 0, y: 0 });
        setIndex(i);
    };

    const saveHandler = () => {
        setCropImgUrl(croppedImageUrl);
        setShowEditImageModal(false);
    };

    return (
        <div className='edit_imag_modal_outer'>
            <Modal show={showEditImageModal} onHide={handleClose} backdrop="static">
                <Modal.Body>
                    <div className='pop_up_cross_icon_outer text-end cursor-pointer' onClick={handleClose}>
                        <RxCross2 className="pop_up_cross_icon" />
                    </div>
                    <h3 className='cmn_heading_class text-center pb-3'>Edit Picture</h3>
                    <div className='text-center'>
                        {(file?.attachmentSource || file.url) && (
                            <ReactCrop
                                src={file.url ? file.url : "data:image/jpeg; base64," + file?.attachmentSource}
                                crop={crop}
                                onComplete={onCropComplete}
                                onChange={onCropChange}>
                                <Image
                                    src={file.url ? file?.url : "data:image/jpeg; base64," + file?.attachmentSource}
                                    alt="Selected Image"
                                    onLoad={onImageLoaded}
                                />
                            </ReactCrop>
                        )}
                        <ul className='aspect_ratio_outer'>
                            {aspectData.map((data, i) => (
                                <li
                                    className={index === i ? "active_color" : ""}
                                    key={i}
                                    onClick={() => handleAspectChange(data.aspectRatio, i)}
                                >
                                    {data.icon} <h5>{data.title}</h5>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="cmn_modal_cancelbtn me-3 cmn_btn_padding" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={crop?.unit === "%"}
                        onClick={saveHandler}
                        className={`cmn_btn_color cmn_connect_btn connect_btn yes_btn ${
                            crop?.unit === "%" ? "disabled-button" : ""
                        }`}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditImageModal;
