import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaFacebook } from 'react-icons/fa';
import warning_img from "../../../images/warning_img.svg"
import "./common.css"
const WarningModal = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
 
      <Modal show={show} size='sm' onHide={handleClose} className='warning_modal_container'>
      <Modal.Header closeButton>
        
        </Modal.Header>
        <Modal.Body>
            <div className='warning_outer'>
            <img src={warning_img} className='warning_img'/>
            <h3 className='cmn_text_style'>Warning</h3>
            <h4 className='cmn_headings'> <FaFacebook className='fb_icon'/> Facebook account has been temporarily disabled due to a violation of our community standards.</h4>

            </div>
        </Modal.Body>
       
      </Modal>

     
    </>
  );


}


export default WarningModal