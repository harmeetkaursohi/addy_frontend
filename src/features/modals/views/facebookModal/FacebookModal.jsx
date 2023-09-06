import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import biker_img from "../../../../images/biker.png"
import "./Facebook.css"

function FacebookModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    <section className='facebook_modal_outer'>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
           <div className='facebook_title'>
           <h2 className='cmn_text_style'>Please choose your page to connect with Addy</h2>
          <p className='user_contents'>You have Personal Plan, you can add only one page.</p>
          <button className='cmn_blue_bg cmn_white_text upgrade_paln_btn'>Upgrade Plan</button>
           </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='facebook_content_outer'>
            <div className='modal_inner_content'>
                <div className='users_profile'>
                    <img src={biker_img}/>
                </div>
                <div className='users_name'>
                    <h2 className='cmn_text_style'>Team Musafir - Facebook Page</h2>
                    <p className='user_contents'>Lorem ipsum dolor sit amet consectetur. Dolor eget ante elementum amet sed justo. Id tincidunt diam morbi condimentum non a venenatis amet eu. Volutpat massa eget ut diam.</p>
                </div>
                <div className='connect_btn_outer'><button className='cmn_btn_color cmn_connect_btn connect_btn connect_btn'>connect</button></div>
            </div>
            <div className='modal_inner_content'>
                <div className='users_profile'>
                    <img src={biker_img}/>
                </div>
                <div className='users_name'>
                    <h2 className='cmn_text_style'>Team Musafir - Facebook Page</h2>
                    <p className='user_contents'>Lorem ipsum dolor sit amet consectetur. Dolor eget ante elementum amet sed justo. Id tincidunt diam morbi condimentum non a venenatis amet eu. Volutpat massa eget ut diam.</p>
                </div>
                <div className='connect_btn_outer'><button className='cmn_btn_color cmn_connect_btn connect_btn connect_btn'>connect</button></div>
            </div>
            <div className='modal_inner_content'>
                <div className='users_profile'>
                    <img src={biker_img}/>
                </div>
                <div className='users_name'>
                    <h2 className='cmn_text_style'>Team Musafir - Facebook Page</h2>
                    <p className='user_contents'>Lorem ipsum dolor sit amet consectetur. Dolor eget ante elementum amet sed justo. Id tincidunt diam morbi condimentum non a venenatis amet eu. Volutpat massa eget ut diam.</p>
                </div>
                <div className='connect_btn_outer'><button className='cmn_btn_color cmn_connect_btn connect_btn connect_btn'>connect</button></div>
            </div>

            </div>
        </Modal.Body>
        
      </Modal>

    </section>
    </>
  );
}

export default FacebookModal;