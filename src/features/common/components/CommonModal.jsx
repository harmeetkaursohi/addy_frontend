import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"
import ConfirmModal from "./ConfirmModal.jsx";
import {DisconnectPageWarning, SocialAccountProvider} from "../../../utils/contantData.js";
import {isNullOrEmpty} from "../../../utils/commonUtils.js";
import default_user_icon from "../../../images/default_user_icon.svg"
import {RxCross2} from 'react-icons/rx';
import no_page_connect_img from "../../../images/error_img.svg"
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {useConnectPageMutation} from "../../../app/apis/pageAccessTokenApi";
import {useGetSocialMediaReportQuery} from "../../../app/apis/insightApi";
import {addyApi} from "../../../app/addyApi";
import {useDispatch} from "react-redux";

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

    const dispatch=useDispatch()
    const currentConnectedPages = connectedPagesList?.map(page => page?.pageId) || []

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mediaPageData, setMediaPageData] = useState(null);

    const getSocialMediaReportApi = useGetSocialMediaReportQuery({
        pages: allPagesList,
        socialMediaAccountInfo: socialMediaAccountInfo
    })
    const [connectPage, connectPageApi] = useConnectPageMutation()

    const handleSubmit = async () => {
        await handleRTKQuery(
            async () => {
                return await connectPage({data: mediaPageData, socialMediaAccountInfo: socialMediaAccountInfo}).unwrap()
            },
            () => {
                dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi"]))
            })
    }

    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="lg" show={showModal} onHide={handleClose} className='choose_page_outer'>
                    <div
                        className='pop_up_cross_icon_outer  cursor-pointer'
                        onClick={(e) => {
                            handleClose()
                        }}>
                        <RxCross2 className="pop_up_cross_icon"/>
                    </div>
                    <Modal.Body className='pt-0 cmn_body'>
                        <div className='d-flex  pt-3 pb-3'>
                            <div className='facebook_title flex-grow-1'>
                                <h3>
                                    <img src="./Addy_icon.svg" className="addy_icon "/></h3>
                                <h2 className='cmn_text_style'>Please choose
                                    your {socialMediaType === SocialAccountProvider.PINTEREST ? "board" : "page"} to
                                    connect with Addy</h2>
                            </div>


                        </div>
                        <div className='facebook_content_outer'>
                            <div className='choose_page_container'>
                                {
                                    isNullOrEmpty(allPagesList) &&
                                    <div className='text-center'>
                                        <img src={no_page_connect_img} className='no_page_connect_img'/>
                                    </div>
                                }

                                {
                                    Array.isArray(allPagesList) && allPagesList.length > 0 ? allPagesList?.map((data, index) => {
                                            return (
                                                <div key={index}
                                                     className={`modal_inner_content ${currentConnectedPages?.includes(data?.id) ? "active_connected_page" : "disconnected_page"} `}>

                                                    <div className="user_info_container">
                                                        <div className='users_profile'>
                                                            {
                                                                socialMediaType === SocialAccountProvider.FACEBOOK &&
                                                                <img src={data.picture.data.url || default_user_icon}/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.INSTAGRAM &&
                                                                <img src={data.profile_picture_url || default_user_icon}/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.PINTEREST &&
                                                                <img
                                                                    src={data.media?.image_cover_url || default_user_icon}/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.LINKEDIN &&
                                                                <img src={data?.logo_url || default_user_icon}/>
                                                            }

                                                        </div>

                                                        <div className='users_name'>
                                                            <h2 className={`cmn_text_style ${currentConnectedPages?.includes(data?.id) ? '' : ''}`}>{data.name}</h2>
                                                            <div className="followers-reach">
                                                                <div
                                                                    className="account-detail follower_reach_container">
                                                                    <h3 className="label">Followers</h3>
                                                                    {
                                                                        currentConnectedPages?.includes(data?.id) ?
                                                                            getSocialMediaReportApi?.isLoading ?
                                                                                <i className="fa fa-spinner fa-spin"/> :
                                                                                <h4>
                                                                                    {
                                                                                        getSocialMediaReportApi.data[data.id]?.Followers?.lifeTime
                                                                                    }
                                                                                </h4>
                                                                            :
                                                                            <h4 className={"hiddenNumber"}>---</h4>
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="account-detail account_reach_container">
                                                                    <h3 className="label"> {socialMediaAccountInfo.provider === "PINTEREST" ? "Pin Count" : "Account Reach"}</h3>
                                                                    {
                                                                        currentConnectedPages?.includes(data?.id) ?
                                                                            getSocialMediaReportApi?.isLoading ?
                                                                                <i className="fa fa-spinner fa-spin"/> :
                                                                                <h4>
                                                                                    {
                                                                                        socialMediaAccountInfo.provider === "PINTEREST"?
                                                                                            getSocialMediaReportApi.data[data.id]?.Pin_Count?.lifeTime:
                                                                                            getSocialMediaReportApi.data[data.id]?.Accounts_Reached?.lifeTime
                                                                                    }
                                                                                </h4>
                                                                            :
                                                                            <h4 className={"hiddenNumber"}>----</h4>
                                                                    }

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='connect_btn_outer 1'>
                                                        <button
                                                            disabled={connectPageApi?.isLoading}
                                                            className={`cmn_connect_btn connect_btn connect_btn ${currentConnectedPages?.includes(data?.id) ? 'connected-button' : 'disconected_btn'}`}
                                                            onClick={(e) => {
                                                                !connectPageApi?.isLoading && setMediaPageData(data);
                                                                !connectPageApi?.isLoading && setShowConfirmModal(true);
                                                            }}>
                                                            {
                                                                currentConnectedPages.includes(data?.id) ? "Disconnect" : "Connect"
                                                            }
                                                            {
                                                                connectPageApi?.isLoading && data?.id === mediaPageData?.id &&
                                                                "ing..."
                                                            }
                                                        </button>
                                                    </div>

                                                </div>
                                            )
                                        })
                                        :
                                        <h3 className={"text-center noPageFoundMessage_text"}>{noPageFoundMessage}</h3>
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
                    confirmMessage={currentConnectedPages?.includes(mediaPageData?.id) ? DisconnectPageWarning : `You want to connect ${socialMediaType} page ?`}
                />}
        </>
    );
}

export default CommonModal;
