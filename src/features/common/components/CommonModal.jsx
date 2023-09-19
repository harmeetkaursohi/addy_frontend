import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"
import {useDispatch} from "react-redux";
import {getToken} from "../../../app/auth/auth.js";
import ConfirmModal from "./ConfirmModal.jsx";
import {SocialAccountProvider} from "../../../utils/contantData.js";
import {facebookPageConnectAction} from "../../../utils/commonUtils.js";


const CommonModal = ({
                         showModal,
                         setShowModal,
                         allPagesList,
                         connectedPagesList,
                         socialMediaType
                     }) => {


    const handleClose = () => setShowModal(false);
    const dispatch = useDispatch();

    const token = getToken();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mediaPageData, setMediaPageData] = useState(null);
    const [currentConnectedPages, setCurrentConnectedPages] = useState([]);

    useEffect(() => {
        if (connectedPagesList !== null && Array.isArray(connectedPagesList)) {
            const newIds = connectedPagesList.map(c => c.pageId);
            const idsToRemove = currentConnectedPages.filter(id => !newIds.includes(id));
            const idsToAdd = newIds.filter(id => !currentConnectedPages.includes(id));
            const updatedIds = currentConnectedPages.filter(id => !idsToRemove.includes(id));

            //adding new ids
            updatedIds.push(...idsToAdd);

            setCurrentConnectedPages(updatedIds);
        }
    }, [connectedPagesList]);


    const handleSubmit = () => {
        switch (socialMediaType) {
            case SocialAccountProvider.FACEBOOK: {
                facebookPageConnectAction(dispatch, token, mediaPageData);
            }
            //handle other case as well...
            case SocialAccountProvider.INSTAGRAM: {
            }
            default: {
            }
        }
    }


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="lg" show={showModal} onHide={handleClose}>
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
                                {allPagesList?.map((data, index) => {
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
                                                    style={{background: currentConnectedPages?.includes(data?.id) ? "#E24A4A" : ""}}
                                                    className='Connectmodal_btn cmn_connect_btn connect_btn connect_btn '
                                                    onClick={(e) => {
                                                        setMediaPageData(data);
                                                        setShowConfirmModal(true);
                                                    }}

                                                >
                                                    {currentConnectedPages.includes(data?.id) ? "Disconnect" : "Connect"}
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
                    confirmModalAction={handleSubmit}
                    setShowConfirmModal={setShowConfirmModal}
                    showConfirmModal={showConfirmModal}
                    icon={currentConnectedPages?.includes(mediaPageData?.id) ? "warning" : "success"}
                    title={"Are you sure ?"}
                    confirmMessage={currentConnectedPages?.includes(mediaPageData?.id) ? "You want to dis-connect from facebook page ?" : "You want to connect from facebook page ?"}
                />}
        </>
    );
}

export default CommonModal;