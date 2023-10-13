import Header from "../../head/views/Header"
import SideBar from "../../sidebar/views/Layout"
import './Dashboard.css'
import fb_img from '../../../images/fb.svg'
import jsondata from '../../../locales/data/initialdata.json'
import React, {useEffect, useState} from "react";
import FacebookModal from "../../modals/views/facebookModal/FacebookModal";
import {useDispatch, useSelector} from "react-redux";
import {decodeJwtToken, getToken, setAuthenticationHeader} from "../../../app/auth/auth.js";
import {getAllFacebookPages, getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions.js";
import {LoginSocialFacebook, LoginSocialInstagram} from "reactjs-social-login";
import {FacebookLoginButton, InstagramLoginButton} from "react-social-login-buttons";
import {computeAndSocialAccountJSONForFacebook} from "../../../utils/commonUtils.js";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions.js";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import {showErrorToast} from "../../common/components/Toast.jsx";
import Swal from "sweetalert2";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {getAllDraftPostsByCustomerAndPeriodAction} from "../../../app/actions/postActions/postActions";
import ScheduledComponent from "../../unPublishedPages/views/ScheduledComponent";
import {DashboardReports} from "./reports/DashboardReports";

const Dashboard = () => {

    const [showFacebookModal, setShowFacebookModal] = useState(false);
    const [facebookDropDown, setFacebookDropDown] = useState(false);

    const dispatch = useDispatch();
    const token = getToken();

    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const facebookPageLoading = useSelector(state => state.facebook.getFacebookPageReducer.loading);
    const facebookConnectedPages = useSelector(state => state.facebook.getFacebookConnectedPagesReducer.facebookConnectedPages);
    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const getAllPostsByCriteriaData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);


    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
            dispatch(getAllDraftPostsByCustomerAndPeriodAction({token: token, query: {limit: 5}}));
        }
    }, [token])


    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {
                customerId: decodeJwt.customerId,
                token: token
            }
            dispatch(getUserInfo(requestBody))
        }
    }, [token, dispatch, userData]);


    useEffect(() => {
        if ((!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length > 0) && getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK') !== undefined) {
            let faceBookSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK');
            dispatch(getAllFacebookPages({
                providerId: faceBookSocialAccount?.providerId,
                accessToken: faceBookSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }

    }, [getAllConnectedSocialAccountData]);


    const facebook = () => {
        setShowFacebookModal(true)
    }


    const connectSocialMediaAccountToCustomer = (object) => {
        object.then((res) => {
            dispatch(socialAccountConnectActions(res)).then(() => {
                dispatch(getAllConnectedSocialAccountAction(res))
            })
        }).catch((error) => {
            showErrorToast(error.response.data.message);
        })
    }

    const disConnectSocialMediaAccountToCustomer = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Disconnect Facebook Account',
            text: 'Are you sure you want to disconnect your Facebook account?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const decodeJwt = decodeJwtToken(token);
                dispatch(disconnectSocialAccountAction({
                    customerId: decodeJwt?.customerId,
                    socialAccountId: getAllConnectedSocialAccountData?.data?.find(c => c.provider === "FACEBOOK")?.id,
                    token: token
                })).then((response) => {
                    dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt?.customerId, token: token}));
                    Swal.fire({
                        icon: 'success',
                        title: 'Facebook Account Disconnected',
                        text: 'Your Facebook account has been disconnected successfully.',
                    });
                }).catch((error) => {
                    console.error('Error disconnecting Facebook account:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while disconnecting your Facebook account. Please try again later.',
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your Facebook account is still connected.', 'info');
            }
        });

    }

    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header userData={userData} getAllConnectedSocialAccountData={getAllConnectedSocialAccountData}
                            facebookPageList={facebookPageList}/>
                    <div className="dashboard_outer">
                        <div className="row">

                            <DashboardReports/>

                            <div className="col-lg-5 col-xl-4 col-sm-12">

                                {/* socail media */}
                                <div className="cmn_background social_media_wrapper">
                                    <div className="social_media_account">
                                        <h3>{jsondata.socialAccount}</h3>
                                    </div>

                                    {/*facebook connect starts */}

                                    {!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0 ?

                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                                <i className={`fa-brands fa-facebook`}
                                                   style={{color: "#0866ff", fontSize: "24px"}}/>
                                                <div>
                                                    <h5 className="">Facebook account</h5>
                                                    <h6 className="cmn_headings">www.facebook.com</h6>
                                                </div>
                                            </div>

                                            <LoginSocialFacebook
                                                isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                                appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                                redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                                onResolve={(response) => {
                                                    connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response))
                                                }}
                                                onReject={(error) => {
                                                }}>

                                                <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                                     icon={() => null} preventActiveStyles={true}
                                                                     style={{
                                                                         borderRadius: '5px',
                                                                         background: "#F07C33",
                                                                         boxShadow: "unset",
                                                                         fontSize: "12px",
                                                                         color: "#fff",
                                                                         border: '1px solid #F07C33',
                                                                         height: "39px",
                                                                         minWidth: "111px",
                                                                         margin: "10px",
                                                                         width: "11px"
                                                                     }}/>
                                            </LoginSocialFacebook>

                                        </div>

                                        :

                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer">
                                                    <div className="social_media_content"
                                                         onClick={() => setFacebookDropDown(!facebookDropDown)}>
                                                        <img className="cmn_width" src={fb_img}/>
                                                        <div className="text-start">
                                                            <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                            <h4 className="connect_text cmn_text_style">Connected</h4>
                                                        </div>
                                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             onClick={() => setFacebookDropDown(!facebookDropDown)}>
                                                            <path id="Icon"
                                                                  d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                  stroke="#5F6D7E" strokeWidth="1.67"
                                                                  strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>

                                                {
                                                    facebookDropDown === true &&

                                                    <ul className="menu_items">
                                                        {
                                                            facebookPageLoading === true ?
                                                                <SkeletonEffect count={3}/> :

                                                                !(getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0) &&
                                                                facebookPageList?.slice(0, 3).map((data, index) => {
                                                                    return (
                                                                        <>
                                                                            <li key={index}>
                                                                                <div
                                                                                    className="user_profileInfo_wrapper">
                                                                                    <div className="user_Details">
                                                                                        <img src={data.picture.data.url}
                                                                                             height="30px"
                                                                                             width="30px"/>
                                                                                        <h4 className="cmn_text_style">{data.name}</h4>
                                                                                    </div>
                                                                                    <h4 className={facebookConnectedPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "connect_text cmn_text_style" : "connect_text_not_connect cmn_text_style"}>{facebookConnectedPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "Connected" : "Not Connected"}</h4>
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    )
                                                                })

                                                        }
                                                        <li>
                                                            {
                                                                (facebookPageList && facebookPageList?.length > 0) &&
                                                                <div className="connectDisconnect_btn_outer">
                                                                    <button className="DisConnectBtn cmn_connect_btn"
                                                                            onClick={() => disConnectSocialMediaAccountToCustomer()}>
                                                                        Disconnect
                                                                    </button>
                                                                    <button className="ConnectBtn cmn_connect_btn"
                                                                            onClick={() => facebook()}>
                                                                        Connect More
                                                                    </button>
                                                                </div>

                                                            }
                                                        </li>
                                                    </ul>}

                                            </div>
                                        </div>
                                    }

                                    {/*facebook connect ends */}

                                    {/* start instagram connect */}

                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <i className="fa-brands fa-instagram"
                                               style={{color: "purple", fontSize: "24px"}}/>
                                            <div>
                                                <h5 className=""> Instagram account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>

                                        <LoginSocialInstagram
                                            client_id={`${import.meta.env.VITE_APP_INSTAGRAM_CLIENT_ID}`}
                                            client_secret={`${import.meta.env.VITE_APP_INSTAGRAM_CLIENT_SECRET}`}
                                            scope={`${import.meta.env.VITE_APP_INSTAGRAM_SCOPE}`}
                                            redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                            onResolve={(response) => {
                                            }}
                                            onReject={(error) => {
                                                console.log(error);
                                            }}
                                        >
                                            <InstagramLoginButton text={"Connect"}
                                                                  className={"facebook_connect"}
                                                                  icon={() => null}
                                                                  preventActiveStyles={true}
                                                                  style={{
                                                                      borderRadius: '5px',
                                                                      background: "#F07C33",
                                                                      boxShadow: "unset",
                                                                      fontSize: "12px",
                                                                      color: "#fff",
                                                                      border: '1px solid #F07C33',
                                                                      height: "39px",
                                                                      minWidth: "111px",
                                                                      margin: "10px",
                                                                      width: "11px"
                                                                  }}/>
                                        </LoginSocialInstagram>

                                    </div>

                                    {/* end instagram connect */}
                                </div>
                            </div>
                        </div>
                        {/* upcoming post */}
                        <ScheduledComponent scheduledData={getAllPostsByCriteriaData}/>
                    </div>

                </div>

            </div>
            {showFacebookModal &&
                <FacebookModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal}
                               facebookPageList={facebookPageList}
                               facebookConnectedPages={facebookConnectedPages}/>}
        </>
    )
}
export default Dashboard