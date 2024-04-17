import React, {useEffect, useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"
import {useDispatch, useSelector} from "react-redux";
import {getToken} from "../../../app/auth/auth.js";
import ConfirmModal from "./ConfirmModal.jsx";
import {SocialAccountProvider} from "../../../utils/contantData.js";
import { pageConnectAction} from "../../../utils/commonUtils.js";
import default_user_icon from "../../../images/default_user_icon.svg"


const CommonModal = ({
                         socialMediaAccountInfo,
                         showModal,
                         setShowModal,
                         allPagesList,
                         connectedPagesList,
                         socialMediaType,
                         noPageFoundMessage,
                     }) => {

    const handleClose = () => setShowModal(false);
    const dispatch = useDispatch();
    const token = getToken();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mediaPageData, setMediaPageData] = useState(null);
    const [currentConnectedPages, setCurrentConnectedPages] = useState([]);
    const [state, setState] = useState(false);
    const facebookPageConnectData = useSelector(state => state.facebook.facebookPageConnectReducer);

    useEffect(() => {
        if (connectedPagesList !== null && Array.isArray(connectedPagesList)) {
            const newIds = connectedPagesList.map(c => c.pageId);
            const idsToRemove = currentConnectedPages.filter(id => !newIds.includes(id));
            const idsToAdd = newIds.filter(id => !currentConnectedPages.includes(id));
            const updatedIds = currentConnectedPages.filter(id => !idsToRemove.includes(id));
            setState(false);
            //adding new ids
            updatedIds.push(...idsToAdd);
            setCurrentConnectedPages(updatedIds);
        }
       
    }, [connectedPagesList]);

    const handleSubmit = () => {
        pageConnectAction(dispatch, token, mediaPageData, socialMediaAccountInfo)
        setState(true);
    }

    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="lg" show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className="commonmodal_header">
                            <div className='facebook_title'>
                                <h2 className='cmn_text_style mb-3'>Please choose your {socialMediaType===SocialAccountProvider.PINTEREST?"board":"page"}  to connect with Addy</h2>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='pt-0'>
                        <div className='facebook_content_outer'>
                            <div className=''>
                                {Array.isArray(allPagesList) && allPagesList.length > 0 ? allPagesList?.map((data, index) => {
                                        return (
                                            <div key={index}
                                                 // className={`modal_inner_content ${(currentConnectedPages?.includes(data?.id) ? '' : (currentConnectedPages.length > 0 ? 'disconnect_wrapper' : ''))}`}>
                                                 className={`modal_inner_content `}>

                                                <div className="user_info_container">
                                                    <div className='users_profile'>
                                                        {
                                                            socialMediaType === SocialAccountProvider.FACEBOOK &&
                                                            <img src={data.picture.data.url || default_user_icon }/>
                                                        }
                                                        {
                                                            socialMediaType === SocialAccountProvider.INSTAGRAM &&
                                                            <img src={data.profile_picture_url || default_user_icon}/>
                                                        }
                                                        {
                                                            socialMediaType === SocialAccountProvider.PINTEREST &&
                                                            <img src={data.media?.image_cover_url || default_user_icon}/>
                                                        }
                                                        {
                                                            socialMediaType === SocialAccountProvider.LINKEDIN &&
                                                            <img src={data?.logo_url || default_user_icon}/>
                                                        }

                                                    </div>
                                                    <div className='users_name'>
                                                        <h2 className={`cmn_text_style ${currentConnectedPages?.includes(data?.id) ? 'text-success' : ''}`}>{data.name}</h2>
                                                        {data.about && <p className="cmn_text_style mb-0">{data.about}</p>}
                                                    </div>
                                                </div>
                                                
                                                <div className='connect_btn_outer 1'>
                                                    <button
                                                        disabled={facebookPageConnectData?.loading}
                                                        className={`cmn_connect_btn connect_btn connect_btn ${currentConnectedPages?.includes(data?.id) ? 'connected-button' : 'disconected_btn'}`}
                                                        onClick={(e) => {
                                                            !facebookPageConnectData?.loading && setMediaPageData(data);
                                                            !facebookPageConnectData?.loading && setShowConfirmModal(true);
                                                        }}

                                                    >
                                                        {currentConnectedPages.includes(data?.id) ? "Disconnect" : "Connect"}
                                                        {(state && data?.id===mediaPageData?.id ) ?"ing...":""} 
                                                    </button>
                                                </div>

                                            </div>
                                        )
                                    })

                                    :
                                    <h3 className={"text-center"}>{noPageFoundMessage}</h3>
                                }
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
                    confirmMessage={currentConnectedPages?.includes(mediaPageData?.id) ? `You want to dis-connect from ${socialMediaType} page ?` : `You want to connect from ${socialMediaType} page ?`}
                />}
        </>
    );
}

export default CommonModal;