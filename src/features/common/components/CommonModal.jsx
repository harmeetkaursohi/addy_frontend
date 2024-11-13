import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import "./CommonModal.css"
import ConfirmModal from "./ConfirmModal.jsx";
import {DisconnectPageWarning, SocialAccountProvider} from "../../../utils/contantData.js";
import {isNullOrEmpty} from "../../../utils/commonUtils.js";
import default_user_icon from "../../../images/default_user_icon.svg"
import Addy_icon from "../../../images/Addy_icon.svg?react"
import {RxCross2} from 'react-icons/rx';
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {useConnectPageMutation} from "../../../app/apis/pageAccessTokenApi";
import {useGetSocialMediaReportQuery} from "../../../app/apis/insightApi";
import {addyApi} from "../../../app/addyApi";
import {useDispatch} from "react-redux";
import NotFoundPopup from './NotFoundPopup.jsx';
import { Image } from 'react-bootstrap';
import Skeleton from '../../loader/skeletonEffect/Skeleton.jsx';
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

    const dispatch = useDispatch()
    const currentConnectedPages = connectedPagesList?.map(page => page?.pageId) || []

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showNoBusinessAccountModal, setShowNoBusinessAccountModal] = useState(false);
    const [mediaPageData, setMediaPageData] = useState(null);

    const getSocialMediaReportApi = useGetSocialMediaReportQuery({
        pages: allPagesList,
        socialMediaAccountInfo: socialMediaAccountInfo
    })
    const [connectPage, connectPageApi] = useConnectPageMutation()

    const handleSubmit = async (pageData) => {
        const data = isNullOrEmpty(pageData) ? mediaPageData : pageData
        await handleRTKQuery(
            async () => {
                return await connectPage({data: data, socialMediaAccountInfo: socialMediaAccountInfo}).unwrap()
            },
            () => {
                dispatch(addyApi.util.invalidateTags(["getSocialMediaPostsByCriteriaApi"]))
            })
    }

    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="lg" show={showModal} onHide={handleClose} className='choose_page_outer' centered>
                    <div
                        className='pop_up_cross_icon_outer  cursor-pointer'
                        onClick={(e) => {
                            handleClose()
                        }}>
                        <RxCross2 className="pop_up_cross_icon"/>
                    </div>
                    <Modal.Body className='pt-0 cmn_body'>
                        <div className='d-flex  pt-3 pb-4'>
                            <div className='facebook_title flex-grow-1 header_border pb-4'>
                                <h3>
                                    <Addy_icon className="addy_icon "/></h3>
                                <h2 className='cmn_text_style'>Please choose
                                    your {socialMediaType === SocialAccountProvider.PINTEREST ? "board" : "page"} to connect with Addy</h2>
                                <p className='planInfo'>You have Personal Plan, you can add only one page.&nbsp;<span>Upgrade Plan</span>
                                </p>
                            </div>


                        </div>
                        <div className='facebook_content_outer'>
                            <div className='choose_page_container'>
                                {/* {
                                    isNullOrEmpty(allPagesList) &&
                                    <div className='text-center'>
                                        <Image src={no_page_connect_img} className='no_page_connect_img'/>
                                    </div>
                                } */}

                                {
                                    Array.isArray(allPagesList) && allPagesList.length > 0 ? allPagesList?.map((data, index) => {
                                            return (
                                                <div key={index}
                                                     className={`modal_inner_content ${currentConnectedPages?.includes(data?.id) ? "active_connected_page" : "disconnected_page"} `}>

                                                    <div className="user_info_container">
                                                        <div className='users_profile'>
                                                            {
                                                                socialMediaType === SocialAccountProvider.FACEBOOK &&
                                                                <Image src={data.picture.data.url || default_user_icon} alt='social media logo'/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.INSTAGRAM &&
                                                                <Image src={data.profile_picture_url || default_user_icon} alt='social media logo'/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.PINTEREST &&
                                                                <Image
                                                                    src={data.media?.image_cover_url || default_user_icon} alt='social media logo'/>
                                                            }
                                                            {
                                                                socialMediaType === SocialAccountProvider.LINKEDIN &&
                                                                <Image src={data?.logo_url || default_user_icon} alt='social media logo'/>
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
                                                                            (getSocialMediaReportApi?.isLoading || getSocialMediaReportApi?.isFetching) ?
                                                                               <Skeleton/> :
                                                                                <h4>
                                                                                    {
                                                                                        getSocialMediaReportApi?.data?.[data?.id]?.Followers?.lifeTime
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
                                                                            getSocialMediaReportApi?.isLoading || getSocialMediaReportApi?.isFetching ?
                                                                            <Skeleton/> :
                                                                                <h4>
                                                                                    {
                                                                                        socialMediaAccountInfo.provider === "PINTEREST" ?
                                                                                            getSocialMediaReportApi?.data?.[data?.id]?.Pin_Count?.lifeTime :
                                                                                            getSocialMediaReportApi?.data?.[data?.id]?.Accounts_Reached?.lifeTime
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
                                                                if (connectPageApi?.isLoading) return;
                                                                setMediaPageData(data);
                                                                const isPageConnected = currentConnectedPages.includes(data?.id);
                                                                setShowConfirmModal(isPageConnected);
                                                                !isPageConnected && handleSubmit(data);
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

            {
                showConfirmModal &&
                <ConfirmModal
                    confirmModalAction={handleSubmit}
                    setShowConfirmModal={setShowConfirmModal}
                    showConfirmModal={showConfirmModal}
                    icon={"warning"}
                    title={"Are you sure ?"}
                    confirmMessage={DisconnectPageWarning}
                />
            }
            {
                showNoBusinessAccountModal &&
                <NotFoundPopup
                    show={showNoBusinessAccountModal}
                    setShow={setShowNoBusinessAccountModal}
                />
            }
        </>
    );
}

export default CommonModal;
