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
const EditImageModal = ({showEditImageModal, setShowEditImageModal, file, setFileSize, setCropImgUrl}) => {


    const [crop, setCrop] = useState({unit: "px", width: 210, aspect: 1 / 1, height: 210, x: 105, y: 105});
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const imageRef = useRef(null);

    const aspectData = [
        {icon: <MdOutlinePhoto/>, title: "Original", aspectRatio: 3 / 2, height: 260, width: 280},
        {icon: <IoSquareOutline/>, title: "Square", aspectRatio: 1 / 1, height: 270, width: 270},
        {icon: <LuRectangleHorizontal/>, title: "2:3", aspectRatio: 2 / 3, height: 200, width: 360},
        {icon: <TbRectangleVertical/>, title: "4:5", aspectRatio: 4 / 5, height: 360, width: 250},
        {icon: <LuRectangleHorizontal/>, title: "5:4", aspectRatio: 5 / 4, height: 230, width: 320},
        {icon: <BiRectangle/>, title: "7:5", aspectRatio: 7 / 5, height: 290, width: 310},
        {icon: <LuRectangleHorizontal/>, title: "16:9", aspectRatio: 16 / 9, height: 400, width: 400},
    ]

    useEffect(()=>{
        if(crop){
            makeClientCrop(crop)
        }
    },[crop])

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
                file?.file?.name
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

            }, file?.file?.type, 1);

        });
    };

    const saveHandler = () => {
        setCropImgUrl(croppedImageUrl)
        setShowEditImageModal(false)
    }

    const [index, setIndex] = useState(0)
    const handleAspectChange = (aspect, height, width, i) => {

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const maxWidth = Math.min(screenWidth * 0.8, width);
        const maxHeight = Math.min(screenHeight * 0.8, height);
        setCrop({...crop, aspect: aspect, height: maxHeight, width: maxWidth, x: 0, y: 0});
        setIndex(i)
    };

    useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth < 600) {
                setCrop(prevCrop => ({
                    ...prevCrop,
                    x: 25,
                    y: 25
                }));
            } else {

                setCrop(prevCrop => ({
                    ...prevCrop,
                    x: 105,
                    y: 105
                }));
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [window.innerWidth])
    return (
        <div className='edit_imag_modal_outer'>


            <Modal show={showEditImageModal} onHide={handleClose} backdrop="static">
               
                <Modal.Body >
                  <div className='pop_up_cross_icon_outer text-end cursor-pointer' onClick={(e) => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>
                    <h3 className='cmn_heading_class text-center pb-3'>Edit picture</h3>

                    
                    <div className='text-center'>
                    {
                        (file?.attachmentSource || file.url) &&
                        <ReactCrop
                            src={file.url ? file.url : "data:image/jpeg; base64," + file?.attachmentSource}
                            crop={crop}
                            onComplete={onCropComplete}
                            onChange={onCropChange}>

                            <Image src={file.url ? file?.url : "data:image/jpeg; base64," + file?.attachmentSource}
                                 alt="Selected Image" height="400px" width="400px" onLoad={onImageLoaded}/>
                        </ReactCrop>
                    }
                    <ul className='aspect_ratio_outer'>
                        {aspectData.map((data, i) => (

                            <li className={index === i ? "active_color" : ""} key={i} onClick={() => {
                                handleAspectChange(data.aspectRatio, data.height, data.width, i)
                            }}>{data.icon}  <h5>{data.title}</h5></li>
                        ))}


                    </ul>

                    </div>

                </Modal.Body>
                <Modal.Footer>


                    <button className="cmn_modal_cancelbtn me-3 cmn_btn_padding" onClick={handleClose}> Cancel
                    </button>
                    <button type="button" disabled={crop?.unit === "%"} onClick={saveHandler}
                            className={`cmn_btn_color cmn_connect_btn connect_btn yes_btn ${crop?.unit === "%" ? "disabled-button" : ""}`}
                    > Save
                    </button>


                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default EditImageModal





