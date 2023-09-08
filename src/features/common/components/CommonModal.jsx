import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"

const CommonModal = ({
                         showFacebookModal,
                         setShowFacebookModal,
                         facebookPageList,
                         setFacebookData,
                         facebookConnectedPages
                     }) => {

    const handleClose = () => setShowFacebookModal(false);

    console.log("facebookPageList--->",facebookPageList);
    console.log("facebookConnectedPages--->",facebookConnectedPages)


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal show={showFacebookModal} onHide={handleClose}>
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
                            <div className=''>
                                {facebookPageList?.map((data, index) => {

                                    return (
                                        <div key={index} className="modal_inner_content">
                                            <div className='users_profile'>
                                                <img src={JSON.parse(data.imageUrl)}/>
                                            </div>
                                            <div className='users_name'>
                                                <h2 className='cmn_text_style'>{data.name}</h2>
                                                <p className="cmn_text_style">{data.about}</p>
                                            </div>
                                            <div className='connect_btn_outer'>
                                                <button
                                                    style={{background: facebookConnectedPages?.find(c => c.pageId === data?.id) ? "red" : ""}}
                                                    className='cmn_btn_color cmn_connect_btn connect_btn connect_btn '
                                                    onClick={(e) => {
                                                        setFacebookData(data);
                                                    }}>
                                                    {facebookConnectedPages?.find(c => c.pageId === data?.id) ? "Disconnect" : "Connect"}
                                                </button>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}

export default CommonModal;