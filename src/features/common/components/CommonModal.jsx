import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"
import {useDispatch} from "react-redux";
import {decodeJwtToken, getToken} from "../../../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions.js";
import ConfirmModal from "./ConfirmModal.jsx";

const CommonModal = ({
                         showFacebookModal,
                         setShowFacebookModal,
                         facebookPageList,
                         facebookConnectedPages
                     }) => {

    const handleClose = () => setShowFacebookModal(false);
    const dispatch = useDispatch();
    const token = getToken();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [facebookData, setFacebookData] = useState(null);
    const [connectPage, setConnectPage] = useState(false);

    const facebookPageConnectAction = () => {
        const decodeJwt = decodeJwtToken(token);
        if (facebookData) {
            const requestBody = {
                customerId: decodeJwt?.customerId,
                pageAccessTokenDTO: {
                    pageId: facebookData?.id,
                    name: facebookData?.name,
                    imageUrl: facebookData.picture?.data?.url,
                    about: facebookData?.about,
                    access_token: facebookData?.access_token
                },
                token: token
            }
            dispatch(facebookPageConnect(requestBody)).then((response) => {
                console.log(response)
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            }).catch((error) => {
                console.log("--->error", error)
            })
        }
    }


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal  size="lg" show={showFacebookModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="commonmodal_header">
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
                                            <div className="user_info_container">
                                                <div className='users_profile'>
                                                    <img src={data.picture.data.url}/>
                                                </div>
                                                <div className='users_name'>
                                                    <h2 className='cmn_text_style'>{data.name}</h2>
                                                    {data.about && <p className="cmn_text_style mb-0">{data.about}</p>}
                                                </div>
                                            </div>

                                            <div className='connect_btn_outer'>
                                                <button
                                                    style={{background: facebookConnectedPages?.find(c => c.pageId === data?.id) ? "#E24A4A" : ""}}
                                                    className='Connectmodal_btn cmn_connect_btn connect_btn connect_btn '
                                                    onClick={(e) => {
                                                        setConnectPage(!connectPage);
                                                        setFacebookData(data);
                                                        setShowConfirmModal(true);
                                                    }}

                                                >
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

            {showConfirmModal &&
                <ConfirmModal
                    confirmModalAction={facebookPageConnectAction}
                    setShowConfirmModal={setShowConfirmModal}
                    showConfirmModal={showConfirmModal}
                    icon={facebookConnectedPages?.find(c => c.pageId === facebookData?.id) ? "warning" : "success"}
                    title={"Are you sure ?"}
                    confirmMessage={facebookConnectedPages?.find(c => c.pageId === facebookData?.id) ? "You want to dis-connect from facebook page ?" : "You want to connect from facebook page ?"}
                />}
        </>
    );
}

export default CommonModal;