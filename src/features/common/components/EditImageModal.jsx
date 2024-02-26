import React from 'react'
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import { useRef } from 'react';

const EditImageModal = ({setShowEditImageModal,showEditImageModal,file}) => {
    console.log(file.file.fileName,"file")
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: "%", x: 0, y: 0, width: 50, height: 50 });
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const imageRef = useRef(null);
    const fileUrlRef = useRef(null);

    const onSelectFile=(e)  => {
        // if (e.target.files && e.target.files.length > 0) {
        //   const reader = new FileReader();
        //   reader.addEventListener("load", () => setSrc(reader.result));
        //   reader.readAsDataURL(e.target.files[0]);
        // }
      };
    
      const onImageLoaded = image => {
        imageRef.current = image;
      };
    
      const onCropComplete = crop => {
        makeClientCrop(crop);
      };
    
      const onCropChange = (crop, percentCrop) => {
        setCrop(crop);
      };
    
      const makeClientCrop = async crop => {
        if (imageRef.current && crop.width && crop.height) {
          const croppedImageUrl = await getCroppedImg(imageRef.current, crop, "newFile.jpeg");
          setCroppedImageUrl(croppedImageUrl);
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
              return;
            }
            blob.name = fileName;
            if (fileUrlRef.current) {
              window.URL.revokeObjectURL(fileUrlRef.current);
            }
            fileUrlRef.current = window.URL.createObjectURL(blob);
            resolve(fileUrlRef.current);
          }, "image/jpeg");
        });
      };
const handleClose=()=>{
    setShowEditImageModal(false)
}
  return (
    <div className='edit_imag_modal_outer'>



      <Modal show={showEditImageModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* <div>
          <input type="file" accept="image/*" onChange={onSelectFile()} />
        </div> */}
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )}
    
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
  )
}

export default EditImageModal